"""
Phone number verification via Twilio Verify. Twilio's Verify service owns
OTP generation, delivery, expiry, and attempt-limiting itself, so unlike
email_otp.py there's no code/expiry to store on the Child row — only the
end result (mobile_verified) matters to us.
"""
from twilio.rest import Client
from twilio.base.exceptions import TwilioRestException
from app.core.config import settings


def _client() -> Client:
    if not settings.TWILIO_ACCOUNT_SID or not settings.TWILIO_AUTH_TOKEN:
        raise RuntimeError(
            "Twilio credentials not configured — check TWILIO_ACCOUNT_SID and "
            "TWILIO_AUTH_TOKEN in .env"
        )
    return Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)


def _service_sid() -> str:
    if not settings.TWILIO_VERIFY_SERVICE_SID:
        raise RuntimeError("TWILIO_VERIFY_SERVICE_SID not configured — create a Verify service in the Twilio console")
    return settings.TWILIO_VERIFY_SERVICE_SID


def send_phone_otp(mobile: str) -> None:
    """Kicks off an SMS OTP to `mobile` (E.164 format, e.g. +919876543210)."""
    client = _client()
    try:
        client.verify.v2.services(_service_sid()).verifications.create(to=mobile, channel="sms")
    except TwilioRestException as e:
        # Twilio's error messages are safe to surface (e.g. "invalid number")
        raise RuntimeError(e.msg or "Could not send the verification code.")


def check_phone_otp(mobile: str, code: str) -> bool:
    """Returns True only if Twilio reports the code as approved."""
    client = _client()
    try:
        result = client.verify.v2.services(_service_sid()).verification_checks.create(to=mobile, code=code)
    except TwilioRestException as e:
        # Twilio raises (rather than returning "denied") for a few cases,
        # e.g. checking a number with no pending verification.
        if e.status == 404:
            return False
        raise RuntimeError(e.msg or "Could not verify the code.")
    return result.status == "approved"
