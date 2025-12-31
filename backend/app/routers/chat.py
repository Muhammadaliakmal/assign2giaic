"""
Chat Router - Phase III AI-Powered Todo Chatbot (Gemini Version)

Handles chat endpoint with Google Gemini SDK integration and MCP tools.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List, Dict, Any
import json
from datetime import datetime
import google.generativeai as genai
from google.generativeai.types import FunctionDeclaration, Tool

from app.models import (
    User, Conversation, Message,
    ChatRequest, ChatResponse, ToolCallInfo
)
from app.database import get_session
from app.auth import get_current_user, verify_user_access
from app.config import get_settings
from app.mcp_tools import GEMINI_TOOLS, add_task, list_tasks, complete_task, delete_task, update_task



from app.context import session_context, user_id_context

router = APIRouter(prefix="/api", tags=["Chat"])

# System prompt for the AI assistant
SYSTEM_PROMPT = """You are a helpful task management assistant. You help users manage their todo tasks through natural conversation.

You have access to tools for adding, listing, completing, deleting, and updating tasks.

Guidelines:
- Be friendly, concise, and action-oriented
- Always confirm actions with clear messages
- When listing tasks, format them nicely
- For ambiguous requests, ask for clarification
- Use emojis sparingly (✅ for success, 🗑️ for delete, ✏️ for edit)
- If a user asks to create a task, extract the title and description from their message
- When showing tasks, present them in a clear, numbered list
- If the tool execution was successful, just confirm it based on the tool output, don't repeat the technical details unless asked.

Current Date/Time: {current_time}
"""


def get_gemini_model():
    """Configure and return Gemini model instance."""
    settings = get_settings()
    
    if not settings.GEMINI_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Gemini API key not configured"
        )
    
    genai.configure(api_key=settings.GEMINI_API_KEY)
    
    # Wrap tools in the Tool type to satisfy the SDK
    from google.generativeai.types import Tool
    tools_obj = Tool(function_declarations=GEMINI_TOOLS)
    
    return genai.GenerativeModel(
        model_name='gemini-2.0-flash-exp',
        tools=[tools_obj],
        system_instruction=SYSTEM_PROMPT.format(current_time=datetime.now().isoformat())
    )


@router.post("/{user_id}/chat", response_model=ChatResponse)
async def chat(
    user_id: int,
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Chat endpoint for AI-powered task management using Google Gemini.
    """
    verify_user_access(current_user, user_id)
    
    # Set context variables for tools to access
    token_session = session_context.set(session)
    token_user_id = user_id_context.set(user_id)
    
    try:
        # 1. Get or create conversation
        if request.conversation_id:
            conversation = session.get(Conversation, request.conversation_id)
            if not conversation or conversation.user_id != user_id:
                raise HTTPException(status_code=404, detail="Conversation not found")
            conversation.updated_at = datetime.utcnow()
        else:
            conversation = Conversation(user_id=user_id)
            session.add(conversation)
            session.commit()
            session.refresh(conversation)
        
        # 2. Save user message
        user_message_db = Message(
            conversation_id=conversation.id,
            role="user",
            content=request.message
        )
        session.add(user_message_db)
        session.commit()
        
        # 3. Build history for Gemini
        # We start a fresh chat session populated with recent history to avoid complex state management issues
        statement = select(Message).where(Message.conversation_id == conversation.id).order_by(Message.created_at)
        history_msgs = session.exec(statement).all()
        
        gemini_history = []
        for msg in history_msgs:
            if msg.id == user_message_db.id:
                continue
            
            # Skip messages with no content (e.g. tool execution records from old version)
            if not msg.content:
                continue
                
            role = "user" if msg.role == "user" else "model"
            gemini_history.append({"role": role, "parts": [msg.content]})

        # Ensure history alternates correctly (if multiple users/models in a row, combine or drop)
        # Simplified: If empty, start fresh. If ending with model, looks good.
        # If the last message was user (from history rehydration), we might have issues if we send another user message?
        # Actually start_chat() doesn't send the first message, it just sets context.
        # When we call send_message(), that's the next User part.
        # So history should ideally end with 'model'.
        
        # 4. Initialize Chat Session
        model = get_gemini_model()
        chat_session = model.start_chat(
            history=gemini_history, 
            enable_automatic_function_calling=True
        )

        try:
            response = chat_session.send_message(request.message)
        except Exception as e:
            # Fallback for "Please ensure that multiturn requests alternate" or similar errors
            # Retry with empty history if history was corrupted
            print(f"Chat error with history: {e}. Retrying with empty history.")
            chat_session = model.start_chat(history=[], enable_automatic_function_calling=True)
            response = chat_session.send_message(request.message)
        
        # 5. Extract tool usage info from the LAST turn only
        # The history includes [User, Model(ToolCall), Function(Result), Model(Response)]
        # We need to find the tool calls associated with THIS response text.
        
        tool_calls_info = []
        assistant_content = response.text
        
        # Iterate backwards through history to find the tool calls generated in this session
        # Logic: Looking for 'model' parts with 'function_call'
        # Since we just sent one message, any new items in history are from this turn.
        new_history_start_index = len(gemini_history) + 1 # +1 for the user message we just sent? No, user msg is added to history.
        # ChatHistory: [Old..., User(New), Model(Call), Function(Result), Model(Txt)]
        
        recent_history = chat_session.history[len(gemini_history):]
        
        for part in recent_history:
             if part.role == 'model':
                for p in part.parts:
                    if p.function_call:
                        tool_calls_info.append({
                            "tool_name": p.function_call.name,
                            "inputs": dict(p.function_call.args),
                            "output": {"success": True, "message": "Executed"}
                        })
        
        # 6. Save assistant message
        assistant_msg = Message(
            conversation_id=conversation.id,
            role="assistant",
            content=assistant_content,
            tool_calls=json.dumps(tool_calls_info) if tool_calls_info else None
        )
        session.add(assistant_msg)
        session.commit()
        
        return ChatResponse(
            conversation_id=conversation.id,
            response=assistant_content,
            tool_calls=[
                ToolCallInfo(
                    tool_name=tc["tool_name"],
                    inputs=tc["inputs"],
                    output=tc["output"]
                ) for tc in tool_calls_info
            ]
        )

    except Exception as e:
        import traceback
        traceback.print_exc() # Print full stack trace to console
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Chat error: {str(e)}"
        )
    finally:
        # Reset context variables
        session_context.reset(token_session)
        user_id_context.reset(token_user_id)
