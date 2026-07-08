# AI Architecture

## Scope

The Version 1.0 AI layer is AI-ready and deterministic. It demonstrates how real providers can be connected later without making tests depend on external services.

## Agents

- Memory Agent reads and writes player-scoped memories.
- NPC Agent creates concise Joy Meadow dialogue.
- Recipe Agent creates flavor and lore descriptions.
- Companion Agent powers Lumi hints and reactions.
- Narrative Helper creates journal-style story text.

## Provider Strategy

The backend uses a provider abstraction:

- Mock provider for deterministic tests and local development.
- Future provider interface for real LLM integration.
- Timeout and retry-safe structure.
- Fallback behavior when AI is unavailable.

## Safety Rules

- No hallucinated islands beyond the MVP scope.
- Responses stay concise, warm, and whimsical.
- Canonical names such as `Golden Vanilla Bloom` and `The Day Joy Returned` are preserved.
- API routes do not call LLMs directly.
