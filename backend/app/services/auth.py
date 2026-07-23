"""
Simple name + PIN authentication for children using VaakSiddhi, backed by
Supabase. No email/password — just a name and a short PIN, matching the
low-friction login a child can manage independently.
"""
import bcrypt
from supabase import create_client
from app.core.config import settings

_client = None


def _get_client():
    global _client
    if _client is None:
        if not settings.SUPABASE_URL or not settings.SUPABASE_SERVICE_ROLE_KEY:
            raise RuntimeError("Supabase is not configured — check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env")
        _client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)
    return _client


def hash_pin(pin: str) -> str:
    return bcrypt.hashpw(pin.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_pin(pin: str, pin_hash: str) -> bool:
    return bcrypt.checkpw(pin.encode("utf-8"), pin_hash.encode("utf-8"))


def get_child_by_name(name: str):
    client = _get_client()
    result = client.table("children").select("*").ilike("name", name).limit(1).execute()
    return result.data[0] if result.data else None


def create_child(name: str, pin: str):
    client = _get_client()
    pin_hash = hash_pin(pin)
    result = client.table("children").insert({
        "name": name,
        "pin_hash": pin_hash,
        "character": None,
        "language": None,
    }).execute()
    return result.data[0]


def update_child_profile(child_id: str, character: str = None, language: str = None):
    client = _get_client()
    updates = {}
    if character is not None:
        updates["character"] = character
    if language is not None:
        updates["language"] = language
    if not updates:
        return None
    result = client.table("children").update(updates).eq("id", child_id).execute()
    return result.data[0] if result.data else None
