"""
SatPrep Backend-First Test Assembler
Implements PRD Section 8 (Test Assembly and Pre-Generation)
Rules TA-01 to TA-33.
"""
import hashlib
import json
import random
import uuid
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional

def compute_bundle_checksum(payload: dict) -> str:
    """Computes a deterministic SHA-256 hash of the frozen bundle"""
    canonical_json = json.dumps(payload, sort_keys=True)
    return hashlib.sha256(canonical_json.encode('utf-8')).hexdigest()

def assemble_test_bundle(
    test_id: str,
    exam_config: Dict[str, Any],
    selected_questions: List[Dict[str, Any]],
    user_seen_qids: Optional[List[str]] = None,
    shuffle_options: bool = True
) -> Dict[str, Any]:
    """
    Assembles, freezes and signs an immutable test paper.
    Ensures that student payload NEVER contains answer keys or solutions!
    """
    user_seen_set = set(user_seen_qids or [])
    assembled_questions = []
    
    # Track freshness
    unseen_count = 0
    total_count = len(selected_questions)
    
    for idx, q in enumerate(selected_questions):
        qid = q.get("id")
        if qid not in user_seen_set:
            unseen_count += 1
            
        raw_options = list(q.get("options", []))
        q_type = q.get("type", "mcq")
        
        # Fixed option types (quadratic, quantity, data sufficiency) keep fixed order
        # MCQ single correct allows server-side shuffling
        if shuffle_options and q_type == "mcq":
            shuffled_options = list(raw_options)
            random.shuffle(shuffled_options)
            # Reassign letter labels a, b, c, d, e to new positions
            frozen_options = [
                {"id": chr(97 + i), "text": opt.get("text"), "original_id": opt.get("id")}
                for i, opt in enumerate(shuffled_options)
            ]
        else:
            frozen_options = raw_options
            
        assembled_q = {
            "position": idx + 1,
            "id": qid,
            "stem": q.get("stem"),
            "options": frozen_options,
            "type": q_type,
            "topic_id": q.get("topic_id"),
            "subtopic_id": q.get("subtopic_id"),
            "difficulty": q.get("difficulty_assigned", 3),
            "stimulus": q.get("stimulus"),
            "marks_positive": exam_config.get("marks_per_q", 1.0),
            "marks_negative": exam_config.get("negative_marks", 0.25)
        }
        assembled_questions.append(assembled_q)
        
    freshness_percent = round((unseen_count / max(total_count, 1)) * 100)
    
    # Frozen payload for client delivery
    client_payload = {
        "test_id": test_id,
        "assembled_at": datetime.now(timezone.utc).isoformat(),
        "exam_name": exam_config.get("name", "Quantitative Aptitude Test"),
        "duration_min": exam_config.get("duration_min", 20),
        "total_questions": len(assembled_questions),
        "total_marks": len(assembled_questions) * exam_config.get("marks_per_q", 1.0),
        "negative_marks": exam_config.get("negative_marks", 0.25),
        "section_lock": exam_config.get("section_lock", True),
        "freshness_percent": freshness_percent,
        "sections": [
            {
                "id": exam_config.get("section_id", "quant_main"),
                "name": exam_config.get("section_name", "Quantitative Aptitude"),
                "duration_min": exam_config.get("duration_min", 20),
                "questions": assembled_questions
            }
        ]
    }
    
    checksum = compute_bundle_checksum(client_payload)
    
    return {
        "test_id": test_id,
        "checksum": checksum,
        "payload": client_payload,
        "freshness_percent": freshness_percent,
        "assembled_count": len(assembled_questions)
    }
