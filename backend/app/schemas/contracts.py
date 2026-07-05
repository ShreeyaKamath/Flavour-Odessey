from datetime import datetime
from enum import StrEnum
from typing import Any, Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


JsonObject = dict[str, Any]


class ContractModel(BaseModel):
    model_config = ConfigDict(extra="forbid")


class HealthResponse(ContractModel):
    status: Literal["ok"]
    service: Literal["flavor-odyssey-backend"]


class ErrorCode(StrEnum):
    auth_configuration_error = "AUTH_CONFIGURATION_ERROR"
    invalid_input = "INVALID_INPUT"
    http_error = "HTTP_ERROR"
    not_found = "NOT_FOUND"
    conflict = "CONFLICT"
    unauthorized = "UNAUTHORIZED"
    forbidden = "FORBIDDEN"
    internal_error = "INTERNAL_ERROR"


class ErrorDetail(ContractModel):
    code: ErrorCode | str
    message: str


class ErrorResponse(ContractModel):
    error: ErrorDetail


class PaginationParams(ContractModel):
    limit: int = Field(default=20, ge=1, le=100)
    offset: int = Field(default=0, ge=0)


class PaginationMeta(ContractModel):
    limit: int = Field(ge=1)
    offset: int = Field(ge=0)
    total: int = Field(ge=0)
    has_more: bool


class EventType(StrEnum):
    player_logged_in = "PlayerLoggedIn"
    quest_started = "QuestStarted"
    quest_progress_updated = "QuestProgressUpdated"
    quest_completed = "QuestCompleted"
    ingredient_collected = "IngredientCollected"
    recipe_crafted = "RecipeCrafted"
    emotion_restored = "EmotionRestored"
    island_unlocked = "IslandUnlocked"
    npc_friendship_changed = "NPCFriendshipChanged"
    npc_memory_written = "NPCMemoryWritten"
    weather_changed = "WeatherChanged"
    journal_updated = "JournalUpdated"
    companion_reacted = "CompanionReacted"
    companion_evolved = "CompanionEvolved"
    settings_updated = "SettingsUpdated"
    save_completed = "SaveCompleted"


class GameEvent(ContractModel):
    type: EventType
    payload: JsonObject = Field(default_factory=dict)
    event_id: UUID | None = None
    occurred_at: datetime | None = None


class RegisterRequest(ContractModel):
    email: str = Field(min_length=3, max_length=320)
    password: str = Field(min_length=8, max_length=256)
    display_name: str = Field(min_length=1, max_length=120)


class LoginRequest(ContractModel):
    email: str = Field(min_length=3, max_length=320)
    password: str = Field(min_length=1, max_length=256)


class GuestLoginRequest(ContractModel):
    display_name: str | None = Field(default=None, max_length=120)


class RefreshRequest(ContractModel):
    refresh_token: str = Field(min_length=32)


class LogoutRequest(ContractModel):
    refresh_token: str | None = Field(default=None, min_length=32)


class AuthUser(ContractModel):
    id: UUID
    email: str | None
    display_name: str
    is_guest: bool


class AuthSessionResponse(ContractModel):
    user_id: UUID
    access_token: str
    refresh_token: str
    token_type: Literal["bearer"] = "bearer"
    expires_at: datetime
    user: AuthUser


class RefreshResponse(ContractModel):
    access_token: str
    refresh_token: str
    token_type: Literal["bearer"] = "bearer"
    expires_at: datetime


class LogoutResponse(ContractModel):
    logged_out: bool


class MeResponse(ContractModel):
    user: AuthUser


class PlayerProfileResponse(ContractModel):
    id: UUID
    player_name: str
    current_island: str
    companion: JsonObject = Field(default_factory=dict)


class PlayerProfileUpdateRequest(ContractModel):
    player_name: str | None = None
    current_island: str | None = None


class WorldMapPosition(ContractModel):
    x: int
    y: int


class LandmarkResponse(ContractModel):
    key: str
    name: str
    description: str


class AmbientMetadata(ContractModel):
    description: str
    palette: list[str]
    sounds: list[str]


class ManifestReference(ContractModel):
    key: str
    manifest_type: Literal["asset", "audio"]
    path: str


class IslandSummary(ContractModel):
    id: UUID
    key: str
    name: str
    emotion: str
    description: str
    unlocked: bool
    availability: Literal["playable", "coming_in_version_1"]
    restoration_level: int = Field(ge=0, le=100)
    restoration_state: Literal["unrestored", "restoring", "restored"]
    map_order: int = Field(ge=0)
    map_position: WorldMapPosition
    landmarks: list[LandmarkResponse]
    ambient: AmbientMetadata
    manifests: list[ManifestReference]


class IslandsResponse(ContractModel):
    items: list[IslandSummary]


class WeatherStateResponse(ContractModel):
    id: UUID
    island_id: UUID
    island_key: str
    condition: Literal["sunny", "rain", "fog", "snow", "magical"]
    intensity: int = Field(ge=0, le=100)
    details: JsonObject = Field(default_factory=dict)


class WeatherResponse(ContractModel):
    items: list[WeatherStateResponse]


class WorldEventResponse(ContractModel):
    id: UUID
    event_type: str
    island_key: str | None
    payload: JsonObject = Field(default_factory=dict)
    occurred_at: datetime


class WorldEventsResponse(ContractModel):
    items: list[WorldEventResponse]


class WorldResponse(ContractModel):
    islands: list[IslandSummary]
    weather: list[WeatherStateResponse]
    events: list[WorldEventResponse]


class InventoryItemResponse(ContractModel):
    ingredient_id: Literal["vanilla_orchid", "honey_bloom"]
    name: str
    quantity: int = Field(ge=0)
    collected: bool


class InventoryResponse(ContractModel):
    items: list[InventoryItemResponse]


class InventoryCollectRequest(ContractModel):
    ingredient_id: Literal["vanilla_orchid", "honey_bloom"]


class QuestStateResponse(ContractModel):
    quest_id: str
    title: str
    description: str
    status: Literal["not_started", "active", "completed"]
    required_ingredients: list[str]
    collected_ingredients: list[str]
    recipe_id: str
    crafted: bool
    can_complete: bool


class QuestsResponse(ContractModel):
    items: list[QuestStateResponse]


class QuestStartRequest(ContractModel):
    quest_id: Literal["joy_first_recipe"]


class QuestProgressRequest(ContractModel):
    quest_id: Literal["joy_first_recipe"]


class QuestCompleteRequest(ContractModel):
    quest_id: Literal["joy_first_recipe"]


class RecipeStateResponse(ContractModel):
    recipe_id: str
    name: str
    emotion: str
    lore: str
    ability: str
    required_ingredients: list[str]
    crafted: bool
    can_craft: bool


class RecipesResponse(ContractModel):
    items: list[RecipeStateResponse]


class RecipeCraftRequest(ContractModel):
    recipe_id: Literal["golden_vanilla_bloom"]


class DialogueResponse(ContractModel):
    character_id: str
    character_name: str
    role: Literal["companion", "npc"]
    text: str


class GameIslandState(ContractModel):
    island_id: Literal["joy_meadow"]
    name: Literal["Joy Meadow"]
    restoration_level: int = Field(ge=0, le=100)
    restored: bool


class JournalEntryResponse(ContractModel):
    id: UUID
    title: str
    content: str
    emotion: str
    recipe_name: str | None
    created_at: datetime


class JournalResponse(ContractModel):
    items: list[JournalEntryResponse]


class JournalCreateRequest(ContractModel):
    island_id: Literal["joy_meadow"]


class SaveStatusResponse(ContractModel):
    status: Literal["not_saved", "saved"]
    last_saved_at: datetime | None
    last_event: str | None


class GameStateResponse(ContractModel):
    started: bool
    island: GameIslandState
    dialogue: list[DialogueResponse]
    inventory: list[InventoryItemResponse]
    quest: QuestStateResponse
    recipe: RecipeStateResponse
    journal: list[JournalEntryResponse]
    save: SaveStatusResponse


class GameStartRequest(ContractModel):
    island_id: Literal["joy_meadow"] = "joy_meadow"


class NpcChatRequest(ContractModel):
    npc_id: str
    message: str


class NpcChatResponse(ContractModel):
    reply: str
    mood: str
    memory_written: bool


CONTRACT_MODELS: tuple[type[BaseModel], ...] = (
    HealthResponse,
    ErrorDetail,
    ErrorResponse,
    PaginationParams,
    PaginationMeta,
    GameEvent,
    RegisterRequest,
    LoginRequest,
    GuestLoginRequest,
    RefreshRequest,
    LogoutRequest,
    AuthUser,
    AuthSessionResponse,
    RefreshResponse,
    LogoutResponse,
    MeResponse,
    PlayerProfileResponse,
    PlayerProfileUpdateRequest,
    WorldMapPosition,
    LandmarkResponse,
    AmbientMetadata,
    ManifestReference,
    IslandSummary,
    IslandsResponse,
    WeatherStateResponse,
    WeatherResponse,
    WorldEventResponse,
    WorldEventsResponse,
    WorldResponse,
    InventoryItemResponse,
    InventoryResponse,
    InventoryCollectRequest,
    QuestStateResponse,
    QuestsResponse,
    QuestStartRequest,
    QuestProgressRequest,
    QuestCompleteRequest,
    RecipeStateResponse,
    RecipesResponse,
    RecipeCraftRequest,
    DialogueResponse,
    GameIslandState,
    JournalEntryResponse,
    JournalResponse,
    JournalCreateRequest,
    SaveStatusResponse,
    GameStateResponse,
    GameStartRequest,
    NpcChatRequest,
    NpcChatResponse,
)
