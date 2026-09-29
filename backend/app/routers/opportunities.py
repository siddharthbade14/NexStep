import json
import os
import secrets
from fastapi import APIRouter, Query, HTTPException
from typing import Optional, List
from app.schemas.schemas import (
    InternshipItem,
    JobApplicationCreateRequest,
    JobApplicationItem
)
from app.db.session import get_connection

router = APIRouter(prefix="/opportunities", tags=["Opportunity Matcher & Placement Portal"])

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")

def load_internships() -> List[dict]:
    with open(os.path.join(DATA_DIR, "internships.json"), "r", encoding="utf-8") as f:
        return json.load(f)

@router.get("/match/{student_id}")
def get_matched_opportunities(
    student_id: str,
    only_qualified: bool = Query(False),
    role_filter: Optional[str] = Query(None)
):
    conn = get_connection()
    cursor = conn.cursor()
    
    # Get student profile
    cursor.execute("SELECT * FROM students WHERE id = ?", (student_id,))
    profile = cursor.fetchone()
    
    course = profile["course"] if profile else "B.Tech CSE"
    semester = profile["semester"] if profile else 5
    
    # Get student's verified skills
    cursor.execute("SELECT skill_id FROM verified_skills WHERE student_id = ?", (student_id,))
    verified_skill_ids = set(r["skill_id"] for r in cursor.fetchall())
    
    # Pre-verify git for demo student if empty
    if not verified_skill_ids and student_id == "demo-student":
        verified_skill_ids.add("skill-git")
        
    conn.close()
    
    internships = load_internships()
    results = []
    
    for item in internships:
        if role_filter and role_filter.lower() != "all" and role_filter.lower() not in item["role_category"].lower():
            continue
            
        req_skills = item.get("required_skills", [])
        total_req = len(req_skills)
        
        matched = [s for s in req_skills if s in verified_skill_ids]
        missing = [s for s in req_skills if s not in verified_skill_ids]
        
        match_pct = int((len(matched) / max(1, total_req)) * 100)
        is_qualified = (len(missing) == 0) or (len(matched) >= total_req - 1 and len(matched) >= 2)
        
        matched_names = [s.replace("skill-", "").replace("-", " ").title() for s in matched]
        
        if is_qualified and len(missing) == 0:
            why_tag = f"100% Qualified! Verified in: {', '.join(matched_names)}"
        elif is_qualified:
            why_tag = f"Strong Match ({match_pct}%): Verified in {', '.join(matched_names)}"
        elif matched:
            why_tag = f"Partial Match: Verified in {', '.join(matched_names)}. Verify {missing[0].replace('skill-', '').replace('-', ' ').title()} to qualify."
        else:
            why_tag = f"Requires verification in {', '.join([s.replace('skill-', '').replace('-', ' ').title() for s in req_skills])}"
            
        if only_qualified and not is_qualified:
            continue
            
        results.append(InternshipItem(
            id=item["id"],
            title=item["title"],
            company=item["company"],
            logo_initials=item["logo_initials"],
            role_category=item["role_category"],
            location=item["location"],
            stipend=item["stipend"],
            duration=item["duration"],
            min_semester=item["min_semester"],
            eligible_courses=item["eligible_courses"],
            required_skills=item["required_skills"],
            good_to_have=item.get("good_to_have", []),
            about=item["about"],
            batch=item["batch"],
            apply_link=item["apply_link"],
            is_qualified=is_qualified,
            match_percentage=match_pct,
            verified_matching_skills=matched,
            missing_skills=missing,
            why_qualify_tag=why_tag
        ))
        
    results.sort(key=lambda x: (x.is_qualified, x.match_percentage), reverse=True)
    return results

@router.post("/apply", response_model=JobApplicationItem)
def submit_job_application(payload: JobApplicationCreateRequest):
    conn = get_connection()
    cursor = conn.cursor()
    
    # Check if student exists
    cursor.execute("SELECT * FROM students WHERE id = ?", (payload.student_id,))
    student = cursor.fetchone()
    student_name = student["name"] if student else "Aarav Sharma"
    student_college = student["college"] if student else "Delhi Technological University (DTU)"
    student_course = student["course"] if student else "B.Tech CSE"
    
    # Check if application already submitted
    cursor.execute(
        "SELECT * FROM job_applications WHERE student_id = ? AND internship_id = ?",
        (payload.student_id, payload.internship_id)
    )
    existing = cursor.fetchone()
    if existing:
        conn.close()
        return JobApplicationItem(
            id=existing["id"],
            student_id=existing["student_id"],
            student_name=existing["student_name"],
            student_college=existing["student_college"],
            student_course=existing["student_course"],
            internship_id=existing["internship_id"],
            company=existing["company"],
            role_title=existing["role_title"],
            match_percentage=existing["match_percentage"],
            status=existing["status"],
            proof_certificate_id=existing["proof_certificate_id"],
            verified_skills_snapshot=json.loads(existing["verified_skills_snapshot"]) if existing["verified_skills_snapshot"] else [],
            code_proof_snippet=existing["code_proof_snippet"],
            recruiter_notes=existing["recruiter_notes"],
            applied_at=existing["applied_at"]
        )
        
    # Get student's verified skills and latest code proof
    cursor.execute("SELECT skill_name, certificate_id, code_snippet FROM verified_skills WHERE student_id = ?", (payload.student_id,))
    v_skills_rows = cursor.fetchall()
    v_skills_names = [r["skill_name"] for r in v_skills_rows]
    latest_cert = v_skills_rows[0]["certificate_id"] if v_skills_rows and v_skills_rows[0]["certificate_id"] else "NX-PROOF-VERIFIED"
    latest_code = v_skills_rows[0]["code_snippet"] if v_skills_rows and v_skills_rows[0]["code_snippet"] else "# Candidate proof"
    
    app_id = f"app-{secrets.token_hex(6)}"
    
    cursor.execute("""
    INSERT INTO job_applications (
        id, student_id, student_name, student_college, student_course,
        internship_id, company, role_title, match_percentage, status,
        proof_certificate_id, verified_skills_snapshot, code_proof_snippet, recruiter_notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'applied', ?, ?, ?, ?)
    """, (
        app_id, payload.student_id, student_name, student_college, student_course,
        payload.internship_id, payload.company, payload.role_title, payload.match_percentage,
        latest_cert, json.dumps(v_skills_names), latest_code,
        "Application received with verified skill proof-of-work. Automatically queued for recruiter review."
    ))
    
    conn.commit()
    conn.close()
    
    return JobApplicationItem(
        id=app_id,
        student_id=payload.student_id,
        student_name=student_name,
        student_college=student_college,
        student_course=student_course,
        internship_id=payload.internship_id,
        company=payload.company,
        role_title=payload.role_title,
        match_percentage=payload.match_percentage,
        status="applied",
        proof_certificate_id=latest_cert,
        verified_skills_snapshot=v_skills_names,
        code_proof_snippet=latest_code,
        recruiter_notes="Application received with verified skill proof-of-work. Automatically queued for recruiter review.",
        applied_at="Just now"
    )

@router.get("/my-applications/{student_id}", response_model=List[JobApplicationItem])
def get_student_applications(student_id: str):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM job_applications WHERE student_id = ? ORDER BY applied_at DESC", (student_id,))
    rows = cursor.fetchall()
    conn.close()
    
    items = []
    for r in rows:
        try:
            skills = json.loads(r["verified_skills_snapshot"]) if r["verified_skills_snapshot"] else []
        except Exception:
            skills = []
        items.append(JobApplicationItem(
            id=r["id"],
            student_id=r["student_id"],
            student_name=r["student_name"],
            student_college=r["student_college"],
            student_course=r["student_course"],
            internship_id=r["internship_id"],
            company=r["company"],
            role_title=r["role_title"],
            match_percentage=r["match_percentage"],
            status=r["status"],
            proof_certificate_id=r["proof_certificate_id"],
            verified_skills_snapshot=skills,
            code_proof_snippet=r["code_proof_snippet"],
            recruiter_notes=r["recruiter_notes"],
            applied_at=r["applied_at"] or "2026-09-29T10:00:00"
        ))
    return items
