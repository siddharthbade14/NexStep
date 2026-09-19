import json
import os
from fastapi import APIRouter
from typing import Optional, List
from app.schemas.schemas import RoadmapResponse, RoadmapNode
from app.db.session import get_connection
from app.services.similarity import load_roles

router = APIRouter(prefix="/roadmap", tags=["Roadmap"])

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")

@router.get("/{student_id}", response_model=RoadmapResponse)
def get_student_roadmap(student_id: str, dream_role: Optional[str] = None):
    conn = get_connection()
    cursor = conn.cursor()
    
    # Get student profile
    cursor.execute("SELECT * FROM students WHERE id = ?", (student_id,))
    profile = cursor.fetchone()
    
    if not dream_role:
        dream_role = profile["dream_role"] if profile else "Software Developer"
    
    # Get verified skills
    cursor.execute("SELECT skill_id FROM verified_skills WHERE student_id = ?", (student_id,))
    verified_skill_ids = set(r["skill_id"] for r in cursor.fetchall())
    
    # Pre-verify git for demo student if empty
    if not verified_skill_ids and student_id == "demo-student":
        verified_skill_ids.add("skill-git")
        
    # Get completed quiz resources
    cursor.execute("SELECT resource_id FROM resource_progress WHERE student_id = ? AND is_completed = 1", (student_id,))
    completed_resources = set(r["resource_id"] for r in cursor.fetchall())
    conn.close()
    
    roles = load_roles()
    role_info = roles.get(dream_role, roles["Software Developer"])
    role_skills = role_info.get("skills", [])
    
    nodes = []
    
    # Step 0: Foundation / University Core
    nodes.append(RoadmapNode(
        id="foundation-core",
        title="College Core Curriculum",
        category="Academic Foundation",
        status="verified",
        order=1,
        description="Core engineering principles, programming fundamentals, mathematics, and data structures completed in college.",
        estimated_hours="Semester 1 - 4",
        is_target_role=False
    ))
    
    # Sequenced gap skills
    found_active = False
    for idx, skill in enumerate(role_skills):
        skill_id = skill["id"]
        is_verified = (skill_id in verified_skill_ids) or (skill_id in completed_resources)
        
        if is_verified:
            status = "verified"
        elif not found_active:
            status = "in_progress"
            found_active = True
        else:
            status = "locked"
            
        nodes.append(RoadmapNode(
            id=skill_id,
            title=skill["name"],
            category=skill["category"],
            status=status,
            order=idx + 2,
            description=skill["industry_relevance"],
            estimated_hours="10-15 Hours",
            is_target_role=False
        ))
        
    # Final Dream Role Goal node
    all_verified = all(n.status == "verified" for n in nodes)
    nodes.append(RoadmapNode(
        id="target-goal",
        title=f"Goal: {dream_role}",
        category="Target Career",
        status="in_progress" if any(n.status == "in_progress" for n in nodes) else ("verified" if all_verified else "locked"),
        order=len(nodes) + 1,
        description=f"Industry-ready {dream_role} profile with verified practical skills, ready for top tier tech internships and high-growth placement offers.",
        estimated_hours="Placement Ready",
        is_target_role=True
    ))
    
    verified_nodes = sum(1 for n in nodes if n.status == "verified")
    total_nodes = len(nodes)
    completion_percentage = int((verified_nodes / max(1, total_nodes)) * 100)
    
    return RoadmapResponse(
        student_id=student_id,
        dream_role=dream_role,
        nodes=nodes,
        completion_percentage=completion_percentage
    )
