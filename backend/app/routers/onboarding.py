import json
import uuid
from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List
from app.schemas.schemas import StudentOnboardingRequest, StudentProfile
from app.db.session import get_connection

router = APIRouter(prefix="/onboarding", tags=["Onboarding"])

SUGGESTED_SKILLS = [
    "Python", "C++", "Java", "SQL", "JavaScript", "HTML/CSS", 
    "Data Structures", "Git", "React", "DBMS", "Operating Systems",
    "Machine Learning", "FastAPI", "Pandas", "Docker", "Embedded C"
]

COURSES = [
    {"id": "B.Tech CSE", "name": "B.Tech Computer Science & Engineering", "semesters": 8},
    {"id": "B.Tech ECE", "name": "B.Tech Electronics & Communication Engineering", "semesters": 8},
    {"id": "B.Tech IT", "name": "B.Tech Information Technology", "semesters": 8},
    {"id": "B.Tech Electrical", "name": "B.Tech Electrical Engineering", "semesters": 8}
]

TARGET_ROLES = [
    {"id": "Software Developer", "title": "Software Developer", "badge": "High Demand", "avg_salary": "₹8.5 - 18 LPA"},
    {"id": "Data Analyst", "title": "Data Analyst", "badge": "Rapid Growth", "avg_salary": "₹6.5 - 14 LPA"},
    {"id": "Embedded Systems Engineer", "title": "Embedded Systems Engineer", "badge": "Hardware / IoT", "avg_salary": "₹7.0 - 16 LPA"}
]

LANGUAGES = ["English", "Hindi (हिन्दी)", "Tamil (தமிழ்)", "Telugu (తెలుగు)", "Bengali (বাংলা)", "Marathi (मराठी)"]

@router.get("/meta")
def get_onboarding_metadata():
    return {
        "courses": COURSES,
        "roles": TARGET_ROLES,
        "suggested_skills": SUGGESTED_SKILLS,
        "languages": LANGUAGES
    }

@router.post("/submit", response_model=StudentProfile)
def submit_onboarding(profile: StudentOnboardingRequest):
    conn = get_connection()
    cursor = conn.cursor()
    
    # Use existing or new student id
    student_id = f"student-{uuid.uuid4().hex[:8]}"
    
    cursor.execute("""
    INSERT OR REPLACE INTO students (id, name, college, course, semester, dream_role, language, self_reported_skills)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        student_id,
        profile.name,
        profile.college,
        profile.course,
        profile.semester,
        profile.dream_role,
        profile.language,
        json.dumps(profile.self_reported_skills)
    ))
    conn.commit()
    
    # Check any already verified skills
    cursor.execute("SELECT skill_id FROM verified_skills WHERE student_id = ?", (student_id,))
    rows = cursor.fetchall()
    verified_skills = [r[0] for r in rows]
    conn.close()
    
    return StudentProfile(
        id=student_id,
        name=profile.name,
        college=profile.college,
        course=profile.course,
        semester=profile.semester,
        dream_role=profile.dream_role,
        language=profile.language,
        self_reported_skills=profile.self_reported_skills,
        verified_skills=verified_skills
    )

@router.get("/profile/{student_id}", response_model=StudentProfile)
def get_profile(student_id: str):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM students WHERE id = ?", (student_id,))
    row = cursor.fetchone()
    
    if not row:
        # Return default mock profile if not found
        return StudentProfile(
            id=student_id,
            name="Aarav Sharma",
            college="Delhi Technological University",
            course="B.Tech CSE",
            semester=5,
            dream_role="Software Developer",
            language="English",
            self_reported_skills=["Python", "C++", "DBMS", "Git"],
            verified_skills=["skill-git"]
        )
        
    cursor.execute("SELECT skill_id FROM verified_skills WHERE student_id = ?", (student_id,))
    rows = cursor.fetchall()
    verified_skills = [r[0] for r in rows]
    conn.close()
    
    return StudentProfile(
        id=row["id"],
        name=row["name"],
        college=row["college"],
        course=row["course"],
        semester=row["semester"],
        dream_role=row["dream_role"],
        language=row["language"],
        self_reported_skills=json.loads(row["self_reported_skills"] or "[]"),
        verified_skills=verified_skills
    )
