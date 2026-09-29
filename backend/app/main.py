import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from app.config import settings
from app.db.session import init_db
from app.services.similarity import get_embedding_model
from app.routers import (
    auth,
    onboarding,
    gap_analysis,
    verification,
    resources,
    roadmap,
    opportunities,
    tpo,
    recruiter
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize SQLite database schema & enterprise seed data
    init_db()
    # Pre-warm embedding model
    print("Pre-warming semantic similarity model...")
    get_embedding_model()
    print("NexStep Enterprise API ready to accept requests.")
    yield

# Security Headers Middleware
class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
        return response

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Enterprise-grade AI Career Guidance, Verifiable Skill Proofs, and Placement Ecosystem for Indian Higher Education.",
    lifespan=lifespan
)

# Attach Security Headers Middleware
app.add_middleware(SecurityHeadersMiddleware)

# CORS configuration for modern web clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount all API routers
app.include_router(auth.router, prefix=settings.API_PREFIX)
app.include_router(onboarding.router, prefix=settings.API_PREFIX)
app.include_router(gap_analysis.router, prefix=settings.API_PREFIX)
app.include_router(verification.router, prefix=settings.API_PREFIX)
app.include_router(resources.router, prefix=settings.API_PREFIX)
app.include_router(roadmap.router, prefix=settings.API_PREFIX)
app.include_router(opportunities.router, prefix=settings.API_PREFIX)
app.include_router(tpo.router, prefix=settings.API_PREFIX)
app.include_router(recruiter.router, prefix=settings.API_PREFIX)

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "security_sandbox": "active",
        "cryptographic_proofs": "enabled",
        "embedding_model": settings.EMBEDDING_MODEL_NAME
    }

@app.post("/api/reset-demo")
def reset_demo():
    from app.db.session import get_connection, seed_enterprise_data
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM verified_skills WHERE student_id LIKE 'demo-%' OR student_id = 'demo-student'")
    cursor.execute("DELETE FROM resource_progress WHERE student_id LIKE 'demo-%' OR student_id = 'demo-student'")
    cursor.execute("DELETE FROM job_applications WHERE id LIKE 'app-custom-%'")
    seed_enterprise_data(cursor)
    conn.commit()
    conn.close()
    return {"status": "success", "message": "Demo student data and test sandbox reset successfully"}
