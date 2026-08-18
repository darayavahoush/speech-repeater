"""
Email verification via a 6-digit one-time code, sent through Gmail SMTP.
"""
import random
import smtplib
from email.mime.text import MIMEText
from datetime import datetime, timezone, timedelta
from sqlalchemy import func
from app.core.config import settings
from app.core.database import get_session
from app.core.models import Child

OTP_EXPIRY_MINUTES = 10


def generate_otp() -> str:
    return f"{random.randint(0, 999999):06d}"


def send_otp_email(to_email: str, name: str, code: str):
    if not settings.GMAIL_ADDRESS or not settings.GMAIL_APP_PASSWORD:
        raise RuntimeError("Gmail credentials not configured — check GMAIL_ADDRESS and GMAIL_APP_PASSWORD in .env")

    subject = "Your Vaakify verification code"
    body = f"""Hi {name},

Your Vaakify verification code is:

{code}

This code expires in {OTP_EXPIRY_MINUTES} minutes. If you didn't request this, you can ignore this email.

— The Vaakify team
"""
    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = settings.GMAIL_ADDRESS
    msg["To"] = to_email

    with smtplib.SMTP("smtp.gmail.com", 587, timeout=10) as server:
        server.starttls()
        server.login(settings.GMAIL_ADDRESS, settings.GMAIL_APP_PASSWORD)
        server.send_message(msg)


def issue_otp(email: str, name: str):
    code = generate_otp()
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=OTP_EXPIRY_MINUTES)

    with get_session() as session:
        child = session.query(Child).filter(func.lower(Child.email) == email.lower()).first()
        if child:
            child.email_otp = code
            child.email_otp_expires_at = expires_at
            session.commit()

    send_otp_email(email, name, code)


def verify_otp(email: str, code: str) -> tuple[bool, str]:
    with get_session() as session:
        child = session.query(Child).filter(func.lower(Child.email) == email.lower()).first()
        if not child:
            return False, "No account found with that email."

        stored_code = child.email_otp
        expires_at = child.email_otp_expires_at

        if not stored_code or not expires_at:
            return False, "No verification code was requested. Please request a new one."

        expiry = expires_at if expires_at.tzinfo else expires_at.replace(tzinfo=timezone.utc)
        if datetime.now(timezone.utc) > expiry:
            return False, "This code has expired. Please request a new one."

        if code.strip() != stored_code:
            return False, "Incorrect code. Please try again."

        child.email_verified = True
        child.email_otp = None
        child.email_otp_expires_at = None
        session.commit()

        return True, ""
