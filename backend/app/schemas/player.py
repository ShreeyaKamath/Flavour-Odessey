from uuid import UUID

from pydantic import BaseModel, Field

from app.schemas.common import TimestampedRead


class PlayerProfileCreate(BaseModel):
    user_id: UUID
    player_name: str
    current_island_id: UUID | None = None
    progress: dict = Field(default_factory=dict)


class PlayerProfileRead(TimestampedRead):
    user_id: UUID
    player_name: str
    current_island_id: UUID | None
    progress: dict
