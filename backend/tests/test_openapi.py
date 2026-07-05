from fastapi.testclient import TestClient

from app.main import app


def test_openapi_routes_are_available() -> None:
    client = TestClient(app)

    assert client.get("/openapi.json").status_code == 200
    assert client.get("/docs").status_code == 200
    assert client.get("/redoc").status_code == 200


def test_openapi_includes_shared_contract_components() -> None:
    client = TestClient(app)

    schema = client.get("/openapi.json").json()

    assert schema["x-contract-source"] == "backend/app/schemas/contracts.py"
    assert {
            "/api/auth/guest",
            "/api/ai/companion/respond",
            "/api/ai/journal/story",
            "/api/ai/npc/chat",
            "/api/ai/recipe/describe",
        "/api/auth/login",
        "/api/auth/logout",
        "/api/auth/me",
        "/api/auth/refresh",
            "/api/auth/register",
            "/api/game/start",
            "/api/game/state",
            "/api/inventory",
            "/api/inventory/collect",
            "/api/journal",
            "/api/journal/create",
            "/api/quests",
            "/api/quests/complete",
            "/api/quests/progress",
            "/api/quests/start",
            "/api/recipes",
            "/api/recipes/craft",
            "/api/world",
            "/api/world/events",
            "/api/world/islands",
            "/api/world/islands/{island_id}",
            "/api/world/islands/{island_id}/restore",
        "/api/world/weather",
        "/health",
    }.issubset(set(schema["paths"]))
    assert schema["paths"]["/health"]["get"]["operationId"] == "get_health"

    component_names = set(schema["components"]["schemas"])
    assert {
        "AuthSessionResponse",
        "AICompanionRespondResponse",
        "AIJournalStoryResponse",
        "AINpcChatResponse",
        "AIRecipeDescribeResponse",
        "ErrorResponse",
        "GameEvent",
        "GameStateResponse",
        "HealthResponse",
        "JournalResponse",
        "PaginationMeta",
        "RecipeCraftRequest",
        "RecipesResponse",
        "QuestsResponse",
        "WeatherResponse",
        "WorldResponse",
    }.issubset(component_names)
