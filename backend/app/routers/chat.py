"""
Chat Router - Phase III AI-Powered Todo Chatbot (OpenRouter/OpenAI Version)

Handles chat endpoint with OpenRouter (OpenAI compatible) integration and MCP tools.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List, Dict, Any, Optional
import json
from datetime import datetime
from openai import AsyncOpenAI
import os

from app.models import (
    User, Conversation, Message,
    ChatRequest, ChatResponse, ToolCallInfo
)
from app.database import get_session
from app.auth import get_current_user, verify_user_access
from app.config import get_settings
from app.mcp_tools import (
    OPENAI_TOOLS, 
    add_task, list_tasks, complete_task, delete_task, update_task
)

from app.context import session_context, user_id_context

router = APIRouter(prefix="/api", tags=["Chat"])

# Map function names to actual callables
AVAILABLE_TOOLS = {
    "add_task": add_task,
    "list_tasks": list_tasks,
    "complete_task": complete_task,
    "delete_task": delete_task,
    "update_task": update_task
}

# System prompt for the AI assistant
SYSTEM_PROMPT = """You are a helpful task management assistant. You help users manage their todo tasks through natural conversation.

You have access to tools for adding, listing, completing, deleting, and updating tasks.

Guidelines:
- Be friendly, concise, and action-oriented
- Always confirm actions with clear messages
- When listing tasks, format them nicely
- For ambiguous requests, ask for clarification
- Use emojis sparingly (✅ for success, 🗑️ for delete, ✏️ for edit)
- If me (the user) asks you to create/delete/update a task, use the appropriate tool.
- When showing tasks, present them in a clear, numbered list
- If the tool execution was successful, just confirm it based on the tool output, don't repeat the technical details unless asked.

Current Date/Time: {current_time}
"""

def get_openai_client():
    """Configure and return OpenAI client instance pointing to OpenRouter."""
    settings = get_settings()
    
    # Priority: OPENROUTER_API_KEY -> OPEN_ROUTER -> GEMINI_API_KEY
    api_key = settings.OPENROUTER_API_KEY or settings.OPEN_ROUTER or settings.GEMINI_API_KEY
    # Priority: OPENROUTER_BASE_URL -> BASE_URL -> Default
    base_url = settings.OPENROUTER_BASE_URL or settings.BASE_URL or "https://openrouter.ai/api/v1"
    
    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="AI API key not configured (OPENROUTER_API_KEY or OPEN_ROUTER)"
        )
        
    return AsyncOpenAI(
        api_key=api_key,
        base_url=base_url
    )

@router.post("/{user_id}/chat", response_model=ChatResponse)
async def chat(
    user_id: int,
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Chat endpoint for AI-powered task management using OpenRouter/OpenAI.
    """
    verify_user_access(current_user, user_id)
    
    # Set context variables for tools to access
    token_session = session_context.set(session)
    token_user_id = user_id_context.set(user_id)
    
    try:
        settings = get_settings()
        client = get_openai_client()
        model_name = settings.OPENROUTER_MODEL

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
        
        # 3. Build history for OpenAI
        messages = [
            {"role": "system", "content": SYSTEM_PROMPT.format(current_time=datetime.now().isoformat())}
        ]
        
        # Fetch recent history
        statement = select(Message).where(Message.conversation_id == conversation.id).order_by(Message.created_at)
        history_msgs = session.exec(statement).all()
        
        for msg in history_msgs:
            # We map DB roles to OpenAI roles. 
            # Note: We skip complex tool call history reconstruction for simplicity 
            # and just provide the text content to keep context.
            if msg.content:
                msg_role = "user" if msg.role == "user" else "assistant"
                messages.append({"role": msg_role, "content": msg.content})

        # 4. First Call to LLM
        response = await client.chat.completions.create(
            model=model_name,
            messages=messages,
            tools=OPENAI_TOOLS,
            tool_choice="auto"
        )
        
        response_message = response.choices[0].message
        tool_calls = response_message.tool_calls
        
        final_content = response_message.content
        tool_calls_info_list = []

        # 5. Handle Tool Calls
        if tool_calls:
            # Append the assistant's message (with tool calls) to history
            messages.append(response_message)
            
            # Execute each tool
            for tool_call in tool_calls:
                function_name = tool_call.function.name
                function_args = json.loads(tool_call.function.arguments)
                
                function_to_call = AVAILABLE_TOOLS.get(function_name)
                
                if function_to_call:
                    # Execute tool
                    tool_result = function_to_call(**function_args)
                    
                    # Store info for response
                    tool_calls_info_list.append({
                        "tool_name": function_name,
                        "inputs": function_args,
                        "output": tool_result.to_dict()
                    })
                    
                    # Add tool result to messages
                    messages.append({
                        "tool_call_id": tool_call.id,
                        "role": "tool",
                        "name": function_name,
                        "content": json.dumps(tool_result.to_dict())
                    })
                else:
                    # Handle unknown tool?
                    messages.append({
                        "tool_call_id": tool_call.id,
                        "role": "tool",
                        "name": function_name,
                        "content": json.dumps({"error": f"Tool {function_name} not found"})
                    })

            # 6. Second Call to LLM (Get final response after tools)
            second_response = await client.chat.completions.create(
                model=model_name,
                messages=messages
            )
            final_content = second_response.choices[0].message.content

        # 7. Save assistant message
        assistant_msg = Message(
            conversation_id=conversation.id,
            role="assistant",
            content=final_content,
            tool_calls=json.dumps(tool_calls_info_list) if tool_calls_info_list else None
        )
        session.add(assistant_msg)
        session.commit()
        
        return ChatResponse(
            conversation_id=conversation.id,
            response=final_content or "",
            tool_calls=[
                ToolCallInfo(
                    tool_name=tc["tool_name"],
                    inputs=tc["inputs"],
                    output=tc["output"]
                ) for tc in tool_calls_info_list
            ]
        )

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Chat error: {str(e)}"
        )
    finally:
        # Reset context variables
        session_context.reset(token_session)
        user_id_context.reset(token_user_id)
