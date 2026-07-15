import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Noventra Solutions API"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "noventra_super_secret_key_change_me_in_production_1234567890")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours for dev ease
    
    # DB URL - defaults to SQLite database locally in workspace
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./noventra.db")

    class Config:
        case_sensitive = True

settings = Settings()
