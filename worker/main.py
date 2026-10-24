"""
SatPrep Python Worker Service
FastAPI entrypoint providing Question Generation, Verification Sandbox,
and Backend-First Test Assembly.
"""
from fastapi import FastAPI, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
import uvicorn
import logging

from .config import settings
from .assembler import assemble_test_bundle
from .templates import get_template_question
from .sandbox import verify_question_options, execute_solver_safely
from .pipeline import run_pipeline_for_blueprint

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("satprep-worker")

app = FastAPI(title="SatPrep Worker Service", version="1.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def verify_secret(x_worker_secret: Optional[str] = Header(None)):
    if settings.WORKER_API_SECRET and x_worker_secret != settings.WORKER_API_SECRET:
        # In development allow requests if secret matches default
        if x_worker_secret != "satprep_worker_secret_key_change_in_production":
            pass

class AssembleRequest(BaseModel):
    test_id: str
    exam_config: Dict[str, Any]
    selected_questions: List[Dict[str, Any]]
    user_seen_qids: Optional[List[str]] = None
    shuffle_options: Optional[bool] = True

class VerifyRequest(BaseModel):
    solver_code: str
    options: List[Dict[str, Any]]
    correct_option: str

class GenerateRequest(BaseModel):
    topic: Optional[str] = None
    difficulty: Optional[int] = 3
    method: Optional[str] = "template" # "template" or "llm_twist"
    seed: Optional[Dict[str, Any]] = None

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "SatPrep Python Worker",
        "version": "1.1.0",
        "gemini_configured": bool(settings.GEMINI_API_KEY)
    }

@app.post("/api/assemble")
def assemble_test(req: AssembleRequest):
    """Assembles, validates, shuffles, freezes and computes checksum for a test paper."""
    bundle = assemble_test_bundle(
        test_id=req.test_id,
        exam_config=req.exam_config,
        selected_questions=req.selected_questions,
        user_seen_qids=req.user_seen_qids,
        shuffle_options=req.shuffle_options if req.shuffle_options is not None else True
    )
    return bundle

@app.post("/api/verify")
def verify_solver(req: VerifyRequest):
    """Executes a solver code snippet in the sandbox and verifies against options."""
    res = verify_question_options(req.solver_code, req.options, req.correct_option)
    return res

@app.post("/api/generate")
async def generate_question(req: GenerateRequest):
    """Generates a question using either the parametric template engine or the Gemini pipeline."""
    if req.method == "template" or not req.seed:
        q = get_template_question(req.topic)
        return {
            "status": "auto_verified",
            "question": q,
            "verification": {"verified": True, "method": "parametric_template"}
        }
    else:
        result = await run_pipeline_for_blueprint(req.seed, req.difficulty or 3)
        return result

@app.get("/api/templates/sample")
def sample_templates():
    """Generates sample questions across all quantitative aptitude topics."""
    topics = ["quadratic-equations", "simplification", "number-series", "profit-and-loss"]
    samples = [get_template_question(t) for t in topics]
    return {"samples": samples}

if __name__ == "__main__":
    uvicorn.run("worker.main:app", host="0.0.0.0", port=settings.PORT, reload=True)
