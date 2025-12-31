from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from datetime import timedelta
from app.models import User, UserCreate, UserLogin, Token
from app.database import get_session
from app.auth import hash_password, verify_password, create_access_token
from app.config import settings


router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/signup", response_model=Token, status_code=status.HTTP_201_CREATED)
async def signup(
    user_data: UserCreate,
    session: Session = Depends(get_session)
):
    """
    Register a new user.
    
    Args:
        user_data: User registration data
        session: Database session
        
    Returns:
        JWT token and user information
        
    Raises:
        HTTPException: If email already exists
    """
    # Check if user already exists
    statement = select(User).where(User.email == user_data.email)
    existing_user = session.exec(statement).first()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = hash_password(user_data.password)
    new_user = User(
        email=user_data.email,
        username=user_data.username,
        hashed_password=hashed_password
    )
    
    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    
    # Create access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(new_user.id)},
        expires_delta=access_token_expires
    )
    
    return Token(
        access_token=access_token,
        user_id=new_user.id,
        username=new_user.username
    )


@router.post("/login", response_model=Token)
async def login(
    credentials: UserLogin,
    session: Session = Depends(get_session)
):
    """
    Authenticate user and return JWT token.
    
    Args:
        credentials: User login credentials
        session: Database session
        
    Returns:
        JWT token and user information
        
    Raises:
        HTTPException: If credentials are invalid
    """
    # Find user by email
    statement = select(User).where(User.email == credentials.email)
    user = session.exec(statement).first()
    
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id)},
        expires_delta=access_token_expires
    )
    
    return Token(
        access_token=access_token,
        user_id=user.id,
        username=user.username
    )
