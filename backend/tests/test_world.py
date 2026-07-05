from collections.abc import AsyncGenerator, Generator
from uuid import UUID, uuid4

import pytest
import pytest_asyncio
from fastapi.testclient import TestClient
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.pool import StaticPool

from app.db.base import Base
from app.db.init_db import seed_mvp_data
from app.db.session import get_async_session
from app.main import app
from app.models import Island, PlayerProfile, WorldState


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
            "email": f"world-{uuid4().hex}@example.com",
            "password": "sunlit-meadow-123",
            "display_name": "World Keeper",
        },
    )
    assert response.status_code == 200
    return response.json()


def _headers(session: dict) -> dict[str, str]:
    return {"Authorization": f"Bearer {session['access_token']}"}


@pytest.mark.asyncio
async def test_world_endpoints_return_seeded_world(client: TestClient) -> None:
    auth_session = _register(client)
    headers = _headers(auth_session)

    world = client.get("/api/world", headers=headers)
    islands = client.get("/api/world/islands", headers=headers)
    joy_meadow = client.get("/api/world/islands/joy_meadow", headers=headers)
    events = client.get("/api/world/events", headers=headers)

    assert world.status_code == 200
    assert islands.status_code == 200
    assert joy_meadow.status_code == 200
    assert events.status_code == 200
    assert len(world.json()["islands"]) == 5
    assert joy_meadow.json()["landmarks"][0]["key"] == "vanilla_windmill"
    assert joy_meadow.json()["ambient"]["sounds"] == [
        "sprinkle_birds",
        "distant_laughter",
        "wind_chimes",
    ]
    assert {item["manifest_type"] for item in joy_meadow.json()["manifests"]} == {
        "asset",
        "audio",
    }
    assert events.json()["items"][0]["event_type"] == "WeatherChanged"


@pytest.mark.asyncio
async def test_only_joy_meadow_is_unlocked_by_default(
    client: TestClient,
    session_factory: async_sessionmaker[AsyncSession],
) -> None:
    auth_session = _register(client)
    headers = _headers(auth_session)

    response = client.get("/api/world/islands", headers=headers)
    by_key = {item["key"]: item for item in response.json()["items"]}

    assert by_key["joy_meadow"]["unlocked"] is True
    assert by_key["joy_meadow"]["availability"] == "playable"
    for island_key in (
        "wonder_woods",
        "courage_cliffs",
        "hope_harbor",
        "home_valley",
    ):
        assert by_key[island_key]["unlocked"] is False
        assert by_key[island_key]["availability"] == "coming_in_version_1"

    async with session_factory() as session:
        profile_id = (
            await session.execute(
                select(PlayerProfile.id).where(
                    PlayerProfile.user_id == UUID(auth_session["user_id"])
                )
            )
        ).scalar_one()
        joy_id = (
            await session.execute(
                select(Island.id).where(Island.key == "joy_meadow")
            )
        ).scalar_one()
        session.add(
            WorldState(
                player_profile_id=profile_id,
                island_id=joy_id,
                restoration_level=40,
                unlocked=True,
                state={},
            )
        )
        await session.commit()

    restored_response = client.get(
        "/api/world/islands/joy_meadow",
        headers=headers,
    )
    assert restored_response.json()["restoration_level"] == 40
    assert restored_response.json()["restoration_state"] == "restoring"


@pytest.mark.asyncio
async def test_weather_endpoint_returns_joy_meadow_weather(
    client: TestClient,
) -> None:
    auth_session = _register(client)

    response = client.get("/api/world/weather", headers=_headers(auth_session))

    assert response.status_code == 200
    assert response.json()["items"] == [
        {
            "id": response.json()["items"][0]["id"],
            "island_id": response.json()["items"][0]["island_id"],
            "island_key": "joy_meadow",
            "condition": "sunny",
            "intensity": 25,
            "details": {
                "label": "Warm breeze",
                "temperature": "mild",
                "visual_effect": "drifting_flower_petals",
                "audio_cue": "audio.joy_meadow.ambience",
            },
        }
    ]
