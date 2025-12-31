from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, EmailStr


# ============================================================================
# Database Models (SQLModel)
# ============================================================================

class User(SQLModel, table=True):
    """User database model."""
    __tablename__ = "users"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True, max_length=255)
    username: str = Field(max_length=100)
    hashed_password: str = Field(max_length=255)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    tasks: List["Task"] = Relationship(back_populates="user")
    conversations: List["Conversation"] = Relationship(back_populates="user")


class Task(SQLModel, table=True):
    """Task database model."""
    __tablename__ = "tasks"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", index=True)
    title: str = Field(max_length=255)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationship
    user: Optional[User] = Relationship(back_populates="tasks")


# ============================================================================
# Request/Response Models (Pydantic)
# ============================================================================

class UserCreate(BaseModel):
    """User registration request."""
    email: EmailStr
    username: str
    password: str


class UserLogin(BaseModel):
    """User login request."""
    email: EmailStr
    password: str


class Token(BaseModel):
    """JWT token response."""
    access_token: str
    token_type: str = "bearer"
    user_id: int
    username: str


class TaskCreate(BaseModel):
    """Task creation request."""
    title: str
    description: Optional[str] = None


class TaskUpdate(BaseModel):
    """Task update request."""
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None


class TaskResponse(BaseModel):
    """Task response model."""
    id: int
    user_id: int
    title: str
    description: Optional[str]
    completed: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# ============================================================================
# Chat Models (Phase III)
# ============================================================================

class Conversation(SQLModel, table=True):
    """Conversation database model."""
    __tablename__ = "conversations"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    user: Optional[User] = Relationship(back_populates="conversations")
    messages: List["Message"] = Relationship(back_populates="conversation")


class Message(SQLModel, table=True):
    """Message database model."""
    __tablename__ = "messages"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    conversation_id: int = Field(foreign_key="conversations.id", index=True)
    role: str = Field(max_length=20)  # 'user' or 'assistant'
    content: str = Field(max_length=5000)
    tool_calls: Optional[str] = Field(default=None, max_length=10000)  # JSON string
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationship
    conversation: Optional[Conversation] = Relationship(back_populates="messages")


# ============================================================================
# Chat Request/Response Models (Pydantic)
# ============================================================================

class ChatRequest(BaseModel):
    """Chat message request."""
    conversation_id: Optional[int] = None
    message: str


class ToolCallInfo(BaseModel):
    """Information about a tool call."""
    tool_name: str
    inputs: dict
    output: dict


class ChatResponse(BaseModel):
    """Chat response model."""
    conversation_id: int
    response: str
    tool_calls: List[ToolCallInfo] = []
