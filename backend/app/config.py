from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List
from functools import lru_cache


class Settings(BaseSettings):
    """Application configuration settings."""
    
    # Database
    DATABASE_URL: str
    
    # JWT
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_MINUTES: int = 60 * 24  # 24 hours
    ACESS_TOKEN_EXPIRE_MINUTES: int = 30 # Fixed typo in variable name if it existed, but using standard one
    
    # CORS
    CORS_ORIGINS: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Gemini (Deprecated/Alternative)
    GEMINI_API_KEY: str = "" 
    GEMINI_MODEL: str = "gemini-2.0-flash-exp"
    
    # OpenRouter / OpenAI
    OPENROUTER_API_KEY: str = ""
    OPENROUTER_BASE_URL: str = "https://openrouter.ai/api/v1"
    OPENROUTER_MODEL: str = "meta-llama/llama-3.3-70b-instruct:free"
    
    # User specific aliases (found in .env)
    OPEN_ROUTER: str = ""
    BASE_URL: str = ""
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8-sig",
        case_sensitive=True,
        extra="ignore"
    )
    
    @property
    def cors_origins_list(self) -> List[str]:
        """Parse CORS origins from comma-separated string."""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]


@lru_cache
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()


# Global settings instance (optional, kept for backward compat if needed)
settings = get_settings()
