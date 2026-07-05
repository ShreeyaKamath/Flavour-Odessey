from uuid import uuid4
from urllib.parse import urlparse
import os
import socket

import pytest
from sqlalchemy import select, text

from app.db.init_db import seed_mvp_data
from app.db.repositories.islands import IslandRepository
from app.db.session import AsyncSessionLocal
from app.models import AssetManifest, Ingredient, Island, NPC, PlayerProfile, Quest, User


def _database_is_reachable() -> bool:
    database_url = os.getenv(
        "DATABASE_URL",
        "postgresql+asyncpg://flavor:flavor@localhost:5432/flavor_odyssey",
    )
    parsed = urlparse(database_url)
    host = parsed.hostname or "localhost"
    port = parsed.port or 5432

    try:
        with socket.create_connection((host, port), timeout=1):
            return True
    except OSError:
        return False


pytestmark = [
    pytest.mark.postgres,
    pytest.mark.skipif(
        not _database_is_reachable(),
        reason="PostgreSQL is not reachable; start it with docker compose up -d postgres redis.",
    ),
]


@pytest.mark.asyncio
async def test_database_connection() -> None:
    async with AsyncSessionLocal() as session:
        result = await session.execute(text("SELECT 1"))

    assert result.scalar_one() == 1


@pytest.mark.asyncio
async def test_model_creation() -> None:
    async with AsyncSessionLocal() as session:
        user = User(
            email=f"keeper-{uuid4()}@example.com",
            display_name="Test Keeper",
        )
        session.add(user)
        await session.flush()

        profile = PlayerProfile(
            user_id=user.id,
            player_name="Flavor Keeper",
            progress={"phase": "database_foundation"},
        )
        session.add(profile)
        await session.commit()

        stored = await session.get(PlayerProfile, profile.id)

    assert stored is not None
    assert stored.player_name == "Flavor Keeper"


@pytest.mark.asyncio
async def test_seed_data_loads_mvp_foundation() -> None:
    async with AsyncSessionLocal() as session:
        await seed_mvp_data(session)
        await session.commit()

        island = (
            await session.execute(select(Island).where(Island.key == "joy_meadow"))
        ).scalar_one_or_none()
        npc = (
            await session.execute(select(NPC).where(NPC.key == "joy_meadow_keeper"))
        ).scalar_one_or_none()
        ingredient = (
            await session.execute(select(Ingredient).where(Ingredient.key == "vanilla_orchid"))
        ).scalar_one_or_none()
        quest = (
            await session.execute(select(Quest).where(Quest.key == "joy_first_recipe"))
        ).scalar_one_or_none()
        manifest = (
            await session.execute(
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
async def test_repository_basic_crud() -> None:
    async with AsyncSessionLocal() as session:
        repository = IslandRepository(session)
        key = f"test_island_{uuid4().hex}"

        created = await repository.add(
            Island(
                key=key,
                name="Test Island",
                emotion="test",
                description="Repository test island.",
            )
        )
        await session.commit()

        fetched = await repository.get(created.id)
        fetched_by_key = await repository.get_by_key(key)

    assert fetched is not None
    assert fetched.name == "Test Island"
    assert fetched_by_key is not None
    assert fetched_by_key.id == created.id
