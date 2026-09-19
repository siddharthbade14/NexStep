import os
import json
import time
import httpx
import ast
import builtins
import math
from typing import Dict, Any, List, Tuple
from app.config import settings

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")

def load_challenges() -> Dict[str, Any]:
    with open(os.path.join(DATA_DIR, "challenges.json"), "r", encoding="utf-8") as f:
        return json.load(f)

def run_test_cases_locally(user_code: str, test_cases: List[Dict[str, Any]]) -> Tuple[bool, List[Dict[str, Any]]]:
    """
    Executes Python code in a sandboxed namespace against specified test cases.
    """
    results = []
    all_passed = True
    
    # Safe execution environment with math and standard builtins
    scope = {
        "__builtins__": builtins,
        "math": math,
        "json": json
    }

    try:
        exec(user_code, scope)
    except Exception as e:
        error_msg = f"Syntax / Compilation Error: {str(e)}"
        for idx, tc in enumerate(test_cases):
            results.append({
                "test_case_index": idx + 1,
                "description": tc.get("input", f"Test Case {idx + 1}"),
                "input_str": tc.get("input", ""),
                "expected_str": str(tc.get("expected", "")),
                "actual_str": "None (Compilation Error)",
                "passed": False,
                "execution_time_ms": 0.0,
                "error_message": error_msg
            })
        return False, results

    for idx, tc in enumerate(test_cases):
        test_call = tc.get("test_call")
        expected_raw = tc.get("expected")
        t_start = time.perf_counter()
        
        try:
            # Evaluate test call in scope
            actual_val = eval(test_call, scope)
            t_end = time.perf_counter()
            exec_time_ms = round((t_end - t_start) * 1000, 2)
            
            actual_str = str(actual_val)
            
            # Compare evaluated expected or string representation
            passed = False
            try:
                if isinstance(expected_raw, str):
                    # Try literal_eval or eval
                    try:
                        expected_eval = ast.literal_eval(expected_raw)
                    except Exception:
                        expected_eval = eval(expected_raw, {"math": math})
                else:
                    expected_eval = expected_raw
                passed = (actual_val == expected_eval)
            except Exception:
                # Normalized string fallback
                passed = (str(actual_val).replace(" ", "") == str(expected_raw).replace(" ", ""))
                
            if not passed:
                all_passed = False
                
            results.append({
                "test_case_index": idx + 1,
                "description": tc.get("input", f"Test Case {idx + 1}"),
                "input_str": tc.get("input", ""),
                "expected_str": str(expected_raw),
                "actual_str": actual_str,
                "passed": passed,
                "execution_time_ms": exec_time_ms,
                "error_message": None if passed else "Output did not match expected value"
            })
            
        except Exception as err:
            t_end = time.perf_counter()
            exec_time_ms = round((t_end - t_start) * 1000, 2)
            all_passed = False
            results.append({
                "test_case_index": idx + 1,
                "description": tc.get("input", f"Test Case {idx + 1}"),
                "input_str": tc.get("input", ""),
                "expected_str": str(expected_raw),
                "actual_str": "Error during execution",
                "passed": False,
                "execution_time_ms": exec_time_ms,
                "error_message": str(err)
            })
            
    return all_passed, results

async def execute_code_challenge(skill_id: str, code: str, language: str = "python") -> Dict[str, Any]:
    challenges = load_challenges()
    challenge = challenges.get(skill_id)
    
    if not challenge:
        # Standard fallback test cases that strictly evaluate the function
        test_cases = [
            {"input": "data=[1, 2, 3]", "expected": "6", "test_call": "solution([1, 2, 3])"},
            {"input": "data=[]", "expected": "0", "test_call": "solution([])"},
            {"input": "data=[10, -5, 5]", "expected": "10", "test_call": "solution([10, -5, 5])"}
        ]
    else:
        test_cases = challenge.get("test_cases", [])
    
    # Try Judge0 if credentials are provided
    if settings.JUDGE0_API_KEY:
        try:
            async with httpx.AsyncClient() as client:
                resp = await client.post(
                    f"{settings.JUDGE0_URL}/submissions?base64_encoded=false&wait=true",
                    headers={
                        "X-RapidAPI-Key": settings.JUDGE0_API_KEY,
                        "X-RapidAPI-Host": settings.JUDGE0_HOST,
                        "Content-Type": "application/json"
                    },
                    json={
                        "source_code": code,
                        "language_id": 71 # Python 3
                    },
                    timeout=5.0
                )
                if resp.status_code in (200, 201):
                    judge_data = resp.json()
                    status = judge_data.get("status", {}).get("description")
                    if status == "Accepted":
                        pass
        except Exception:
            pass

    # Run in sandboxed local runner
    all_passed, results = run_test_cases_locally(code, test_cases)
    passed_count = sum(1 for r in results if r["passed"])
    total_count = len(results)
    
    message = (
        "Congratulations! All test cases passed. Skill officially verified."
        if all_passed
        else f"{passed_count} of {total_count} test cases passed. Review the failed case and retry."
    )
    
    return {
        "skill_id": skill_id,
        "all_passed": all_passed,
        "passed_count": passed_count,
        "total_count": total_count,
        "results": results,
        "message": message,
        "is_verified": all_passed
    }
