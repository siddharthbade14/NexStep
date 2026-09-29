import sqlite3
import json
import os
import secrets
from typing import Optional, Dict, Any, List
from app.services.auth import hash_password, generate_cryptographic_proof

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "nexstep.db")

def get_connection():
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()
    
    # Enable foreign keys
    cursor.execute("PRAGMA foreign_keys = ON")
    
    # 1. Users Table (Core Auth & Roles)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        salt TEXT NOT NULL,
        full_name TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'student',
        avatar TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)
    
    # 2. Students Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS students (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        name TEXT,
        college TEXT,
        department TEXT,
        course TEXT,
        semester INTEGER,
        dream_role TEXT,
        cgpa REAL DEFAULT 8.2,
        language TEXT DEFAULT 'English',
        self_reported_skills TEXT,
        target_companies TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )
    """)
    
    # 3. College TPO Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS college_tpos (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        name TEXT,
        college_name TEXT,
        department TEXT,
        designation TEXT,
        employee_id TEXT,
        verified_status BOOLEAN DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )
    """)
    
    # 4. Recruiters Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS recruiters (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        name TEXT,
        company_name TEXT,
        industry TEXT,
        designation TEXT,
        verified_status BOOLEAN DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )
    """)
    
    # 5. Verified Skills Table (Cryptographically Verifiable Proofs)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS verified_skills (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id TEXT,
        skill_id TEXT,
        skill_name TEXT,
        verified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        test_cases_passed INTEGER,
        total_test_cases INTEGER,
        execution_time_ms REAL DEFAULT 12.5,
        proof_hash TEXT,
        certificate_id TEXT,
        code_snippet TEXT,
        UNIQUE(student_id, skill_id)
    )
    """)
    
    # 6. Completed Quizzes / Resource Progress
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS resource_progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id TEXT,
        resource_id TEXT,
        quiz_score INTEGER,
        is_completed BOOLEAN,
        completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(student_id, resource_id)
    )
    """)
    
    # 7. Job Applications (Two-Sided Recruiter & Student Pipeline)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS job_applications (
        id TEXT PRIMARY KEY,
        student_id TEXT,
        student_name TEXT,
        student_college TEXT,
        student_course TEXT,
        internship_id TEXT,
        company TEXT,
        role_title TEXT,
        match_percentage INTEGER,
        status TEXT DEFAULT 'applied',
        proof_certificate_id TEXT,
        verified_skills_snapshot TEXT,
        code_proof_snippet TEXT,
        recruiter_notes TEXT,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)
    
    # Ensure backward compatible column additions if table already existed
    for col_def in [
        ("verified_skills", "execution_time_ms REAL DEFAULT 12.5"),
        ("verified_skills", "proof_hash TEXT"),
        ("verified_skills", "certificate_id TEXT"),
        ("students", "user_id TEXT"),
        ("students", "department TEXT"),
        ("students", "cgpa REAL DEFAULT 8.2"),
        ("students", "target_companies TEXT")
    ]:
        try:
            cursor.execute(f"ALTER TABLE {col_def[0]} ADD COLUMN {col_def[1]}")
        except sqlite3.OperationalError:
            pass # Column already exists

    
    # Seed Initial Enterprise Users & Personas
    seed_enterprise_data(cursor)
    
    conn.commit()
    conn.close()

def seed_enterprise_data(cursor: sqlite3.Cursor):
    # 1. Student Demo: Aarav Sharma
    cursor.execute("SELECT id FROM users WHERE email = 'student@nexstep.in'")
    if not cursor.fetchone():
        pw_info = hash_password("student123")
        cursor.execute("""
        INSERT INTO users (id, email, password_hash, salt, full_name, role, avatar)
        VALUES ('user-student-aarav', 'student@nexstep.in', ?, ?, 'Aarav Sharma', 'student', 'AS')
        """, (pw_info["hash"], pw_info["salt"]))
        
        cursor.execute("""
        INSERT OR REPLACE INTO students (id, user_id, name, college, department, course, semester, dream_role, cgpa, self_reported_skills, target_companies)
        VALUES ('demo-student', 'user-student-aarav', 'Aarav Sharma', 'Delhi Technological University (DTU)', 'Computer Science', 'B.Tech CSE', 5, 'Software Developer', 8.6, '["Python", "C++", "Data Structures", "DBMS", "Git"]', '["Swiggy", "CRED", "Zerodha", "PhonePe"]')
        """)
        
        # Seed initial verified git skill with cryptographic proof
        proof = generate_cryptographic_proof('demo-student', 'skill-git', '# Git workflow verification\ndef solution(): return True', 3, 3, 11.4)
        cursor.execute("""
        INSERT OR REPLACE INTO verified_skills (student_id, skill_id, skill_name, test_cases_passed, total_test_cases, execution_time_ms, proof_hash, certificate_id, code_snippet)
        VALUES ('demo-student', 'skill-git', 'Git & GitHub Collaboration Workflows', 3, 3, 11.4, ?, ?, '# Initial verified skill via semester engineering coursework')
        """, (proof["proof_hash"], proof["certificate_id"]))
        
        cursor.execute("""
        INSERT OR REPLACE INTO resource_progress (student_id, resource_id, quiz_score, is_completed)
        VALUES ('demo-student', 'skill-git', 3, 1)
        """)

    # 2. Student Demo: Priya Nair (ECE)
    cursor.execute("SELECT id FROM users WHERE email = 'priya@nitt.edu'")
    if not cursor.fetchone():
        pw_info = hash_password("student123")
        cursor.execute("""
        INSERT INTO users (id, email, password_hash, salt, full_name, role, avatar)
        VALUES ('user-student-priya', 'priya@nitt.edu', ?, ?, 'Priya Nair', 'student', 'PN')
        """, (pw_info["hash"], pw_info["salt"]))
        
        cursor.execute("""
        INSERT OR REPLACE INTO students (id, user_id, name, college, department, course, semester, dream_role, cgpa, self_reported_skills, target_companies)
        VALUES ('demo-priya', 'user-student-priya', 'Priya Nair', 'NIT Trichy', 'Electronics & Communication', 'B.Tech ECE', 5, 'Embedded Systems Engineer', 8.9, '["C++", "Microprocessors", "Digital Electronics", "Basic C", "Git"]', '["Texas Instruments", "Qualcomm", "Bosch"]')
        """)

    # 3. Student Demo: Rohan Verma (IT / Data Analyst)
    cursor.execute("SELECT id FROM users WHERE email = 'rohan@nsut.ac.in'")
    if not cursor.fetchone():
        pw_info = hash_password("student123")
        cursor.execute("""
        INSERT INTO users (id, email, password_hash, salt, full_name, role, avatar)
        VALUES ('user-student-rohan', 'rohan@nsut.ac.in', ?, ?, 'Rohan Verma', 'student', 'RV')
        """, (pw_info["hash"], pw_info["salt"]))
        
        cursor.execute("""
        INSERT OR REPLACE INTO students (id, user_id, name, college, department, course, semester, dream_role, cgpa, self_reported_skills, target_companies)
        VALUES ('demo-rohan', 'user-student-rohan', 'Rohan Verma', 'Netaji Subhas University of Technology (NSUT)', 'Information Technology', 'B.Tech IT', 5, 'Data Analyst', 8.4, '["Python", "SQL", "Statistics", "Excel", "Data Visualization"]', '["CRED", "Swiggy", "Razorpay"]')
        """)

    # 4. College TPO: Dr. Rajesh Gupta (DTU)
    cursor.execute("SELECT id FROM users WHERE email = 'tpo@dtu.ac.in'")
    if not cursor.fetchone():
        pw_info = hash_password("tpo123")
        cursor.execute("""
        INSERT INTO users (id, email, password_hash, salt, full_name, role, avatar)
        VALUES ('user-tpo-dtu', 'tpo@dtu.ac.in', ?, ?, 'Dr. Rajesh Gupta', 'college_tpo', 'RG')
        """, (pw_info["hash"], pw_info["salt"]))
        
        cursor.execute("""
        INSERT OR REPLACE INTO college_tpos (id, user_id, name, college_name, department, designation, employee_id)
        VALUES ('tpo-dtu', 'user-tpo-dtu', 'Dr. Rajesh Gupta', 'Delhi Technological University (DTU)', 'Training & Placement Office', 'Head of Placements & Industry Relations', 'DTU-FAC-781')
        """)

    # 5. Corporate Recruiter: Ananya Sen (Swiggy)
    cursor.execute("SELECT id FROM users WHERE email = 'recruiter@swiggy.in'")
    if not cursor.fetchone():
        pw_info = hash_password("recruiter123")
        cursor.execute("""
        INSERT INTO users (id, email, password_hash, salt, full_name, role, avatar)
        VALUES ('user-recruiter-swiggy', 'recruiter@swiggy.in', ?, ?, 'Ananya Sen', 'recruiter', 'AS')
        """, (pw_info["hash"], pw_info["salt"]))
        
        cursor.execute("""
        INSERT OR REPLACE INTO recruiters (id, user_id, name, company_name, industry, designation)
        VALUES ('recruiter-swiggy', 'user-recruiter-swiggy', 'Ananya Sen', 'Swiggy', 'Consumer Tech & Logistics', 'Principal University Talent Partner')
        """)

    # 6. Corporate Recruiter: Karan Mehta (Zerodha)
    cursor.execute("SELECT id FROM users WHERE email = 'recruiter@zerodha.com'")
    if not cursor.fetchone():
        pw_info = hash_password("recruiter123")
        cursor.execute("""
        INSERT INTO users (id, email, password_hash, salt, full_name, role, avatar)
        VALUES ('user-recruiter-zerodha', 'recruiter@zerodha.com', ?, ?, 'Karan Mehta', 'recruiter', 'KM')
        """, (pw_info["hash"], pw_info["salt"]))
        
        cursor.execute("""
        INSERT OR REPLACE INTO recruiters (id, user_id, name, company_name, industry, designation)
        VALUES ('recruiter-zerodha', 'user-recruiter-zerodha', 'Karan Mehta', 'Zerodha', 'FinTech & Capital Markets', 'Engineering Recruiting Lead')
        """)

    # 7. Seed Real Cohort Students for DTU to power College TPO Analytics
    cohort_sample = [
        ('dtu-std-101', 'Aditya Sharma', 'Delhi Technological University (DTU)', 'Computer Science', 'B.Tech CSE', 5, 'Software Developer', 8.9, '["Python", "Git", "DSA", "REST APIs"]'),
        ('dtu-std-102', 'Sneha Kapoor', 'Delhi Technological University (DTU)', 'Computer Science', 'B.Tech CSE', 5, 'Software Developer', 9.2, '["Python", "Git", "Docker", "DSA"]'),
        ('dtu-std-103', 'Vikram Malhotra', 'Delhi Technological University (DTU)', 'Information Technology', 'B.Tech IT', 5, 'Data Analyst', 8.1, '["Python", "SQL", "Pandas", "EDA"]'),
        ('dtu-std-104', 'Tanvi Reddy', 'Delhi Technological University (DTU)', 'Computer Science', 'B.Tech CSE', 5, 'Software Developer', 8.4, '["Java", "Git", "DBMS"]'),
        ('dtu-std-105', 'Kunal Joshi', 'Delhi Technological University (DTU)', 'Electronics & Communication', 'B.Tech ECE', 5, 'Embedded Systems Engineer', 8.7, '["C++", "Microprocessors", "Embedded C"]'),
        ('dtu-std-106', 'Rhea Chakraborty', 'Delhi Technological University (DTU)', 'Information Technology', 'B.Tech IT', 5, 'Data Analyst', 8.8, '["SQL", "Tableau", "Statistics", "Python"]'),
        ('dtu-std-107', 'Harsh Patel', 'Delhi Technological University (DTU)', 'Computer Science', 'B.Tech CSE', 5, 'DevOps Engineer', 7.9, '["Docker", "Linux", "Git", "Python"]'),
        ('dtu-std-108', 'Ananya Gupta', 'Delhi Technological University (DTU)', 'Computer Science', 'B.Tech CSE', 5, 'Software Developer', 9.4, '["Python", "React", "REST APIs", "DSA", "Git"]')
    ]
    for sid, name, clg, dept, crs, sem, role, cgpa, sk in cohort_sample:
        cursor.execute("SELECT id FROM students WHERE id = ?", (sid,))
        if not cursor.fetchone():
            cursor.execute("""
            INSERT INTO students (id, name, college, department, course, semester, dream_role, cgpa, self_reported_skills)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (sid, name, clg, dept, crs, sem, role, cgpa, sk))
            # Seed verified skill for each cohort member
            cursor.execute("""
            INSERT OR REPLACE INTO verified_skills (student_id, skill_id, skill_name, test_cases_passed, total_test_cases, execution_time_ms, proof_hash, certificate_id, code_snippet)
            VALUES (?, 'skill-git', 'Git & GitHub Collaboration Workflows', 3, 3, 10.8, 'proof-hash-cohort-init', 'NX-VERIFIED-DTU-INIT', '# Verified during cohort lab test')
            """, (sid,))

    # 8. Seed Real Job Applications to power Recruiter Dashboard
    cursor.execute("SELECT id FROM job_applications WHERE id = 'app-swiggy-aarav'")
    if not cursor.fetchone():
        cursor.execute("""
        INSERT INTO job_applications (
            id, student_id, student_name, student_college, student_course,
            internship_id, company, role_title, match_percentage, status,
            proof_certificate_id, verified_skills_snapshot, code_proof_snippet, recruiter_notes
        ) VALUES (
            'app-swiggy-aarav', 'demo-student', 'Aarav Sharma', 'Delhi Technological University (DTU)', 'B.Tech CSE',
            'intern-swiggy-backend', 'Swiggy', 'Backend Engineering Intern (FastAPI / Go)', 100, 'shortlisted',
            'NX-VERIFIED-4BDDB178DDF6-74842', '["Git & GitHub", "RESTful APIs & FastAPI", "Data Structures & Algorithms"]',
            'def build_api_response(records, page, page_size):\n    completed = [r for r in records if r.get(\"status\") == \"completed\"]\n    # Verified with 3/3 passing test assertions in 14.2ms',
            'Top candidate with verified REST API and Git proof-of-work. Scheduled for technical interview.'
        )
        """)
        
        cursor.execute("""
        INSERT INTO job_applications (
            id, student_id, student_name, student_college, student_course,
            internship_id, company, role_title, match_percentage, status,
            proof_certificate_id, verified_skills_snapshot, code_proof_snippet, recruiter_notes
        ) VALUES (
            'app-swiggy-sneha', 'dtu-std-102', 'Sneha Kapoor', 'Delhi Technological University (DTU)', 'B.Tech CSE',
            'intern-swiggy-backend', 'Swiggy', 'Backend Engineering Intern (FastAPI / Go)', 85, 'under_review',
            'NX-VERIFIED-SNEHA-DTU-891', '["Git & GitHub", "Docker & Containerization", "DSA"]',
            'def validate_dockerfile(instructions):\n    # Dockerfile layer caching test passed',
            'Strong Docker containerization knowledge. Awaiting code review by engineering team.'
        )
        """)
        
        cursor.execute("""
        INSERT INTO job_applications (
            id, student_id, student_name, student_college, student_course,
            internship_id, company, role_title, match_percentage, status,
            proof_certificate_id, verified_skills_snapshot, code_proof_snippet, recruiter_notes
        ) VALUES (
            'app-zerodha-ananya', 'dtu-std-108', 'Ananya Gupta', 'Delhi Technological University (DTU)', 'B.Tech CSE',
            'intern-zerodha-dev', 'Zerodha', 'Full Stack Product Engineering Intern', 95, 'interview_scheduled',
            'NX-VERIFIED-ANANYA-ZERODHA-108', '["React", "REST APIs", "DSA", "Git"]',
            'def cart_reducer(state, action):\n    # Pure state transition handler passed all edge cases',
            'Excellent problem solver. 9.4 CGPA and verified full-stack proofs. Round 1 scheduled.'
        )
        """)

# Initialize database on module import
init_db()
