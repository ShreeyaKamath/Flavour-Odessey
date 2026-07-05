from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi
from pydantic import BaseModel
from pydantic.json_schema import models_json_schema

from app.schemas.contracts import CONTRACT_MODELS


def _contract_component_schemas() -> dict[str, object]:
    model_entries = [(model, "validation") for model in CONTRACT_MODELS]
    _, schema_bundle = models_json_schema(
        model_entries,
        ref_template="#/components/schemas/{model}",
    )
    return schema_bundle.get("$defs", {})


def install_openapi_contracts(app: FastAPI) -> None:
    def custom_openapi() -> dict[str, object]:
        if app.openapi_schema:
            return app.openapi_schema

        openapi_schema = get_openapi(
            title=app.title,
            version=app.version,
            routes=app.routes,
            description=app.description,
        )
        components = openapi_schema.setdefault("components", {})
        schemas = components.setdefault("schemas", {})
        schemas.update(_contract_component_schemas())
        openapi_schema["x-contract-source"] = "backend/app/schemas/contracts.py"

        app.openapi_schema = openapi_schema
        return app.openapi_schema

    app.openapi = custom_openapi  # type: ignore[method-assign]
