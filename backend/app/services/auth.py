from __future__ import annotations

from dataclasses import dataclass
from datetime import timedelta
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.errors import AppError
from app.core.security import (
    create_access_token,
    create_refresh_token,
    ensure_aware,
    hash_password,
    hash_session_token,
    utc_now,
    verify_password,
)
from app.models import AuthCredential, PlayerProfile, PlayerSettings, SaveSlot, SessionToken, User
from app.schemas.contracts import AuthSessionResponse, AuthUser, RefreshResponse


EMAIL_PROVIDER = "email"
GUEST_PROVIDER = "guest"


@dataclass(frozen=True)
class AuthRateLimitContext:
    key: str
    scope: str


class AuthService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def register(self, email: str, password: str, display_name: str) -> AuthSessionResponse:
        normalized_email = self._normalize_email(email)
        existing = await self._get_email_credential(normalized_email)
        if existing is not None:
            raise AppError("CONFLICT", "An account already exists for this email", status_code=409)

        user = User(
            email=normalized_email,
            display_name=display_name.strip(),
            is_guest=False,
        )
        self.session.add(user)
        await self.session.flush()

        self.session.add(
            AuthCredential(
                user_id=user.id,
                provider=EMAIL_PROVIDER,
                identifier=normalized_email,
                password_hash=hash_password(password),
            )
        )
        await self._bootstrap_user_state(user)
        await self.session.flush()

        response = await self._create_session_response(user)
        await self.session.commit()
        return response

    async def login(self, email: str, password: str) -> AuthSessionResponse:
        credential = await self._get_email_credential(self._normalize_email(email))
        if credential is None or not verify_password(password, credential.password_hash):
            raise AppError("UNAUTHORIZED", "Invalid email or password", status_code=401)

        user = await self.session.get(User, credential.user_id)
        if user is None:
            raise AppError("UNAUTHORIZED", "Invalid email or password", status_code=401)

        response = await self._create_session_response(user)
        await self.session.commit()
        return response

    async def guest_login(self, display_name: str | None = None) -> AuthSessionResponse:
        now_suffix = utc_now().strftime("%Y%m%d%H%M%S")
        name = display_name.strip() if display_name and display_name.strip() else "Guest Keeper"
        user = User(
            email=None,
            display_name=name,
            is_guest=True,
        )
        self.session.add(user)
        await self.session.flush()

        self.session.add(
            AuthCredential(
                user_id=user.id,
                provider=GUEST_PROVIDER,
                identifier=f"guest:{user.id}:{now_suffix}",
            )
        )
        await self._bootstrap_user_state(user)
        await self.session.flush()

        response = await self._create_session_response(user)
        await self.session.commit()
        return response

    async def refresh(self, refresh_token: str) -> RefreshResponse:
        session_token = await self._get_active_session_token(
            refresh_token,
            for_update=True,
        )
        if session_token is None:
            raise AppError("UNAUTHORIZED", "Invalid refresh token", status_code=401)

        user = await self.session.get(User, session_token.user_id)
        if user is None:
            raise AppError("UNAUTHORIZED", "Invalid refresh token", status_code=401)

        session_token.revoked_at = utc_now()
        new_refresh_token = create_refresh_token()
        new_session = self._build_session_token(user.id, new_refresh_token)
        self.session.add(new_session)
        access_token, expires_at = create_access_token(user.id)
        await self.session.commit()

        return RefreshResponse(
            access_token=access_token,
            refresh_token=new_refresh_token,
            expires_at=expires_at,
        )

    async def logout(self, user: User, refresh_token: str | None = None) -> None:
        if refresh_token:
            session_token = await self._get_active_session_token(
                refresh_token,
                user.id,
                for_update=True,
            )
            if session_token is not None:
                session_token.revoked_at = utc_now()
        else:
            statement = select(SessionToken).where(
                SessionToken.user_id == user.id,
                SessionToken.revoked_at.is_(None),
            )
            result = await self.session.execute(statement)
            for session_token in result.scalars().all():
                session_token.revoked_at = utc_now()

        await self.session.commit()

    async def get_user_by_id(self, user_id: UUID) -> User | None:
        return await self.session.get(User, user_id)

    async def _bootstrap_user_state(self, user: User) -> None:
        profile = PlayerProfile(
            user_id=user.id,
            player_name=user.display_name,
            progress={},
        )
        self.session.add(profile)
        await self.session.flush()

        self.session.add_all(
            [
                SaveSlot(
                    player_profile_id=profile.id,
                    slot_number=1,
                    name="Autosave",
                    state={},
                ),
                PlayerSettings(user_id=user.id, settings={}),
            ]
        )

    async def _create_session_response(self, user: User) -> AuthSessionResponse:
        refresh_token = create_refresh_token()
        self.session.add(self._build_session_token(user.id, refresh_token))
        access_token, expires_at = create_access_token(user.id)
        return AuthSessionResponse(
            user_id=user.id,
            access_token=access_token,
            refresh_token=refresh_token,
            expires_at=expires_at,
            user=self._to_auth_user(user),
        )

    def _build_session_token(self, user_id: UUID, refresh_token: str) -> SessionToken:
        from app.core.config import settings

        return SessionToken(
            user_id=user_id,
            token_hash=hash_session_token(refresh_token),
            expires_at=utc_now() + timedelta(days=settings.refresh_token_expire_days),
        )

    async def _get_email_credential(self, email: str) -> AuthCredential | None:
        statement = select(AuthCredential).where(
            AuthCredential.provider == EMAIL_PROVIDER,
            AuthCredential.identifier == email,
        )
        result = await self.session.execute(statement)
        return result.scalar_one_or_none()

    async def _get_active_session_token(
        self,
        refresh_token: str,
        user_id: UUID | None = None,
        for_update: bool = False,
    ) -> SessionToken | None:
        statement = select(SessionToken).where(
            SessionToken.token_hash == hash_session_token(refresh_token),
            SessionToken.revoked_at.is_(None),
        )
        if user_id is not None:
            statement = statement.where(SessionToken.user_id == user_id)
        if for_update:
            statement = statement.with_for_update()

        result = await self.session.execute(statement)
        session_token = result.scalar_one_or_none()
        if session_token is None:
            return None
        if ensure_aware(session_token.expires_at) <= utc_now():
            session_token.revoked_at = utc_now()
            await self.session.flush()
            return None
        return session_token

    @staticmethod
    def _normalize_email(email: str) -> str:
        normalized = email.strip().lower()
        if "@" not in normalized:
            raise AppError("INVALID_INPUT", "A valid email address is required", status_code=422)
        return normalized

    @staticmethod
    def _to_auth_user(user: User) -> AuthUser:
        return AuthUser(
            id=user.id,
            email=user.email,
            display_name=user.display_name,
            is_guest=user.is_guest,
        )
