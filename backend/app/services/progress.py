"""
Practice-history logging and aggregation for the progress tracker.
"""
from datetime import datetime, timezone, timedelta
from collections import defaultdict
from app.core.database import get_session
from app.core.models import PracticeAttempt

SUCCESS_THRESHOLD = 70


def log_attempt(child_id: str, word: str, language: str, character: str, composite_score: float):
    if not child_id or child_id == "anonymous":
        return
    with get_session() as session:
        attempt = PracticeAttempt(
            child_id=child_id,
            word=word,
            language=language,
            character=character,
            success=composite_score >= SUCCESS_THRESHOLD,
        )
        session.add(attempt)
        session.commit()


def get_progress(child_id: str, days: int = 30):
    since = datetime.now(timezone.utc) - timedelta(days=days)
    with get_session() as session:
        rows = (
            session.query(PracticeAttempt)
            .filter(PracticeAttempt.child_id == child_id, PracticeAttempt.created_at >= since)
            .order_by(PracticeAttempt.created_at)
            .all()
        )
        attempts = [a.to_dict() for a in rows]

    total_words = len(attempts)
    total_success = sum(1 for a in attempts if a["success"])
    accuracy = round((total_success / total_words) * 100, 1) if total_words else 0

    by_day = defaultdict(lambda: {"total": 0, "success": 0})
    for a in attempts:
        day = a["created_at"][:10]
        by_day[day]["total"] += 1
        by_day[day]["success"] += 1 if a["success"] else 0

    daily = [
        {"date": day, "total": v["total"], "success": v["success"],
         "accuracy": round((v["success"] / v["total"]) * 100, 1) if v["total"] else 0}
        for day, v in sorted(by_day.items())
    ]

    streak = 0
    cursor = datetime.now(timezone.utc).date()
    practiced_days = set(by_day.keys())
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
