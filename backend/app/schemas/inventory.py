from uuid import UUID

from app.models.enums import IngredientRarity
from app.schemas.common import TimestampedRead


class IngredientRead(TimestampedRead):
    key: str
    name: str
    rarity: IngredientRarity
    extra: dict


class InventoryItemRead(TimestampedRead):
    player_profile_id: UUID
    ingredient_id: UUID | None
    item_key: str
    quantity: int
    extra: dict
