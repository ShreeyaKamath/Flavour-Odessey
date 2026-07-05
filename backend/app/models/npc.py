from uuid import UUID

from sqlalchemy import ForeignKey, Index, Integer, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, GUID, JSONBType, TimestampMixin, UUIDPrimaryKeyMixin


class NPC(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "npcs"
    __table_args__ = (Index("ix_npcs_key", "key", unique=True), Index("ix_npcs_island_id", "island_id"))

    key: Mapped[str] = mapped_column(String(120), nullable=False)
    island_id: Mapped[UUID | None] = mapped_column(GUID(), ForeignKey("islands.id"), nullable=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    role: Mapped[str] = mapped_column(String(120), nullable=False)
    profile: Mapped[dict] = mapped_column(JSONBType, default=dict, nullable=False)

    island: Mapped["Island | None"] = relationship(back_populates="npcs")
    memories: Mapped[list["NPCMemory"]] = relationship(back_populates="npc")


class NPCRelationship(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "npc_relationships"
    __table_args__ = (
        UniqueConstraint("player_profile_id", "npc_id", name="uq_npc_relationships_profile_npc"),
        Index("ix_npc_relationships_player_profile_id", "player_profile_id"),
    )

    player_profile_id: Mapped[UUID] = mapped_column(
        GUID(), ForeignKey("player_profiles.id"), nullable=False
    )
    npc_id: Mapped[UUID] = mapped_column(GUID(), ForeignKey("npcs.id"), nullable=False)
    friendship: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    trust: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    state: Mapped[dict] = mapped_column(JSONBType, default=dict, nullable=False)


class NPCMemory(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "npc_memories"
    __table_args__ = (
        Index("ix_npc_memories_player_npc", "player_profile_id", "npc_id"),
        Index("ix_npc_memories_importance", "importance"),
    )

    player_profile_id: Mapped[UUID] = mapped_column(
        GUID(), ForeignKey("player_profiles.id"), nullable=False
    )
    npc_id: Mapped[UUID] = mapped_column(GUID(), ForeignKey("npcs.id"), nullable=False)
    memory_type: Mapped[str] = mapped_column(String(80), nullable=False)
    content: Mapped[str] = mapped_column(String(2000), nullable=False)
    importance: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    extra: Mapped[dict] = mapped_column(JSONBType, default=dict, nullable=False)

    npc: Mapped[NPC] = relationship(back_populates="memories")
