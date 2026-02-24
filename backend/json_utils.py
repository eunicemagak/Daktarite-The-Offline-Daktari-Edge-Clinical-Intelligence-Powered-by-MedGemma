import json
import re

def extract_json(model_text: str) -> dict:
    """
    Extract valid JSON from model output string.
    Falls back to empty structured template if parsing fails.
    """

    # Try to extract JSON-looking part
    json_match = re.search(r"\{.*\}", model_text, re.DOTALL)
    if json_match:
        try:
            return json.loads(json_match.group())
        except json.JSONDecodeError:
            pass

    # Fallback template
    return {
        "patient_name": "",
        "summary": "",
        "symptoms": [],
        "medications": [],
        "allergies": [],
        "red_flags": [],
        "urgency_level": "low"
    }
