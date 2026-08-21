"""
Verifies the Google Sign-In ID token the frontend gets back from
@react-oauth/google (a One Tap / button credential response), using
Google's own client library — never trust an unverified token.
"""
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from app.core.config import settings

_VALID_ISSUERS = ("accounts.google.com", "https://accounts.google.com")


def verify_google_token(credential: str) -> dict:
    """Returns {"google_id", "email", "email_verified", "name"} or raises."""
    if not settings.GOOGLE_CLIENT_ID:
        raise RuntimeError("Google sign-in isn't configured — set GOOGLE_CLIENT_ID in .env")

    idinfo = id_token.verify_oauth2_token(
        credential, google_requests.Request(), settings.GOOGLE_CLIENT_ID
    )

    if idinfo.get("iss") not in _VALID_ISSUERS:
        raise ValueError("Invalid token issuer.")

    email = (idinfo.get("email") or "").strip().lower()
    if not email:
        raise ValueError("Google account has no email on file.")

    name = idinfo.get("name") or idinfo.get("given_name") or email.split("@")[0]

    return {
        "google_id": idinfo["sub"],
        "email": email,
        "email_verified": bool(idinfo.get("email_verified", False)),
        "name": name,
    }
