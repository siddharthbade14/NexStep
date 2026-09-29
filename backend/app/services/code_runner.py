import os
import json
import time
import httpx
import ast
import math
import re
import collections
import itertools
import heapq
import concurrent.futures
from typing import Dict, Any, List, Tuple, Optional
from app.config import settings
from app.services.auth import generate_cryptographic_proof

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")

# Whitelist of allowed modules in student code
ALLOWED_MODULES = {
    "math", "json", "re", "collections", "itertools", 
    "heapq", "bisect", "string", "random", "datetime", "typing"
}

# Forbidden function names, globals, and built-ins
FORBIDDEN_CALLS = {
    "eval", "exec", "open", "compile", "globals", "locals",
    "getattr", "setattr", "delattr", "__import__", "breakpoint"
}

# Forbidden dunder attributes used in sandbox escape exploits
FORBIDDEN_ATTRIBUTES = {
    "__subclasses__", "__code__", "__globals__", "__builtins__",
    "__class__", "__bases__", "__mro__", "__reduce__", "__reduce_ex__",
    "__import__", "__loader__", "__spec__", "gi_frame", "f_builtins", "f_globals"
}

def safe_import(name, globals=None, locals=None, fromlist=(), level=0):
    root_pkg = name.split('.')[0]
    if root_pkg not in ALLOWED_MODULES:
        raise ImportError(f"Import of module '{name}' is not allowed in sandbox.")
    return __import__(name, globals, locals, fromlist, level)

SAFE_BUILTINS = {
    "__import__": safe_import,
    "abs": abs, "all": all, "any": any, "bin": bin, "bool": bool,
    "dict": dict, "enumerate": enumerate, "filter": filter, "float": float,
    "format": format, "frozenset": frozenset, "hex": hex, "int": int,
    "isinstance": isinstance, "issubclass": issubclass, "iter": iter,
    "len": len, "list": list, "map": map, "max": max, "min": min,
    "next": next, "oct": oct, "ord": ord, "pow": pow, "range": range,
    "repr": repr, "reversed": reversed, "round": round, "set": set,
    "slice": slice, "sorted": sorted, "str": str, "sum": sum,
    "tuple": tuple, "zip": zip, "True": True, "False": False, "None": None,
    "ValueError": ValueError, "TypeError": TypeError, "KeyError": KeyError,
    "IndexError": IndexError, "ZeroDivisionError": ZeroDivisionError
}


def load_challenges() -> Dict[str, Any]:
    with open(os.path.join(DATA_DIR, "challenges.json"), "r", encoding="utf-8") as f:
        return json.load(f)

def validate_code_security(user_code: str) -> Optional[str]:
    """
    Static analysis check verifying code complies with strict security sandbox guidelines.
    Returns None if safe, or an error string if dangerous constructs are detected.
    """
    if len(user_code) > settings.MAX_CODE_LENGTH_CHARS:
        return f"Code length exceeds security limit ({len(user_code)} > {settings.MAX_CODE_LENGTH_CHARS} chars)."

    try:
        tree = ast.parse(user_code)
    except SyntaxError as e:
        return f"Syntax Error: {e.msg} (line {e.lineno})"

    for node in ast.walk(tree):
        # 1. Block unauthorized imports
        if isinstance(node, ast.Import):
            for alias in node.names:
                root_pkg = alias.name.split('.')[0]
                if root_pkg not in ALLOWED_MODULES:
                    return f"Security Restriction: Import of module '{alias.name}' is prohibited in this sandbox. Allowed: {sorted(list(ALLOWED_MODULES))}"
                    
        elif isinstance(node, ast.ImportFrom):
            root_pkg = (node.module or "").split('.')[0]
            if root_pkg not in ALLOWED_MODULES:
                return f"Security Restriction: Import from '{node.module}' is prohibited. Allowed: {sorted(list(ALLOWED_MODULES))}"

        # 2. Block forbidden built-in / execution calls
        elif isinstance(node, ast.Call):
            if isinstance(node.func, ast.Name):
                if node.func.id in FORBIDDEN_CALLS:
                    return f"Security Restriction: Function call '{node.func.id}()' is prohibited for sandbox safety."

        # 3. Block inspection of dangerous attributes
        elif isinstance(node, ast.Attribute):
            if node.attr in FORBIDDEN_ATTRIBUTES:
                return f"Security Restriction: Attribute access to '{node.attr}' is blocked to prevent sandbox escapes."

    return None

def _execute_in_isolated_scope(user_code: str, test_cases: List[Dict[str, Any]]) -> Tuple[bool, List[Dict[str, Any]]]:
    """
    Runs code inside an isolated, constrained namespace.
    """
    results = []
    all_passed = True
    
    # Construct isolated execution scope
    isolated_scope = {
        "__builtins__": SAFE_BUILTINS,
        "math": math,
        "json": json,
        "re": re,
        "collections": collections,
        "itertools": itertools,
        "heapq": heapq
    }

    try:
        exec(user_code, isolated_scope)
    except Exception as e:
        error_msg = f"Runtime Error during module initialization: {type(e).__name__}: {str(e)}"
        for idx, tc in enumerate(test_cases):
            results.append({
                "test_case_index": idx + 1,
                "description": tc.get("input", f"Test Case {idx + 1}"),
                "input_str": tc.get("input", ""),
                "expected_str": str(tc.get("expected", "")),
                "actual_str": "None (Execution Failed)",
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
            actual_val = eval(test_call, isolated_scope)
            t_end = time.perf_counter()
            exec_time_ms = round((t_end - t_start) * 1000, 2)
            
            actual_str = str(actual_val)
            
            passed = False
            try:
                if isinstance(expected_raw, str):
                    try:
                        expected_eval = ast.literal_eval(expected_raw)
                    except Exception:
                        expected_eval = eval(expected_raw, {"math": math, "json": json})
                else:
                    expected_eval = expected_raw
                passed = (actual_val == expected_eval)
            except Exception:
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
                "error_message": None if passed else "Output did not match expected test assertion"
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
                "actual_str": f"Exception: {type(err).__name__}",
                "passed": False,
                "execution_time_ms": exec_time_ms,
                "error_message": f"{type(err).__name__}: {str(err)}"
            })
            
    return all_passed, results

def run_test_cases_sandboxed(user_code: str, test_cases: List[Dict[str, Any]]) -> Tuple[bool, List[Dict[str, Any]]]:
    """
    Executes Python code with security static analysis and strict execution timeouts.
    """
    # 1. Security Analysis
    security_error = validate_code_security(user_code)
    if security_error:
        results = [{
            "test_case_index": idx + 1,
            "description": tc.get("input", f"Test Case {idx + 1}"),
            "input_str": tc.get("input", ""),
            "expected_str": str(tc.get("expected", "")),
            "actual_str": "Blocked by Security Sandbox",
            "passed": False,
            "execution_time_ms": 0.0,
            "error_message": security_error
        } for idx, tc in enumerate(test_cases)]
        return False, results

    # 2. Timeout-bounded execution
    with concurrent.futures.ThreadPoolExecutor(max_workers=1) as executor:
        future = executor.submit(_execute_in_isolated_scope, user_code, test_cases)
        try:
            return future.result(timeout=settings.SANDBOX_TIMEOUT_SECONDS)
        except concurrent.futures.TimeoutError:
            results = [{
                "test_case_index": idx + 1,
                "description": tc.get("input", f"Test Case {idx + 1}"),
                "input_str": tc.get("input", ""),
                "expected_str": str(tc.get("expected", "")),
                "actual_str": "Execution Timeout",
                "passed": False,
                "execution_time_ms": round(settings.SANDBOX_TIMEOUT_SECONDS * 1000, 2),
                "error_message": f"Execution exceeded maximum allowable limit ({settings.SANDBOX_TIMEOUT_SECONDS}s). Ensure there are no infinite loops."
            } for idx, tc in enumerate(test_cases)]
            return False, results

async def execute_code_challenge(
    skill_id: str,
    code: str,
    student_id: str = "demo-student",
    language: str = "python"
) -> Dict[str, Any]:
    challenges = load_challenges()
    challenge = challenges.get(skill_id)
    
    if not challenge:
        test_cases = [
            {"input": "data=[1, 2, 3]", "expected": "6", "test_call": "solution([1, 2, 3])"},
            {"input": "data=[]", "expected": "0", "test_call": "solution([])"},
            {"input": "data=[10, -5, 5]", "expected": "10", "test_call": "solution([10, -5, 5])"}
        ]
    else:
        test_cases = challenge.get("test_cases", [])
    
    # Run in secure sandboxed runner with timeout protection
    all_passed, results = run_test_cases_sandboxed(code, test_cases)
    passed_count = sum(1 for r in results if r["passed"])
    total_count = len(results)
    
    total_time_ms = round(sum(r.get("execution_time_ms", 0.0) for r in results), 2)
    
    proof_credential = None
    if all_passed:
        proof_credential = generate_cryptographic_proof(
            student_id=student_id,
            skill_id=skill_id,
            code_content=code,
            passed_count=passed_count,
            total_count=total_count,
            execution_time_ms=total_time_ms
        )
        message = f"All {passed_count}/{total_count} test assertions passed! Cryptographic Proof generated."
    else:
        message = f"Passed {passed_count}/{total_count} test assertions. Review test feedback and retry."
        
    return {
        "skill_id": skill_id,
        "all_passed": all_passed,
        "passed_count": passed_count,
        "total_count": total_count,
        "total_time_ms": total_time_ms,
        "results": results,
        "message": message,
        "proof_credential": proof_credential
    }
