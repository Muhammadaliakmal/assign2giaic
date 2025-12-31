"""
MCP (Model Context Protocol) Tool Adapters for Task Operations.

These tools wrap existing task CRUD operations to be used by the AI chatbot.
Each tool is stateless and calls the corresponding task router function.
"""

from typing import Dict, Any, Optional
from sqlmodel import Session, select
from datetime import datetime

from app.models import Task, TaskCreate, TaskUpdate
from app.database import get_session


class MCPToolResult:
    """Standardized result format for MCP tool calls."""
    
    def __init__(self, success: bool, data: Any = None, message: str = "", error: str = ""):
        self.success = success
        self.data = data
        self.message = message
        self.error = error
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "success": self.success,
            "data": self.data,
            "message": self.message,
            "error": self.error
        }


from app.context import session_context, user_id_context

def get_context():
    session = session_context.get()
    user_id = user_id_context.get()
    if not session or not user_id:
        raise ValueError("Context not initialized")
    return session, user_id

def add_task(title: str, description: str = "") -> MCPToolResult:
    """Create a new task for the user."""
    try:
        session, user_id = get_context()
        
        new_task = Task(
            user_id=user_id,
            title=title,
            description=description
        )
        
        session.add(new_task)
        session.commit()
        session.refresh(new_task)
        
        task_data = {
            "id": new_task.id,
            "title": new_task.title,
            "description": new_task.description,
            "completed": new_task.completed,
            "created_at": new_task.created_at.isoformat()
        }
        
        return MCPToolResult(
            success=True,
            data=task_data,
            message=f"✅ Task created: {title}"
        )
    except Exception as e:
        return MCPToolResult(success=False, error=str(e))

def list_tasks(completed: bool = None) -> MCPToolResult:
    """List all tasks, optionally filtered by completion status."""
    try:
        session, user_id = get_context()
        
        statement = select(Task).where(Task.user_id == user_id)
        if completed is not None:
            statement = statement.where(Task.completed == completed)
        
        statement = statement.order_by(Task.created_at.desc())
        tasks = session.exec(statement).all()
        
        task_list = [
            {
                "id": t.id, 
                "title": t.title, 
                "description": t.description, 
                "completed": t.completed
            } for t in tasks
        ]
        
        return MCPToolResult(
            success=True, 
            data=task_list, 
            message=f"Found {len(task_list)} tasks."
        )
    except Exception as e:
        return MCPToolResult(success=False, error=str(e))

def complete_task(task_id: int) -> MCPToolResult:
    """Toggle task completion status."""
    try:
        session, user_id = get_context()
        task = session.get(Task, task_id)
        
        if not task or task.user_id != user_id:
            return MCPToolResult(success=False, error="Task not found")
            
        task.completed = not task.completed
        task.updated_at = datetime.utcnow()
        session.add(task)
        session.commit()
        
        return MCPToolResult(
            success=True,
            data={"id": task.id, "completed": task.completed},
            message=f"✅ Task {'completed' if task.completed else 'reopened'}"
        )
    except Exception as e:
        return MCPToolResult(success=False, error=str(e))

def delete_task(task_id: int) -> MCPToolResult:
    """Delete a task permanently."""
    try:
        session, user_id = get_context()
        task = session.get(Task, task_id)
        
        if not task or task.user_id != user_id:
            return MCPToolResult(success=False, error="Task not found")
            
        session.delete(task)
        session.commit()
        
        return MCPToolResult(success=True, message="🗑️ Task deleted")
    except Exception as e:
        return MCPToolResult(success=False, error=str(e))

def update_task(task_id: int, title: str = None, description: str = None, completed: bool = None) -> MCPToolResult:
    """Update a task's details."""
    try:
        session, user_id = get_context()
        task = session.get(Task, task_id)
        
        if not task or task.user_id != user_id:
            return MCPToolResult(success=False, error="Task not found")
            
        if title is not None: task.title = title
        if description is not None: task.description = description
        if completed is not None: task.completed = completed
        
        task.updated_at = datetime.utcnow()
        session.add(task)
        session.commit()
        
        return MCPToolResult(success=True, message="✏️ Task updated")
    except Exception as e:
        return MCPToolResult(success=False, error=str(e))

# Tool definitions for OpenAI function calling
# List of tool functions for Gemini
# Note: These are now the CLEAN functions with correct signatures
GEMINI_TOOLS = [
    add_task,
    list_tasks,
    complete_task,
    delete_task,
    update_task
]
