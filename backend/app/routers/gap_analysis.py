from fastapi import APIRouter, Query, HTTPException
from typing import Optional, List
from app.schemas.schemas import GapAnalysisResponse
from app.services.similarity import run_semantic_gap_analysis
from app.db.session import get_connection

router = APIRouter(prefix="/gap-analysis", tags=["Gap Analysis"])

@router.get("/analyze", response_model=GapAnalysisResponse)
def analyze_student_gaps(
    student_id: Optional[str] = Query("demo-student"),
    course: Optional[str] = Query("B.Tech CSE"),
    semester: Optional[int] = Query(5),
    dream_role: Optional[str] = Query("Software Developer")
):
    conn = get_connection()
    cursor = conn.cursor()
    
    # Retrieve profile if available
    cursor.execute("SELECT * FROM students WHERE id = ?", (student_id,))
    profile = cursor.fetchone()
    if profile:
        course = profile["course"] or course
        semester = profile["semester"] or semester
        dream_role = profile["dream_role"] or dream_role
        
    # Retrieve verified skills
    cursor.execute("SELECT skill_id FROM verified_skills WHERE student_id = ?", (student_id,))
    rows = cursor.fetchall()
    verified_skill_ids = [r[0] for r in rows]
    conn.close()
    
    # If no skills verified yet for demo, seed one pre-verified skill for realism if demo-student
    if not verified_skill_ids and student_id == "demo-student":
        verified_skill_ids = ["skill-git"]
        
    analysis_data = run_semantic_gap_analysis(
        course=course,
        semester=semester,
        dream_role=dream_role,
        verified_skill_ids=verified_skill_ids
    )
    
    return GapAnalysisResponse(
        student_id=student_id,
        course=analysis_data["course"],
        semester=analysis_data["semester"],
        dream_role=analysis_data["dream_role"],
        role_overview=analysis_data["role_overview"],
        average_salary_lpa=analysis_data["average_salary_lpa"],
        total_role_skills=analysis_data["total_role_skills"],
        covered_skills_count=analysis_data["covered_skills_count"],
        gap_skills_count=analysis_data["gap_skills_count"],
        verified_skills_count=analysis_data["verified_skills_count"],
        readiness_percentage=analysis_data["readiness_percentage"],
        gap_skills=analysis_data["gap_skills"],
        covered_skills=analysis_data["covered_skills"]
    )
