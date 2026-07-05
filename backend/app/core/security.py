from __future__ import annotations

import base64
import binascii
from datetime import UTC, datetime, timedelta
from functools import lru_cache
import hashlib
import hmac
import json
import logging
import secrets
from typing import Any
from uuid import UUID

from app.core.config import settings
from app.core.errors import AppError


logger = logging.getLogger(__name__)
_DEV_JWT_SECRET = secrets.token_urlsafe(48)


def _base64url_encode(value: bytes) -> str:
    return base64.urlsafe_b64encode(value).rstrip(b"=").decode("ascii")


def _base64url_decode(value: str) -> bytes:
    padding = "=" * (-len(value) % 4)
    return base64.urlsafe_b64decode(value + padding)


@lru_cache(maxsize=1)
def _jwt_secret() -> str:
    if settings.jwt_secret:
        return settings.jwt_secret
    if settings.environment.lower() in {"local", "test"}:
        logger.warning(
            "JWT_SECRET is not configured. Using an ephemeral dev-only secret; "
            "tokens will be invalid after backend restart."
        )
        return _DEV_JWT_SECRET
    raise AppError("AUTH_CONFIGURATION_ERROR", "JWT secret is not configured", status_code=500)


def utc_now() -> datetime:
    return datetime.now(UTC)


def ensure_aware(value: datetime) -> datetime:
    if value.tzinfo is None:
        return value.replace(tzinfo=UTC)
    return value


def hash_password(password: str) -> str:
    salt = secrets.token_urlsafe(24)
    iterations = settings.password_hash_iterations
    digest = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt.encode("utf-8"),
        iterations,
    )
    return f"pbkdf2_sha256${iterations}${salt}${_base64url_encode(digest)}"


def verify_password(password: str, password_hash: str | None) -> bool:
    if not password_hash:
        return False

    try:
        algorithm, iterations_raw, salt, digest = password_hash.split("$", 3)
        iterations = int(iterations_raw)
    except (TypeError, ValueError):
        return False

    if algorithm != "pbkdf2_sha256" or iterations < 1:
        return False

    candidate = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt.encode("utf-8"),
        iterations,
    )
    return hmac.compare_digest(_base64url_encode(candidate), digest)


def create_access_token(user_id: UUID) -> tuple[str, datetime]:
    issued_at = utc_now()
    expires_at = issued_at + timedelta(minutes=settings.access_token_expire_minutes)
    payload: dict[str, Any] = {
        "sub": str(user_id),
        "typ": "access",
        "iat": int(issued_at.timestamp()),
        "exp": int(expires_at.timestamp()),
    }
    return encode_jwt(payload), expires_at


def encode_jwt(payload: dict[str, Any]) -> str:
    header = {"alg": "HS256", "typ": "JWT"}
    header_part = _base64url_encode(
        json.dumps(header, separators=(",", ":"), sort_keys=True).encode("utf-8")
    )
    payload_part = _base64url_encode(
        json.dumps(payload, separators=(",", ":"), sort_keys=True).encode("utf-8")
    )
    signing_input = f"{header_part}.{payload_part}".encode("ascii")
    signature = hmac.new(_jwt_secret().encode("utf-8"), signing_input, hashlib.sha256).digest()
    return f"{header_part}.{payload_part}.{_base64url_encode(signature)}"


def decode_jwt(token: str, expected_type: str = "access") -> dict[str, Any]:
    try:
        header_part, payload_part, signature_part = token.split(".", 2)
        header = json.loads(_base64url_decode(header_part))
        if header != {"alg": "HS256", "typ": "JWT"}:
            raise ValueError("Invalid header")

        signing_input = f"{header_part}.{payload_part}".encode("ascii")
        expected_signature = hmac.new(
            _jwt_secret().encode("utf-8"),
            signing_input,
            hashlib.sha256,
        ).digest()
        if not hmac.compare_digest(_base64url_encode(expected_signature), signature_part):
            raise ValueError("Invalid signature")

        payload = json.loads(_base64url_decode(payload_part))
        if not isinstance(payload, dict):
            raise ValueError("Invalid payload")
        expires_at = datetime.fromtimestamp(int(payload.get("exp", 0)), UTC)
    except (
        binascii.Error,
        json.JSONDecodeError,
        TypeError,
        UnicodeDecodeError,
        ValueError,
    ):
        raise AppError("UNAUTHORIZED", "Invalid authentication token", status_code=401) from None

    if payload.get("typ") != expected_type:
        raise AppError("UNAUTHORIZED", "Invalid authentication token", status_code=401)

    if expires_at <= utc_now():
        raise AppError("UNAUTHORIZED", "Authentication token has expired", status_code=401)

    return payload


def create_refresh_token() -> str:
    return secrets.token_urlsafe(48)


def hash_session_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()
