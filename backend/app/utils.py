from app.model import analyze_sentiment
from app.storage import save_review


def process_and_save_review(review: dict):
    """
    Universal pipeline:
    - runs AI
    - guarantees required fields
    - saves clean data
    """

    result = analyze_sentiment(review["text"])

    # 🛡️ Always guarantee fields (NO EXCEPTIONS)
    review["sentiment"] = result.get("sentiment", "NEUTRAL")
    review["confidence"] = result.get("confidence", 0.5)

    return save_review(review)