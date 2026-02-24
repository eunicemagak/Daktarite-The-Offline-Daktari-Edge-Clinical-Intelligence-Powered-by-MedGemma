# backend/triage.py

from config import HIGH_RISK_KEYWORDS, MEDIUM_RISK_KEYWORDS, URGENCY_PRIORITY

def compute_rule_based_urgency(note: str, model_output: dict) -> str:
    """
    Deterministic scoring system.
    Rules are aligned with the model prompt:
    - High-risk keywords (life-threatening) → +3 points
    - Medium-risk keywords → +2 points
    - Bonus if multiple red_flags detected
    """

    score = 0
    note_lower = note.lower()

    # High-risk keywords add +3
    for keyword in HIGH_RISK_KEYWORDS:
        if keyword in note_lower:
            score += 3

    # Medium-risk keywords add +2
    for keyword in MEDIUM_RISK_KEYWORDS:
        if keyword in note_lower:
            score += 2

    # Bonus if model detected multiple red flags
    if len(model_output.get("red_flags", [])) > 2:
        score += 1

    if score >= 3:
        return "high"
    elif score == 2:
        return "medium"
    else:
        return "low"


def apply_triage_rules(note: str, result: dict) -> dict:
    """
    Updates model output with deterministic urgency_level.
    Ensures consistency between model red_flags and triage rules.
    """
    rule_urgency = compute_rule_based_urgency(note, result)
    result["urgency_level"] = rule_urgency
    return result