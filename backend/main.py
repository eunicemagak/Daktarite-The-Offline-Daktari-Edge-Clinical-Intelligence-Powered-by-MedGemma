# backend/main.py
from database import init_db, save_case, get_all_cases
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from model import llm
from prompt import build_prompt
from json_utils import extract_json
from triage import apply_triage_rules
from benchmarking import start_benchmark, end_benchmark
from schemas import ClinicalInput
from logger import log_case
from datetime import datetime


app = FastAPI()

init_db()

# Enable frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/analyze")
def analyze(input: ClinicalInput):
    """
    Main endpoint for clinical analysis with logging and error handling.
    """

    benchmark_start = start_benchmark()

    # Build strict prompt
    prompt = build_prompt(input.note)
    print("PROMPT SENT TO MODEL:\n", prompt)

    try:
        output = llm(
            prompt,
            max_tokens=400,
            temperature=0.1
        )
        model_text = output["choices"][0]["text"]
        print("MODEL RAW OUTPUT:\n", model_text)

        parsed = extract_json(model_text)

    except Exception as e:
        print("MODEL ERROR:", e)
        raise HTTPException(status_code=500, detail=f"Model failed: {e}")

    # Apply deterministic safety rules
    final_result = apply_triage_rules(input.note, parsed)

    benchmark_result = end_benchmark(benchmark_start)

    # Log case
    log_case(input.note, final_result, benchmark_result)

    # Save to SQLite
    # Use None for new cases; if you want updates in future, pass case_id
    save_case(input.note, final_result, benchmark_result)

    # Return response to frontend
    return {
        "note": input.note,
        "clinical_output": final_result,
        "benchmark": benchmark_result
    }


@app.get("/history")
def get_history():
    """
    Return all cases including created_at and updated_at
    """
    return get_all_cases()