from app.schemas.common import TimestampedRead


class IslandRead(TimestampedRead):
    key: str
    name: str
    emotion: str
    description: str | None
    is_unlocked_by_default: bool
    extra: dict
