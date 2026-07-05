from collections.abc import AsyncGenerator, Generator
from uuid import UUID, uuid4

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
from app.models import (
    EventLog,
    InventoryItem,
    JournalEntry,
    PlayerProfile,
    QuestProgress,
    Recipe,
)


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


def _register(client: TestClient) -> dict:
    response = client.post(
        "/api/auth/register",
        json={
            "email": f"game-{uuid4().hex}@example.com",
            "password": "golden-bloom-123",
            "display_name": "Joy Keeper",
        },
    )
    assert response.status_code == 200
    return response.json()


def _headers(auth_session: dict) -> dict[str, str]:
    return {"Authorization": f"Bearer {auth_session['access_token']}"}


def _start(client: TestClient, headers: dict[str, str]) -> dict:
    response = client.post(
        "/api/game/start",
        headers=headers,
        json={"island_id": "joy_meadow"},
    )
    assert response.status_code == 200
    return response.json()


def _collect_starters(client: TestClient, headers: dict[str, str]) -> None:
    for ingredient_id in ("vanilla_orchid", "honey_bloom"):
        response = client.post(
            "/api/inventory/collect",
            headers=headers,
            json={"ingredient_id": ingredient_id},
        )
        assert response.status_code == 200


def _start_quest(client: TestClient, headers: dict[str, str]) -> dict:
    response = client.post(
        "/api/quests/start",
        headers=headers,
        json={"quest_id": "joy_first_recipe"},
    )
    assert response.status_code == 200
    return response.json()


def _craft(client: TestClient, headers: dict[str, str]) -> dict:
    response = client.post(
        "/api/recipes/craft",
        headers=headers,
        json={"recipe_id": "golden_vanilla_bloom"},
    )
    assert response.status_code == 200
    return response.json()


def _complete(client: TestClient, headers: dict[str, str]) -> dict:
    response = client.post(
        "/api/quests/complete",
        headers=headers,
        json={"quest_id": "joy_first_recipe"},
    )
    assert response.status_code == 200
    return response.json()


@pytest.mark.asyncio
async def test_game_state_starts_and_saves_authenticated_progress(
    client: TestClient,
) -> None:
    auth_session = _register(client)
    headers = _headers(auth_session)

    initial = client.get("/api/game/state", headers=headers)
    started = _start(client, headers)

    assert initial.status_code == 200
    assert initial.json()["started"] is False
    assert initial.json()["island"]["restoration_level"] == 0
    assert started["started"] is True
    assert started["save"]["status"] == "saved"
    assert started["save"]["last_event"] == "GameStarted"
    assert {line["character_name"] for line in started["dialogue"]} == {
        "Lumi",
        "Meadow Keeper",
    }


@pytest.mark.asyncio
async def test_collect_ingredient_updates_inventory(
    client: TestClient,
    session_factory: async_sessionmaker[AsyncSession],
) -> None:
    auth_session = _register(client)
    headers = _headers(auth_session)
    _start(client, headers)

    response = client.post(
        "/api/inventory/collect",
        headers=headers,
        json={"ingredient_id": "vanilla_orchid"},
    )

    assert response.status_code == 200
    vanilla = next(
        item
        for item in response.json()["inventory"]
        if item["ingredient_id"] == "vanilla_orchid"
    )
    assert vanilla == {
        "ingredient_id": "vanilla_orchid",
        "name": "Vanilla Orchid",
        "quantity": 1,
        "collected": True,
    }

    async with session_factory() as session:
        stored = (
            await session.execute(
                select(InventoryItem).where(
                    InventoryItem.item_key == "vanilla_orchid"
                )
            )
        ).scalar_one()
    assert stored.quantity == 1


@pytest.mark.asyncio
async def test_quest_start_progress_and_complete_restores_joy(
    client: TestClient,
    session_factory: async_sessionmaker[AsyncSession],
) -> None:
    auth_session = _register(client)
    headers = _headers(auth_session)
    _start(client, headers)
    _collect_starters(client, headers)

    started = _start_quest(client, headers)
    progress = client.post(
        "/api/quests/progress",
        headers=headers,
        json={"quest_id": "joy_first_recipe"},
    )
    _craft(client, headers)
    completed = _complete(client, headers)

    assert started["quest"]["status"] == "active"
    assert progress.status_code == 200
    assert progress.json()["quest"]["collected_ingredients"] == [
        "vanilla_orchid",
        "honey_bloom",
    ]
    assert completed["quest"]["status"] == "completed"
    assert completed["island"] == {
        "island_id": "joy_meadow",
        "name": "Joy Meadow",
        "restoration_level": 100,
        "restored": True,
    }

    async with session_factory() as session:
        stored = (await session.execute(select(QuestProgress))).scalar_one()
    assert stored.status.value == "completed"


@pytest.mark.asyncio
async def test_recipe_craft_requires_and_consumes_starter_ingredients(
    client: TestClient,
    session_factory: async_sessionmaker[AsyncSession],
) -> None:
    auth_session = _register(client)
    headers = _headers(auth_session)
    _start(client, headers)
    _collect_starters(client, headers)
    _start_quest(client, headers)

    crafted = _craft(client, headers)

    assert crafted["recipe"]["name"] == "Golden Vanilla Bloom"
    assert crafted["recipe"]["crafted"] is True
    assert all(item["quantity"] == 0 for item in crafted["inventory"])
    async with session_factory() as session:
        profile_id = (
            await session.execute(
                select(PlayerProfile.id).where(
                    PlayerProfile.user_id == UUID(auth_session["user_id"])
                )
            )
        ).scalar_one()
        stored = (
            await session.execute(
                select(Recipe).where(Recipe.player_profile_id == profile_id)
            )
        ).scalar_one()
    assert stored.key == "golden_vanilla_bloom"


@pytest.mark.asyncio
async def test_journal_creation_is_persisted_and_idempotent(
    client: TestClient,
    session_factory: async_sessionmaker[AsyncSession],
) -> None:
    auth_session = _register(client)
    headers = _headers(auth_session)
    _start(client, headers)
    _collect_starters(client, headers)
    _start_quest(client, headers)
    _craft(client, headers)
    _complete(client, headers)

    response = client.post(
        "/api/journal/create",
        headers=headers,
        json={"island_id": "joy_meadow"},
    )

    assert response.status_code == 200
    assert response.json()["journal"][0]["title"] == "The Day Joy Returned"
    journal = client.get("/api/journal", headers=headers)
    assert journal.json()["items"][0]["recipe_name"] == "Golden Vanilla Bloom"
    async with session_factory() as session:
        count = (
            await session.execute(select(func.count(JournalEntry.id)))
        ).scalar_one()
    assert count == 1


@pytest.mark.asyncio
async def test_island_restoration_endpoint_is_idempotent(
    client: TestClient,
) -> None:
    auth_session = _register(client)
    headers = _headers(auth_session)
    _start(client, headers)
    _collect_starters(client, headers)
    _start_quest(client, headers)
    _craft(client, headers)
    _complete(client, headers)

    response = client.post(
        "/api/world/islands/joy_meadow/restore",
        headers=headers,
    )
    world = client.get("/api/world/islands/joy_meadow", headers=headers)

    assert response.status_code == 200
    assert response.json()["island"]["restoration_level"] == 100
    assert world.json()["restoration_level"] == 100


@pytest.mark.asyncio
async def test_recipe_availability_requires_active_quest(client: TestClient) -> None:
    auth_session = _register(client)
    headers = _headers(auth_session)
    _start(client, headers)
    _collect_starters(client, headers)

    before_quest = client.get("/api/recipes", headers=headers)
    _start_quest(client, headers)
    after_quest = client.get("/api/recipes", headers=headers)

    assert before_quest.json()["items"][0]["can_craft"] is False
    assert after_quest.json()["items"][0]["can_craft"] is True


@pytest.mark.asyncio
async def test_gameplay_actions_are_idempotent(
    client: TestClient,
    session_factory: async_sessionmaker[AsyncSession],
) -> None:
    auth_session = _register(client)
    headers = _headers(auth_session)

    _start(client, headers)
    _start(client, headers)
    _collect_starters(client, headers)
    _collect_starters(client, headers)
    _start_quest(client, headers)
    _start_quest(client, headers)
    _craft(client, headers)
    _craft(client, headers)
    _complete(client, headers)
    _complete(client, headers)

    async with session_factory() as session:
        event_counts = dict(
            (
                await session.execute(
                    select(EventLog.event_type, func.count(EventLog.id))
                    .where(
                        EventLog.event_type.in_(
                            (
                                "GameStarted",
                                "IngredientCollected",
                                "QuestStarted",
                                "RecipeCrafted",
                                "QuestCompleted",
                                "EmotionRestored",
                                "JournalUpdated",
                            )
                        )
                    )
                    .group_by(EventLog.event_type)
                )
            ).all()
        )
        crafted_count = (
            await session.execute(
                select(func.count(Recipe.id)).where(
                    Recipe.player_profile_id.is_not(None)
                )
            )
        ).scalar_one()
        journal_count = (
            await session.execute(select(func.count(JournalEntry.id)))
        ).scalar_one()

    assert event_counts == {
        "EmotionRestored": 1,
        "GameStarted": 1,
        "IngredientCollected": 2,
        "JournalUpdated": 1,
        "QuestCompleted": 1,
        "QuestStarted": 1,
        "RecipeCrafted": 1,
    }
    assert crafted_count == 1
    assert journal_count == 1


@pytest.mark.asyncio
async def test_new_guest_has_clean_isolated_game_state(client: TestClient) -> None:
    first_guest = client.post("/api/auth/guest", json={}).json()
    first_headers = _headers(first_guest)
    _start(client, first_headers)
    client.post(
        "/api/inventory/collect",
        headers=first_headers,
        json={"ingredient_id": "vanilla_orchid"},
    )

    second_guest = client.post("/api/auth/guest", json={}).json()
    second_state = client.get(
        "/api/game/state",
        headers=_headers(second_guest),
    ).json()

    assert second_state["started"] is False
    assert second_state["island"]["restoration_level"] == 0
    assert all(item["quantity"] == 0 for item in second_state["inventory"])
    assert second_state["quest"]["status"] == "not_started"
    assert second_state["journal"] == []


@pytest.mark.asyncio
async def test_registered_progress_survives_relogin(client: TestClient) -> None:
    payload = {
        "email": f"persistent-{uuid4().hex}@example.com",
        "password": "persistent-bloom-123",
        "display_name": "Persistent Keeper",
    }
    registered = client.post("/api/auth/register", json=payload).json()
    headers = _headers(registered)
    _start(client, headers)
    _collect_starters(client, headers)
    _start_quest(client, headers)
    _craft(client, headers)
    _complete(client, headers)

    relogged = client.post(
        "/api/auth/login",
        json={"email": payload["email"], "password": payload["password"]},
    )
    reloaded = client.get(
        "/api/game/state",
        headers=_headers(relogged.json()),
    )

    assert relogged.status_code == 200
    assert reloaded.status_code == 200
    assert reloaded.json()["started"] is True
    assert reloaded.json()["island"]["restored"] is True
    assert reloaded.json()["quest"]["status"] == "completed"
    assert reloaded.json()["journal"][0]["title"] == "The Day Joy Returned"


@pytest.mark.asyncio
@pytest.mark.parametrize(
    ("method", "path", "json_body"),
    [
        ("GET", "/api/game/state", None),
        ("POST", "/api/game/start", {"island_id": "joy_meadow"}),
        ("GET", "/api/inventory", None),
        (
            "POST",
            "/api/inventory/collect",
            {"ingredient_id": "vanilla_orchid"},
        ),
        ("GET", "/api/quests", None),
        ("POST", "/api/quests/start", {"quest_id": "joy_first_recipe"}),
        ("POST", "/api/quests/progress", {"quest_id": "joy_first_recipe"}),
        ("POST", "/api/quests/complete", {"quest_id": "joy_first_recipe"}),
        ("GET", "/api/recipes", None),
        (
            "POST",
            "/api/recipes/craft",
            {"recipe_id": "golden_vanilla_bloom"},
        ),
        ("GET", "/api/journal", None),
        ("POST", "/api/journal/create", {"island_id": "joy_meadow"}),
        ("POST", "/api/world/islands/joy_meadow/restore", None),
    ],
)
async def test_gameplay_endpoints_require_authentication(
    client: TestClient,
    method: str,
    path: str,
    json_body: dict | None,
) -> None:
    response = client.request(method, path, json=json_body)

    assert response.status_code == 401
    assert response.json()["error"]["code"] == "UNAUTHORIZED"
