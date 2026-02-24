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

app = FastAPI()

# Initialize SQLite DB
init_db()

# CORS middleware: allow localhost and 127.0.0.1
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/analyze")
def analyze(input: ClinicalInput):
    """
    Main endpoint for clinical analysis
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

    # Log and save case
    log_case(input.note, final_result, benchmark_result)
    save_case(input.note, final_result, benchmark_result)

    # Return response
    return {
        "note": input.note,
        "clinical_output": final_result,
        "benchmark": benchmark_result
    }


@app.get("/history")
def get_history():
    """
    Return all saved cases
    """
    return get_all_cases()