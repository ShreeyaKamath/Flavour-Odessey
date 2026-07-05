from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any


REPO_ROOT = Path(__file__).resolve().parents[2]
OPENAPI_PATH = REPO_ROOT / "shared" / "openapi" / "openapi.json"
CONTRACTS_DIR = REPO_ROOT / "shared" / "contracts"


def _json(value: object) -> str:
    return json.dumps(value, ensure_ascii=False)


def _ref_name(ref: str) -> str:
    return ref.rsplit("/", 1)[-1]


def _ts_key(key: str) -> str:
    return key if re.fullmatch(r"[A-Za-z_$][A-Za-z0-9_$]*", key) else _json(key)


def _schema_to_ts(schema: dict[str, Any]) -> str:
    if "$ref" in schema:
        return f'components["schemas"]["{_ref_name(schema["$ref"])}"]'

    for union_key in ("anyOf", "oneOf"):
        if union_key in schema:
            return " | ".join(_schema_to_ts(item) for item in schema[union_key])

    if "allOf" in schema:
        return " & ".join(_schema_to_ts(item) for item in schema["allOf"])

    if "const" in schema:
        return _json(schema["const"])

    if "enum" in schema:
        return " | ".join(_json(item) for item in schema["enum"])

    schema_type = schema.get("type")

    if isinstance(schema_type, list):
        return " | ".join(
            _schema_to_ts({**schema, "type": item}) for item in schema_type
        )

    if schema_type == "string":
        return "string"
    if schema_type == "integer" or schema_type == "number":
        return "number"
    if schema_type == "boolean":
        return "boolean"
    if schema_type == "null":
        return "null"
    if schema_type == "array":
        return f"Array<{_schema_to_ts(schema.get('items', {}))}>"
    if schema_type == "object" or "properties" in schema:
        properties = schema.get("properties", {})
        required = set(schema.get("required", []))
        if not properties:
            additional = schema.get("additionalProperties")
            if isinstance(additional, dict):
                return f"Record<string, {_schema_to_ts(additional)}>"
            return "Record<string, unknown>"

        lines = ["{"]
        for name, prop_schema in properties.items():
            optional = "?" if name not in required else ""
            lines.append(f"  {_ts_key(name)}{optional}: {_schema_to_ts(prop_schema)};")
        lines.append("}")
        return "\n".join(lines)

    return "unknown"


def _operation_response_type(operation: dict[str, Any]) -> str:
    responses = operation.get("responses", {})
    for status_code in sorted(responses):
        if str(status_code).startswith("2"):
            content = responses[status_code].get("content", {})
            schema = content.get("application/json", {}).get("schema")
            if schema:
                return _schema_to_ts(schema)
    return "unknown"


def _operation_request_body(
    operation: dict[str, Any],
) -> tuple[str, bool] | None:
    request_body = operation.get("requestBody")
    if not request_body:
        return None

    schema = (
        request_body.get("content", {})
        .get("application/json", {})
        .get("schema")
    )
    if not schema:
        return None
    return _schema_to_ts(schema), bool(request_body.get("required"))


def _operation_path_parameters(
    operation: dict[str, Any],
) -> list[tuple[str, str]]:
    parameters = []
    for parameter in operation.get("parameters", []):
        if parameter.get("in") != "path":
            continue
        parameters.append(
            (
                parameter["name"],
                _schema_to_ts(parameter.get("schema", {})),
            )
        )
    return parameters


def _camel_case(value: str) -> str:
    parts = re.split(r"[_\-\s]+", value)
    return parts[0] + "".join(part[:1].upper() + part[1:] for part in parts[1:])


def _emit_components(schemas: dict[str, Any]) -> str:
    lines = ["export type components = {", "  schemas: {"]
    for name in sorted(schemas):
        lines.append(f'    "{name}": {_schema_to_ts(schemas[name])};')
    lines.extend(["  };", "};"])
    return "\n".join(lines)


def _emit_paths(paths: dict[str, Any]) -> str:
    lines = ["export type paths = {"]
    for path in sorted(paths):
        lines.append(f'  "{path}": {{')
        for method in sorted(paths[path]):
            operation = paths[path][method]
            lines.append(f"    {method}: {{")
            if operation.get("operationId"):
                lines.append(f'      operationId: "{operation["operationId"]}";')
            path_parameters = _operation_path_parameters(operation)
            if path_parameters:
                lines.append("      parameters: {")
                lines.append("        path: {")
                for name, parameter_type in path_parameters:
                    lines.append(
                        f"          {_ts_key(name)}: {parameter_type};"
                    )
                lines.append("        };")
                lines.append("      };")
            request_body = _operation_request_body(operation)
            if request_body:
                body_type, required = request_body
                optional = "" if required else "?"
                lines.append("      requestBody: {")
                lines.append(f"        required: {str(required).lower()};")
                lines.append("        content: {")
                lines.append(f'          "application/json"{optional}: {body_type};')
                lines.append("        };")
                lines.append("      };")
            lines.append("      responses: {")
            for status_code, response in sorted(operation.get("responses", {}).items()):
                content = response.get("content", {})
                schema = content.get("application/json", {}).get("schema")
                body_type = _schema_to_ts(schema) if schema else "unknown"
                lines.append(f'        "{status_code}": {{')
                lines.append("          content: {")
                lines.append(f'            "application/json": {body_type};')
                lines.append("          };")
                lines.append("        };")
            lines.append("      };")
            lines.append("    };")
        lines.append("  };")
    lines.append("};")
    return "\n".join(lines)


def _emit_client(paths: dict[str, Any]) -> str:
    lines = [
        'export type ApiErrorEnvelope = components["schemas"]["ErrorResponse"];',
        'export type HealthResponse = components["schemas"]["HealthResponse"];',
        "export type AccessTokenProvider = () => string | null;",
        "",
        "export class GeneratedApiClient {",
        "  constructor(",
        '    private readonly baseUrl = "http://localhost:8000",',
        "    private readonly accessTokenProvider?: AccessTokenProvider",
        "  ) {}",
        "",
    ]

    for path in sorted(paths):
        for method, operation in sorted(paths[path].items()):
            operation_id = operation.get("operationId")
            if not operation_id:
                continue
            method_name = _camel_case(operation_id)
            response_type = _operation_response_type(operation)
            request_body = _operation_request_body(operation)
            path_parameters = _operation_path_parameters(operation)
            method_parameters = [
                f"{_camel_case(name)}: {parameter_type}"
                for name, parameter_type in path_parameters
            ]
            request_path = _json(path)
            for name, _parameter_type in path_parameters:
                argument_name = _camel_case(name)
                request_path += (
                    f'.replace("{{{name}}}", '
                    f"encodeURIComponent(String({argument_name})))"
                )
            if request_body:
                body_type, required = request_body
                if required:
                    method_parameters.append(f"body: {body_type}")
                else:
                    method_parameters.append(f"body: {body_type} = null")
                method_parameters.append("options: RequestInit = {}")
                signature = ", ".join(method_parameters)
                lines.append(
                    f"  async {method_name}({signature}): Promise<{response_type}> {{"
                )
                lines.append(
                    f"    return this.request<{response_type}>({request_path}, {{"
                )
                lines.append("      ...options,")
                lines.append(f'      method: "{method.upper()}",')
                lines.append("      body: body === null ? undefined : JSON.stringify(body)")
                lines.append("    });")
            else:
                method_parameters.append("options: RequestInit = {}")
                signature = ", ".join(method_parameters)
                lines.append(
                    f"  async {method_name}({signature}): Promise<{response_type}> {{"
                )
                lines.append(
                    f'    return this.request<{response_type}>({request_path}, {{ ...options, method: "{method.upper()}" }});'
                )
            lines.append("  }")
            lines.append("")

    lines.extend(
        [
            "  private async request<TResponse>(",
            "    path: string,",
            "    init: RequestInit",
            "  ): Promise<TResponse> {",
            "    const headers = new Headers(init.headers);",
            '    headers.set("Accept", "application/json");',
            "    if (init.body) {",
            '      headers.set("Content-Type", "application/json");',
            "    }",
            "",
            "    const accessToken = this.accessTokenProvider?.();",
            '    if (accessToken && !headers.has("Authorization")) {',
            '      headers.set("Authorization", `Bearer ${accessToken}`);',
            "    }",
            "",
            "    const response = await fetch(`${this.baseUrl}${path}`, {",
            "      ...init,",
            "      headers",
            "    });",
            "",
            "    if (!response.ok) {",
            "      const payload = (await response.json().catch(() => null)) as ApiErrorEnvelope | null;",
            '      throw new Error(payload?.error.message ?? "Request failed");',
            "    }",
            "",
            "    return (await response.json()) as TResponse;",
            "  }",
            "}",
        ]
    )
    return "\n".join(lines)


def main() -> None:
    openapi = json.loads(OPENAPI_PATH.read_text(encoding="utf-8"))
    schemas = openapi.get("components", {}).get("schemas", {})
    paths = openapi.get("paths", {})

    CONTRACTS_DIR.mkdir(parents=True, exist_ok=True)

    header = "/* Generated from shared/openapi/openapi.json. Do not edit manually. */\n\n"
    api_ts = "\n\n".join(
        [
            _emit_components(schemas),
            _emit_paths(paths),
            _emit_client(paths),
        ]
    )
    (CONTRACTS_DIR / "api.ts").write_text(header + api_ts + "\n", encoding="utf-8")

    (CONTRACTS_DIR / "errors.ts").write_text(
        header
        + 'import type { components } from "./api";\n\n'
        + 'export type ErrorCode = components["schemas"]["ErrorCode"];\n'
        + 'export type ErrorDetail = components["schemas"]["ErrorDetail"];\n'
        + 'export type ApiErrorEnvelope = components["schemas"]["ErrorResponse"];\n',
        encoding="utf-8",
    )
    (CONTRACTS_DIR / "events.ts").write_text(
        header
        + 'import type { components } from "./api";\n\n'
        + 'export type EventType = components["schemas"]["EventType"];\n'
        + 'export type GameEvent = components["schemas"]["GameEvent"];\n',
        encoding="utf-8",
    )
    print(f"Wrote {CONTRACTS_DIR.relative_to(REPO_ROOT)}")


if __name__ == "__main__":
    main()
