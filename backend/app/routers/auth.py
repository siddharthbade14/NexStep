import sqlite3
import json
import secrets
from fastapi import APIRouter, HTTPException, Depends, status
from typing import Dict, Any, Optional
from app.schemas.schemas import AuthLoginRequest, AuthRegisterRequest, AuthResponse, UserResponse
from app.db.session import get_connection
from app.services.auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user
)

router = APIRouter(prefix="/auth", tags=["Enterprise Authentication"])

@router.post("/register", response_model=AuthResponse)
def register(payload: AuthRegisterRequest):
    email = payload.email.strip().lower()
    conn = get_connection()
    cursor = conn.cursor()
    
    # Check if user already exists
    cursor.execute("SELECT id FROM users WHERE email = ?", (email,))
    if cursor.fetchone():
        conn.close()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists. Please log in."
        )
        
    user_id = f"user-{secrets.token_hex(6)}"
    pw_info = hash_password(payload.password)
    initials = "".join([part[0] for part in payload.full_name.split() if part][:2]).upper() or "NX"
    
    cursor.execute("""
    INSERT INTO users (id, email, password_hash, salt, full_name, role, avatar)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (user_id, email, pw_info["hash"], pw_info["salt"], payload.full_name, payload.role, initials))
    
    # Create role-specific record
    if payload.role == "student":
        student_id = f"std-{secrets.token_hex(5)}"
        cursor.execute("""
        INSERT INTO students (id, user_id, name, college, department, course, semester, dream_role, cgpa, self_reported_skills)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            student_id, user_id, payload.full_name,
            payload.college or "Delhi Technological University (DTU)",
            payload.department or "Computer Science",
            payload.course or "B.Tech CSE",
            payload.semester or 5,
            "Software Developer",
            8.5,
            json.dumps(["Python", "Git", "DSA"])
        ))
        # Seed default verified skill
        cursor.execute("""
        INSERT OR REPLACE INTO verified_skills (student_id, skill_id, skill_name, test_cases_passed, total_test_cases, execution_time_ms, proof_hash, certificate_id, code_snippet)
        VALUES (?, 'skill-git', 'Git & GitHub Collaboration Workflows', 3, 3, 11.2, 'init-proof-hash', 'NX-VERIFIED-INIT', '# Initial verification')
        """, (student_id,))
        
    elif payload.role == "college_tpo":
        tpo_id = f"tpo-{secrets.token_hex(5)}"
        cursor.execute("""
        INSERT INTO college_tpos (id, user_id, name, college_name, department, designation, employee_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            tpo_id, user_id, payload.full_name,
            payload.college or "Delhi Technological University (DTU)",
            payload.department or "Training & Placement Office",
            payload.designation or "Head of Placements",
            f"EMP-{secrets.token_hex(3).upper()}"
        ))
        
    elif payload.role == "recruiter":
        recruiter_id = f"rec-{secrets.token_hex(5)}"
        cursor.execute("""
        INSERT INTO recruiters (id, user_id, name, company_name, industry, designation)
        VALUES (?, ?, ?, ?, ?, ?)
        """, (
            recruiter_id, user_id, payload.full_name,
            payload.company_name or "Swiggy",
            "Tech & Engineering",
            payload.designation or "University Talent Partner"
        ))
        
    conn.commit()
    conn.close()
    
    # Generate JWT
    token_claims = {
        "sub": user_id,
        "email": email,
        "name": payload.full_name,
        "role": payload.role
    }
    access_token = create_access_token(token_claims)
    
    return AuthResponse(
        status="success",
        access_token=access_token,
        token_type="bearer",
        user=UserResponse(
            id=user_id,
            email=email,
            full_name=payload.full_name,
            role=payload.role,
            avatar=initials,
            college=payload.college,
            company_name=payload.company_name,
            designation=payload.designation
        ),
        message="Registration successful. Welcome to NexStep!"
    )

@router.post("/login", response_model=AuthResponse)
def login(payload: AuthLoginRequest):
    email = payload.email.strip().lower()
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
    user = cursor.fetchone()
    
    if not user:
        conn.close()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials. No user found with this email."
        )
        
    # Verify password
    if not verify_password(payload.password, user["password_hash"], user["salt"]):
        conn.close()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password. Please check your credentials."
        )
        
    # Retrieve role metadata
    college = None
    company_name = None
    designation = None
    
    if user["role"] == "student":
        cursor.execute("SELECT college FROM students WHERE user_id = ?", (user["id"],))
        std = cursor.fetchone()
        college = std["college"] if std else None
    elif user["role"] == "college_tpo":
        cursor.execute("SELECT college_name, designation FROM college_tpos WHERE user_id = ?", (user["id"],))
        tpo = cursor.fetchone()
        if tpo:
            college = tpo["college_name"]
            designation = tpo["designation"]
    elif user["role"] == "recruiter":
        cursor.execute("SELECT company_name, designation FROM recruiters WHERE user_id = ?", (user["id"],))
        rec = cursor.fetchone()
        if rec:
            company_name = rec["company_name"]
            designation = rec["designation"]
            
    conn.close()
    
    token_claims = {
        "sub": user["id"],
        "email": user["email"],
        "name": user["full_name"],
        "role": user["role"]
    }
    access_token = create_access_token(token_claims)
    
    return AuthResponse(
        status="success",
        access_token=access_token,
        token_type="bearer",
        user=UserResponse(
            id=user["id"],
            email=user["email"],
            full_name=user["full_name"],
            role=user["role"],
            avatar=user["avatar"],
            college=college,
            company_name=company_name,
            designation=designation
        ),
        message=f"Welcome back, {user['full_name']}!"
    )

@router.get("/me", response_model=UserResponse)
def get_current_user_profile(user_payload: Dict[str, Any] = Depends(get_current_user)):
    user_id = user_payload.get("sub")
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
    user = cursor.fetchone()
    
    if not user:
        conn.close()
        raise HTTPException(status_code=404, detail="User not found")
        
    college = None
    company_name = None
    designation = None
    
    if user["role"] == "student":
        cursor.execute("SELECT college FROM students WHERE user_id = ?", (user["id"],))
        std = cursor.fetchone()
        college = std["college"] if std else None
    elif user["role"] == "college_tpo":
        cursor.execute("SELECT college_name, designation FROM college_tpos WHERE user_id = ?", (user["id"],))
        tpo = cursor.fetchone()
        if tpo:
            college = tpo["college_name"]
            designation = tpo["designation"]
    elif user["role"] == "recruiter":
        cursor.execute("SELECT company_name, designation FROM recruiters WHERE user_id = ?", (user["id"],))
        rec = cursor.fetchone()
        if rec:
            company_name = rec["company_name"]
            designation = rec["designation"]
            
    conn.close()
    return UserResponse(
        id=user["id"],
        email=user["email"],
        full_name=user["full_name"],
        role=user["role"],
        avatar=user["avatar"],
        college=college,
        company_name=company_name,
        designation=designation
    )

@router.post("/switch-persona/{persona_id}", response_model=AuthResponse)
def switch_persona(persona_id: str):
    """
    Seamless 1-click persona switch for demonstrations and multi-role testing.
    """
    persona_map = {
        "student": "student@nexstep.in",
        "demo-student": "student@nexstep.in",
        "priya": "priya@nitt.edu",
        "demo-priya": "priya@nitt.edu",
        "rohan": "rohan@nsut.ac.in",
        "demo-rohan": "rohan@nsut.ac.in",
        "tpo": "tpo@dtu.ac.in",
        "tpo-dtu": "tpo@dtu.ac.in",
        "recruiter": "recruiter@swiggy.in",
        "recruiter-swiggy": "recruiter@swiggy.in",
        "recruiter-zerodha": "recruiter@zerodha.com"
    }
    
    target_email = persona_map.get(persona_id.lower(), "student@nexstep.in")
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email = ?", (target_email,))
    user = cursor.fetchone()
    
    if not user:
        conn.close()
        raise HTTPException(status_code=404, detail="Persona not found")
        
    college = None
    company_name = None
    designation = None
    
    if user["role"] == "student":
        cursor.execute("SELECT college FROM students WHERE user_id = ?", (user["id"],))
        std = cursor.fetchone()
        college = std["college"] if std else None
    elif user["role"] == "college_tpo":
        cursor.execute("SELECT college_name, designation FROM college_tpos WHERE user_id = ?", (user["id"],))
        tpo = cursor.fetchone()
        if tpo:
            college = tpo["college_name"]
            designation = tpo["designation"]
    elif user["role"] == "recruiter":
        cursor.execute("SELECT company_name, designation FROM recruiters WHERE user_id = ?", (user["id"],))
        rec = cursor.fetchone()
        if rec:
            company_name = rec["company_name"]
            designation = rec["designation"]
            
    conn.close()
    
    token_claims = {
        "sub": user["id"],
        "email": user["email"],
        "name": user["full_name"],
        "role": user["role"]
    }
    access_token = create_access_token(token_claims)
    
    return AuthResponse(
        status="success",
        access_token=access_token,
        token_type="bearer",
        user=UserResponse(
            id=user["id"],
            email=user["email"],
            full_name=user["full_name"],
            role=user["role"],
            avatar=user["avatar"],
            college=college,
            company_name=company_name,
            designation=designation
        ),
        message=f"Active role switched to {user['full_name']} ({user['role'].upper()})"
    )
