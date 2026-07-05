from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends

from app.api.dependencies import (
    get_auth_rate_limit_context,
    get_auth_service,
    get_current_user,
)
from app.models import User
from app.schemas.contracts import (
    AuthSessionResponse,
    ErrorResponse,
    GuestLoginRequest,
    LoginRequest,
    LogoutRequest,
    LogoutResponse,
    MeResponse,
    RefreshRequest,
    RefreshResponse,
    RegisterRequest,
)
from app.services.auth import AuthRateLimitContext, AuthService


router = APIRouter(prefix="/api/auth", tags=["auth"])

VALIDATION_RESPONSE = {422: {"model": ErrorResponse}}
AUTHENTICATION_RESPONSES = {
    401: {"model": ErrorResponse},
    422: {"model": ErrorResponse},
}


@router.post(
    "/register",
    operation_id="auth_register",
    response_model=AuthSessionResponse,
    responses={
        409: {"model": ErrorResponse},
        422: {"model": ErrorResponse},
    },
)
async def register(
    payload: RegisterRequest,
    auth_service: Annotated[AuthService, Depends(get_auth_service)],
    _rate_limit: Annotated[AuthRateLimitContext, Depends(get_auth_rate_limit_context)],
) -> AuthSessionResponse:
    return await auth_service.register(payload.email, payload.password, payload.display_name)


@router.post(
    "/login",
    operation_id="auth_login",
    response_model=AuthSessionResponse,
    responses=AUTHENTICATION_RESPONSES,
)
async def login(
    payload: LoginRequest,
    auth_service: Annotated[AuthService, Depends(get_auth_service)],
    _rate_limit: Annotated[AuthRateLimitContext, Depends(get_auth_rate_limit_context)],
) -> AuthSessionResponse:
    return await auth_service.login(payload.email, payload.password)


@router.post(
    "/guest",
    operation_id="auth_guest",
    response_model=AuthSessionResponse,
    responses=VALIDATION_RESPONSE,
)
async def guest_login(
    payload: GuestLoginRequest,
    auth_service: Annotated[AuthService, Depends(get_auth_service)],
    _rate_limit: Annotated[AuthRateLimitContext, Depends(get_auth_rate_limit_context)],
) -> AuthSessionResponse:
    return await auth_service.guest_login(payload.display_name)


@router.post(
    "/refresh",
    operation_id="auth_refresh",
    response_model=RefreshResponse,
    responses=AUTHENTICATION_RESPONSES,
)
async def refresh(
    payload: RefreshRequest,
    auth_service: Annotated[AuthService, Depends(get_auth_service)],
    _rate_limit: Annotated[AuthRateLimitContext, Depends(get_auth_rate_limit_context)],
) -> RefreshResponse:
    return await auth_service.refresh(payload.refresh_token)


@router.post(
    "/logout",
    operation_id="auth_logout",
    response_model=LogoutResponse,
    responses=AUTHENTICATION_RESPONSES,
)
async def logout(
    current_user: Annotated[User, Depends(get_current_user)],
    auth_service: Annotated[AuthService, Depends(get_auth_service)],
    payload: LogoutRequest | None = None,
) -> LogoutResponse:
    await auth_service.logout(current_user, payload.refresh_token if payload else None)
    return LogoutResponse(logged_out=True)


@router.get(
    "/me",
    operation_id="auth_me",
    response_model=MeResponse,
    responses={401: {"model": ErrorResponse}},
)
async def me(current_user: Annotated[User, Depends(get_current_user)]) -> MeResponse:
    return MeResponse(user=AuthService._to_auth_user(current_user))
