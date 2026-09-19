from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class StudentOnboardingRequest(BaseModel):
    name: str = "Aarav Sharma"
    college: str = "IIT Delhi / NIT Trichy / Pune University"
    course: str = "B.Tech CSE"
    semester: int = Field(ge=1, le=8, default=5)
    dream_role: str = "Software Developer"
    language: str = "English"
    self_reported_skills: List[str] = []

class StudentProfile(BaseModel):
    id: str
    name: str
    college: str
    course: str
    semester: int
    dream_role: str
    language: str
    self_reported_skills: List[str]
    verified_skills: List[str] = []

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

class TestCaseResult(BaseModel):
    test_case_index: int
    description: str
    input_str: str
    expected_str: str
    actual_str: str
    passed: bool
    execution_time_ms: float
    error_message: Optional[str] = None

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
    results: List[TestCaseResult]
    message: str
    is_verified: bool

class QuizSubmissionRequest(BaseModel):
    student_id: Optional[str] = "demo-student"
    skill_id: str
    answers: Dict[str, int] # e.g. {"q1": 1, "q2": 1, "q3": 0}

class QuizSubmissionResponse(BaseModel):
    skill_id: str
    passed: bool
    score: int
    total_questions: int
    percentage: int
    unlocked_next_skill: Optional[str] = None
    feedback: str

class RoadmapNode(BaseModel):
    id: str
    title: str
    category: str
    status: str # "verified", "in_progress", "locked"
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
