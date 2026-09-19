import os
from pydantic import BaseModel

class Settings(BaseModel):
    PROJECT_NAME: str = "NexStep API"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    DATABASE_URL: str = "sqlite:///./nexstep.db"
    
    # Judge0 API settings (RapidAPI or self-hosted instance)
    JUDGE0_URL: str = os.getenv("JUDGE0_URL", "https://judge0-ce.p.rapidapi.com")
    JUDGE0_API_KEY: str = os.getenv("JUDGE0_API_KEY", "")
    JUDGE0_HOST: str = os.getenv("JUDGE0_HOST", "judge0-ce.p.rapidapi.com")
    
    # Embedding Model
    EMBEDDING_MODEL_NAME: str = "all-MiniLM-L6-v2"

settings = Settings()
