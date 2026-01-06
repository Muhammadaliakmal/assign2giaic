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


# ============================================================================
# Chat Kit Models (Chat Kit Configuration System)
# ============================================================================

class ChatKit(SQLModel, table=True):
    """Chat Kit configuration database model."""
    __tablename__ = "chat_kits"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    chatbot_id: str = Field(max_length=100, index=True)
    chatbot_name: str = Field(max_length=255)
    chatbot_type: str = Field(max_length=50)
    
    # Chat Kit Info
    kit_id: str = Field(max_length=100, unique=True, index=True)
    kit_name: str = Field(max_length=255)
    provider: str = Field(max_length=100)
    enabled: bool = Field(default=True)
    
    # JSON configurations
    capabilities: str = Field(max_length=2000)  # JSON string
    ui_config: str = Field(max_length=2000)  # JSON string
    limits: str = Field(max_length=1000)  # JSON string
    security_config: str = Field(max_length=1000)  # JSON string
    telemetry_config: str = Field(max_length=1000)  # JSON string
    
    # Metadata
    version: str = Field(default="1.0.0", max_length=20)
    environment: str = Field(default="production", max_length=50)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


# ============================================================================
# Chat Kit Request/Response Models (Pydantic)
# ============================================================================

class ChatbotInfo(BaseModel):
    """Chatbot information."""
    id: str
    name: str
    type: str


class ChatKitCapabilities(BaseModel):
    """Chat kit capabilities configuration."""
    text_chat: bool = True
    context_memory: bool = True
    rich_responses: bool = True
    streaming: bool = False
    attachments: Optional[dict] = None


class ChatKitUI(BaseModel):
    """Chat kit UI configuration."""
    theme: str = "auto"
    position: str = "bottom-right"
    launcher: Optional[dict] = None


class ChatKitLimits(BaseModel):
    """Chat kit limits configuration."""
    max_message_length: int = 4000
    rate_limit_per_minute: int = 60


class ChatKitSecurity(BaseModel):
    """Chat kit security configuration."""
    auth_required: bool = True
    auth_type: str = "jwt"
    scopes: List[str] = []


class ChatKitTelemetry(BaseModel):
    """Chat kit telemetry configuration."""
    logging: bool = True
    metrics: bool = True
    trace_level: str = "info"


class ChatKitInfo(BaseModel):
    """Chat kit information."""
    id: str
    name: str
    provider: str
    enabled: bool = True
    capabilities: ChatKitCapabilities
    ui: ChatKitUI
    limits: ChatKitLimits


class ChatKitRegistration(BaseModel):
    """Chat kit registration request."""
    action: str = "register_chat_kit"
    version: str = "1.0.0"
    environment: str = "production"
    chatbot: ChatbotInfo
    chat_kit: ChatKitInfo
    security: ChatKitSecurity
    telemetry: ChatKitTelemetry


class ChatKitResponse(BaseModel):
    """Chat kit response model."""
    id: int
    chatbot_id: str
    chatbot_name: str
    chatbot_type: str
    kit_id: str
    kit_name: str
    provider: str
    enabled: bool
    capabilities: dict
    ui_config: dict
    limits: dict
    security_config: dict
    telemetry_config: dict
    version: str
    environment: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class ChatKitUpdate(BaseModel):
    """Chat kit update request."""
    enabled: Optional[bool] = None
    capabilities: Optional[ChatKitCapabilities] = None
    ui: Optional[ChatKitUI] = None
    limits: Optional[ChatKitLimits] = None
    security: Optional[ChatKitSecurity] = None
    telemetry: Optional[ChatKitTelemetry] = None


# ============================================================================
# Agent SDK Models (OpenAI Agent Configuration)
# ============================================================================

class AgentConfig(SQLModel, table=True):
    """Agent SDK configuration database model."""
    __tablename__ = "agent_configs"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    agent_id: str = Field(max_length=100, unique=True, index=True)
    display_name: str = Field(max_length=255)
    provider: str = Field(max_length=50)
    
    # Model Policy (JSON)
    model_policy: str = Field(max_length=2000)  # JSON string
    
    # Integration settings
    target: str = Field(max_length=100)
    mode: str = Field(max_length=50)
    lifecycle: str = Field(max_length=1000)  # JSON string
    
    # Capabilities (JSON)
    capabilities: str = Field(max_length=2000)  # JSON string
    
    # Security (JSON)
    security: str = Field(max_length=2000)  # JSON string
    
    # Observability (JSON)
    observability: str = Field(max_length=1000)  # JSON string
    
    # Failover (JSON)
    failover: str = Field(max_length=1000)  # JSON string
    
    # Compliance (JSON)
    compliance: str = Field(max_length=1000)  # JSON string
    
    # Activation
    status: str = Field(default="enabled", max_length=20)
    activation_time: str = Field(default="immediate", max_length=50)
    
    # Metadata
    spec_version: str = Field(default="1.0.0", max_length=20)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


# ============================================================================
# Agent SDK Request/Response Models (Pydantic)
# ============================================================================

class ModelPolicy(BaseModel):
    """Model policy configuration."""
    default_model: str = "gpt-4.1"
    fallback_models: List[str] = ["gpt-4.1-mini"]
    temperature: float = 0.7
    max_tokens: int = 4096


class Lifecycle(BaseModel):
    """Lifecycle configuration."""
    auto_start: bool = True
    graceful_shutdown: bool = True
    hot_reload: bool = False


class Integration(BaseModel):
    """Integration configuration."""
    target: str
    mode: str = "embedded"
    lifecycle: Lifecycle


class ConversationMemory(BaseModel):
    """Conversation memory configuration."""
    type: str = "contextual"
    window_size: int = 10
    persist: bool = False


class ConversationCapability(BaseModel):
    """Conversation capability configuration."""
    enabled: bool = True
    memory: ConversationMemory


class ReasoningCapability(BaseModel):
    """Reasoning capability configuration."""
    enabled: bool = True
    strategy: str = "chain_of_thought_guarded"


class ToolsCapability(BaseModel):
    """Tools capability configuration."""
    enabled: bool = True
    tool_selection: str = "auto"


class AgentCapabilities(BaseModel):
    """Agent capabilities configuration."""
    conversation: ConversationCapability
    reasoning: ReasoningCapability
    tools: ToolsCapability


class Authentication(BaseModel):
    """Authentication configuration."""
    method: str = "api_key"
    key_source: str = "environment"


class Permissions(BaseModel):
    """Permissions configuration."""
    allow_external_calls: bool = False
    allow_code_execution: bool = False


class DataHandling(BaseModel):
    """Data handling configuration."""
    log_user_input: bool = False
    log_model_output: bool = True
    pii_redaction: bool = True


class AgentSecurity(BaseModel):
    """Agent security configuration."""
    authentication: Authentication
    permissions: Permissions
    data_handling: DataHandling


class Logging(BaseModel):
    """Logging configuration."""
    level: str = "info"
    structured: bool = True


class Metrics(BaseModel):
    """Metrics configuration."""
    enabled: bool = True
    capture_latency: bool = True
    capture_tokens: bool = True


class Tracing(BaseModel):
    """Tracing configuration."""
    enabled: bool = False


class Observability(BaseModel):
    """Observability configuration."""
    logging: Logging
    metrics: Metrics
    tracing: Tracing


class Failover(BaseModel):
    """Failover configuration."""
    on_timeout: str = "retry"
    on_rate_limit: str = "fallback_model"
    max_retries: int = 2


class Compliance(BaseModel):
    """Compliance configuration."""
    safety_mode: str = "standard"
    content_filtering: bool = True
    region_restrictions: List[str] = []


class Activation(BaseModel):
    """Activation configuration."""
    status: str = "enabled"
    activation_time: str = "immediate"


class AgentInfo(BaseModel):
    """Agent information."""
    id: str
    display_name: str
    provider: str
    model_policy: ModelPolicy


class AgentConfigRequest(BaseModel):
    """Agent SDK initialization request."""
    prompt_type: str = "agent_sdk_initialization"
    spec_version: str = "1.0.0"
    agent: AgentInfo
    integration: Integration
    capabilities: AgentCapabilities
    security: AgentSecurity
    observability: Observability
    failover: Failover
    compliance: Compliance
    activation: Activation


class AgentConfigResponse(BaseModel):
    """Agent configuration response."""
    id: int
    agent_id: str
    display_name: str
    provider: str
    model_policy: dict
    target: str
    mode: str
    lifecycle: dict
    capabilities: dict
    security: dict
    observability: dict
    failover: dict
    compliance: dict
    status: str
    activation_time: str
    spec_version: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class AgentConfigUpdate(BaseModel):
    """Agent configuration update request."""
    model_policy: Optional[ModelPolicy] = None
    capabilities: Optional[AgentCapabilities] = None
    security: Optional[AgentSecurity] = None
    observability: Optional[Observability] = None
    failover: Optional[Failover] = None
    status: Optional[str] = None

