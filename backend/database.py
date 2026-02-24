import sqlite3
from datetime import datetime
import json

DB_NAME = "daktarite.db"


def init_db():
    """
    Creates clinical_cases table if it doesn't exist, with created_at and updated_at.
    """
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS clinical_cases (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            note TEXT NOT NULL,
            clinical_output TEXT NOT NULL,
            benchmark TEXT NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        )
    """)

    conn.commit()
    conn.close()


def save_case(note: str, clinical_output: dict, benchmark: dict, case_id: int = None):
    """
    Inserts a new clinical case or updates existing one.
    If case_id is provided, it updates that row (updated_at changes).
    """
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    now = datetime.utcnow().isoformat()

    if case_id:
        # Update existing case
        cursor.execute("""
            UPDATE clinical_cases
            SET note = ?, clinical_output = ?, benchmark = ?, updated_at = ?
            WHERE id = ?
        """, (
            note,
            json.dumps(clinical_output),
            json.dumps(benchmark),
            now,
            case_id
        ))
    else:
        # Insert new case
        cursor.execute("""
            INSERT INTO clinical_cases (note, clinical_output, benchmark, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?)
        """, (
            note,
            json.dumps(clinical_output),
            json.dumps(benchmark),
            now,
            now
        ))

    conn.commit()
    conn.close()


def get_all_cases():
    """
    Returns all stored cases (newest first), including created_at and updated_at.
    """
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute("""
        SELECT id, note, clinical_output, benchmark, created_at, updated_at
        FROM clinical_cases
        ORDER BY id DESC
    """)

    rows = cursor.fetchall()
    conn.close()

    results = []
    for row in rows:
        results.append({
            "id": row[0],
            "note": row[1],
            "clinical_output": json.loads(row[2]),
            "benchmark": json.loads(row[3]),
            "created_at": row[4],
            "updated_at": row[5]
        })

    return results