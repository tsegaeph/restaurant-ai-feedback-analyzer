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

# Initialize the official Hugging Face client
client = InferenceClient(token=HF_TOKEN)

# --- MODELS ---
SENTIMENT_MODEL = "cardiffnlp/twitter-roberta-base-sentiment-latest"

LLM_MODEL = "meta-llama/Llama-3.1-8B-Instruct"


# --- NLP HELPERS ---

def detect_negation(text: str) -> str | None:
    """Detects specific negation patterns and neutral fallback keywords."""
    text_lower = text.lower()
    
    # Define pattern lists
    pos_negations = ["not bad", "not terrible", "not awful"]
    neg_negations = ["not good", "not great", "not amazing"]
    
    has_pos = any(phrase in text_lower for phrase in pos_negations)
    has_neg = any(phrase in text_lower for phrase in neg_negations)
    
    if has_pos and has_neg:
        return "MIXED"
    elif has_pos:
        return "POSITIVE"
    elif has_neg:
        return "NEGATIVE"
        
    # Keyword fallback (using regex to ensure exact word boundaries)
    if re.search(r'\b(okay|fine|average|normal)\b', text_lower):
        return "NEUTRAL"
        
    return None

def is_balanced(sorted_scores: list) -> bool:
    """Checks if the top two sentiment scores are too close to call."""
    if len(sorted_scores) >= 2:
        diff = sorted_scores[0]['score'] - sorted_scores[1]['score']
        return diff < 0.15
    return False

def apply_rules(text: str, raw_results: list) -> dict:
    """Applies a hybrid of rule-based and confidence-based sentiment logic."""
    # Ensure results are sorted by score in descending order
    sorted_results = sorted(raw_results, key=lambda x: x['score'], reverse=True)
    top_label = sorted_results[0]['label'].upper()
    top_score = sorted_results[0]['score']
    
    # 1. Negation & Keyword Overrides
    negation_result = detect_negation(text)
    if negation_result:
        reason = "complex negation detected" if negation_result == "MIXED" else "rule-based keyword/negation override"
        return {"sentiment": negation_result, "confidence": top_score, "reason": reason}
        
    # 2. Confidence Threshold Drop
    if top_score < 0.60:
        return {"sentiment": "NEUTRAL", "confidence": top_score, "reason": f"low model confidence ({top_score:.2f} < 0.60)"}
        
    # 3. Balanced Scores Check
    if is_balanced(sorted_results):
        return {"sentiment": "NEUTRAL", "confidence": top_score, "reason": "balanced probabilities between top two classes"}
        
    # 4. Default to Model Prediction
    return {"sentiment": top_label, "confidence": top_score, "reason": "strong model prediction"}


# --- MAIN API FUNCTIONS ---

def analyze_sentiment(text: str) -> dict:
    """Analyzes the sentiment of a single review using a hybrid approach."""
    try:
        result = client.text_classification(text, model=SENTIMENT_MODEL)
        
        # Convert to dictionary format: [{'label': 'positive', 'score': 0.9}, ...]
        raw_results = [r.__dict__ for r in result]
        
        # Pass through the post-processing pipeline
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


def generate_summary(reviews: list) -> str:
    """Uses an LLM to read recent reviews and write a 1-paragraph summary."""
    if not reviews:
        return "Not enough data to generate an AI summary. Submit some reviews!"
        
    try:
        texts = [f"- {r['rating']} Stars: {r['text']}" for r in reviews]
        reviews_text = "\n".join(texts)
        
        # Using the chat_completion API format
        messages = [
            {"role": "system", "content": "You are a witty, elite restaurant critic. Summarize the overall feeling of a restaurant in exactly ONE bold, impactful sentence. No lists."},
            {"role": "user", "content": f"Based on these reviews, what is the 'Bottom Line' verdict?\n\n{reviews_text}"}
        ]
        
        response = client.chat_completion(
            messages=messages, 
            model=LLM_MODEL, 
            max_tokens=60
        )
        return response.choices[0].message.content.strip()
        
    except Exception as e:
        print(f"Hugging Face API Error (Summary): {repr(e)}")
        return "The kitchen is buzzing, but the data is still cooking."


def generate_insights(reviews: list) -> dict:
    """Uses an LLM to extract exactly 2 positives and 2 problems by grouping themes."""
    fallback_data = {
        "top_problems": ["Awaiting more data"],
        "top_positives": ["Awaiting more data"]
    }
    
    if not reviews:
        return fallback_data
        
    try:
        texts = [f"- {r['text']}" for r in reviews]
        reviews_text = "\n".join(texts)
        
        messages = [
            {
                "role": "system", 
                "content": "You are a Senior Restaurant Analyst. Your goal is to provide a balanced, non-contradictory summary of guest sentiment. Output ONLY raw JSON."
            },
            {
                "role": "user", 
                "content": (
                    f"Analyze these reviews: \n{reviews_text}\n\n"
                    "1. Identify the 2 most significant POSITIVE trends.\n"
                    "2. Identify the 2 most significant NEGATIVE trends.\n"
                    "3. CRITICAL: If a theme (like service) is mentioned as both good and bad, weigh the frequency. "
                    "Only include it in the category where it is most dominant. If it's a tie, prioritize the negative so management can fix it.\n"
                    "Return ONLY this JSON structure: {\"top_problems\": [], \"top_positives\": []}"
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
        if match:
            clean_json = match.group(1)
            data = json.loads(clean_json)

            # 🔥 NORMALIZATION FIX
            def normalize_list(items):
                normalized = []
                for item in items:
                    if isinstance(item, str):
                        normalized.append(item)
                    elif isinstance(item, dict):
                        key = list(item.keys())[0]
                        normalized.append(key.replace("_", " ").title())
                return normalized[:2]

            return {
                "top_problems": normalize_list(data.get("top_problems", [])),
                "top_positives": normalize_list(data.get("top_positives", []))
            }

        else:
            print(f"AI Response was not JSON: {content}")
            return fallback_data
        
    except Exception as e:
        print(f"Insight Generation Error: {repr(e)}")
        return fallback_data