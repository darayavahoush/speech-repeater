import os
import json
import time
import requests
import cv2
import numpy as np
from pathlib import Path
from rapidfuzz import process, fuzz

DATA_DIR = Path(__file__).resolve().parent.parent.parent.parent.parent / "data" / "images"
INDEX_PATH = DATA_DIR / "index.json"
ARASAAC_API = "https://api.arasaac.org/v1"

_index: dict = {}
_embeddings = None
_embedding_model = None


def load_index():
    global _index
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    if INDEX_PATH.exists():
        with open(INDEX_PATH) as f:
            _index = json.load(f)


def save_index():
    with open(INDEX_PATH, "w") as f:
        json.dump(_index, f, indent=2)


def load_embedding_model():
    global _embedding_model
    if _embedding_model is None:
        from sentence_transformers import SentenceTransformer
        _embedding_model = SentenceTransformer("all-MiniLM-L6-v2")
    return _embedding_model


def semantic_match(word: str) -> str | None:
    if not _index:
        return None
    try:
        model = load_embedding_model()
        import numpy as np
        words_in_index = list(_index.keys())
        all_words = [word] + words_in_index
        embeddings = model.encode(all_words)
        query_emb = embeddings[0]
        index_embs = embeddings[1:]
        similarities = np.dot(index_embs, query_emb) / (
            np.linalg.norm(index_embs, axis=1) * np.linalg.norm(query_emb) + 1e-9
        )
        best_idx = int(np.argmax(similarities))
        best_score = float(similarities[best_idx])
        if best_score > 0.5:
            return words_in_index[best_idx]
    except Exception as e:
        print(f"Semantic match error: {e}")
    return None


def fetch_from_arasaac(word: str) -> str | None:
    try:
        url = f"{ARASAAC_API}/pictograms/en/search/{word}"
        res = requests.get(url, timeout=8)
        if res.status_code == 200:
            results = res.json()
            if results:
                pic_id = results[0]["_id"]
                img_url = f"{ARASAAC_API}/pictograms/{pic_id}?download=false"
                img_res = requests.get(img_url, timeout=8)
                if img_res.status_code == 200:
                    filename = f"{word}.png"
                    filepath = DATA_DIR / filename
                    with open(filepath, "wb") as f:
                        f.write(img_res.content)
                    _index[word] = filename
                    save_index()
                    return filename
    except Exception as e:
        print(f"ARASAAC fetch error for {word}: {e}")
    return None


def find_image(word: str) -> dict:
    if not _index:
        load_index()

    word = word.lower().strip()
    words_in_index = list(_index.keys())

    # 1. Exact match
    if word in _index:
        return {"path": str(DATA_DIR / _index[word]), "word": word, "confidence": 100, "match_type": "exact"}

    # 2. Fuzzy match
    if words_in_index:
        result = process.extractOne(word, words_in_index, scorer=fuzz.token_sort_ratio)
        if result and result[1] >= 75:
            matched_word = result[0]
            return {"path": str(DATA_DIR / _index[matched_word]), "word": matched_word, "confidence": result[1], "match_type": "fuzzy"}

    # 3. Live ARASAAC API fetch
    filename = fetch_from_arasaac(word)
    if filename:
        return {"path": str(DATA_DIR / filename), "word": word, "confidence": 95, "match_type": "api"}

    # 4. Semantic match from existing index
    matched = semantic_match(word)
    if matched:
        return {"path": str(DATA_DIR / _index[matched]), "word": matched, "confidence": 70, "match_type": "semantic"}

    return {"path": None, "word": word, "confidence": 0, "match_type": "none"}


def parse_attributes(phrase: str) -> dict:
    COLORS = ["red", "blue", "green", "yellow", "orange", "purple",
              "pink", "white", "black", "brown", "grey", "gray"]
    SIZES = ["big", "large", "small", "tiny", "huge", "little"]
    words = phrase.lower().strip().split()
    color, size, obj_words = None, None, []
    for w in words:
        if w in COLORS and color is None:
            color = w
        elif w in SIZES and size is None:
            size = w
        else:
            obj_words.append(w)
    # Use last noun as object if multiple words
    obj = " ".join(obj_words) if obj_words else phrase
    return {"object": obj, "color": color, "size": size}


def make_transparent(img):
    """Remove background using floodfill from corners — works on any bg colour."""
    rgba = cv2.cvtColor(img, cv2.COLOR_BGR2BGRA)
    h, w = img.shape[:2]
    
    # Floodfill mask needs to be 2px larger
    flood_mask = np.zeros((h + 2, w + 2), np.uint8)
    img_copy = img.copy()
    
    # Flood from all 4 corners to catch full background
    for corner in [(0, 0), (0, w-1), (h-1, 0), (h-1, w-1)]:
        cv2.floodFill(img_copy, flood_mask, (corner[1], corner[0]),
                      (255, 0, 255), loDiff=(25, 25, 25), upDiff=(25, 25, 25))
    
    # Pixels filled = background
    bg_mask = (img_copy[:,:,0] == 255) & (img_copy[:,:,1] == 0) & (img_copy[:,:,2] == 255)
    rgba[:,:,3][bg_mask] = 0
    return rgba


def apply_color(image_path: str, color_name: str):
    COLOR_HUES = {
        "red": 0, "orange": 15, "yellow": 30, "green": 60,
        "blue": 120, "purple": 150, "pink": 170, "brown": 10
    }
    img = cv2.imread(image_path)
    if img is None:
        return None
    target_hue = COLOR_HUES.get(color_name)
    if target_hue is None:
        return img

    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV).astype(np.float32)

    # Mask: coloured pixels only
    # Exclude white (high V, low S), grey (low S), black (low V)
    saturation_mask = hsv[:, :, 1] > 40       # not grey or white
    brightness_mask = hsv[:, :, 2] > 40       # not black
    not_white_mask  = hsv[:, :, 2] < 240      # not pure white
    mask = saturation_mask & brightness_mask & not_white_mask

    if mask.sum() == 0:
        # No coloured pixels — just tint the whole non-white area
        mask = brightness_mask & not_white_mask

    if mask.sum() == 0:
        return cv2.cvtColor(hsv.astype(np.uint8), cv2.COLOR_HSV2BGR)

    # Set hue directly to target — more reliable than relative shift
    hsv[:, :, 0][mask] = target_hue
    hsv[:, :, 1][mask] = np.clip(hsv[:, :, 1][mask] * 1.4, 80, 255)

    hsv = np.clip(hsv, 0, 255).astype(np.uint8)
    return cv2.cvtColor(hsv, cv2.COLOR_HSV2BGR)


def apply_size(image_path: str, size: str):
    SCALE = {"big": 1.4, "large": 1.4, "huge": 1.6, "small": 0.7, "tiny": 0.5, "little": 0.6}
    img = cv2.imread(image_path)
    if img is None:
        return None
    scale = SCALE.get(size, 1.0)
    h, w = img.shape[:2]
    return cv2.resize(img, (int(w * scale), int(h * scale)))


def get_image_for_phrase(phrase: str) -> dict:
    attrs = parse_attributes(phrase)
    match = find_image(attrs["object"])

    if not match["path"]:
        return {"found": False, "phrase": phrase, "match_type": "none", "image_bytes": None}

    if attrs["color"]:
        img = apply_color(match["path"], attrs["color"])
    elif attrs["size"]:
        img = apply_size(match["path"], attrs["size"])
    else:
        img = cv2.imread(match["path"])

    if img is None:
        return {"found": False, "phrase": phrase, "match_type": "none", "image_bytes": None}

    img = make_transparent(img)
    _, buf = cv2.imencode(".png", img)
    return {
        "found": True,
        "phrase": phrase,
        "matched_word": match["word"],
        "match_type": match["match_type"],
        "confidence": match["confidence"],
        "image_bytes": buf.tobytes()
    }
