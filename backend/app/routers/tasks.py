from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List
from datetime import datetime
from app.models import Task, TaskCreate, TaskUpdate, TaskResponse, User
from app.database import get_session
from app.auth import get_current_user, verify_user_access


router = APIRouter(prefix="/api", tags=["Tasks"])


@router.get("/{user_id}/tasks", response_model=List[TaskResponse])
async def get_tasks(
    user_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Get all tasks for a user.
    
    Args:
        user_id: User ID from path
        current_user: Current authenticated user
        session: Database session
        
    Returns:
        List of user's tasks
    """
    verify_user_access(current_user, user_id)
    
    statement = select(Task).where(Task.user_id == user_id).order_by(Task.created_at.desc())
    tasks = session.exec(statement).all()
    
    return tasks


@router.post("/{user_id}/tasks", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(
    user_id: int,
    task_data: TaskCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Create a new task.
    
    Args:
        user_id: User ID from path
        task_data: Task creation data
        current_user: Current authenticated user
        session: Database session
        
    Returns:
        Created task
    """
    verify_user_access(current_user, user_id)
    
    new_task = Task(
        user_id=user_id,
        title=task_data.title,
        description=task_data.description
    )
    
    session.add(new_task)
    session.commit()
    session.refresh(new_task)
    
    return new_task


@router.get("/{user_id}/tasks/{task_id}", response_model=TaskResponse)
async def get_task(
    user_id: int,
    task_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Get a specific task.
    
    Args:
        user_id: User ID from path
        task_id: Task ID
        current_user: Current authenticated user
        session: Database session
        
    Returns:
        Task details
    """
    verify_user_access(current_user, user_id)
    
    task = session.get(Task, task_id)
    
    if not task or task.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    return task


@router.put("/{user_id}/tasks/{task_id}", response_model=TaskResponse)
async def update_task(
    user_id: int,
    task_id: int,
    task_data: TaskUpdate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Update a task.
    
    Args:
        user_id: User ID from path
        task_id: Task ID
        task_data: Task update data
        current_user: Current authenticated user
        session: Database session
        
    Returns:
        Updated task
    """
    verify_user_access(current_user, user_id)
    
    task = session.get(Task, task_id)
    
    if not task or task.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    # Update fields
    if task_data.title is not None:
        task.title = task_data.title
    if task_data.description is not None:
        task.description = task_data.description
    if task_data.completed is not None:
        task.completed = task_data.completed
    
    task.updated_at = datetime.utcnow()
    
    session.add(task)
    session.commit()
    session.refresh(task)
    
    return task


@router.delete("/{user_id}/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    user_id: int,
    task_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Delete a task.
    
    Args:
        user_id: User ID from path
        task_id: Task ID
        current_user: Current authenticated user
        session: Database session
    """
    verify_user_access(current_user, user_id)
    
    task = session.get(Task, task_id)
    
    if not task or task.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    session.delete(task)
    session.commit()


@router.patch("/{user_id}/tasks/{task_id}/complete", response_model=TaskResponse)
async def toggle_task_completion(
    user_id: int,
    task_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Toggle task completion status.
    
    Args:
        user_id: User ID from path
        task_id: Task ID
        current_user: Current authenticated user
        session: Database session
        
    Returns:
        Updated task
    """
    verify_user_access(current_user, user_id)
    
    task = session.get(Task, task_id)
    
    if not task or task.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    task.completed = not task.completed
    task.updated_at = datetime.utcnow()
    
    session.add(task)
    session.commit()
    session.refresh(task)
    
    return task
