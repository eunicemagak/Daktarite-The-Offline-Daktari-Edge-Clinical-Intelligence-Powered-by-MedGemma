# backend/model.py

import os
from llama_cpp import Llama
from config import MODEL_PATHS, DEFAULT_MODEL

# Load model size from environment variable
MODEL_SIZE = os.getenv("MODEL_SIZE", DEFAULT_MODEL)

# -----------------------------------------
# Real Llama Model Initialization (Persistent)
# -----------------------------------------
llm_model = Llama(
    model_path=MODEL_PATHS[MODEL_SIZE],
    n_ctx=2048,
    n_threads=min(os.cpu_count(), 4)  # safer on smaller machines
)

# Warm-up the model to prevent first-call issues
try:
    _ = llm_model("Hello, this is a startup test.", max_tokens=10)
    print("Llama model warm-up successful ✅")
except Exception as e:
    print("Llama warm-up failed:", e)


def llm(prompt, max_tokens=600, temperature=0.1):
    """
    Sends prompt to the offline LLaMA model and enforces structured JSON output.
    Guaranteed safe return even if the model fails to produce text.
    """

    system_prompt = """
You are a clinical AI assistant.

Extract structured medical data and return ONLY valid JSON in this format:

{
  "patient_name": "",
  "summary": "",
  "symptoms": [],
  "medications": [],
  "allergies": [],
  "red_flags": [],
  "urgency_level": "low | medium | high"
}

Rules:
- Extract patient name if mentioned.
- Identify severe or life-threatening symptoms as red_flags.
- Determine urgency_level based on red_flags.
- Do NOT include explanations.
- Return ONLY JSON.
"""

    full_prompt = system_prompt + "\n\nClinical Note:\n" + prompt

    try:
        response = llm_model(
            full_prompt,
            max_tokens=max_tokens,
            temperature=temperature
        )

        # Safe return: ensure 'choices' and 'text' exist
        if not response or "choices" not in response or not response["choices"]:
            return {"choices": [{"text": ""}]}

        return response

    except Exception as e:
        print("LLM ERROR:", e)
        # Return empty but valid structure on failure
        return {"choices": [{"text": ""}]}