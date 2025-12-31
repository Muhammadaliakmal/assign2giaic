from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.config import settings
from app.database import create_db_and_tables
from app.routers import auth, tasks, chat


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan manager.
    Creates database tables on startup.
    """
    # Startup
    print("Creating database tables...")
    create_db_and_tables()
    print("Database tables created successfully!")
    
    yield
    
    # Shutdown
    print("Application shutting down...")


# Create FastAPI application
app = FastAPI(
    title="Phase III Task Manager API with AI Chatbot",
    description="RESTful API for task management with JWT authentication and AI-powered chatbot",
    version="2.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router)
app.include_router(tasks.router)
app.include_router(chat.router)  # Phase III: AI Chatbot


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "Phase III Task Manager API with AI Chatbot",
        "version": "2.0.0",
        "status": "running"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}
