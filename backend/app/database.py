from sqlmodel import create_engine, SQLModel, Session
from app.config import settings
from typing import Generator


# Create database engine
engine = create_engine(
    settings.DATABASE_URL,
    echo=True,  # Log SQL queries (disable in production)
    pool_pre_ping=True,  # Verify connections before using
)


def create_db_and_tables():
    """Create all database tables."""
    SQLModel.metadata.create_all(engine)


def get_session() -> Generator[Session, None, None]:
    """
    Dependency to get database session.
    
    Yields:
        Session: SQLModel database session
    """
    with Session(engine) as session:
        yield session
