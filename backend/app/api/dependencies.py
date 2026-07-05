from __future__ import annotations

from typing import Annotated
from uuid import UUID

from fastapi import Depends, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.errors import AppError
from app.core.security import decode_jwt
from app.db.session import get_async_session
from app.models import User
from app.services.auth import AuthRateLimitContext, AuthService


bearer_scheme = HTTPBearer(auto_error=False)


def get_auth_rate_limit_context(request: Request) -> AuthRateLimitContext:
    forwarded_for = request.headers.get("x-forwarded-for")
    client_host = forwarded_for.split(",", 1)[0].strip() if forwarded_for else None
    client_host = client_host or (request.client.host if request.client else "unknown")
    return AuthRateLimitContext(key=client_host, scope="auth")


def get_auth_service(
    session: Annotated[AsyncSession, Depends(get_async_session)],
) -> AuthService:
    return AuthService(session)


async def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer_scheme)],
    auth_service: Annotated[AuthService, Depends(get_auth_service)],
) -> User:
    if credentials is None:
        raise AppError("UNAUTHORIZED", "Authentication is required", status_code=401)

    payload = decode_jwt(credentials.credentials)
    user_id_raw = payload.get("sub")
    try:
        user_id = UUID(str(user_id_raw))
    except ValueError:
        raise AppError("UNAUTHORIZED", "Invalid authentication token", status_code=401) from None

    user = await auth_service.get_user_by_id(user_id)
    if user is None:
        raise AppError("UNAUTHORIZED", "Invalid authentication token", status_code=401)

    return user
