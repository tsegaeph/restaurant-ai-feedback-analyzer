from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.schemas import ReviewInput, ReviewOutput, SummaryOutput, InsightsOutput
from app.model import generate_summary, generate_insights
from app.storage import load_reviews
from app.utils import process_and_save_review  # 🔥 NEW PIPELINE

import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "https://restaurant-ai-feedback-analyzer.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔥 STARTUP: LOAD DATA THROUGH PIPELINE
@app.on_event("startup")
def load_initial_data():
    reviews = load_reviews()

    print("🔄 Checking reviews for missing AI processing...")

    updated_reviews = []
    changed = False

    for r in reviews:
        if "sentiment" not in r or "confidence" not in r:
            print(f"⚡ Processing: {r['text'][:30]}...")

            processed = process_and_save_review({
                "text": r["text"],
                "rating": r["rating"],
                "author": r["author"]
            })

            updated_reviews.append(processed)
            changed = True
        else:
            updated_reviews.append(r)

    # 🔥 overwrite file with clean processed data
    if changed:
        from app.storage import DATA_FILE
        import json

        with open(DATA_FILE, "w", encoding="utf-8") as f:
            json.dump(updated_reviews, f, indent=4)

        print("✅ Missing reviews processed and updated!")

    else:
        print("✅ All reviews already processed.")

# 🔥 POST REVIEW (USES SAME PIPELINE)
@app.post("/analyze", response_model=ReviewOutput)
def analyze(review: ReviewInput):

    review_data = {
        "text": review.text,
        "rating": review.rating,
        "author": review.author,
    }

    return process_and_save_review(review_data)


# 🔥 SAFE GET (NO MORE CRASHES)
@app.get("/reviews")
def get_reviews():
    reviews = load_reviews()

    # 🛡️ Safety layer (prevents schema crashes forever)
    for r in reviews:
        r.setdefault("sentiment", "UNKNOWN")
        r.setdefault("confidence", 0.0)

    return reviews


@app.get("/summary", response_model=SummaryOutput)
def get_summary():
    reviews = load_reviews()[-20:]
    return {"summary": generate_summary(reviews)}


@app.get("/insights", response_model=InsightsOutput)
def get_insights():
    reviews = load_reviews()[-30:]
    return generate_insights(reviews)