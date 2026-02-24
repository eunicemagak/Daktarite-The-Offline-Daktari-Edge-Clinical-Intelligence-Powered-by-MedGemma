# backend/logger.py

import logging
import os

# Create logs directory
os.makedirs("logs", exist_ok=True)

logging.basicConfig(
    filename="logs/clinical.log",
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)

def log_case(note, result, benchmark):
    """
    Logs clinical case for audit trail.
    """
    logging.info(f"NOTE: {note} | RESULT: {result} | BENCHMARK: {benchmark}")