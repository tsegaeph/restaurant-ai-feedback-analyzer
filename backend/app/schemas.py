from pydantic import BaseModel
from typing import List, Optional

class ReviewInput(BaseModel):
    text: str
    rating: int
    author: str

class ReviewOutput(BaseModel):
    id: str
    text: str
    rating: int
    author: str
    sentiment: str
    confidence: float
    timestamp: str

class InsightsOutput(BaseModel):
    top_problems: List[str]
    top_positives: List[str]

class SummaryOutput(BaseModel):
    summary: str