from collections.abc import AsyncGenerator, Generator
from uuid import uuid4

import pytest
import pytest_asyncio
from fastapi.testclient import TestClient
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.pool import StaticPool

from app.db.base import Base
from app.db.session import get_async_session
from app.main import app
from app.models import AuthCredential, PlayerProfile, PlayerSettings, SaveSlot, User


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


def _register_payload() -> dict[str, str]:
    return {
        "email": f"keeper-{uuid4().hex}@example.com",
        "password": "sunlit-vanilla-123",
        "display_name": "Test Keeper",
    }


async def _register_user(client: TestClient) -> dict:
    response = client.post("/api/auth/register", json=_register_payload())
    assert response.status_code == 200
    return response.json()


@pytest.mark.asyncio
async def test_register_creates_user_and_baseline_auth_state(
    client: TestClient,
    session_factory: async_sessionmaker[AsyncSession],
) -> None:
    payload = _register_payload()

    response = client.post("/api/auth/register", json=payload)

    assert response.status_code == 200
    body = response.json()
    assert body["access_token"]
    assert body["refresh_token"]
    assert body["token_type"] == "bearer"
    assert body["user"]["email"] == payload["email"]
    assert body["user"]["is_guest"] is False

    async with session_factory() as session:
        credential = (
            await session.execute(
                select(AuthCredential).where(AuthCredential.identifier == payload["email"])
            )
        ).scalar_one()
        user = await session.get(User, credential.user_id)
        profile = (
            await session.execute(
                select(PlayerProfile).where(PlayerProfile.user_id == credential.user_id)
            )
        ).scalar_one()
        settings = (
            await session.execute(
                select(PlayerSettings).where(PlayerSettings.user_id == credential.user_id)
            )
        ).scalar_one()
        save_slot = (
            await session.execute(
                select(SaveSlot).where(SaveSlot.player_profile_id == profile.id)
            )
        ).scalar_one()

    assert user is not None
    assert credential.password_hash is not None
    assert credential.password_hash != payload["password"]
    assert credential.password_hash.startswith("pbkdf2_sha256$")
    assert profile.player_name == payload["display_name"]
    assert settings.settings == {}
    assert save_slot.slot_number == 1


@pytest.mark.asyncio
async def test_login_returns_tokens_for_registered_user(client: TestClient) -> None:
    payload = _register_payload()
    register_response = client.post("/api/auth/register", json=payload)
    assert register_response.status_code == 200

    response = client.post(
        "/api/auth/login",
        json={"email": payload["email"], "password": payload["password"]},
    )

    assert response.status_code == 200
    body = response.json()
    assert body["access_token"]
    assert body["refresh_token"]
    assert body["user"]["email"] == payload["email"]


@pytest.mark.asyncio
async def test_login_rejects_invalid_credentials_with_auth_error(
    client: TestClient,
) -> None:
    response = client.post(
        "/api/auth/login",
        json={"email": "missing@example.com", "password": "wrong-password"},
    )

    assert response.status_code == 401
    assert response.json() == {
        "error": {
            "code": "UNAUTHORIZED",
            "message": "Invalid email or password",
        }
    }


@pytest.mark.asyncio
async def test_guest_login_returns_guest_user(client: TestClient) -> None:
    response = client.post("/api/auth/guest", json={"display_name": "Guest Sprout"})

    assert response.status_code == 200
    body = response.json()
    assert body["access_token"]
    assert body["refresh_token"]
    assert body["user"]["email"] is None
    assert body["user"]["display_name"] == "Guest Sprout"
    assert body["user"]["is_guest"] is True


@pytest.mark.asyncio
async def test_refresh_rotates_refresh_token(client: TestClient) -> None:
    session = await _register_user(client)

    response = client.post(
        "/api/auth/refresh",
        json={"refresh_token": session["refresh_token"]},
    )

    assert response.status_code == 200
    body = response.json()
    assert body["access_token"]
    assert body["refresh_token"] != session["refresh_token"]

    reused_response = client.post(
        "/api/auth/refresh",
        json={"refresh_token": session["refresh_token"]},
    )
    assert reused_response.status_code == 401


@pytest.mark.asyncio
async def test_logout_invalidates_refresh_token(client: TestClient) -> None:
    session = await _register_user(client)

    response = client.post(
        "/api/auth/logout",
        headers={"Authorization": f"Bearer {session['access_token']}"},
        json={"refresh_token": session["refresh_token"]},
    )

    assert response.status_code == 200
    assert response.json() == {"logged_out": True}

    refresh_response = client.post(
        "/api/auth/refresh",
        json={"refresh_token": session["refresh_token"]},
    )
    assert refresh_response.status_code == 401


@pytest.mark.asyncio
async def test_logout_without_token_invalidates_all_user_sessions(
    client: TestClient,
) -> None:
    payload = _register_payload()
    first_session = client.post("/api/auth/register", json=payload).json()
    second_session = client.post(
        "/api/auth/login",
        json={"email": payload["email"], "password": payload["password"]},
    ).json()

    response = client.post(
        "/api/auth/logout",
        headers={"Authorization": f"Bearer {second_session['access_token']}"},
    )

    assert response.status_code == 200
    for refresh_token in (
        first_session["refresh_token"],
        second_session["refresh_token"],
    ):
        refresh_response = client.post(
            "/api/auth/refresh",
            json={"refresh_token": refresh_token},
        )
        assert refresh_response.status_code == 401


@pytest.mark.asyncio
async def test_me_returns_current_user_for_access_token(client: TestClient) -> None:
    session = await _register_user(client)

    response = client.get(
        "/api/auth/me",
        headers={"Authorization": f"Bearer {session['access_token']}"},
    )

    assert response.status_code == 200
    assert response.json()["user"]["id"] == session["user_id"]
