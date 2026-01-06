"""
Chat Kit Router - Chat Kit Configuration Management

Handles chat kit registration, configuration, and management endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlmodel import Session, select
from typing import List, Optional
import json
from datetime import datetime

from app.models import (
    ChatKit, ChatKitRegistration, ChatKitResponse, ChatKitUpdate
)
from app.database import get_session

router = APIRouter(prefix="/api/chatkit", tags=["Chat Kit"])


@router.post("/register", response_model=ChatKitResponse, status_code=status.HTTP_201_CREATED)
async def register_chat_kit(
    registration: ChatKitRegistration,
    session: Session = Depends(get_session)
):
    """
    Register a new chat kit configuration.
    
    Accepts the complete chat kit configuration and stores it in the database.
    """
    # Check if chat kit with same kit_id already exists
    statement = select(ChatKit).where(ChatKit.kit_id == registration.chat_kit.id)
    existing_kit = session.exec(statement).first()
    
    if existing_kit:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Chat kit with id '{registration.chat_kit.id}' already exists"
        )
    
    # Create new chat kit
    chat_kit = ChatKit(
        chatbot_id=registration.chatbot.id,
        chatbot_name=registration.chatbot.name,
        chatbot_type=registration.chatbot.type,
        kit_id=registration.chat_kit.id,
        kit_name=registration.chat_kit.name,
        provider=registration.chat_kit.provider,
        enabled=registration.chat_kit.enabled,
        capabilities=json.dumps(registration.chat_kit.capabilities.model_dump()),
        ui_config=json.dumps(registration.chat_kit.ui.model_dump()),
        limits=json.dumps(registration.chat_kit.limits.model_dump()),
        security_config=json.dumps(registration.security.model_dump()),
        telemetry_config=json.dumps(registration.telemetry.model_dump()),
        version=registration.version,
        environment=registration.environment
    )
    
    session.add(chat_kit)
    session.commit()
    session.refresh(chat_kit)
    
    # Convert to response model
    return _chat_kit_to_response(chat_kit)


@router.get("/{chatkit_id}", response_model=ChatKitResponse)
async def get_chat_kit(
    chatkit_id: int,
    session: Session = Depends(get_session)
):
    """
    Get a specific chat kit configuration by ID.
    """
    chat_kit = session.get(ChatKit, chatkit_id)
    
    if not chat_kit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Chat kit with id {chatkit_id} not found"
        )
    
    return _chat_kit_to_response(chat_kit)


@router.get("/", response_model=List[ChatKitResponse])
async def list_chat_kits(
    enabled: Optional[bool] = Query(None, description="Filter by enabled status"),
    provider: Optional[str] = Query(None, description="Filter by provider"),
    session: Session = Depends(get_session)
):
    """
    List all chat kits with optional filtering.
    """
    statement = select(ChatKit)
    
    if enabled is not None:
        statement = statement.where(ChatKit.enabled == enabled)
    
    if provider:
        statement = statement.where(ChatKit.provider == provider)
    
    chat_kits = session.exec(statement).all()
    
    return [_chat_kit_to_response(kit) for kit in chat_kits]


@router.put("/{chatkit_id}", response_model=ChatKitResponse)
async def update_chat_kit(
    chatkit_id: int,
    update: ChatKitUpdate,
    session: Session = Depends(get_session)
):
    """
    Update a chat kit configuration.
    
    Supports partial updates - only provided fields will be updated.
    """
    chat_kit = session.get(ChatKit, chatkit_id)
    
    if not chat_kit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Chat kit with id {chatkit_id} not found"
        )
    
    # Update fields if provided
    if update.enabled is not None:
        chat_kit.enabled = update.enabled
    
    if update.capabilities:
        chat_kit.capabilities = json.dumps(update.capabilities.model_dump())
    
    if update.ui:
        chat_kit.ui_config = json.dumps(update.ui.model_dump())
    
    if update.limits:
        chat_kit.limits = json.dumps(update.limits.model_dump())
    
    if update.security:
        chat_kit.security_config = json.dumps(update.security.model_dump())
    
    if update.telemetry:
        chat_kit.telemetry_config = json.dumps(update.telemetry.model_dump())
    
    chat_kit.updated_at = datetime.utcnow()
    
    session.add(chat_kit)
    session.commit()
    session.refresh(chat_kit)
    
    return _chat_kit_to_response(chat_kit)


@router.delete("/{chatkit_id}")
async def delete_chat_kit(
    chatkit_id: int,
    hard_delete: bool = Query(False, description="Permanently delete (true) or soft delete (false)"),
    session: Session = Depends(get_session)
):
    """
    Delete a chat kit.
    
    By default performs a soft delete (sets enabled=false).
    Set hard_delete=true to permanently remove from database.
    """
    chat_kit = session.get(ChatKit, chatkit_id)
    
    if not chat_kit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Chat kit with id {chatkit_id} not found"
        )
    
    if hard_delete:
        session.delete(chat_kit)
        session.commit()
        return {"message": f"Chat kit {chatkit_id} permanently deleted"}
    else:
        chat_kit.enabled = False
        chat_kit.updated_at = datetime.utcnow()
        session.add(chat_kit)
        session.commit()
        return {"message": f"Chat kit {chatkit_id} disabled (soft delete)"}


@router.get("/{chatkit_id}/status")
async def get_chat_kit_status(
    chatkit_id: int,
    session: Session = Depends(get_session)
):
    """
    Get operational status and metrics for a chat kit.
    """
    chat_kit = session.get(ChatKit, chatkit_id)
    
    if not chat_kit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Chat kit with id {chatkit_id} not found"
        )
    
    return {
        "chatkit_id": chat_kit.id,
        "kit_id": chat_kit.kit_id,
        "kit_name": chat_kit.kit_name,
        "enabled": chat_kit.enabled,
        "provider": chat_kit.provider,
        "environment": chat_kit.environment,
        "status": "operational" if chat_kit.enabled else "disabled",
        "uptime_since": chat_kit.created_at.isoformat(),
        "last_updated": chat_kit.updated_at.isoformat()
    }


# Helper function to convert ChatKit to ChatKitResponse
def _chat_kit_to_response(chat_kit: ChatKit) -> ChatKitResponse:
    """Convert ChatKit database model to ChatKitResponse."""
    return ChatKitResponse(
        id=chat_kit.id,
        chatbot_id=chat_kit.chatbot_id,
        chatbot_name=chat_kit.chatbot_name,
        chatbot_type=chat_kit.chatbot_type,
        kit_id=chat_kit.kit_id,
        kit_name=chat_kit.kit_name,
        provider=chat_kit.provider,
        enabled=chat_kit.enabled,
        capabilities=json.loads(chat_kit.capabilities),
        ui_config=json.loads(chat_kit.ui_config),
        limits=json.loads(chat_kit.limits),
        security_config=json.loads(chat_kit.security_config),
        telemetry_config=json.loads(chat_kit.telemetry_config),
        version=chat_kit.version,
        environment=chat_kit.environment,
        created_at=chat_kit.created_at,
        updated_at=chat_kit.updated_at
    )
