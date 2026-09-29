import os
from typing import List
from pydantic import BaseModel

class Settings(BaseModel):
    PROJECT_NAME: str = "NexStep Enterprise API"
    VERSION: str = "2.0.0"
    API_PREFIX: str = "/api"
    DATABASE_URL: str = "sqlite:///./nexstep.db"
    
    # JWT Authentication & Cryptography
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "nexstep_enterprise_production_secret_key_2026_super_secure")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    CREDENTIAL_SIGNING_PEPPER: str = os.getenv("CREDENTIAL_SIGNING_PEPPER", "nexstep_proof_of_work_pepper_v2")

    # Code Execution Sandbox Security Limits
    SANDBOX_TIMEOUT_SECONDS: float = 2.5
    MAX_CODE_LENGTH_CHARS: int = 25000
    
    # Judge0 API settings (RapidAPI or self-hosted instance)
    JUDGE0_URL: str = os.getenv("JUDGE0_URL", "https://judge0-ce.p.rapidapi.com")
    JUDGE0_API_KEY: str = os.getenv("JUDGE0_API_KEY", "")
    JUDGE0_HOST: str = os.getenv("JUDGE0_HOST", "judge0-ce.p.rapidapi.com")
    
    # Embedding Model
    EMBEDDING_MODEL_NAME: str = "all-MiniLM-L6-v2"

settings = Settings()

