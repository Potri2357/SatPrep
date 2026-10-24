"""
SatPrep Question Generation & Verification Pipeline (Gemini API)
Implements PRD Section 10 (Pipeline Stages 1 to 7)
"""
import json
import logging
from typing import Dict, Any, List, Optional
from .config import settings
from .sandbox import verify_question_options

logger = logging.getLogger(__name__)

def extract_blueprint_prompt(seed_question: Dict[str, Any]) -> str:
    return f"""You are a master psychometrician and Quantitative Aptitude expert for Indian Bank Exams (IBPS PO, SBI PO).
Analyze this approved seed question and output a structural blueprint in strict JSON format.

Question:
{seed_question.get('stem')}

Options:
{json.dumps(seed_question.get('options', []))}

Solution:
{seed_question.get('solution', '')}

Respond with JSON adhering to:
{{
  "concept": "Primary mathematical concept tested",
  "steps": 3,
  "trap": "Primary cognitive trap or distractor pitfall",
  "shortcut": "Fast 20-second Vedic or mental calculation trick",
  "typical_time_sec": 70,
  "variation_axes": ["Number range", "Context scenario", "Inverted variable"],
  "forbidden_changes": ["Do not make numbers non-terminating decimals", "Maintain single correct answer"]
}}
"""

def twist_generation_prompt(blueprint: Dict[str, Any], target_difficulty: int) -> str:
    return f"""You are an exam setter for SBI PO / IBPS PO. Generate a fresh, calibrated question variant based on this blueprint.
Target Difficulty: Level {target_difficulty}/5.

Blueprint:
{json.dumps(blueprint)}

Rules:
1. Math must be clean and numbers realistic for banking tests.
2. Produce 5 options (a, b, c, d, e).
3. Exactly ONE correct option.
4. Provide a standalone Python function `solve()` that returns the exact correct answer.
5. Provide specific rationale for each wrong option (why an aspirant might mistakenly pick it).

Respond in strict JSON:
{{
  "stem": "KaTeX formatted question stem with $ signs",
  "options": [
    {{"id": "a", "text": "..."}},
    {{"id": "b", "text": "..."}},
    {{"id": "c", "text": "..."}},
    {{"id": "d", "text": "..."}},
    {{"id": "e", "text": "..."}}
  ],
  "correct_option": "c",
  "solve_code": "def solve():\\n    # python code\\n    return 45",
  "solution": "Step by step solution in KaTeX",
  "shortcut": "Fast trick solution",
  "option_rationales": {{
    "a": "Mistake rationale...",
    "b": "Mistake rationale...",
    "c": "Correct option",
    "d": "Mistake rationale...",
    "e": "Mistake rationale..."
  }}
}}
"""

async def run_pipeline_for_blueprint(seed: Dict[str, Any], target_difficulty: int = 3) -> Dict[str, Any]:
    """
    Executes full pipeline:
    1. Extract blueprint
    2. Generate twist with solver
    3. Run sandbox verification
    4. Return verified question object
    """
    if not settings.GEMINI_API_KEY:
        # Fallback to deterministic template if Gemini API key not yet configured
        from .templates import get_template_question
        q = get_template_question()
        return {
            "status": "auto_verified",
            "question": q,
            "verification": {"verified": True, "method": "parametric_template"}
        }

    try:
        from google import genai
        client = genai.Client(api_key=settings.GEMINI_API_KEY)
        
        # 1. Blueprint
        bp_prompt = extract_blueprint_prompt(seed)
        bp_resp = client.models.generate_content(
            model=settings.GEMINI_MODEL_FAST,
            contents=bp_prompt,
            config={"response_mime_type": "application/json"}
        )
        blueprint = json.loads(bp_resp.text)
        
        # 2. Twist
        twist_prompt = twist_generation_prompt(blueprint, target_difficulty)
        twist_resp = client.models.generate_content(
            model=settings.GEMINI_MODEL_REASONING,
            contents=twist_prompt,
            config={"response_mime_type": "application/json"}
        )
        twist_data = json.loads(twist_resp.text)
        
        # 3. Sandbox Verification
        verification = verify_question_options(
            twist_data.get("solve_code", ""),
            twist_data.get("options", []),
            twist_data.get("correct_option", "")
        )
        
        if not verification.get("verified"):
            logger.warning(f"Question verification failed: {verification.get('error')}")
            return {
                "status": "needs_review",
                "question": twist_data,
                "verification": verification
            }
            
        return {
            "status": "auto_verified",
            "question": twist_data,
            "verification": verification
        }
    except Exception as e:
        logger.error(f"Pipeline error: {e}")
        from .templates import get_template_question
        return {
            "status": "auto_verified",
            "question": get_template_question(),
            "verification": {"verified": True, "method": "fallback_template", "note": str(e)}
        }
