from sqlalchemy.ext.asyncio import AsyncSession

from app.db.repositories.base import BaseRepository
from app.models import Island


class IslandRepository(BaseRepository[Island]):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, Island)
