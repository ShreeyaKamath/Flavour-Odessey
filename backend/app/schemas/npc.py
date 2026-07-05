from uuid import UUID

from app.schemas.common import TimestampedRead


class NPCRead(TimestampedRead):
    key: str
    island_id: UUID | None
    name: str
    role: str
    profile: dict
