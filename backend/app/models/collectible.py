from uuid import UUID

from sqlalchemy import Enum, ForeignKey, Index, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, GUID, JSONBType, TimestampMixin, UUIDPrimaryKeyMixin
from app.models.enums import CollectibleType


class Collectible(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "collectibles"
    __table_args__ = (Index("ix_collectibles_key", "key", unique=True),)

    key: Mapped[str] = mapped_column(String(120), nullable=False)
    name: Mapped[str] = mapped_column(String(180), nullable=False)
    collectible_type: Mapped[CollectibleType] = mapped_column(
        Enum(CollectibleType, native_enum=False), nullable=False
    )
    extra: Mapped[dict] = mapped_column(JSONBType, default=dict, nullable=False)


class PlayerCollectible(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "player_collectibles"
    __table_args__ = (
        UniqueConstraint("player_profile_id", "collectible_id", name="uq_player_collectibles_profile_collectible"),
        Index("ix_player_collectibles_player_profile_id", "player_profile_id"),
    )

    player_profile_id: Mapped[UUID] = mapped_column(
        GUID(), ForeignKey("player_profiles.id"), nullable=False
    )
    collectible_id: Mapped[UUID] = mapped_column(GUID(), ForeignKey("collectibles.id"), nullable=False)
    state: Mapped[dict] = mapped_column(JSONBType, default=dict, nullable=False)
