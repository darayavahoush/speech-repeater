"""
Email verification via a 6-digit one-time code, sent through Gmail SMTP
(free — uses a personal Gmail account + app password, no third-party
email service signup needed).
"""
import random
import httpx
from datetime import datetime, timezone, timedelta
from supabase import create_client
from app.core.config import settings

OTP_EXPIRY_MINUTES = 10

_client = None


def _get_client():
    global _client
    if _client is None:
        _client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)
    return _client


def generate_otp() -> str:
    return f"{random.randint(0, 999999):06d}"


def send_otp_email(to_email: str, name: str, code: str):
    if not settings.RESEND_API_KEY:
        raise RuntimeError("Resend not configured — check RESEND_API_KEY in .env / Space secrets")

    html_body = f"""<p>Hi {name},</p>
<p>Your Vaakify verification code is:</p>
<h2>{code}</h2>
<p>This code expires in {OTP_EXPIRY_MINUTES} minutes. If you didn't request this, you can ignore this email.</p>
<p>— The Vaakify team</p>"""

    resp = httpx.post(
        "https://api.resend.com/emails",
        headers={"Authorization": f"Bearer {settings.RESEND_API_KEY}"},
        json={
            "from": "Vaakify <onboarding@resend.dev>",
            "to": [to_email],
            "subject": "Your Vaakify verification code",
            "html": html_body,
        },
        timeout=10,
    )
    if resp.status_code >= 400:
        raise RuntimeError(f"Resend API error {resp.status_code}: {resp.text}")


def issue_otp(email: str, name: str):
    """Generates a code, stores it with an expiry, and emails it."""
    client = _get_client()
    code = generate_otp()
    expires_at = (datetime.now(timezone.utc) + timedelta(minutes=OTP_EXPIRY_MINUTES)).isoformat()

    client.table("children").update({
        "email_otp": code,
        "email_otp_expires_at": expires_at,
    }).ilike("email", email).execute()

    send_otp_email(email, name, code)


def verify_otp(email: str, code: str) -> tuple[bool, str]:
    """Returns (success, error_message)."""
    client = _get_client()
    result = client.table("children").select("*").ilike("email", email).limit(1).execute()
    if not result.data:
        return False, "No account found with that email."

    account = result.data[0]
    stored_code = account.get("email_otp")
    expires_at = account.get("email_otp_expires_at")

    if not stored_code or not expires_at:
        return False, "No verification code was requested. Please request a new one."

    expiry = datetime.fromisoformat(expires_at.replace("Z", "+00:00"))
    if datetime.now(timezone.utc) > expiry:
        return False, "This code has expired. Please request a new one."

    if code.strip() != stored_code:
        return False, "Incorrect code. Please try again."

    client.table("children").update({
        "email_verified": True,
        "email_otp": None,
        "email_otp_expires_at": None,
    }).eq("id", account["id"]).execute()

    return True, ""
