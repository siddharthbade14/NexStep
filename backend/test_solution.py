import urllib.request
import json

solution_code = """import math

def build_api_response(records, page, page_size):
    completed = [r for r in records if r.get('status') == 'completed']
    total_completed = len(completed)
    total_amount = round(sum(r.get('amount', 0.0) for r in completed), 2)
    total_pages = max(1, math.ceil(total_completed / page_size)) if page_size > 0 else 1
    
    if page < 1 or (page > total_pages and total_completed > 0):
        return {'status': 'error', 'data': [], 'meta': {'total_completed': total_completed, 'current_page': page, 'total_pages': total_pages, 'total_amount': total_amount}}
        
    start_idx = (page - 1) * page_size
    end_idx = start_idx + page_size
    page_data = completed[start_idx:end_idx]
    
    return {
        'status': 'success',
        'data': page_data,
        'meta': {
            'total_completed': total_completed,
            'current_page': page,
            'total_pages': total_pages,
            'total_amount': total_amount
        }
    }
"""

req = urllib.request.Request(
    'http://localhost:8000/api/verify/submit',
    data=json.dumps({
        'student_id': 'demo-student',
        'skill_id': 'skill-rest-apis',
        'code': solution_code
    }).encode('utf-8'),
    headers={'Content-Type': 'application/json'}
)

resp = urllib.request.urlopen(req)
data = json.loads(resp.read().decode('utf-8'))
print("Verification Result:", data['all_passed'])
print("Passed count:", data['passed_count'], "of", data['total_count'])
print("Message:", data['message'])
for r in data.get('results', []):
    print("Test", r['test_case_index'], "Passed:", r['passed'], "Expected:", r['expected_str'], "Actual:", r['actual_str'], "Error:", r.get('error_message'))

# Check updated opportunities now that skill-rest-apis is verified!
res_opp = urllib.request.urlopen('http://localhost:8000/api/opportunities/match/demo-student')
opp_data = json.loads(res_opp.read())
print("Qualified internships now:", sum(1 for o in opp_data if o['is_qualified']))
for o in opp_data:
    if o['is_qualified']:
        print(" -> Qualified for:", o['company'], "-", o['title'], "| Why:", o['why_qualify_tag'])
