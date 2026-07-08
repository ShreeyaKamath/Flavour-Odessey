# Flavor Odyssey Architecture

## Purpose

This document summarizes the Version 1.0 portfolio architecture in a reviewer-friendly format. The detailed canonical references remain in the organized engineering documents.

## System Shape

Flavor Odyssey is a modular monorepo with clear ownership boundaries:

- `frontend/` renders the storybook UI, gameplay shell, showcase mode, audio, animation, cinematics, and production fallbacks.
- `backend/` exposes FastAPI routes and service-layer foundations for auth, world, gameplay, inventory, recipes, quests, journal, AI integration, and health.
- `ai/` contains deterministic provider-ready agents and prompts.
- `shared/` contains generated OpenAPI and TypeScript contracts.
- `docs/` contains product, engineering, process, deployment, and release documentation.

## Architectural Principles

- Backend schemas are the API source of truth.
- Frontend uses generated contracts instead of duplicating API types.
- Routes call services; services own domain behavior.
- UI components stay presentation-focused.
- AI integration is behind providers and service boundaries.
- Production fallbacks keep the app usable when optional browser features are unavailable.

## Runtime Flow

1. A user enters through splash, auth, or guest login.
2. Protected routes load server-backed state through the generated API client.
3. Gameplay actions mutate backend state and refresh client queries.
4. Audio, animation, Lumi, weather, and cinematic systems react to state and events.
5. Showcase mode exposes architecture and project information without changing gameplay.

## Production Readiness

The Phase 19 and Phase 20 work added:

- Route-level lazy loading.
- WebGL fallback UI.
- Storage and audio capability notices.
- Asset preload placeholder recovery.
- Centralized render budget helpers.
- Portfolio showcase routes and release documentation.
