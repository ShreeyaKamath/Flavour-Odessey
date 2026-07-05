from pydantic import BaseModel

from app.schemas.common import TimestampedRead


class UserCreate(BaseModel):
    email: str | None = None
    display_name: str
    is_guest: bool = False


class UserRead(TimestampedRead):
    email: str | None
    display_name: str
    is_guest: bool
