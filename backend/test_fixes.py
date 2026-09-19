import urllib.request
import json
import sqlite3

print("--- 1. TESTING ROADMAP ENDPOINT ---")
resp_rm = urllib.request.urlopen("http://127.0.0.1:8000/api/roadmap/demo-student?dream_role=Software%20Developer")
rm_data = json.loads(resp_rm.read().decode('utf-8'))
print("Roadmap Dream Role:", rm_data["dream_role"])
print("Milestones count:", len(rm_data["nodes"]))
print("Completion percentage:", rm_data["completion_percentage"])
assert len(rm_data["nodes"]) > 0
print("Roadmap test: PASSED (Nodes exist, no crash)\n")

print("--- 2. TESTING WRONG CODE SUBMISSION (MUST FAIL!) ---")
wrong_code = """
def build_api_response(records, page, page_size):
    # This is an intentionally incorrect answer
    return {'status': 'wrong_answer'}
"""
req_wrong = urllib.request.Request(
    'http://127.0.0.1:8000/api/verify/submit',
    data=json.dumps({
        'student_id': 'test-student-wrong',
        'skill_id': 'skill-rest-apis',
        'code': wrong_code
    }).encode('utf-8'),
    headers={'Content-Type': 'application/json'}
)
resp_wrong = urllib.request.urlopen(req_wrong)
wrong_result = json.loads(resp_wrong.read().decode('utf-8'))
print("Wrong submission result:")
print(" - all_passed:", wrong_result["all_passed"])
print(" - is_verified:", wrong_result["is_verified"])
print(" - passed_count:", wrong_result["passed_count"], "of", wrong_result["total_count"])
print(" - message:", wrong_result["message"])

assert wrong_result["all_passed"] is False, "ERROR: Wrong answer should have failed but passed!"
assert wrong_result["is_verified"] is False, "ERROR: Wrong answer should not be marked verified!"

# Verify it was NOT saved to DB
conn = sqlite3.connect("app/nexstep.db")
row = conn.execute("SELECT * FROM verified_skills WHERE student_id = 'test-student-wrong'").fetchone()
conn.close()
assert row is None, "ERROR: Wrong answer was saved into database!"
print("Wrong code rejection test: PASSED (Strictly rejected with False, not verified!)\n")

print("--- 3. TESTING CORRECT CODE SUBMISSION ---")
correct_code = """import math

def build_api_response(records, page, page_size):
    completed = [r for r in records if r.get('status') == 'completed']
    total_completed = len(completed)
    total_amount = round(sum(r.get('amount', 0.0) for r in completed), 2)
    total_pages = max(1, math.ceil(total_completed / page_size)) if page_size > 0 else 1
    if page < 1 or (page > total_pages and total_completed > 0):
        return {'status': 'error', 'data': [], 'meta': {'total_completed': total_completed, 'current_page': page, 'total_pages': total_pages, 'total_amount': total_amount}}
    start_idx = (page - 1) * page_size
    end_idx = start_idx + page_size
    return {
        'status': 'success',
        'data': completed[start_idx:end_idx],
        'meta': {
            'total_completed': total_completed,
            'current_page': page,
            'total_pages': total_pages,
            'total_amount': total_amount
        }
    }
"""
req_correct = urllib.request.Request(
    'http://127.0.0.1:8000/api/verify/submit',
    data=json.dumps({
        'student_id': 'test-student-correct',
        'skill_id': 'skill-rest-apis',
        'code': correct_code
    }).encode('utf-8'),
    headers={'Content-Type': 'application/json'}
)
resp_correct = urllib.request.urlopen(req_correct)
correct_result = json.loads(resp_correct.read().decode('utf-8'))
print("Correct submission result:")
print(" - all_passed:", correct_result["all_passed"])
print(" - is_verified:", correct_result["is_verified"])
print(" - passed_count:", correct_result["passed_count"], "of", correct_result["total_count"])

assert correct_result["all_passed"] is True
assert correct_result["is_verified"] is True
print("Correct code execution test: PASSED (Verified successfully!)\n")

print("--- 4. TESTING FRONTEND VITE SERVER ---")
resp_fe = urllib.request.urlopen("http://127.0.0.1:5173")
print("Frontend HTTP Status:", resp_fe.status)
assert resp_fe.status == 200
print("Frontend server test: PASSED\n")

print("=== ALL TESTS PASSED SUCCESSFULLY! ===")
