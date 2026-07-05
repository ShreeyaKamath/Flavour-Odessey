from datetime import datetime
from uuid import UUID

from sqlalchemy import DateTime, ForeignKey, Index, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, GUID, JSONBType, TimestampMixin, UUIDPrimaryKeyMixin


class WorldEvent(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "world_events"
    __table_args__ = (
        Index("ix_world_events_player_profile_id", "player_profile_id"),
        Index("ix_world_events_event_type", "event_type"),
    )

    player_profile_id: Mapped[UUID | None] = mapped_column(
        GUID(), ForeignKey("player_profiles.id"), nullable=True
    )
    event_type: Mapped[str] = mapped_column(String(120), nullable=False)
    payload: Mapped[dict] = mapped_column(JSONBType, default=dict, nullable=False)
    processed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)


class EventLog(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "event_log"
    __table_args__ = (
        Index("ix_event_log_event_type", "event_type"),
        Index("ix_event_log_aggregate", "aggregate_type", "aggregate_id"),
    )

    event_type: Mapped[str] = mapped_column(String(120), nullable=False)
    aggregate_type: Mapped[str | None] = mapped_column(String(120), nullable=True)
    aggregate_id: Mapped[UUID | None] = mapped_column(GUID(), nullable=True)
    payload: Mapped[dict] = mapped_column(JSONBType, default=dict, nullable=False)
    published_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
