from uuid import UUID

from sqlalchemy import ForeignKey, Index, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, GUID, JSONBType, TimestampMixin, UUIDPrimaryKeyMixin


class JournalEntry(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "journal_entries"
    __table_args__ = (
        Index("ix_journal_entries_player_profile_id", "player_profile_id"),
        Index("ix_journal_entries_island_id", "island_id"),
    )

    player_profile_id: Mapped[UUID] = mapped_column(
        GUID(), ForeignKey("player_profiles.id"), nullable=False
    )
    island_id: Mapped[UUID | None] = mapped_column(GUID(), ForeignKey("islands.id"), nullable=True)
    recipe_id: Mapped[UUID | None] = mapped_column(GUID(), ForeignKey("recipes.id"), nullable=True)
    title: Mapped[str] = mapped_column(String(180), nullable=False)
    emotion: Mapped[str | None] = mapped_column(String(80), nullable=True)
    story: Mapped[str] = mapped_column(String(2000), nullable=False)
    artwork_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    extra: Mapped[dict] = mapped_column(JSONBType, default=dict, nullable=False)
