from typing import Generic, TypeVar
from uuid import UUID

from sqlalchemy import Select, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.base import Base

ModelT = TypeVar("ModelT", bound=Base)


class BaseRepository(Generic[ModelT]):
    def __init__(self, session: AsyncSession, model: type[ModelT]) -> None:
        self.session = session
        self.model = model

    async def add(self, instance: ModelT) -> ModelT:
        self.session.add(instance)
        await self.session.flush()
        await self.session.refresh(instance)
        return instance

    async def get(self, item_id: UUID) -> ModelT | None:
        return await self.session.get(self.model, item_id)

    async def list(self, limit: int = 100, offset: int = 0) -> list[ModelT]:
        statement: Select[tuple[ModelT]] = select(self.model).offset(offset).limit(limit)
        result = await self.session.execute(statement)
        return list(result.scalars().all())

    async def get_by_key(self, key: str) -> ModelT | None:
        statement = select(self.model).where(getattr(self.model, "key") == key)
        result = await self.session.execute(statement)
        return result.scalar_one_or_none()
