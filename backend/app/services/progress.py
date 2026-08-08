"""
Practice-history logging and aggregation for the progress tracker.
"""
from datetime import datetime, timezone, timedelta
from collections import defaultdict
from supabase import create_client
from app.core.config import settings

SUCCESS_THRESHOLD = 70  # composite_score >= this counts as a successful attempt

_client = None

def _get_client():
    global _client
    if _client is None:
        _client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)
    return _client

def log_attempt(child_id: str, word: str, language: str, character: str, composite_score: float):
    """Fire-and-forget style log — caller should catch exceptions so a
    logging failure never breaks the actual practice flow."""
    if not child_id or child_id == "anonymous":
        return
    client = _get_client()
    client.table("practice_attempts").insert({
        "child_id": child_id,
        "word": word,
        "language": language,
        "character": character,
        "success": composite_score >= SUCCESS_THRESHOLD,
    }).execute()

def get_progress(child_id: str, days: int = 30):
    client = _get_client()
    since = (datetime.now(timezone.utc) - timedelta(days=days)).isoformat()
    result = (
        client.table("practice_attempts")
        .select("*")
        .eq("child_id", child_id)
        .gte("created_at", since)
        .order("created_at")
        .execute()
    )
    attempts = result.data or []

    total_words = len(attempts)
    total_success = sum(1 for a in attempts if a["success"])
    accuracy = round((total_success / total_words) * 100, 1) if total_words else 0

    # Group by day for the chart + streak calc
    by_day = defaultdict(lambda: {"total": 0, "success": 0})
    for a in attempts:
        day = a["created_at"][:10]  # YYYY-MM-DD
        by_day[day]["total"] += 1
        by_day[day]["success"] += 1 if a["success"] else 0

    daily = [
        {"date": day, "total": v["total"], "success": v["success"],
         "accuracy": round((v["success"] / v["total"]) * 100, 1) if v["total"] else 0}
        for day, v in sorted(by_day.items())
    ]

    # Current streak: consecutive days (ending today or yesterday) with >=1 attempt
    streak = 0
    cursor = datetime.now(timezone.utc).date()
    practiced_days = set(by_day.keys())
    # Allow today to be "not yet practiced" without breaking the streak
    if cursor.isoformat() not in practiced_days:
        cursor -= timedelta(days=1)
    while cursor.isoformat() in practiced_days:
        streak += 1
        cursor -= timedelta(days=1)

    return {
        "total_words": total_words,
        "total_success": total_success,
        "accuracy": accuracy,
        "streak": streak,
        "daily": daily,
    }
