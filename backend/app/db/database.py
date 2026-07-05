from sqlalchemy.ext.asyncio import AsyncEngine, create_async_engine

from app.core.config import settings


def create_engine(database_url: str | None = None) -> AsyncEngine:
    return create_async_engine(
        database_url or settings.database_url,
        pool_pre_ping=True,
    )


engine = create_engine()
