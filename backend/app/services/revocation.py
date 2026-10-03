"""
Server-side logout. Session tokens are stateless signed strings, so logging out
records a hash of the token in `revoked_sessions` until it would have expired
anyway. Both calls are best-effort: if the table isn't there yet (migration not
run) revoke() returns False and is_revoked() returns False, i.e. logout still
clears the device but the token isn't blocked server-side.
"""
import hashlib
from datetime import datetime, timezone

from app.core.database import get_session
from app.core.models import RevokedSession
from app.services.session import token_expiry


def _hash(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()


def revoke(token: str) -> bool:
    exp = token_expiry(token)
    if not exp:
        return False
    now = datetime.now(timezone.utc)
    try:
        with get_session() as session:
            session.query(RevokedSession).filter(RevokedSession.expires_at < now).delete()
            if not session.query(RevokedSession).filter(RevokedSession.token_hash == _hash(token)).first():
                session.add(RevokedSession(token_hash=_hash(token), expires_at=datetime.fromtimestamp(exp, timezone.utc)))
            session.commit()
        return True
    except Exception as e:
        print(f"Session revoke error: {e}")
        return False


def is_revoked(token: str) -> bool:
    try:
        with get_session() as session:
            return session.query(RevokedSession).filter(RevokedSession.token_hash == _hash(token)).first() is not None
    except Exception as e:
        print(f"Session revoke check error: {e}")
        return False
