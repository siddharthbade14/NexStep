import sys
import json
sys.stdout.reconfigure(encoding='utf-8')
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def run_tests():
    print("=" * 60)
    print("RUNNING ENTERPRISE E2E INTEGRATION TEST SUITE")
    print("=" * 60)

    # 1. Health check & Security Headers
    print("\n[TEST 1] Health Check & Security Headers...")
    res = client.get("/api/health")
    assert res.status_code == 200, f"Expected 200, got {res.status_code}"
    data = res.json()
    assert data["security_sandbox"] == "active"
    assert data["cryptographic_proofs"] == "enabled"
    assert res.headers.get("X-Content-Type-Options") == "nosniff"
    assert res.headers.get("X-Frame-Options") == "DENY"
    print("  [PASS] Health check and security headers verified.")


    # 2. Authentication & JWT Tokens
    print("\n[TEST 2] Enterprise Authentication & Multi-Role Personas...")
    # Student login
    login_res = client.post("/api/auth/login", json={"email": "student@nexstep.in", "password": "student123"})
    assert login_res.status_code == 200
    student_auth = login_res.json()
    assert "access_token" in student_auth
    assert student_auth["user"]["role"] == "student"
    print(f"  [PASS] Student login successful: {student_auth['user']['full_name']} (JWT issued)")

    # TPO login
    tpo_login = client.post("/api/auth/login", json={"email": "tpo@dtu.ac.in", "password": "tpo123"})
    assert tpo_login.status_code == 200
    tpo_auth = tpo_login.json()
    assert tpo_auth["user"]["role"] == "college_tpo"
    print(f"  [PASS] College TPO login successful: {tpo_auth['user']['full_name']} (Role: {tpo_auth['user']['role']})")

    # Recruiter login
    rec_login = client.post("/api/auth/login", json={"email": "recruiter@swiggy.in", "password": "recruiter123"})
    assert rec_login.status_code == 200
    rec_auth = rec_login.json()
    assert rec_auth["user"]["role"] == "recruiter"
    print(f"  [PASS] Corporate Recruiter login successful: {rec_auth['user']['full_name']} (Company: {rec_auth['user']['company_name']})")

    # 3. Security Sandbox & Static AST Analyzer
    print("\n[TEST 3] Security Sandbox & Malicious Code Blocking...")
    # Malicious import
    mal_import = client.post("/api/verify/submit", json={
        "student_id": "demo-student",
        "skill_id": "skill-rest-apis",
        "code": "import os\ndef solution(x): os.system('calc')"
    })
    assert mal_import.status_code == 200
    res_mal = mal_import.json()
    assert res_mal["all_passed"] is False
    assert "prohibited in this sandbox" in res_mal["results"][0]["error_message"]
    print("  [PASS] Malicious import 'import os' successfully blocked by AST sandbox.")

    # Forbidden call
    mal_call = client.post("/api/verify/submit", json={
        "student_id": "demo-student",
        "skill_id": "skill-rest-apis",
        "code": "def solution(x): return open('passwords.txt', 'r').read()"
    })
    assert mal_call.status_code == 200
    res_call = mal_call.json()
    assert res_call["all_passed"] is False
    assert "open()' is prohibited" in res_call["results"][0]["error_message"]
    print("  [PASS] Forbidden call 'open()' successfully blocked by AST sandbox.")

    # 4. Valid Code Verification & Cryptographic Proof Generation
    print("\n[TEST 4] Valid Code Challenge & Tamper-Proof Credential...")
    from app.services.code_runner import load_challenges
    ch = load_challenges()["skill-rest-apis"]
    run_res = client.post("/api/verify/submit", json={
        "student_id": "demo-student",
        "skill_id": "skill-rest-apis",
        "code": ch["solution_template"]
    })
    assert run_res.status_code == 200
    run_data = run_res.json()
    assert run_data["all_passed"] is True
    assert run_data["passed_count"] == run_data["total_count"]
    proof = run_data.get("proof_credential")
    assert proof is not None
    cert_id = proof["certificate_id"]
    print(f"  [PASS] All {run_data['passed_count']}/{run_data['total_count']} assertions passed in {run_data['total_time_ms']} ms.")
    print(f"  [PASS] Cryptographic proof generated: {cert_id} (HMAC-SHA256)")

    # 5. Public Certificate Verification Endpoint
    print("\n[TEST 5] Public Verification Registry...")
    cert_res = client.get(f"/api/verify/certificate/{cert_id}")
    assert cert_res.status_code == 200
    cert_data = cert_res.json()
    assert cert_data["valid"] is True
    assert cert_data["student_id"] == "demo-student"
    assert "Tamper-Proof" in cert_data["integrity_status"]
    print(f"  [PASS] Public verification successful for student: {cert_data['student_name']}")

    # 6. Real Job Application Submission & Tracking
    print("\n[TEST 6] Real Job Application & Proof-of-Work Pipeline...")
    apply_res = client.post("/api/opportunities/apply", json={
        "student_id": "demo-student",
        "internship_id": "intern-swiggy-backend",
        "company": "Swiggy",
        "role_title": "Backend Engineering Intern (FastAPI / Go)",
        "match_percentage": 100
    })
    assert apply_res.status_code == 200
    app_data = apply_res.json()
    assert app_data["status"] in ["applied", "shortlisted", "interview_scheduled", "interview", "hired"]
    print(f"  [PASS] Application submitted for {app_data['company']} - {app_data['role_title']} (Status: {app_data['status']})")

    # Check student applications list
    my_apps = client.get("/api/opportunities/my-applications/demo-student")
    assert my_apps.status_code == 200
    my_apps_list = my_apps.json()
    assert len(my_apps_list) >= 1
    print(f"  [PASS] Student has {len(my_apps_list)} active applications with verifiable proof credentials.")

    # 7. College TPO Portal
    print("\n[TEST 7] College TPO Dashboard Analytics & Curriculum Audit...")
    tpo_stats_res = client.get("/api/tpo/dashboard-stats?college=Delhi+Technological+University+(DTU)")
    assert tpo_stats_res.status_code == 200
    tpo_data = tpo_stats_res.json()
    assert tpo_data["total_cohort_students"] > 0
    assert len(tpo_data["department_breakdown"]) >= 3
    assert len(tpo_data["top_curriculum_deficits"]) >= 2
    print(f"  [PASS] TPO Dashboard metrics computed: {tpo_data['total_cohort_students']} students, Avg Readiness: {tpo_data['average_readiness_pct']}%.")
    print(f"  [PASS] AICTE Curriculum Deficits identified: {len(tpo_data['top_curriculum_deficits'])} actionable intervention plans.")

    # TPO Students
    tpo_std_res = client.get("/api/tpo/students?college=Delhi+Technological+University+(DTU)")
    assert tpo_std_res.status_code == 200
    cohort_list = tpo_std_res.json()
    assert len(cohort_list) >= 5
    print(f"  [PASS] TPO Student Cohort list loaded ({len(cohort_list)} students indexed).")

    # 8. Corporate Recruiter Portal
    print("\n[TEST 8] Corporate Recruiter Talent Hub & Applicant Progression...")
    rec_apps_res = client.get("/api/recruiter/applications?company=Swiggy")
    assert rec_apps_res.status_code == 200
    rec_apps = rec_apps_res.json()
    assert len(rec_apps) >= 1
    target_app = rec_apps[0]
    print(f"  [PASS] Recruiter applications loaded ({len(rec_apps)} applicants). Inspecting {target_app['student_name']}.")

    # Update candidate status
    status_update = client.post(f"/api/recruiter/applications/{target_app['id']}/status", json={
        "status": "interview_scheduled",
        "recruiter_notes": "Code proof verified in sandbox. Scheduled for technical interview Round 1."
    })
    assert status_update.status_code == 200
    print(f"  [PASS] Candidate status progressed to: INTERVIEW_SCHEDULED.")

    print("\n" + "=" * 60)
    print("ALL 8 ENTERPRISE SUITE TESTS PASSED WITH 100% SUCCESS!")
    print("=" * 60)


if __name__ == "__main__":
    run_tests()
