from uuid import UUID

from app.schemas.common import TimestampedRead


class QuestRead(TimestampedRead):
    key: str
    title: str
    description: str | None
    island_id: UUID | None
    reward: dict
    requirements: dict
