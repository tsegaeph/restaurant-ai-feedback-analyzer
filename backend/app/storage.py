import json
import os
from datetime import datetime
import uuid

DATA_FILE = "app/data/reviews.json"

def init_storage():
    os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)
    if not os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump([], f)

def load_reviews():
    init_storage()
    with open(DATA_FILE, encoding='utf-8') as f:
        return json.load(f)

def save_review(review_data: dict):
    reviews = load_reviews()
    
    # Add generated fields
    review_data["id"] = str(uuid.uuid4())
    review_data["timestamp"] = datetime.utcnow().isoformat()
    
    reviews.append(review_data)
    
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(reviews, f, indent=4)
        
    return review_data