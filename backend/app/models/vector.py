from uuid import UUID

from sqlalchemy import ForeignKey, Index, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, GUID, JSONBType, TimestampMixin, UUIDPrimaryKeyMixin


class VectorMemory(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    """pgvector-ready placeholder.

    The embedding is JSONB for Phase 4 so migrations do not require the pgvector
    extension yet. A later AI phase can replace this with a vector column.
    """

    __tablename__ = "vector_memory_entries"
    __table_args__ = (
        Index("ix_vector_memory_entries_player_profile_id", "player_profile_id"),
        Index("ix_vector_memory_entries_source", "source_type", "source_id"),
    )

    player_profile_id: Mapped[UUID | None] = mapped_column(
        GUID(), ForeignKey("player_profiles.id"), nullable=True
    )
    npc_id: Mapped[UUID | None] = mapped_column(GUID(), ForeignKey("npcs.id"), nullable=True)
    source_type: Mapped[str] = mapped_column(String(120), nullable=False)
    source_id: Mapped[UUID | None] = mapped_column(GUID(), nullable=True)
    content: Mapped[str] = mapped_column(String(4000), nullable=False)
    embedding: Mapped[dict] = mapped_column(JSONBType, default=dict, nullable=False)
    extra: Mapped[dict] = mapped_column(JSONBType, default=dict, nullable=False)
