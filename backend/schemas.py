# backend/schemas.py

from pydantic import BaseModel

class ClinicalInput(BaseModel):
    note: str