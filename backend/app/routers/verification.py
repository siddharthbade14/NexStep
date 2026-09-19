from fastapi import APIRouter, HTTPException
from typing import Optional, Dict, Any
from app.schemas.schemas import CodeRunRequest, CodeRunResponse
from app.services.code_runner import execute_code_challenge, load_challenges
from app.db.session import get_connection

router = APIRouter(prefix="/verify", tags=["Skill Verification"])

@router.get("/challenge/{skill_id}")
def get_challenge_details(skill_id: str):
    challenges = load_challenges()
    challenge = challenges.get(skill_id)
    if not challenge:
        # Generate default challenge format
        return {
            "skill_id": skill_id,
            "title": f"Coding Challenge: {skill_id.replace('skill-', '').replace('-', ' ').title()}",
            "language": "python",
            "difficulty": "Intermediate",
            "description": f"Demonstrate practical proficiency in {skill_id}. Write a function that processes structured inputs and handles boundary conditions according to industry standards.",
            "starter_code": "def solution(data):\n    # TODO: Implement your solution here\n    pass\n",
            "test_cases": [
                {"input": "data=[1, 2, 3]", "expected": "6"},
                {"input": "data=[]", "expected": "0"},
                {"input": "data=[-1, 5, 2]", "expected": "6"}
            ]
        }
    
    # Strip solution template from public endpoint
    challenge_data = dict(challenge)
    challenge_data.pop("solution_template", None)
    return challenge_data

@router.post("/submit", response_model=CodeRunResponse)
async def submit_challenge_code(payload: CodeRunRequest):
    result = await execute_code_challenge(
        skill_id=payload.skill_id,
        code=payload.code,
        language=payload.language
    )
    
    # If all test cases passed, record verified skill in SQLite
    if result["all_passed"]:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("""
        INSERT OR REPLACE INTO verified_skills (student_id, skill_id, skill_name, test_cases_passed, total_test_cases, code_snippet)
        VALUES (?, ?, ?, ?, ?, ?)
        """, (
            payload.student_id or "demo-student",
            payload.skill_id,
            payload.skill_id.replace("skill-", "").replace("-", " ").title(),
            result["passed_count"],
            result["total_count"],
            payload.code
        ))
        conn.commit()
        conn.close()
        
    return CodeRunResponse(
        skill_id=result["skill_id"],
        all_passed=result["all_passed"],
        passed_count=result["passed_count"],
        total_count=result["total_count"],
        results=result["results"],
        message=result["message"],
        is_verified=result["all_passed"]
    )
