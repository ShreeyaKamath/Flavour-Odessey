from uuid import UUID

from sqlalchemy import Enum, ForeignKey, Index, Integer, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, GUID, JSONBType, TimestampMixin, UUIDPrimaryKeyMixin
from app.models.enums import IngredientRarity


class Ingredient(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "ingredients"
    __table_args__ = (Index("ix_ingredients_key", "key", unique=True),)

    key: Mapped[str] = mapped_column(String(120), nullable=False)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    rarity: Mapped[IngredientRarity] = mapped_column(
        Enum(IngredientRarity, native_enum=False), default=IngredientRarity.COMMON, nullable=False
    )
    extra: Mapped[dict] = mapped_column(JSONBType, default=dict, nullable=False)


class InventoryItem(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "inventory_items"
    __table_args__ = (
        UniqueConstraint("player_profile_id", "item_key", name="uq_inventory_items_profile_item"),
        Index("ix_inventory_items_player_profile_id", "player_profile_id"),
        Index("ix_inventory_items_ingredient_id", "ingredient_id"),
    )

    player_profile_id: Mapped[UUID] = mapped_column(
        GUID(), ForeignKey("player_profiles.id"), nullable=False
    )
    ingredient_id: Mapped[UUID | None] = mapped_column(
        GUID(), ForeignKey("ingredients.id"), nullable=True
    )
    item_key: Mapped[str] = mapped_column(String(120), nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    extra: Mapped[dict] = mapped_column(JSONBType, default=dict, nullable=False)

    ingredient: Mapped[Ingredient | None] = relationship()
