"""
Answer caching for the AI assistant chatbot.
Uses sentence-transformers embeddings + cosine similarity so that
semantically similar questions (not just exact string matches) reuse
a previously-generated answer instead of re-hitting the Claude API.
"""
import json
import os
import numpy as np
from sentence_transformers import SentenceTransformer

CACHE_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "chat_answer_cache.json")
SIMILARITY_THRESHOLD = 0.5  # calibrated empirically: true matches score 0.64-0.89, true negatives cap ~0.33

_embedder = None
_cache = None  # list of {"question": str, "answer": str, "embedding": list[float]}


def _get_embedder():
    global _embedder
    if _embedder is None:
        _embedder = SentenceTransformer("paraphrase-multilingual-MiniLM-L12-v2")
    return _embedder


def _load_cache():
    global _cache
    if _cache is None:
        if os.path.exists(CACHE_PATH):
            with open(CACHE_PATH, "r", encoding="utf-8") as f:
                _cache = json.load(f)
        else:
            _cache = []
    return _cache


def _save_cache():
    os.makedirs(os.path.dirname(CACHE_PATH), exist_ok=True)
    with open(CACHE_PATH, "w", encoding="utf-8") as f:
        json.dump(_cache, f, ensure_ascii=False, indent=2)


def _cosine_sim(a, b):
    a, b = np.array(a), np.array(b)
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))


def find_cached_answer(question: str):
    """Returns a cached answer if a sufficiently similar question was asked before, else None."""
    cache = _load_cache()
    if not cache:
        return None
    embedder = _get_embedder()
    q_emb = embedder.encode(question).tolist()

    best_score = 0.0
    best_answer = None
    for entry in cache:
        score = _cosine_sim(q_emb, entry["embedding"])
        if score > best_score:
            best_score = score
            best_answer = entry["answer"]

    if best_score >= SIMILARITY_THRESHOLD:
        print(f"Chat cache hit (similarity={best_score:.3f}) for: {question[:50]}")
        return best_answer
    return None


def store_answer(question: str, answer: str):
    """Stores a new question/answer pair with its embedding for future similarity matching."""
    cache = _load_cache()
    embedder = _get_embedder()
    q_emb = embedder.encode(question).tolist()
    cache.append({"question": question, "answer": answer, "embedding": q_emb})
    _save_cache()
