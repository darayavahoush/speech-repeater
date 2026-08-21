"""
SQLAlchemy models mirroring the previous Supabase tables:
`children` and `practice_attempts`.
"""
import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Boolean, DateTime, Float, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.core.database import Base


def _now():
    return datetime.now(timezone.utc)


class Child(Base):
    __tablename__ = "children"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False, unique=True)
    # Nullable now: a phone-only signup has no email, and a Google signup
    # never sets a password. Application logic (auth.py) still enforces
    # "email + password" OR "google_id" OR "verified mobile" so every
    # account has at least one way to sign back in.
    email = Column(String, nullable=True, unique=True)
    mobile = Column(String, nullable=True, unique=True)
    password_hash = Column(String, nullable=True)
    mobile_verified = Column(Boolean, default=False)
    google_id = Column(String, nullable=True, unique=True)

    character = Column(String, nullable=True)
    language = Column(String, nullable=True)

    trial_started_at = Column(DateTime(timezone=True), default=_now)
    subscription_status = Column(String, default="trial")

    email_verified = Column(Boolean, default=False)
    email_otp = Column(String, nullable=True)
    email_otp_expires_at = Column(DateTime(timezone=True), nullable=True)

    created_at = Column(DateTime(timezone=True), default=_now)

    attempts = relationship("PracticeAttempt", back_populates="child")

    def to_dict(self):
        return {
            "id": str(self.id),
            "name": self.name,
            "email": self.email,
            "mobile": self.mobile,
            "password_hash": self.password_hash,
            "character": self.character,
            "language": self.language,
            "trial_started_at": self.trial_started_at.isoformat() if self.trial_started_at else None,
            "subscription_status": self.subscription_status,
            "email_verified": self.email_verified,
            "email_otp": self.email_otp,
            "email_otp_expires_at": self.email_otp_expires_at.isoformat() if self.email_otp_expires_at else None,
            "mobile_verified": self.mobile_verified,
            "google_id": self.google_id,
        }


class PracticeAttempt(Base):
    __tablename__ = "practice_attempts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    child_id = Column(UUID(as_uuid=True), ForeignKey("children.id"), nullable=False)
    word = Column(String, nullable=False)
    language = Column(String, nullable=False)
    character = Column(String, nullable=True)
    success = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), default=_now)

    child = relationship("Child", back_populates="attempts")

    def to_dict(self):
        return {
            "id": str(self.id),
            "child_id": str(self.child_id),
            "word": self.word,
            "language": self.language,
            "character": self.character,
            "success": self.success,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
