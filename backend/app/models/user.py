from datetime import datetime
from uuid import UUID

from sqlalchemy import Boolean, DateTime, ForeignKey, Index, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, GUID, JSONBType, TimestampMixin, UUIDPrimaryKeyMixin


class User(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "users"

    email: Mapped[str | None] = mapped_column(String(320), unique=True, nullable=True)
    display_name: Mapped[str] = mapped_column(String(120), nullable=False)
    is_guest: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    credentials: Mapped[list["AuthCredential"]] = relationship(back_populates="user")
    profiles: Mapped[list["PlayerProfile"]] = relationship(back_populates="user")
    session_tokens: Mapped[list["SessionToken"]] = relationship(back_populates="user")
    settings: Mapped["PlayerSettings | None"] = relationship(back_populates="user")


class AuthCredential(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "auth_credentials"
    __table_args__ = (
        Index("ix_auth_credentials_user_provider", "user_id", "provider"),
        Index("ix_auth_credentials_provider_identifier", "provider", "identifier", unique=True),
    )

    user_id: Mapped[UUID] = mapped_column(GUID(), ForeignKey("users.id"), nullable=False)
    provider: Mapped[str] = mapped_column(String(50), nullable=False)
    identifier: Mapped[str] = mapped_column(String(320), nullable=False)
    password_hash: Mapped[str | None] = mapped_column(String(255), nullable=True)
    extra: Mapped[dict] = mapped_column(JSONBType, default=dict, nullable=False)

    user: Mapped[User] = relationship(back_populates="credentials")


class SessionToken(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "session_tokens"
    __table_args__ = (
        Index("ix_session_tokens_user_id", "user_id"),
        Index("ix_session_tokens_token_hash", "token_hash", unique=True),
    )

    user_id: Mapped[UUID] = mapped_column(GUID(), ForeignKey("users.id"), nullable=False)
    token_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    revoked_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    user: Mapped[User] = relationship(back_populates="session_tokens")
