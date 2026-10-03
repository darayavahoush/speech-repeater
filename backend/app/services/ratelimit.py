"""
Small in-memory sliding-window rate limiter for the OTP / login endpoints.

State lives in each server process, so with N replicas the effective limit is
up to N x the numbers below. That is fine for stopping a bot from running up
the SMS bill; if it ever needs to be exact, move the counters to Redis/Postgres.
"""
import threading
import time
from collections import defaultdict, deque
from typing import Optional, Tuple

from fastapi import Request
from fastapi.responses import JSONResponse

_lock = threading.Lock()
_hits = defaultdict(deque)
_calls = 0


def client_ip(request: Request) -> str:
    # The last X-Forwarded-For entry is the one added by our own ingress; earlier
    # entries are client-supplied and can be spoofed.
    xff = request.headers.get("x-forwarded-for", "")
    if xff:
        return xff.split(",")[-1].strip() or "unknown"
    return request.client.host if request.client else "unknown"


def _check(key: str, limit: int, window: int) -> int:
    """Record a hit. Returns 0 if allowed, else the seconds until it would be."""
    global _calls
    now = time.monotonic()
    with _lock:
        _calls += 1
        if _calls % 1000 == 0:  # occasional sweep so idle keys don't pile up
            for k in [k for k, q in _hits.items() if not q or now - q[-1] > 86400]:
                del _hits[k]
        q = _hits[key]
        while q and now - q[0] > window:
            q.popleft()
        if len(q) >= limit:
            return int(window - (now - q[0])) + 1
        q.append(now)
        return 0


def _too_many(wait: int) -> JSONResponse:
    mins = max(1, (wait + 59) // 60)
    unit = "minute" if mins == 1 else "minutes"
    return JSONResponse(
        status_code=429,
        content={"success": False, "error": f"Too many attempts. Please try again in {mins} {unit}."},
        headers={"Retry-After": str(wait)},
    )


def enforce(
    request: Request,
    action: str,
    identifier: Optional[str] = None,
    per_ip: Optional[Tuple[int, int]] = None,
    per_id: Optional[Tuple[int, int]] = None,
    per_id_extra: Optional[Tuple[int, int]] = None,
) -> Optional[JSONResponse]:
    """Returns a 429 response if any limit is exceeded, otherwise None.
    Each limit is (max_hits, window_seconds)."""
    checks = []
    if per_ip:
        checks.append((f"{action}:ip:{client_ip(request)}", *per_ip))
    if identifier:
        ident = identifier.strip().lower()
        if per_id:
            checks.append((f"{action}:id:{ident}", *per_id))
        if per_id_extra:
            checks.append((f"{action}:id2:{ident}", *per_id_extra))
    for key, limit, window in checks:
        wait = _check(key, limit, window)
        if wait:
            return _too_many(wait)
    return None
