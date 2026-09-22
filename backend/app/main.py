import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.db.session import init_db
from app.services.similarity import get_embedding_model
from app.routers import onboarding, gap_analysis, verification, resources, roadmap, opportunities

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize SQLite database
    init_db()
    # Pre-warm embedding model
    print("Pre-warming semantic similarity model...")
    get_embedding_model()
    print("NexStep API ready to accept requests.")
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    lifespan=lifespan
)

# CORS configuration for modern web clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount all API routers
app.include_router(onboarding.router, prefix=settings.API_PREFIX)
app.include_router(gap_analysis.router, prefix=settings.API_PREFIX)
app.include_router(verification.router, prefix=settings.API_PREFIX)
app.include_router(resources.router, prefix=settings.API_PREFIX)
app.include_router(roadmap.router, prefix=settings.API_PREFIX)
app.include_router(opportunities.router, prefix=settings.API_PREFIX)

from pydantic import BaseModel
from typing import Optional

class LoginRequest(BaseModel):
    email: str
    password: Optional[str] = ""

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "embedding_model": settings.EMBEDDING_MODEL_NAME
    }

@app.post("/api/auth/login")
def login(creds: LoginRequest):
    email = creds.email.strip().lower()
    is_demo = "demo" in email or "student" in email
    student_id = "demo-student" if is_demo else email.split("@")[0]
    return {
        "status": "success",
        "token": f"nexstep_jwt_{student_id}_session",
        "user": {
            "id": student_id,
            "name": "Aarav Sharma" if is_demo else email.split("@")[0].capitalize(),
            "email": creds.email,
            "role": "student",
            "is_demo": is_demo
        }
    }

@app.post("/api/reset-demo")
def reset_demo():
    from app.db.session import get_connection
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM verified_skills WHERE student_id LIKE 'demo-%' OR student_id = 'demo-student'")
    cursor.execute("DELETE FROM resource_progress WHERE student_id LIKE 'demo-%' OR student_id = 'demo-student'")
    conn.commit()
    conn.close()
    return {"status": "success", "message": "Demo student data reset successfully"}
