import os
import json
import re
from dotenv import load_dotenv
from huggingface_hub import InferenceClient

load_dotenv()

HF_TOKEN = os.getenv("HF_API_KEY")

if not HF_TOKEN:
    print("WARNING: HF_API_KEY is missing from .env!")

client = InferenceClient(token=HF_TOKEN)

SENTIMENT_MODEL = "cardiffnlp/twitter-roberta-base-sentiment-latest"
LLM_MODEL = "meta-llama/Llama-3.1-8B-Instruct"


# =========================================================
# NLP HELPERS
# =========================================================

def detect_negation(text: str):
    text_lower = text.lower()

    pos_negations = ["not bad", "not terrible", "not awful"]
    neg_negations = ["not good", "not great", "not amazing"]

    has_pos = any(p in text_lower for p in pos_negations)
    has_neg = any(p in text_lower for p in neg_negations)

    if has_pos and has_neg:
        return "NEUTRAL"
    elif has_pos:
        return "POSITIVE"
    elif has_neg:
        return "NEGATIVE"

    if re.search(r'\b(okay|fine|average|normal)\b', text_lower):
        return "NEUTRAL"

    return None


def is_balanced(sorted_scores):
    if len(sorted_scores) >= 2:
        return (sorted_scores[0]["score"] - sorted_scores[1]["score"]) < 0.15
    return False


def apply_rules(text, raw_results):
    sorted_results = sorted(raw_results, key=lambda x: x["score"], reverse=True)

    top_label = sorted_results[0]["label"].upper()
    top_score = sorted_results[0]["score"]

    neg = detect_negation(text)

    if neg:
        return {
            "sentiment": neg,
            "confidence": top_score,
            "reason": "rule override"
        }

    if top_score < 0.60:
        return {
            "sentiment": "NEUTRAL",
            "confidence": top_score,
            "reason": "low confidence"
        }

    if is_balanced(sorted_results):
        return {
            "sentiment": "NEUTRAL",
            "confidence": top_score,
            "reason": "balanced scores"
        }

    return {
        "sentiment": top_label,
        "confidence": top_score,
        "reason": "model prediction"
    }


# =========================================================
# SENTIMENT
# =========================================================

def analyze_sentiment(text: str):
    try:
        result = client.text_classification(text, model=SENTIMENT_MODEL)
        raw_results = [r.__dict__ for r in result]

        final = apply_rules(text, raw_results)

        return {
            "status": "success",
            "sentiment": final["sentiment"],
            "confidence": final["confidence"],
            "reason": final["reason"],
            "raw": raw_results
        }

    except Exception as e:
        return {"status": "error", "message": str(e)}


# =========================================================
# SUMMARY
# =========================================================

def generate_summary(reviews):
    if not reviews:
        return "Not enough data yet."

    try:
        text_block = "\n".join(
            f"- {r['rating']} Stars: {r['text']}" for r in reviews
        )

        messages = [
            {
                "role": "system",
                "content": "You are a restaurant critic. One short powerful sentence only."
            },
            {
                "role": "user",
                "content": text_block
            }
        ]

        response = client.chat_completion(
            messages=messages,
            model=LLM_MODEL,
            max_tokens=60
        )

        return response.choices[0].message.content.strip()

    except Exception:
        return "Summary temporarily unavailable."


# =========================================================
# INSIGHTS (🔥 FIXED VERSION)
# =========================================================

def generate_insights(reviews):
    fallback = {
        "top_problems": [
            "Service delays during busy hours",
            "Inconsistent food quality"
        ],
        "top_positives": [
            "Excellent food taste",
            "Friendly atmosphere"
        ]
    }

    if not reviews:
        return fallback

    try:
        text_block = "\n".join(f"- {r['text']}" for r in reviews)

        messages = [
            {
                "role": "system",
                "content": (
                    "Return ONLY valid JSON. "
                    "No commentary."
                )
            },
            {
                "role": "user",
                "content": f"""
Analyze reviews:

{text_block}

Return ONLY JSON in this exact format:
{{
  "top_positives": ["...", "..."],
  "top_problems": ["...", "..."]
}}
"""
            }
        ]

        response = client.chat_completion(
            messages=messages,
            model=LLM_MODEL,
            max_tokens=300
        )

        content = response.choices[0].message.content

        match = re.search(r'\{.*\}', content, re.DOTALL)
        if not match:
            return fallback

        data = json.loads(match.group())

        # 🔥 FINAL CLEANUP (very strict)
        def clean(items):
            clean_list = []

            for x in items:
                if isinstance(x, str):
                    val = x.strip()
                elif isinstance(x, dict):
                    val = next(iter(x.keys())).replace("_", " ").title()
                else:
                    continue

                # block garbage placeholders completely
                if val.lower() in ["theme", "name", "item", "positive", "negative"]:
                    continue

                if val not in clean_list:
                    clean_list.append(val)

            return clean_list[:2]

        positives = clean(data.get("top_positives", []))
        problems = clean(data.get("top_problems", []))

        return {
            "top_positives": positives or fallback["top_positives"],
            "top_problems": problems or fallback["top_problems"]
        }

    except Exception:
        return fallback