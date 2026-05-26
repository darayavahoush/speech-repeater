#!/usr/bin/env python3
import requests
import json
import time
from pathlib import Path

# Always resolve relative to project root, not script location
PROJECT_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = PROJECT_ROOT / "data" / "images"
INDEX_PATH = DATA_DIR / "index.json"
DATA_DIR.mkdir(parents=True, exist_ok=True)

print(f"Saving images to: {DATA_DIR}")

WORD_LIST = [
    "dog", "cat", "cow", "elephant", "lion", "tiger", "monkey", "parrot",
    "fish", "bird", "rabbit", "horse", "goat", "duck", "butterfly",
    "apple", "banana", "mango", "rice", "bread", "milk", "water",
    "egg", "potato", "tomato", "onion", "carrot", "orange", "grapes",
    "mother", "father", "baby", "girl", "boy", "grandfather", "grandmother",
    "hand", "eye", "ear", "nose", "mouth", "foot", "head", "hair",
    "ball", "book", "chair", "table", "cup", "bag", "car", "bus",
    "house", "door", "window", "bed", "tree", "flower", "sun", "moon",
    "eat", "drink", "sleep", "run", "jump", "sit", "stand", "walk",
    "read", "write", "play", "cry", "laugh", "sing",
    "happy", "sad", "angry", "scared", "surprised",
    "red", "blue", "green", "yellow", "purple", "white", "black",
    "one", "two", "three", "four", "five",
    "pencil", "pen", "paper", "school", "teacher",
]

ARASAAC_API = "https://api.arasaac.org/v1"

def search_pictogram(word):
    try:
        url = f"{ARASAAC_API}/pictograms/en/search/{word}"
        res = requests.get(url, timeout=10)
        if res.status_code == 200:
            results = res.json()
            if results:
                return results[0]
    except Exception as e:
        print(f"  Error searching {word}: {e}")
    return None

def download_pictogram(pictogram_id, word):
    try:
        url = f"{ARASAAC_API}/pictograms/{pictogram_id}?color=true&download=false"
        res = requests.get(url, timeout=10)
        if res.status_code == 200 and "image" in res.headers.get("content-type", ""):
            filename = f"{word}.png"
            with open(DATA_DIR / filename, "wb") as f:
                f.write(res.content)
            return filename
        else:
            print(f"  Bad response for {word}: {res.status_code}")
    except Exception as e:
        print(f"  Error downloading {word}: {e}")
    return None

def build_index():
    index = {}
    if INDEX_PATH.exists():
        with open(INDEX_PATH) as f:
            index = json.load(f)
        print(f"Loaded existing index with {len(index)} entries.")

    for word in WORD_LIST:
        if word in index:
            print(f"  Skipping {word} (already indexed)")
            continue
        print(f"Processing: {word}")
        pictogram = search_pictogram(word)
        if not pictogram:
            print(f"  No pictogram found for {word}")
            continue
        filename = download_pictogram(pictogram["_id"], word)
        if filename:
            index[word] = filename
            print(f"  Downloaded: {filename}")
        else:
            print(f"  Failed: {word}")
        with open(INDEX_PATH, "w") as f:
            json.dump(index, f, indent=2)
        time.sleep(0.3)

    print(f"\nDone. {len(index)} images saved to {DATA_DIR}")

if __name__ == "__main__":
    build_index()
