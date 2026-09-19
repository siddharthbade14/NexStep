import json
import os
import numpy as np
from typing import Dict, Any, List, Tuple
from sentence_transformers import SentenceTransformer

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")

_model = None
_embedding_cache = {}

def get_embedding_model():
    global _model
    if _model is None:
        try:
            print("Loading sentence-transformers all-MiniLM-L6-v2 model...")
            _model = SentenceTransformer("all-MiniLM-L6-v2")
            print("SentenceTransformer loaded successfully.")
        except Exception as e:
            print(f"Warning: Could not load SentenceTransformer: {e}. Falling back to n-gram matcher.")
            _model = False
    return _model

def compute_cosine_similarity(vec1: np.ndarray, vec2: np.ndarray) -> float:
    dot = np.dot(vec1, vec2)
    norm1 = np.linalg.norm(vec1)
    norm2 = np.linalg.norm(vec2)
    if norm1 == 0 or norm2 == 0:
        return 0.0
    return float(dot / (norm1 * norm2))

def get_text_embedding(text: str) -> np.ndarray:
    global _embedding_cache
    if text in _embedding_cache:
        return _embedding_cache[text]
        
    model = get_embedding_model()
    if model:
        emb = model.encode(text, convert_to_numpy=True)
    else:
        # Simple bag-of-words / character vector fallback if offline
        emb = np.zeros(128, dtype=np.float32)
        for i, ch in enumerate(text.lower()):
            emb[ord(ch) % 128] += 1.0
        norm = np.linalg.norm(emb)
        if norm > 0:
            emb = emb / norm
            
    _embedding_cache[text] = emb
    return emb

def load_curriculum(course: str) -> Dict[str, Any]:
    with open(os.path.join(DATA_DIR, "curricula.json"), "r", encoding="utf-8") as f:
        data = json.load(f)
    return data.get(course, data.get("B.Tech CSE"))

def load_roles() -> Dict[str, Any]:
    with open(os.path.join(DATA_DIR, "roles.json"), "r", encoding="utf-8") as f:
        return json.load(f)

def run_semantic_gap_analysis(
    course: str,
    semester: int,
    dream_role: str,
    verified_skill_ids: List[str]
) -> Dict[str, Any]:
    curriculum = load_curriculum(course)
    roles = load_roles()
    
    role_data = roles.get(dream_role)
    if not role_data:
        # Default fallback
        dream_role = "Software Developer"
        role_data = roles["Software Developer"]
        
    # Collect curriculum subjects covered up to current semester
    covered_subjects = []
    sem_dict = curriculum.get("semesters", {})
    for s_idx in range(1, semester + 1):
        subjects = sem_dict.get(str(s_idx), [])
        covered_subjects.extend(subjects)
        
    if not covered_subjects:
        covered_subjects = ["Basics of Engineering", "Introduction to Programming"]
        
    # Pre-embed covered subjects
    subject_embeddings = [(subj, get_text_embedding(subj)) for subj in covered_subjects]
    
    role_skills = role_data.get("skills", [])
    gap_skills = []
    covered_skills = []
    
    for skill in role_skills:
        skill_text = f"{skill['name']}: {skill.get('expected_depth', '')}"
        skill_emb = get_text_embedding(skill_text)
        
        # Find best matching subject in curriculum
        best_subj = None
        best_score = 0.0
        for subj_name, subj_emb in subject_embeddings:
            sim = compute_cosine_similarity(skill_emb, subj_emb)
            if sim > best_score:
                best_score = sim
                best_subj = subj_name
                
        # Normalized similarity percentage
        normalized_sim = round(float(best_score), 3)
        is_verified = skill["id"] in verified_skill_ids
        
        # Threshold: > 0.60 is considered covered in curriculum
        is_gap = normalized_sim < 0.60
        
        item = {
            "id": skill["id"],
            "name": skill["name"],
            "category": skill["category"],
            "industry_relevance": skill["industry_relevance"],
            "difficulty": skill["difficulty"],
            "expected_depth": skill.get("expected_depth", ""),
            "similarity_score": normalized_sim,
            "curriculum_match_subject": best_subj if best_score > 0.35 else "None in standard syllabus",
            "is_gap": is_gap,
            "is_verified": is_verified,
            "is_in_progress": not is_verified and is_gap
        }
        
        if is_gap:
            gap_skills.append(item)
        else:
            covered_skills.append(item)
            
    # Calculate readiness score:
    # 50% based on curriculum coverage + 50% based on verified gap skills
    total_role = len(role_skills)
    covered_count = len(covered_skills)
    gap_count = len(gap_skills)
    verified_count = sum(1 for s in role_skills if s["id"] in verified_skill_ids)
    
    # Readiness percentage calculation
    if total_role > 0:
        base_readiness = (covered_count / total_role) * 40.0
        verified_readiness = (verified_count / max(1, gap_count)) * 60.0 if gap_count > 0 else 60.0
        readiness_pct = min(100, int(round(base_readiness + verified_readiness)))
    else:
        readiness_pct = 50
        
    return {
        "course": course,
        "semester": semester,
        "dream_role": dream_role,
        "role_overview": role_data.get("overview", ""),
        "average_salary_lpa": role_data.get("average_salary_lpa", "8 - 16 LPA"),
        "total_role_skills": total_role,
        "covered_skills_count": covered_count,
        "gap_skills_count": gap_count,
        "verified_skills_count": verified_count,
        "readiness_percentage": readiness_pct,
        "gap_skills": gap_skills,
        "covered_skills": covered_skills
    }
