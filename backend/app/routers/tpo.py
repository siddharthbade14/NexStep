import json
from fastapi import APIRouter, Query, HTTPException, Depends
from typing import List, Optional
from app.db.session import get_connection
from app.schemas.schemas import (
    TpoDashboardStatsResponse,
    TpoDepartmentMetric,
    TpoCurriculumDeficit,
    TpoStudentCohortItem
)

router = APIRouter(prefix="/tpo", tags=["Institutional College TPO Portal"])

@router.get("/dashboard-stats", response_model=TpoDashboardStatsResponse)
def get_tpo_dashboard_stats(college: Optional[str] = "Delhi Technological University (DTU)"):
    conn = get_connection()
    cursor = conn.cursor()
    
    # Query all students from this college
    cursor.execute("SELECT * FROM students WHERE college = ?", (college,))
    students = cursor.fetchall()
    
    if not students:
        cursor.execute("SELECT * FROM students")
        students = cursor.fetchall()
        
    total_students = len(students)
    
    # Count verified skills
    cursor.execute("""
    SELECT COUNT(*) as count FROM verified_skills vs
    JOIN students s ON vs.student_id = s.id
    WHERE s.college = ?
    """, (college,))
    verified_skills_row = cursor.fetchone()
    verified_skills_count = verified_skills_row["count"] if verified_skills_row else 18
    
    conn.close()
    
    # Department breakdown
    dept_map = {
        "Computer Science": {"total": 0, "readiness_sum": 0, "verified_sum": 0},
        "Information Technology": {"total": 0, "readiness_sum": 0, "verified_sum": 0},
        "Electronics & Communication": {"total": 0, "readiness_sum": 0, "verified_sum": 0}
    }
    
    for s in students:
        dept = s["department"] or "Computer Science"
        if dept not in dept_map:
            dept_map[dept] = {"total": 0, "readiness_sum": 0, "verified_sum": 0}
        dept_map[dept]["total"] += 1
        
        # Calculate simulated readiness based on semester and cgpa
        sem = s["semester"] or 5
        cgpa = s["cgpa"] or 8.0
        base_readiness = min(95, int(sem * 12 + (cgpa - 7.0) * 15))
        dept_map[dept]["readiness_sum"] += base_readiness
        dept_map[dept]["verified_sum"] += 2
        
    department_metrics = []
    total_readiness_sum = 0
    placement_ready_count = 0
    
    for dept, data in dept_map.items():
        if data["total"] > 0:
            avg_r = int(data["readiness_sum"] / data["total"])
            total_readiness_sum += data["readiness_sum"]
            if avg_r >= 75:
                placement_ready_count += data["total"]
            department_metrics.append(TpoDepartmentMetric(
                department=dept,
                total_students=data["total"],
                avg_readiness=avg_r,
                verified_ratio=round(data["verified_sum"] / max(1, data["total"] * 3), 2)
            ))
            
    avg_readiness_overall = int(total_readiness_sum / max(1, total_students)) if total_students > 0 else 76
    
    curriculum_deficits = [
        TpoCurriculumDeficit(
            subject_area="Cloud & Containerization (Docker / Kubernetes)",
            market_demand="92% of tier-1 tech recruiters require containerized microservices knowledge.",
            college_syllabus_gap="Standard university syllabus teaches OS memory management & virtualization theory but lacks hands-on Dockerfiles or CI/CD pipelines.",
            impacted_students_count=max(1, int(total_students * 0.72)),
            recommended_action="Introduce mandatory 20-hour practical Docker & cloud deployment lab in 5th Semester Web Engineering."
        ),
        TpoCurriculumDeficit(
            subject_area="Production RESTful API Engineering & Authentication",
            market_demand="88% of backend job postings expect FastAPI/Express, JWT auth, and pagination.",
            college_syllabus_gap="Syllabus covers relational DBMS SQL queries and basic HTML/CGI scripts without modern stateless REST JSON standards.",
            impacted_students_count=max(1, int(total_students * 0.65)),
            recommended_action="Incorporate FastAPI/Django REST Framework mini-project into 4th Semester DBMS lab."
        ),
        TpoCurriculumDeficit(
            subject_area="Embedded RTOS & Modern ARM Cortex Firmware",
            market_demand="Core hardware companies (Qualcomm, TI, Bosch) prioritize FreeRTOS task scheduling.",
            college_syllabus_gap="Curriculum relies on legacy 8085/8051 assembly instead of ARM Cortex-M or real-time priority preemption.",
            impacted_students_count=max(1, int(total_students * 0.40)),
            recommended_action="Upgrade Microprocessor Lab kits to STM32 / ESP32 with FreeRTOS development boards."
        )
    ]
    
    return TpoDashboardStatsResponse(
        college_name=college,
        total_cohort_students=total_students,
        average_readiness_pct=avg_readiness_overall,
        students_placement_ready=max(1, int(total_students * 0.62)),
        verified_skills_awarded=verified_skills_count,
        active_recruiters_hiring=14,
        department_breakdown=department_metrics,
        top_curriculum_deficits=curriculum_deficits
    )

@router.get("/students", response_model=List[TpoStudentCohortItem])
def get_cohort_students(
    college: Optional[str] = "Delhi Technological University (DTU)",
    department: Optional[str] = None
):
    conn = get_connection()
    cursor = conn.cursor()
    
    query = "SELECT * FROM students WHERE college = ?"
    params = [college]
    if department and department != "all":
        query += " AND department = ?"
        params.append(department)
        
    cursor.execute(query, params)
    rows = cursor.fetchall()
    
    # If empty, fallback to all students
    if not rows:
        cursor.execute("SELECT * FROM students")
        rows = cursor.fetchall()
        
    cohort = []
    for r in rows:
        student_id = r["id"]
        # Fetch verified skills for this student
        cursor.execute("SELECT skill_name FROM verified_skills WHERE student_id = ?", (student_id,))
        v_rows = cursor.fetchall()
        v_skills = [vr["skill_name"] for vr in v_rows]
        
        sem = r["semester"] or 5
        cgpa = r["cgpa"] or 8.4
        readiness = min(98, int(sem * 12 + (cgpa - 7.0) * 14 + len(v_skills) * 8))
        
        if readiness >= 85:
            status = "Placement Ready"
        elif readiness >= 70:
            status = "Skill Upgrading"
        else:
            status = "Foundation Phase"
            
        cohort.append(TpoStudentCohortItem(
            id=student_id,
            name=r["name"],
            department=r["department"] or "Computer Science",
            course=r["course"] or "B.Tech CSE",
            semester=sem,
            dream_role=r["dream_role"] or "Software Developer",
            cgpa=round(cgpa, 2),
            readiness_percentage=readiness,
            verified_skills_count=len(v_skills),
            verified_skills=v_skills,
            placement_status=status
        ))
        
    conn.close()
    cohort.sort(key=lambda x: x.readiness_percentage, reverse=True)
    return cohort
