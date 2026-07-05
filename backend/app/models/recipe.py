from uuid import UUID

from sqlalchemy import ForeignKey, Index, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, GUID, JSONBType, TimestampMixin, UUIDPrimaryKeyMixin


class Recipe(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "recipes"
    __table_args__ = (
        Index("ix_recipes_player_profile_id", "player_profile_id"),
        Index("ix_recipes_key", "key"),
    )

    player_profile_id: Mapped[UUID | None] = mapped_column(
        GUID(), ForeignKey("player_profiles.id"), nullable=True
    )
    key: Mapped[str | None] = mapped_column(String(120), nullable=True)
    name: Mapped[str] = mapped_column(String(180), nullable=False)
    emotion: Mapped[str] = mapped_column(String(80), nullable=False)
    ingredients: Mapped[dict] = mapped_column(JSONBType, default=dict, nullable=False)
    lore: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    ability: Mapped[str | None] = mapped_column(String(120), nullable=True)
    extra: Mapped[dict] = mapped_column(JSONBType, default=dict, nullable=False)
