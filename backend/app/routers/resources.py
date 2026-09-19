import json
import os
from fastapi import APIRouter, HTTPException
from typing import Optional, List, Dict, Any
from app.schemas.schemas import QuizSubmissionRequest, QuizSubmissionResponse
from app.db.session import get_connection

router = APIRouter(prefix="/resources", tags=["Learning Resources"])

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")

def load_resources() -> Dict[str, Any]:
    with open(os.path.join(DATA_DIR, "resources.json"), "r", encoding="utf-8") as f:
        return json.load(f)

@router.get("/list/{student_id}")
def get_student_resources(student_id: str):
    resources_map = load_resources()
    
    conn = get_connection()
    cursor = conn.cursor()
    
    # Get completed quizzes for this student
    cursor.execute("SELECT resource_id, quiz_score, is_completed FROM resource_progress WHERE student_id = ?", (student_id,))
    completed_rows = {r["resource_id"]: r for r in cursor.fetchall()}
    
    # Get verified skills
    cursor.execute("SELECT skill_id FROM verified_skills WHERE student_id = ?", (student_id,))
    verified_skills = set(r["skill_id"] for r in cursor.fetchall())
    conn.close()
    
    resource_list = []
    # Sort resources by order
    sorted_items = sorted(resources_map.values(), key=lambda x: x.get("order", 1))
    
    for idx, item in enumerate(sorted_items):
        skill_id = item["skill_id"]
        prereqs = item.get("prerequisites", [])
        
        # Check if completed
        completed_info = completed_rows.get(skill_id)
        is_completed = bool(completed_info and completed_info["is_completed"])
        quiz_score = completed_info["quiz_score"] if completed_info else None
        
        # Check prerequisites
        prereqs_satisfied = True
        for p in prereqs:
            p_comp = completed_rows.get(p)
            if not (p_comp and p_comp["is_completed"]) and (p not in verified_skills):
                prereqs_satisfied = False
                break
                
        # First resource is unlocked by default; subsequent resources unlock as prereqs pass
        is_unlocked = (idx == 0) or prereqs_satisfied
        
        # Sanitize quiz for list view (exclude correct answers, keep questions & options)
        safe_quiz = []
        for q in item.get("quiz", []):
            safe_quiz.append({
                "id": q["id"],
                "question": q["question"],
                "options": q["options"]
            })
            
        resource_list.append({
            "skill_id": skill_id,
            "title": item["title"],
            "order": item["order"],
            "provider": item["provider"],
            "url": item["url"],
            "duration_hours": item["duration_hours"],
            "level": item["level"],
            "summary": item["summary"],
            "prerequisites": prereqs,
            "is_unlocked": is_unlocked,
            "is_completed": is_completed,
            "is_skill_verified": skill_id in verified_skills,
            "quiz_score": quiz_score,
            "quiz": safe_quiz
        })
        
    return resource_list

@router.post("/quiz/submit", response_model=QuizSubmissionResponse)
def submit_recheck_quiz(payload: QuizSubmissionRequest):
    resources_map = load_resources()
    resource = resources_map.get(payload.skill_id)
    
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
        
    quiz_questions = resource.get("quiz", [])
    total_questions = len(quiz_questions)
    correct_count = 0
    
    for q in quiz_questions:
        q_id = q["id"]
        user_answer = payload.answers.get(q_id)
        if user_answer is not None and user_answer == q["correct_index"]:
            correct_count += 1
            
    passed = correct_count >= 2 # 2/3 or 3/3 is passing
    percentage = int((correct_count / max(1, total_questions)) * 100)
    
    if passed:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("""
        INSERT OR REPLACE INTO resource_progress (student_id, resource_id, quiz_score, is_completed)
        VALUES (?, ?, ?, 1)
        """, (payload.student_id or "demo-student", payload.skill_id, correct_count))
        conn.commit()
        conn.close()
        
        # Determine next unlocked skill
        sorted_items = sorted(resources_map.values(), key=lambda x: x.get("order", 1))
        next_skill = None
        for item in sorted_items:
            if payload.skill_id in item.get("prerequisites", []):
                next_skill = item["title"]
                break
                
        feedback = f"Great work! You scored {correct_count}/{total_questions} ({percentage}%). Concept verified and next milestone unlocked!"
    else:
        next_skill = None
        feedback = f"You scored {correct_count}/{total_questions}. A score of at least 2/3 is required to verify this module. Review the guide and retry."
        
    return QuizSubmissionResponse(
        skill_id=payload.skill_id,
        passed=passed,
        score=correct_count,
        total_questions=total_questions,
        percentage=percentage,
        unlocked_next_skill=next_skill,
        feedback=feedback
    )
