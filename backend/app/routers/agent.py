"""
Agent Router - Agent SDK Configuration Management

Handles agent configuration, registration, and management endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import Optional
import json
from datetime import datetime

from app.models import (
    AgentConfig, AgentConfigRequest, AgentConfigResponse, AgentConfigUpdate
)
from app.database import get_session

router = APIRouter(prefix="/api/agent", tags=["Agent SDK"])


@router.post("/configure", response_model=AgentConfigResponse, status_code=status.HTTP_201_CREATED)
async def configure_agent(
    config: AgentConfigRequest,
    session: Session = Depends(get_session)
):
    """
    Configure/register a new agent SDK configuration.
    """
    # Check if agent with same agent_id already exists
    statement = select(AgentConfig).where(AgentConfig.agent_id == config.agent.id)
    existing_agent = session.exec(statement).first()
    
    if existing_agent:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Agent with id '{config.agent.id}' already exists"
        )
    
    # Create new agent configuration
    agent_config = AgentConfig(
        agent_id=config.agent.id,
        display_name=config.agent.display_name,
        provider=config.agent.provider,
        model_policy=json.dumps(config.agent.model_policy.model_dump()),
        target=config.integration.target,
        mode=config.integration.mode,
        lifecycle=json.dumps(config.integration.lifecycle.model_dump()),
        capabilities=json.dumps(config.capabilities.model_dump()),
        security=json.dumps(config.security.model_dump()),
        observability=json.dumps(config.observability.model_dump()),
        failover=json.dumps(config.failover.model_dump()),
        compliance=json.dumps(config.compliance.model_dump()),
        status=config.activation.status,
        activation_time=config.activation.activation_time,
        spec_version=config.spec_version
    )
    
    session.add(agent_config)
    session.commit()
    session.refresh(agent_config)
    
    return _agent_to_response(agent_config)


@router.get("/config", response_model=AgentConfigResponse)
async def get_agent_config(
    agent_id: Optional[str] = None,
    session: Session = Depends(get_session)
):
    """
    Get agent configuration. If agent_id not provided, returns the first active agent.
    """
    if agent_id:
        statement = select(AgentConfig).where(AgentConfig.agent_id == agent_id)
    else:
        # Get first active agent
        statement = select(AgentConfig).where(AgentConfig.status == "enabled").limit(1)
    
    agent_config = session.exec(statement).first()
    
    if not agent_config:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No agent configuration found"
        )
    
    return _agent_to_response(agent_config)


@router.get("/config/{config_id}", response_model=AgentConfigResponse)
async def get_agent_config_by_id(
    config_id: int,
    session: Session = Depends(get_session)
):
    """
    Get agent configuration by database ID.
    """
    agent_config = session.get(AgentConfig, config_id)
    
    if not agent_config:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Agent configuration with id {config_id} not found"
        )
    
    return _agent_to_response(agent_config)


@router.put("/config/{config_id}", response_model=AgentConfigResponse)
async def update_agent_config(
    config_id: int,
    update: AgentConfigUpdate,
    session: Session = Depends(get_session)
):
    """
    Update agent configuration.
    """
    agent_config = session.get(AgentConfig, config_id)
    
    if not agent_config:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Agent configuration with id {config_id} not found"
        )
    
    # Update fields if provided
    if update.model_policy:
        agent_config.model_policy = json.dumps(update.model_policy.model_dump())
    
    if update.capabilities:
        agent_config.capabilities = json.dumps(update.capabilities.model_dump())
    
    if update.security:
        agent_config.security = json.dumps(update.security.model_dump())
    
    if update.observability:
        agent_config.observability = json.dumps(update.observability.model_dump())
    
    if update.failover:
        agent_config.failover = json.dumps(update.failover.model_dump())
    
    if update.status:
        agent_config.status = update.status
    
    agent_config.updated_at = datetime.utcnow()
    
    session.add(agent_config)
    session.commit()
    session.refresh(agent_config)
    
    return _agent_to_response(agent_config)


@router.delete("/config/{config_id}")
async def delete_agent_config(
    config_id: int,
    session: Session = Depends(get_session)
):
    """
    Delete agent configuration.
    """
    agent_config = session.get(AgentConfig, config_id)
    
    if not agent_config:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Agent configuration with id {config_id} not found"
        )
    
    session.delete(agent_config)
    session.commit()
    
    return {"message": f"Agent configuration {config_id} deleted successfully"}


# Helper function
def _agent_to_response(agent_config: AgentConfig) -> AgentConfigResponse:
    """Convert AgentConfig to AgentConfigResponse."""
    return AgentConfigResponse(
        id=agent_config.id,
        agent_id=agent_config.agent_id,
        display_name=agent_config.display_name,
        provider=agent_config.provider,
        model_policy=json.loads(agent_config.model_policy),
        target=agent_config.target,
        mode=agent_config.mode,
        lifecycle=json.loads(agent_config.lifecycle),
        capabilities=json.loads(agent_config.capabilities),
        security=json.loads(agent_config.security),
        observability=json.loads(agent_config.observability),
        failover=json.loads(agent_config.failover),
        compliance=json.loads(agent_config.compliance),
        status=agent_config.status,
        activation_time=agent_config.activation_time,
        spec_version=agent_config.spec_version,
        created_at=agent_config.created_at,
        updated_at=agent_config.updated_at
    )
