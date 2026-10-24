"""
SatPrep Python Solver Sandbox Runner
Executes untrusted mathematical solve() routines safely in a restricted environment
with strict timeouts and namespace limits.
"""
import math
import multiprocessing
import traceback
from typing import Any, Dict, Optional, Tuple

SAFE_BUILTINS = {
    'abs': abs,
    'round': round,
    'min': min,
    'max': max,
    'sum': sum,
    'len': len,
    'range': range,
    'int': int,
    'float': float,
    'str': str,
    'bool': bool,
    'list': list,
    'dict': dict,
    'tuple': tuple,
    'set': set,
}

SAFE_MODULES = {
    'math': math,
}

def _worker_exec(code_str: str, return_dict: dict):
    try:
        local_scope = {}
        global_scope = {'__builtins__': SAFE_BUILTINS, **SAFE_MODULES}
        
        exec(code_str, global_scope, local_scope)
        
        if 'solve' not in local_scope:
            return_dict['error'] = "Function 'solve()' not found in solver code"
            return
            
        result = local_scope['solve']()
        return_dict['result'] = result
        return_dict['success'] = True
    except Exception as e:
        return_dict['error'] = f"{type(e).__name__}: {str(e)}"
        return_dict['traceback'] = traceback.format_exc()

def execute_solver_safely(code_str: str, timeout_sec: float = 2.0) -> Tuple[bool, Any, Optional[str]]:
    """
    Executes solver code in a spawned process to prevent hangs, resource leaks,
    or malicious filesystem/network access.
    """
    manager = multiprocessing.Manager()
    return_dict = manager.dict({'success': False, 'result': None, 'error': None})
    
    p = multiprocessing.Process(target=_worker_exec, args=(code_str, return_dict))
    p.start()
    p.join(timeout=timeout_sec)
    
    if p.is_alive():
        p.terminate()
        p.join()
        return False, None, f"Execution timed out after {timeout_sec}s"
        
    if return_dict.get('success'):
        return True, return_dict.get('result'), None
    else:
        return False, None, return_dict.get('error')

def verify_question_options(solver_code: str, options: list, stated_correct_option: str) -> Dict[str, Any]:
    """
    Verifies that the solver output matches the stated correct option,
    and that no two options have identical values.
    """
    success, result, error = execute_solver_safely(solver_code)
    if not success:
        return {
            "verified": False,
            "error": f"Solver execution failed: {error}",
            "computed_value": None
        }
        
    computed_str = str(result).strip()
    
    # Check matching option
    matched_options = []
    for opt in options:
        opt_id = opt.get("id")
        opt_text = str(opt.get("text", "")).strip()
        # Direct match or numeric equivalence
        if opt_text == computed_str:
            matched_options.append(opt_id)
        else:
            try:
                if abs(float(opt_text) - float(computed_str)) < 1e-5:
                    matched_options.append(opt_id)
            except (ValueError, TypeError):
                pass
                
    if len(matched_options) == 0:
        return {
            "verified": False,
            "error": f"Solver result '{computed_str}' matched none of the given options",
            "computed_value": computed_str,
            "matched_options": []
        }
    elif len(matched_options) > 1:
        return {
            "verified": False,
            "error": f"Ambiguity detected: solver result matched multiple options: {matched_options}",
            "computed_value": computed_str,
            "matched_options": matched_options
        }
    elif matched_options[0] != stated_correct_option:
        return {
            "verified": False,
            "error": f"Key mismatch: solver found option '{matched_options[0]}' but stated key was '{stated_correct_option}'",
            "computed_value": computed_str,
            "matched_options": matched_options
        }
        
    return {
        "verified": True,
        "error": None,
        "computed_value": computed_str,
        "matched_options": matched_options
    }
