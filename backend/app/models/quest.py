from uuid import UUID

from sqlalchemy import Enum, ForeignKey, Index, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, GUID, JSONBType, TimestampMixin, UUIDPrimaryKeyMixin
from app.models.enums import QuestStatus


class Quest(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "quests"
    __table_args__ = (Index("ix_quests_key", "key", unique=True), Index("ix_quests_island_id", "island_id"))

    key: Mapped[str] = mapped_column(String(120), nullable=False)
    title: Mapped[str] = mapped_column(String(180), nullable=False)
    description: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    island_id: Mapped[UUID | None] = mapped_column(GUID(), ForeignKey("islands.id"), nullable=True)
    reward: Mapped[dict] = mapped_column(JSONBType, default=dict, nullable=False)
    requirements: Mapped[dict] = mapped_column(JSONBType, default=dict, nullable=False)

    island: Mapped["Island | None"] = relationship(back_populates="quests")
    progress_records: Mapped[list["QuestProgress"]] = relationship(back_populates="quest")


class QuestProgress(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "quest_progress"
    __table_args__ = (
        UniqueConstraint("player_profile_id", "quest_id", name="uq_quest_progress_profile_quest"),
        Index("ix_quest_progress_player_profile_id", "player_profile_id"),
        Index("ix_quest_progress_status", "status"),
    )

    player_profile_id: Mapped[UUID] = mapped_column(
        GUID(), ForeignKey("player_profiles.id"), nullable=False
    )
    quest_id: Mapped[UUID] = mapped_column(GUID(), ForeignKey("quests.id"), nullable=False)
    status: Mapped[QuestStatus] = mapped_column(
        Enum(QuestStatus, native_enum=False), default=QuestStatus.NOT_STARTED, nullable=False
    )
    progress: Mapped[dict] = mapped_column(JSONBType, default=dict, nullable=False)
    evidence: Mapped[dict] = mapped_column(JSONBType, default=dict, nullable=False)

    quest: Mapped[Quest] = relationship(back_populates="progress_records")
