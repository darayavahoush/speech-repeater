"""
Email + password authentication, backed by Supabase.
Mobile number is collected but NOT verified (no SMS/OTP provider configured
yet) — it's a placeholder field for future OTP integration.
"""
import re
import bcrypt
from datetime import datetime, timezone, timedelta
from supabase import create_client
from app.core.config import settings

TRIAL_DURATION_DAYS = 7

_client = None


def _get_client():
    global _client
    if _client is None:
        if not settings.SUPABASE_URL or not settings.SUPABASE_SERVICE_ROLE_KEY:
            raise RuntimeError("Supabase is not configured — check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env")
        _client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)
    return _client


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, password_hash: str) -> bool:
    return bcrypt.checkpw(password.encode("utf-8"), password_hash.encode("utf-8"))


def is_valid_email(email: str) -> bool:
    return bool(re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", email))


def get_account_by_email(email: str):
    client = _get_client()
    result = client.table("children").select("*").ilike("email", email).limit(1).execute()
    return result.data[0] if result.data else None


def create_account(name: str, email: str, password: str, mobile: str = None):
    client = _get_client()
    password_hash = hash_password(password)
    now = datetime.now(timezone.utc).isoformat()
    result = client.table("children").insert({
        "name": name,
        "email": email,
        "mobile": mobile,
        "password_hash": password_hash,
        "trial_started_at": now,
        "subscription_status": "trial",
        "character": None,
        "language": None,
    }).execute()
    return result.data[0]


def update_account_profile(account_id: str, character: str = None, language: str = None):
    client = _get_client()
    updates = {}
    if character is not None:
        updates["character"] = character
    if language is not None:
        updates["language"] = language
    if not updates:
        return None
    result = client.table("children").update(updates).eq("id", account_id).execute()
    return result.data[0] if result.data else None


def get_trial_status(account: dict) -> dict:
    """
    Returns {"status": "trial"|"expired"|"active", "days_remaining": int|None}
    based on subscription_status and trial_started_at.
    """
    status = account.get("subscription_status", "trial")
    if status == "active":
        return {"status": "active", "days_remaining": None}

    trial_started_at = account.get("trial_started_at")
    if not trial_started_at:
        return {"status": "expired", "days_remaining": 0}

    started = datetime.fromisoformat(trial_started_at.replace("Z", "+00:00"))
    elapsed = datetime.now(timezone.utc) - started
    remaining_days = TRIAL_DURATION_DAYS - elapsed.days

    if remaining_days <= 0:
        return {"status": "expired", "days_remaining": 0}
    return {"status": "trial", "days_remaining": remaining_days}
