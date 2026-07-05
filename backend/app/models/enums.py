from enum import StrEnum


class AssetManifestType(StrEnum):
    ASSET = "asset"
    AUDIO = "audio"


class CollectibleType(StrEnum):
    MEMORY_PAGE = "memory_page"
    RECIPE_CARD = "recipe_card"
    ARTIFACT = "artifact"
    COSMETIC = "cosmetic"


class IngredientRarity(StrEnum):
    COMMON = "common"
    UNCOMMON = "uncommon"
    RARE = "rare"
    LEGENDARY = "legendary"


class QuestStatus(StrEnum):
    NOT_STARTED = "not_started"
    ACTIVE = "active"
    COMPLETED = "completed"
    ABANDONED = "abandoned"


class WeatherType(StrEnum):
    SUNNY = "sunny"
    RAIN = "rain"
    FOG = "fog"
    SNOW = "snow"
    MAGICAL = "magical"
