from collections.abc import AsyncGenerator, Generator
from uuid import uuid4

import pytest
import pytest_asyncio
from fastapi.testclient import TestClient
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.pool import StaticPool

from ai.providers.factory import DeferredLLMProvider
from app.api.ai import get_ai_provider
from app.db.base import Base
from app.db.init_db import seed_mvp_data
from app.db.session import get_async_session
from app.main import app
from app.models import JournalEntry, NPCMemory


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


def _started_player(client: TestClient) -> dict[str, str]:
    auth = client.post(
        "/api/auth/register",
        json={
            "email": f"ai-{uuid4().hex}@example.com",
            "password": "memory-bloom-123",
            "display_name": "Memory Keeper",
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


def _restore_joy(client: TestClient, headers: dict[str, str]) -> None:
    for ingredient_id in ("vanilla_orchid", "honey_bloom"):
        client.post(
            "/api/inventory/collect",
            headers=headers,
            json={"ingredient_id": ingredient_id},
        )
    client.post(
        "/api/quests/start",
        headers=headers,
        json={"quest_id": "joy_first_recipe"},
    )
    client.post(
        "/api/recipes/craft",
        headers=headers,
        json={"recipe_id": "golden_vanilla_bloom"},
    )
    response = client.post(
        "/api/quests/complete",
        headers=headers,
        json={"quest_id": "joy_first_recipe"},
    )
    assert response.status_code == 200


@pytest.mark.asyncio
async def test_npc_chat_uses_context_and_writes_important_memory(
    client: TestClient,
    session_factory: async_sessionmaker[AsyncSession],
) -> None:
    headers = _started_player(client)

    response = client.post(
        "/api/ai/npc/chat",
        headers=headers,
        json={
            "npc_id": "joy_meadow_keeper",
            "message": "I promise to restore Joy and remember this recipe.",
        },
    )

    assert response.status_code == 200
    assert response.json()["provider"] == "mock"
    assert response.json()["memory_written"] is True
    async with session_factory() as session:
        memory = (await session.execute(select(NPCMemory))).scalar_one()
    assert memory.importance >= 4
    assert "promise" in memory.content


@pytest.mark.asyncio
async def test_companion_response_reacts_to_gameplay_event(client: TestClient) -> None:
    headers = _started_player(client)

    response = client.post(
        "/api/ai/companion/respond",
        headers=headers,
        json={"event": "ingredient_collected"},
    )

    assert response.status_code == 200
    assert response.json()["companion_id"] == "lumi"
    assert response.json()["event"] == "ingredient_collected"
    assert response.json()["fallback_used"] is False


@pytest.mark.asyncio
async def test_recipe_description_preserves_rules(client: TestClient) -> None:
    headers = _started_player(client)

    response = client.post(
        "/api/ai/recipe/describe",
        headers=headers,
        json={"recipe_id": "golden_vanilla_bloom"},
    )

    assert response.status_code == 200
    assert response.json()["name"] == "Golden Vanilla Bloom"
    assert response.json()["emotion"] == "joy"
    assert response.json()["required_ingredients"] == [
        "vanilla_orchid",
        "honey_bloom",
    ]


@pytest.mark.asyncio
async def test_journal_story_preserves_title_and_persists_text(
    client: TestClient,
    session_factory: async_sessionmaker[AsyncSession],
) -> None:
    headers = _started_player(client)
    _restore_joy(client, headers)

    response = client.post(
        "/api/ai/journal/story",
        headers=headers,
        json={"island_id": "joy_meadow"},
    )

    assert response.status_code == 200
    assert response.json()["title"] == "The Day Joy Returned"
    async with session_factory() as session:
        journal = (await session.execute(select(JournalEntry))).scalar_one()
    assert journal.title == "The Day Joy Returned"
    assert journal.story == response.json()["story"]


@pytest.mark.asyncio
async def test_ai_provider_failure_returns_deterministic_fallback(
    client: TestClient,
) -> None:
    headers = _started_player(client)
    app.dependency_overrides[get_ai_provider] = lambda: DeferredLLMProvider()

    response = client.post(
        "/api/ai/npc/chat",
        headers=headers,
        json={"npc_id": "joy_meadow_keeper", "message": "Hello"},
    )

    assert response.status_code == 200
    assert response.json()["fallback_used"] is True
    assert response.json()["provider"] == "fallback"
    assert response.json()["reply"]


@pytest.mark.asyncio
@pytest.mark.parametrize(
    ("path", "body"),
    [
        (
            "/api/ai/npc/chat",
            {"npc_id": "joy_meadow_keeper", "message": "Hello"},
        ),
        ("/api/ai/companion/respond", {"event": "hint"}),
        (
            "/api/ai/recipe/describe",
            {"recipe_id": "golden_vanilla_bloom"},
        ),
        ("/api/ai/journal/story", {"island_id": "joy_meadow"}),
    ],
)
async def test_ai_endpoints_require_authentication(
    client: TestClient,
    path: str,
    body: dict,
) -> None:
    response = client.post(path, json=body)

    assert response.status_code == 401
