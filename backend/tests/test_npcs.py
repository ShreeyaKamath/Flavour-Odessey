from collections.abc import AsyncGenerator, Generator
from uuid import uuid4

import pytest
import pytest_asyncio
from fastapi.testclient import TestClient
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.pool import StaticPool

from app.db.base import Base
from app.db.init_db import seed_mvp_data
from app.db.session import get_async_session
from app.main import app
from app.models import NPC, NPCMemory, NPCRelationship


@pytest_asyncio.fixture()
async def session_factory() -> AsyncGenerator[async_sessionmaker[AsyncSession], None]:
    engine = create_async_engine(
        "sqlite+aiosqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    async with engine.begin() as connection:
        await connection.run_sync(Base.metadata.create_all)

    factory = async_sessionmaker(engine, expire_on_commit=False)
    async with factory() as session:
        await seed_mvp_data(session)
        await session.commit()
    yield factory
    await engine.dispose()


@pytest.fixture()
def client(
    session_factory: async_sessionmaker[AsyncSession],
) -> Generator[TestClient, None, None]:
    async def override_session() -> AsyncGenerator[AsyncSession, None]:
        async with session_factory() as session:
            yield session

    app.dependency_overrides[get_async_session] = override_session
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


def _started_headers(client: TestClient) -> dict[str, str]:
    auth = client.post(
        "/api/auth/register",
        json={
            "email": f"npc-{uuid4().hex}@example.com",
            "password": "living-meadow-123",
            "display_name": "Village Friend",
        },
    ).json()
    headers = {"Authorization": f"Bearer {auth['access_token']}"}
    response = client.post(
        "/api/game/start",
        headers=headers,
        json={"island_id": "joy_meadow"},
    )
    assert response.status_code == 200
    return headers


@pytest.mark.asyncio
async def test_seed_contains_five_idempotent_joy_meadow_npcs(
    session_factory: async_sessionmaker[AsyncSession],
) -> None:
    async with session_factory() as session:
        await seed_mvp_data(session)
        await session.commit()
        count = (
            await session.execute(
                select(func.count(NPC.id)).where(NPC.key.like("joy_meadow_%"))
            )
        ).scalar_one()

    assert count == 5


@pytest.mark.asyncio
async def test_list_npcs_returns_schedule_movement_and_relationship(
    client: TestClient,
) -> None:
    headers = _started_headers(client)

    response = client.get("/api/npcs", headers=headers)

    assert response.status_code == 200
    items = response.json()["items"]
    assert [item["npc_id"] for item in items] == [
        "joy_meadow_keeper",
        "joy_meadow_baker",
        "joy_meadow_gardener",
        "joy_meadow_child_explorer",
        "joy_meadow_traveling_merchant",
    ]
    first = items[0]
    assert first["daily_schedule"][0]["activity"] == "Water Flowers"
    assert first["movement"]["no_teleporting"] is True
    assert 0 <= first["movement"]["progress"] <= 1
    assert first["relationship"]["friendship_xp"] == 0


@pytest.mark.asyncio
async def test_npc_chat_updates_memory_friendship_history_and_mood(
    client: TestClient,
    session_factory: async_sessionmaker[AsyncSession],
) -> None:
    headers = _started_headers(client)

    response = client.post(
        "/api/ai/npc/chat",
        headers=headers,
        json={
            "npc_id": "joy_meadow_baker",
            "message": "I promise to bring the bakery a remembered recipe.",
        },
    )

    assert response.status_code == 200
    payload = response.json()
    assert payload["npc_id"] == "joy_meadow_baker"
    assert payload["memory_written"] is True
    assert payload["relationship"]["friendship_xp"] == 3
    assert payload["relationship"]["trust_xp"] >= 1
    assert payload["relationship"]["conversation_history"][-1]["speaker"] == "npc"
    async with session_factory() as session:
        relationship = (await session.execute(select(NPCRelationship))).scalar_one()
        memory = (await session.execute(select(NPCMemory))).scalar_one()
    assert relationship.state["current_mood"]
    assert "bakery" in memory.content


@pytest.mark.asyncio
async def test_gift_reaction_updates_relationship_and_memory(
    client: TestClient,
    session_factory: async_sessionmaker[AsyncSession],
) -> None:
    headers = _started_headers(client)

    response = client.post(
        "/api/npcs/joy_meadow_gardener/gift",
        headers=headers,
        json={"gift_id": "vanilla_orchid"},
    )

    assert response.status_code == 200
    payload = response.json()
    assert payload["friendship_delta"] == 8
    assert payload["trust_delta"] == 3
    assert "Tavi Sprig" in payload["reaction"]
    async with session_factory() as session:
        memory = (await session.execute(select(NPCMemory))).scalar_one()
    assert memory.memory_type == "gift"
    assert memory.extra["gift_id"] == "vanilla_orchid"


@pytest.mark.asyncio
async def test_npc_endpoints_require_authentication(client: TestClient) -> None:
    response = client.get("/api/npcs")

    assert response.status_code == 401
