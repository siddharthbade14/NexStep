import json
import os
from fastapi import APIRouter, Query
from typing import Optional, List
from app.schemas.schemas import InternshipItem
from app.db.session import get_connection

router = APIRouter(prefix="/opportunities", tags=["Opportunity Matcher"])

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
        if role_filter and role_filter.lower() not in item["role_category"].lower():
            continue
            
        req_skills = item.get("required_skills", [])
        total_req = len(req_skills)
        
        # Calculate intersection
        matched = [s for s in req_skills if s in verified_skill_ids]
        missing = [s for s in req_skills if s not in verified_skill_ids]
        
        match_pct = int((len(matched) / max(1, total_req)) * 100)
        # Qualified if 100% matched or (matched >= 2 and total_req <= 3)
        is_qualified = (len(missing) == 0) or (len(matched) >= total_req - 1 and len(matched) >= 2)
        
        # Friendly skill names
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
        
    # Sort: qualified first, then highest match percentage
    results.sort(key=lambda x: (x.is_qualified, x.match_percentage), reverse=True)
    return results
