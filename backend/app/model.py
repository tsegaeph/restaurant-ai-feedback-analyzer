import os
import json
import re
from dotenv import load_dotenv
from huggingface_hub import InferenceClient

load_dotenv()

# Retrieve the token
HF_TOKEN = os.getenv("HF_API_KEY")

if not HF_TOKEN:
    print("WARNING: HF_API_KEY is missing from .env!")

# Initialize Hugging Face client
client = InferenceClient(token=HF_TOKEN)

# --- MODELS ---
SENTIMENT_MODEL = "cardiffnlp/twitter-roberta-base-sentiment-latest"
LLM_MODEL = "meta-llama/Llama-3.1-8B-Instruct"


# =========================================================
# NLP HELPERS
# =========================================================

def detect_negation(text: str) -> str | None:
    """Detect specific negation patterns."""
    
    text_lower = text.lower()

    pos_negations = ["not bad", "not terrible", "not awful"]
    neg_negations = ["not good", "not great", "not amazing"]

    has_pos = any(phrase in text_lower for phrase in pos_negations)
    has_neg = any(phrase in text_lower for phrase in neg_negations)

    if has_pos and has_neg:
        return "NEUTRAL"

    elif has_pos:
        return "POSITIVE"

    elif has_neg:
        return "NEGATIVE"

    # Neutral keyword fallback
    if re.search(r'\b(okay|fine|average|normal)\b', text_lower):
        return "NEUTRAL"

    return None


def is_balanced(sorted_scores: list) -> bool:
    """Check if model probabilities are too close."""
    
    if len(sorted_scores) >= 2:
        diff = sorted_scores[0]["score"] - sorted_scores[1]["score"]
        return diff < 0.15

    return False


def apply_rules(text: str, raw_results: list) -> dict:
    """Apply rule-based corrections on top of model predictions."""

    sorted_results = sorted(
        raw_results,
        key=lambda x: x["score"],
        reverse=True
    )

    top_label = sorted_results[0]["label"].upper()
    top_score = sorted_results[0]["score"]

    # 1. Negation rules
    negation_result = detect_negation(text)

    if negation_result:
        return {
            "sentiment": negation_result,
            "confidence": top_score,
            "reason": "rule-based override"
        }

    # 2. Low confidence → neutral
    if top_score < 0.60:
        return {
            "sentiment": "NEUTRAL",
            "confidence": top_score,
            "reason": "low confidence"
        }

    # 3. Balanced probabilities → neutral
    if is_balanced(sorted_results):
        return {
            "sentiment": "NEUTRAL",
            "confidence": top_score,
            "reason": "balanced scores"
        }

    # 4. Default prediction
    return {
        "sentiment": top_label,
        "confidence": top_score,
        "reason": "strong prediction"
    }


# =========================================================
# SENTIMENT ANALYSIS
# =========================================================

def analyze_sentiment(text: str) -> dict:
    """Analyze sentiment using Hugging Face model."""

    try:
        result = client.text_classification(
            text,
            model=SENTIMENT_MODEL
        )

        raw_results = [r.__dict__ for r in result]

        final_analysis = apply_rules(text, raw_results)

        return {
            "status": "success",
            "sentiment": final_analysis["sentiment"],
            "confidence": final_analysis["confidence"],
            "reason": final_analysis["reason"],
            "raw": raw_results
        }

    except Exception as e:
        print(f"Hugging Face API Error (Sentiment): {repr(e)}")

        return {
            "status": "error",
            "message": str(e)
        }


# =========================================================
# SUMMARY GENERATION
# =========================================================

def generate_summary(reviews: list) -> str:
    """Generate restaurant summary using LLM."""

    if not reviews:
        return "Not enough data to generate an AI summary."

    try:
        texts = [
            f"- {r['rating']} Stars: {r['text']}"
            for r in reviews
        ]

        reviews_text = "\n".join(texts)

        messages = [
            {
                "role": "system",
                "content": (
                    "You are a professional restaurant critic. "
                    "Write ONE short impactful summary sentence."
                )
            },
            {
                "role": "user",
                "content": (
                    f"Summarize these restaurant reviews:\n\n"
                    f"{reviews_text}"
                )
            }
        ]

        response = client.chat_completion(
            messages=messages,
            model=LLM_MODEL,
            max_tokens=60
        )

        return response.choices[0].message.content.strip()

    except Exception as e:
        print(f"Hugging Face API Error (Summary): {repr(e)}")

        return "The AI summary is temporarily unavailable."


# =========================================================
# INSIGHT GENERATION
# =========================================================

def generate_insights(reviews: list) -> dict:
    """Generate top positive and negative restaurant insights."""

    fallback_data = {
        "top_problems": [
            "Service delays during busy hours",
            "Inconsistent food quality"
        ],
        "top_positives": [
            "Excellent food taste",
            "Friendly restaurant atmosphere"
        ]
    }

    if not reviews:
        return fallback_data

    try:
        texts = [f"- {r['text']}" for r in reviews]
        reviews_text = "\n".join(texts)

        messages = [
            {
                "role": "system",
                "content": (
                    "You are a Senior Restaurant Analyst. "
                    "Return ONLY valid raw JSON."
                )
            },
            {
                "role": "user",
                "content": (
                    f"Analyze these reviews:\n\n"
                    f"{reviews_text}\n\n"

                    "Find:\n"
                    "1. Two major positive trends\n"
                    "2. Two major negative trends\n\n"

                    "Return ONLY this JSON:\n"
                    "{\"top_problems\": [], \"top_positives\": []}"
                )
            }
        ]

        response = client.chat_completion(
            messages=messages,
            model=LLM_MODEL,
            max_tokens=300
        )

        content = response.choices[0].message.content

        # Extract JSON safely
        match = re.search(r'(\{.*\})', content, re.DOTALL)

        if not match:
            print(f"AI response was not valid JSON: {content}")
            return fallback_data

        clean_json = match.group(1)
        data = json.loads(clean_json)

        # =================================================
        # CLEAN + NORMALIZE OUTPUT
        # =================================================

        def clean_items(items):

            cleaned = []

            invalid_words = [
                "theme",
                "name",
                "placeholder",
                "item",
                "positive",
                "negative"
            ]

            for item in items:

                # Convert object → readable string
                if isinstance(item, dict):

                    key = next(iter(item.keys()), "Unknown")

                    item = key.replace("_", " ").title()

                item = str(item).strip()

                # Skip useless placeholders
                if item.lower() in invalid_words:
                    continue

                # Remove duplicates
                if item not in cleaned:
                    cleaned.append(item)

            return cleaned[:2]

        top_problems = clean_items(
            data.get("top_problems", [])
        )

        top_positives = clean_items(
            data.get("top_positives", [])
        )

        # Fallback if AI output is garbage
        if not top_problems:
            top_problems = fallback_data["top_problems"]

        if not top_positives:
            top_positives = fallback_data["top_positives"]

        return {
            "top_problems": top_problems,
            "top_positives": top_positives
        }

    except Exception as e:
        print(f"Insight Generation Error: {repr(e)}")
        return fallback_data