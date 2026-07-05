from uuid import UUID

from sqlalchemy import ForeignKey, Index, Integer, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, GUID, JSONBType, TimestampMixin, UUIDPrimaryKeyMixin


class PlayerProfile(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "player_profiles"
    __table_args__ = (Index("ix_player_profiles_user_id", "user_id"),)

    user_id: Mapped[UUID] = mapped_column(GUID(), ForeignKey("users.id"), nullable=False)
    player_name: Mapped[str] = mapped_column(String(120), nullable=False)
    current_island_id: Mapped[UUID | None] = mapped_column(
        GUID(), ForeignKey("islands.id"), nullable=True
    )
    progress: Mapped[dict] = mapped_column(JSONBType, default=dict, nullable=False)

    user: Mapped["User"] = relationship(back_populates="profiles")
    current_island: Mapped["Island | None"] = relationship()
    save_slots: Mapped[list["SaveSlot"]] = relationship(back_populates="player_profile")
    companion_state: Mapped["CompanionState | None"] = relationship(back_populates="player_profile")


class SaveSlot(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "save_slots"
    __table_args__ = (
        UniqueConstraint("player_profile_id", "slot_number", name="uq_save_slots_profile_slot"),
        Index("ix_save_slots_player_profile_id", "player_profile_id"),
    )

    player_profile_id: Mapped[UUID] = mapped_column(
        GUID(), ForeignKey("player_profiles.id"), nullable=False
    )
    slot_number: Mapped[int] = mapped_column(Integer, nullable=False)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    state: Mapped[dict] = mapped_column(JSONBType, default=dict, nullable=False)

    player_profile: Mapped[PlayerProfile] = relationship(back_populates="save_slots")


class PlayerSettings(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "player_settings"
    __table_args__ = (Index("ix_player_settings_user_id", "user_id", unique=True),)

    user_id: Mapped[UUID] = mapped_column(GUID(), ForeignKey("users.id"), nullable=False)
    settings: Mapped[dict] = mapped_column(JSONBType, default=dict, nullable=False)

    user: Mapped["User"] = relationship(back_populates="settings")


class CompanionState(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "companion_states"
    __table_args__ = (Index("ix_companion_states_player_profile_id", "player_profile_id", unique=True),)

    player_profile_id: Mapped[UUID] = mapped_column(
        GUID(), ForeignKey("player_profiles.id"), nullable=False
    )
    companion_key: Mapped[str] = mapped_column(String(120), nullable=False)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    state: Mapped[dict] = mapped_column(JSONBType, default=dict, nullable=False)

    player_profile: Mapped[PlayerProfile] = relationship(back_populates="companion_state")
