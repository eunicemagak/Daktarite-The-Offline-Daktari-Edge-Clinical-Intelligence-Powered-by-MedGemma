# backend/config.py

# -----------------------------
# Clinical keyword configuration
# -----------------------------

# HIGH-risk symptoms (life-threatening / unstable)
HIGH_RISK_KEYWORDS = [
    "severe chest pain",
    "crushing chest pain",
    "unresponsive",
    "loss of consciousness",
    "active seizure",
    "stroke symptoms",
    "o2 sat 88",
    "oxygen saturation 88",
    "hypotension",
    "bp 80",
    "severe bleeding",
    "cardiac arrest"
]

# MEDIUM-risk symptoms (needs prompt evaluation but stable)
MEDIUM_RISK_KEYWORDS = [
    "chest pain",
    "shortness of breath",
    "fever",
    "high fever",
    "productive cough",
    "tachycardia",
    "infection",
    "pneumonia",
    "persistent vomiting",
    "dehydration"
]

# LOW-risk indicators (mild / stable complaints)
LOW_RISK_KEYWORDS = [
    "mild headache",
    "tension headache",
    "no neurological deficits",
    "stable vitals",
    "routine follow up",
    "minor pain"
]

# Urgency priority ranking
URGENCY_PRIORITY = {
    "low": 1,
    "medium": 2,
    "high": 3
}

# Model paths for environment switching
MODEL_PATHS = {
    "4b": "C:/Users/magak/Downloads/llama.cpp/medgemma-4b-it-q4_k_m.gguf"
}

DEFAULT_MODEL = "4b"