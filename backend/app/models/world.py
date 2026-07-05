from uuid import UUID

from sqlalchemy import Boolean, Enum, ForeignKey, Index, Integer, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, GUID, JSONBType, TimestampMixin, UUIDPrimaryKeyMixin
from app.models.enums import WeatherType


class Island(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "islands"
    __table_args__ = (Index("ix_islands_key", "key", unique=True),)

    key: Mapped[str] = mapped_column(String(120), nullable=False)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    emotion: Mapped[str] = mapped_column(String(80), nullable=False)
    description: Mapped[str | None] = mapped_column(String(500), nullable=True)
    is_unlocked_by_default: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    extra: Mapped[dict] = mapped_column(JSONBType, default=dict, nullable=False)

    quests: Mapped[list["Quest"]] = relationship(back_populates="island")
    npcs: Mapped[list["NPC"]] = relationship(back_populates="island")


class WorldState(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "world_states"
    __table_args__ = (
        UniqueConstraint("player_profile_id", "island_id", name="uq_world_states_profile_island"),
        Index("ix_world_states_player_profile_id", "player_profile_id"),
    )

    player_profile_id: Mapped[UUID] = mapped_column(
        GUID(), ForeignKey("player_profiles.id"), nullable=False
    )
    island_id: Mapped[UUID] = mapped_column(GUID(), ForeignKey("islands.id"), nullable=False)
    restoration_level: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    unlocked: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    state: Mapped[dict] = mapped_column(JSONBType, default=dict, nullable=False)


class WeatherState(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "weather_states"
    __table_args__ = (
        Index("ix_weather_states_island_id", "island_id"),
        Index("ix_weather_states_player_profile_id", "player_profile_id"),
    )

    island_id: Mapped[UUID | None] = mapped_column(GUID(), ForeignKey("islands.id"), nullable=True)
    player_profile_id: Mapped[UUID | None] = mapped_column(
        GUID(), ForeignKey("player_profiles.id"), nullable=True
    )
    weather_type: Mapped[WeatherType] = mapped_column(
        Enum(WeatherType, native_enum=False), default=WeatherType.SUNNY, nullable=False
    )
    intensity: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    state: Mapped[dict] = mapped_column(JSONBType, default=dict, nullable=False)
