from collections.abc import AsyncGenerator
from uuid import uuid4

import pytest
import pytest_asyncio
from sqlalchemy import func, select, text
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.pool import StaticPool

from app.db.base import Base
from app.db.init_db import seed_mvp_data
from app.db.repositories.islands import IslandRepository
from app.models import (
    AssetManifest,
    Ingredient,
    Island,
    NPC,
    PlayerProfile,
    Quest,
    Recipe,
    User,
    WeatherState,
    WorldEvent,
)


@pytest_asyncio.fixture()
async def sqlite_session() -> AsyncGenerator[AsyncSession, None]:
    engine = create_async_engine(
        "sqlite+aiosqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )

    async with engine.begin() as connection:
        await connection.run_sync(Base.metadata.create_all)

    session_factory = async_sessionmaker(engine, expire_on_commit=False)

    async with session_factory() as session:
        yield session

    await engine.dispose()


@pytest.mark.asyncio
async def test_sqlite_fallback_connection(sqlite_session: AsyncSession) -> None:
    result = await sqlite_session.execute(text("SELECT 1"))

    assert result.scalar_one() == 1


@pytest.mark.asyncio
async def test_sqlite_model_creation(sqlite_session: AsyncSession) -> None:
    user = User(
        email=f"sqlite-keeper-{uuid4()}@example.com",
        display_name="SQLite Keeper",
    )
    sqlite_session.add(user)
    await sqlite_session.flush()

    profile = PlayerProfile(
        user_id=user.id,
        player_name="SQLite Flavor Keeper",
        progress={"test": "sqlite_fallback"},
    )
    sqlite_session.add(profile)
    await sqlite_session.commit()

    stored = await sqlite_session.get(PlayerProfile, profile.id)

    assert stored is not None
    assert stored.user_id == user.id
    assert stored.progress == {"test": "sqlite_fallback"}


@pytest.mark.asyncio
async def test_sqlite_seed_data_loads(sqlite_session: AsyncSession) -> None:
    await seed_mvp_data(sqlite_session)
    await sqlite_session.commit()

    island = (
        await sqlite_session.execute(select(Island).where(Island.key == "joy_meadow"))
    ).scalar_one_or_none()
    npc = (
        await sqlite_session.execute(select(NPC).where(NPC.key == "joy_meadow_keeper"))
    ).scalar_one_or_none()
    ingredient = (
        await sqlite_session.execute(select(Ingredient).where(Ingredient.key == "vanilla_orchid"))
    ).scalar_one_or_none()
    quest = (
        await sqlite_session.execute(select(Quest).where(Quest.key == "joy_first_recipe"))
    ).scalar_one_or_none()
    manifest = (
        await sqlite_session.execute(
            select(AssetManifest).where(AssetManifest.asset_key == "audio.joy_meadow.placeholder")
        )
    ).scalar_one_or_none()

    assert island is not None
    assert island.name == "Joy Meadow"
    assert npc is not None
    assert ingredient is not None
    assert quest is not None
    assert manifest is not None


@pytest.mark.asyncio
async def test_sqlite_seed_data_is_idempotent(sqlite_session: AsyncSession) -> None:
    await seed_mvp_data(sqlite_session)
    await sqlite_session.commit()
    await seed_mvp_data(sqlite_session)
    await sqlite_session.commit()

    async def count(model: type) -> int:
        return (
            await sqlite_session.execute(select(func.count()).select_from(model))
        ).scalar_one()

    assert await count(Island) == 5
    assert await count(NPC) == 6
    assert await count(Ingredient) == 2
    assert await count(Quest) == 1
    assert await count(Recipe) == 1
    assert await count(WeatherState) == 1
    assert await count(WorldEvent) == 1


@pytest.mark.asyncio
async def test_sqlite_repository_basic_crud(sqlite_session: AsyncSession) -> None:
    repository = IslandRepository(sqlite_session)
    key = f"sqlite_test_island_{uuid4().hex}"

    created = await repository.add(
        Island(
            key=key,
            name="SQLite Test Island",
            emotion="test",
            description="SQLite repository fallback test.",
        )
    )
    await sqlite_session.commit()

    fetched = await repository.get(created.id)
    fetched_by_key = await repository.get_by_key(key)

    assert fetched is not None
    assert fetched.name == "SQLite Test Island"
    assert fetched_by_key is not None
    assert fetched_by_key.id == created.id
