import base64, hashlib, hmac, json, os, time

TTL_SECONDS = 90 * 24 * 3600  # 90 days


def _key():
    s = os.getenv("SESSION_SECRET")
    return s.encode() if s else None


def _b64(b: bytes) -> str:
    return base64.urlsafe_b64encode(b).rstrip(b"=").decode()


def _unb64(s: str) -> bytes:
    return base64.urlsafe_b64decode(s + "=" * (-len(s) % 4))


def make_session_token(account_id: str):
    key = _key()
    if not key:
        return None  # feature stays off until SESSION_SECRET is set
    payload = _b64(json.dumps({"sub": account_id, "exp": int(time.time()) + TTL_SECONDS}).encode())
    sig = _b64(hmac.new(key, payload.encode(), hashlib.sha256).digest())
    return f"{payload}.{sig}"


def verify_session_token(token: str):
    key = _key()
    if not key or not token or "." not in token:
        return None
    try:
        payload, sig = token.split(".", 1)
        expected = _b64(hmac.new(key, payload.encode(), hashlib.sha256).digest())
        if not hmac.compare_digest(sig, expected):
            return None
        data = json.loads(_unb64(payload))
        return data["sub"] if data["exp"] > time.time() else None
    except Exception:
        return None


def token_expiry(token: str):
    """Expiry (unix seconds) of a validly signed token, else None."""
    if verify_session_token(token) is None:
        return None
    try:
        return int(json.loads(_unb64(token.split(".", 1)[0]))["exp"])
    except Exception:
        return None


# Codes for "add/verify an email on an existing account". Instead of storing a
# pending email in the DB, the 6-digit code is an HMAC of (account, email,
# 10-minute window); a code is accepted for the current and previous window.
EMAIL_CODE_WINDOW = 600


def _email_code(account_id: str, email: str, window: int) -> str:
    key = _key()
    msg = f"email-add|{account_id}|{email.strip().lower()}|{window}".encode()
    digest = hmac.new(key, msg, hashlib.sha256).digest()
    return f"{int.from_bytes(digest[:4], 'big') % 1_000_000:06d}"


def make_email_code(account_id: str, email: str):
    if not _key():
        return None
    return _email_code(account_id, email, int(time.time()) // EMAIL_CODE_WINDOW)


def check_email_code(account_id: str, email: str, code: str) -> bool:
    if not _key() or not code:
        return False
    now_window = int(time.time()) // EMAIL_CODE_WINDOW
    return any(
        hmac.compare_digest(code.strip(), _email_code(account_id, email, w))
        for w in (now_window, now_window - 1)
    )
