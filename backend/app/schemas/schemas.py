from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

# --- Authentication & User Schemas ---
class AuthLoginRequest(BaseModel):
    email: str
    password: str

class AuthRegisterRequest(BaseModel):
    email: str
    password: str
    full_name: str
    role: str = "student" # 'student', 'college_tpo', 'recruiter'
    college: Optional[str] = "Delhi Technological University (DTU)"
    department: Optional[str] = "Computer Science"
    course: Optional[str] = "B.Tech CSE"
    semester: Optional[int] = 5
    company_name: Optional[str] = None
    designation: Optional[str] = None

class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    role: str
    avatar: Optional[str] = None
    college: Optional[str] = None
    company_name: Optional[str] = None
    designation: Optional[str] = None

class AuthResponse(BaseModel):
    status: str
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
    message: str

# --- Student Onboarding & Profiling ---
class StudentOnboardingRequest(BaseModel):
    name: str = "Aarav Sharma"
    college: str = "Delhi Technological University (DTU)"
    department: Optional[str] = "Computer Science"
    stream: Optional[str] = "Computer Science & Engineering"
    domain: Optional[str] = "Full-Stack & Web Engineering"
    degree: Optional[str] = "B.Tech"
    course: str = "B.Tech CSE"
    semester: int = Field(ge=1, le=8, default=5)
    grad_year: Optional[int] = 2026
    dream_role: str = "Software Developer"
    cgpa: Optional[float] = 8.6
    language: str = "English"
    self_reported_skills: List[str] = []
    target_companies: Optional[List[str]] = []
    preferred_work_mode: Optional[str] = "Hybrid"
    preferred_location: Optional[str] = "Bengaluru (Bangalore)"

class StudentProfile(BaseModel):
    id: str
    name: str
    college: str
    department: Optional[str] = "Computer Science"
    stream: Optional[str] = "Computer Science & Engineering"
    domain: Optional[str] = "Full-Stack & Web Engineering"
    degree: Optional[str] = "B.Tech"
    course: str
    semester: int
    grad_year: Optional[int] = 2026
    dream_role: str
    cgpa: Optional[float] = 8.5
    language: str
    self_reported_skills: List[str]
    verified_skills: List[str] = []
    target_companies: Optional[List[str]] = []
    preferred_work_mode: Optional[str] = "Hybrid"
    preferred_location: Optional[str] = "Bengaluru (Bangalore)"

# --- Semantic Gap Analysis ---
class SkillGapItem(BaseModel):
    id: str
    name: str
    category: str
    industry_relevance: str
    difficulty: str
    expected_depth: str
    similarity_score: float
    curriculum_match_subject: Optional[str] = None
    is_gap: bool
    is_verified: bool
    is_in_progress: bool = False

class GapAnalysisResponse(BaseModel):
    student_id: str
    course: str
    semester: int
    dream_role: str
    role_overview: str
    average_salary_lpa: str
    total_role_skills: int
    covered_skills_count: int
    gap_skills_count: int
    verified_skills_count: int
    readiness_percentage: int
    gap_skills: List[SkillGapItem]
    covered_skills: List[SkillGapItem]

# --- Skill Verification & Sandboxed Code Execution ---
class TestCaseResult(BaseModel):
    test_case_index: int
    description: str
    input_str: str
    expected_str: str
    actual_str: str
    passed: bool
    execution_time_ms: float
    error_message: Optional[str] = None

class ProofCredential(BaseModel):
    certificate_id: str
    proof_hash: str
    code_digest: str
    timestamp: int
    verified_at: str
    integrity_algorithm: str

class CodeRunRequest(BaseModel):
    student_id: Optional[str] = "demo-student"
    skill_id: str
    code: str
    language: str = "python"

class CodeRunResponse(BaseModel):
    skill_id: str
    all_passed: bool
    passed_count: int
    total_count: int
    total_time_ms: Optional[float] = 0.0
    results: List[TestCaseResult]
    message: str
    is_verified: bool
    proof_credential: Optional[ProofCredential] = None

class CertificateVerificationResponse(BaseModel):
    valid: bool
    certificate_id: str
    student_id: str
    student_name: str
    college: str
    skill_id: str
    skill_name: str
    verified_at: str
    test_cases_passed: int
    total_test_cases: int
    execution_time_ms: float
    proof_hash: str
    code_snippet: str
    integrity_status: str

# --- Quiz & Learning ---
class QuizSubmissionRequest(BaseModel):
    student_id: Optional[str] = "demo-student"
    skill_id: str
    answers: Dict[str, int]

class QuizSubmissionResponse(BaseModel):
    skill_id: str
    passed: bool
    score: int
    total_questions: int
    percentage: int
    unlocked_next_skill: Optional[str] = None
    feedback: str

# --- Roadmap Visualizer ---
class RoadmapNode(BaseModel):
    id: str
    title: str
    category: str
    status: str
    order: int
    description: str
    estimated_hours: str
    resource_url: Optional[str] = None
    provider: Optional[str] = None
    is_target_role: bool = False

class RoadmapResponse(BaseModel):
    student_id: str
    dream_role: str
    nodes: List[RoadmapNode]
    completion_percentage: int

# --- Opportunity & Internship Matcher ---
class InternshipItem(BaseModel):
    id: str
    title: str
    company: str
    logo_initials: str
    role_category: str
    location: str
    stipend: str
    duration: str
    min_semester: int
    eligible_courses: List[str]
    required_skills: List[str]
    good_to_have: List[str]
    about: str
    batch: str
    apply_link: str
    is_qualified: bool
    match_percentage: int
    verified_matching_skills: List[str]
    missing_skills: List[str]
    why_qualify_tag: str

class JobApplicationCreateRequest(BaseModel):
    student_id: str
    internship_id: str
    company: str
    role_title: str
    match_percentage: int
    notes: Optional[str] = ""

class JobApplicationItem(BaseModel):
    id: str
    student_id: str
    student_name: str
    student_college: str
    student_course: str
    internship_id: str
    company: str
    role_title: str
    match_percentage: int
    status: str # 'applied', 'under_review', 'shortlisted', 'interview_scheduled', 'rejected', 'offered'
    proof_certificate_id: Optional[str] = None
    verified_skills_snapshot: List[str] = []
    code_proof_snippet: Optional[str] = None
    recruiter_notes: Optional[str] = None
    applied_at: str

class UpdateApplicationStatusRequest(BaseModel):
    status: str
    recruiter_notes: Optional[str] = None

# --- Institutional / College TPO Portal Schemas ---
class TpoDepartmentMetric(BaseModel):
    department: str
    total_students: int
    avg_readiness: int
    verified_ratio: float

class TpoCurriculumDeficit(BaseModel):
    subject_area: str
    market_demand: str
    college_syllabus_gap: str
    impacted_students_count: int
    recommended_action: str

class TpoDashboardStatsResponse(BaseModel):
    college_name: str
    total_cohort_students: int
    average_readiness_pct: int
    students_placement_ready: int
    verified_skills_awarded: int
    active_recruiters_hiring: int
    department_breakdown: List[TpoDepartmentMetric]
    top_curriculum_deficits: List[TpoCurriculumDeficit]

class TpoStudentCohortItem(BaseModel):
    id: str
    name: str
    department: str
    course: str
    semester: int
    dream_role: str
    cgpa: float
    readiness_percentage: int
    verified_skills_count: int
    verified_skills: List[str]
    placement_status: str

# --- Corporate Recruiter Portal Schemas ---
class RecruiterDashboardStatsResponse(BaseModel):
    company_name: str
    active_openings: int
    total_applicants: int
    shortlisted_candidates: int
    interviews_scheduled: int
    offers_extended: int
    top_demanded_skills: List[str]
