def build_prompt(note: str) -> str:
    """
    Builds strict JSON prompt for deterministic output.
    """
    return f"""
You are a clinical AI assistant running offline.
Extract patient name ONLY if explicitly stated in the clinical note.
Identify all symptoms, ALL medications with doses, allergies, and life-threatening red_flags.
Do NOT include any extra text—return VALID JSON ONLY.
Do NOT include explanations, markdown, or backticks.

Return exactly:

{{
 "patient_name": "",
 "summary": "",
 "symptoms": [],
 "medications": [],
 "allergies": [],
 "red_flags": [],
 "urgency_level": "low | medium | high"
}}

Clinical Note:
{note}

JSON:
"""
