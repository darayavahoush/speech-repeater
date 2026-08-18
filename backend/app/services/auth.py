"""
Email + password authentication, backed by local PostgreSQL (via SQLAlchemy).
Mobile number is collected but NOT verified (no SMS/OTP provider configured
yet) — it's a placeholder field for future OTP integration.
"""
import re
import bcrypt
from datetime import datetime, timezone
from sqlalchemy import func
from app.core.database import get_session
from app.core.models import Child, PracticeAttempt

TRIAL_DURATION_DAYS = 7


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, password_hash: str) -> bool:
    return bcrypt.checkpw(password.encode("utf-8"), password_hash.encode("utf-8"))


def is_valid_email(email: str) -> bool:
    return bool(re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", email))


def get_account_by_email(email: str):
    with get_session() as session:
        child = session.query(Child).filter(func.lower(Child.email) == email.lower()).first()
        return child.to_dict() if child else None


def get_account_by_mobile(mobile: str):
    with get_session() as session:
        child = session.query(Child).filter(Child.mobile == mobile).first()
        return child.to_dict() if child else None


def create_account(name: str, email: str, password: str, mobile: str = None):
    password_hash = hash_password(password)
    now = datetime.now(timezone.utc)
    with get_session() as session:
        child = Child(
            name=name,
            email=email,
            mobile=mobile,
            password_hash=password_hash,
            trial_started_at=now,
            subscription_status="trial",
            character=None,
            language=None,
        )
        session.add(child)
        session.commit()
        session.refresh(child)
        return child.to_dict()


def update_account_profile(account_id: str, character: str = None, language: str = None):
    with get_session() as session:
        child = session.query(Child).filter(Child.id == account_id).first()
        if not child:
            return None
        if character is not None:
            child.character = character
        if language is not None:
            child.language = language
        session.commit()
        session.refresh(child)
        return child.to_dict()


def get_trial_status(account: dict) -> dict:
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


def change_email(account_id: str, new_email: str, password: str):
    """Returns (success, error_message, updated_account_dict|None).
    Requires the current password. Marks the account unverified so the
    existing OTP flow can re-confirm the new address."""
    new_email = new_email.strip().lower()
    if not is_valid_email(new_email):
        return False, "Please enter a valid email address.", None

    with get_session() as session:
        child = session.query(Child).filter(Child.id == account_id).first()
        if not child:
            return False, "Account not found.", None
        if not verify_password(password, child.password_hash):
            return False, "Incorrect password.", None

        existing = (
            session.query(Child)
            .filter(func.lower(Child.email) == new_email, Child.id != account_id)
            .first()
        )
        if existing:
            return False, "That email is already in use.", None

        child.email = new_email
        child.email_verified = False
        session.commit()
        session.refresh(child)
        return True, "", child.to_dict()


def delete_account(account_id: str, password: str):
    """Returns (success, error_message). Hard-deletes the account and all
    of its practice history."""
    with get_session() as session:
        child = session.query(Child).filter(Child.id == account_id).first()
        if not child:
            return False, "Account not found."
        if not verify_password(password, child.password_hash):
            return False, "Incorrect password."

        session.query(PracticeAttempt).filter(PracticeAttempt.child_id == account_id).delete()
        session.delete(child)
        session.commit()
        return True, ""
