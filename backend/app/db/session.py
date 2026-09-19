import sqlite3
import json
import os
from typing import Optional, Dict, Any, List

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "nexstep.db")

def get_connection():
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()
    
    # Students table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS students (
        id TEXT PRIMARY KEY,
        name TEXT,
        college TEXT,
        course TEXT,
        semester INTEGER,
        dream_role TEXT,
        language TEXT,
        self_reported_skills TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)
    
    # Verified skills table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS verified_skills (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id TEXT,
        skill_id TEXT,
        skill_name TEXT,
        verified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        test_cases_passed INTEGER,
        total_test_cases INTEGER,
        code_snippet TEXT,
        UNIQUE(student_id, skill_id)
    )
    """)
    
    # Completed quizzes / resource progress
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
    
    # Seed initial demo student if not present
    cursor.execute("SELECT id FROM students WHERE id = 'demo-student'")
    if not cursor.fetchone():
        cursor.execute("""
        INSERT INTO students (id, name, college, course, semester, dream_role, language, self_reported_skills)
        VALUES ('demo-student', 'Aarav Sharma', 'Delhi Technological University (DTU)', 'B.Tech CSE', 5, 'Software Developer', 'English', '["Python", "Data Structures", "DBMS", "Git"]')
        """)
        cursor.execute("""
        INSERT INTO verified_skills (student_id, skill_id, skill_name, test_cases_passed, total_test_cases, code_snippet)
        VALUES ('demo-student', 'skill-git', 'Git & GitHub Collaboration Workflows', 3, 3, '# Initial foundation skill verified via semester coursework')
        """)
        cursor.execute("""
        INSERT INTO resource_progress (student_id, resource_id, quiz_score, is_completed)
        VALUES ('demo-student', 'skill-git', 3, 1)
        """)

    conn.commit()
    conn.close()

# Initialize database on module load
init_db()
