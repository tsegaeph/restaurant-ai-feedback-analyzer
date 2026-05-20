import csv
import json
import uuid
import random
from datetime import datetime

INPUT_FILE = "reviews.tsv"
OUTPUT_FILE = "reviews.json"

def map_rating(liked):
    liked = int(liked)
    return random.choice([4, 5]) if liked == 1 else random.choice([1, 2])

data = []

with open(INPUT_FILE, "r", encoding="utf-8") as f:
    reader = csv.DictReader(f, delimiter="\t")

    for i, row in enumerate(reader):
        if i >= 50:
            break;
        
        text = row.get("Review")
        liked = row.get("Liked")

        if not text or liked not in ["0", "1"]:
            continue

        review = {
            "text": text,
            "rating": map_rating(liked),
            "author": f"User{i}",
            "id": str(uuid.uuid4()),
            "timestamp": datetime.utcnow().isoformat()
        }

        data.append(review)

with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2)

print(f"Converted {len(data)} reviews!")