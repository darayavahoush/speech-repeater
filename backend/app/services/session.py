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
