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

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "embedding_model": settings.EMBEDDING_MODEL_NAME
    }

@app.post("/api/reset-demo")
def reset_demo():
    from app.db.session import get_connection
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM verified_skills WHERE student_id = 'demo-student'")
    cursor.execute("DELETE FROM resource_progress WHERE student_id = 'demo-student'")
    conn.commit()
    conn.close()
    return {"status": "success", "message": "Demo student data reset"}
