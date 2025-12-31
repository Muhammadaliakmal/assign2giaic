from contextvars import ContextVar
from typing import Optional
from sqlmodel import Session

# Context variables to hold request-scoped data
session_context: ContextVar[Optional[Session]] = ContextVar("session_context", default=None)
user_id_context: ContextVar[Optional[int]] = ContextVar("user_id_context", default=None)
