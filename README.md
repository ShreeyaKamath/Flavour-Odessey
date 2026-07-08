<div align="center">

# Flavor Odyssey

**A cozy fantasy engineering showcase about restoring emotions through magical ice cream.**

[![Frontend](https://img.shields.io/badge/frontend-Next.js%20%2B%20TypeScript-0f766e)](#technology-stack)
[![Backend](https://img.shields.io/badge/backend-FastAPI-2563eb)](#technology-stack)
[![AI](https://img.shields.io/badge/AI-mock%20provider%20ready-7c3aed)](#ai-system-overview)
[![Status](https://img.shields.io/badge/status-Version%201.0%20portfolio%20MVP-b45309)](#roadmap)
[![License](https://img.shields.io/badge/license-placeholder-lightgrey)](#license)

```
              .-""""-.
           .'  FO      '.
          /  Flavor      \
         |   Odyssey      |
          \  Joy Meadow  /
           '.          .'
             '-......-'
```

Logo and screenshots are placeholder-ready until final owned artwork is added.

</div>

## Table of Contents

- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Screenshots](#screenshots)
- [Gameplay Overview](#gameplay-overview)
- [Architecture Overview](#architecture-overview)
- [AI System Overview](#ai-system-overview)
- [Technology Stack](#technology-stack)
- [Folder Structure](#folder-structure)
- [Installation Guide](#installation-guide)
- [Local Development](#local-development)
- [Deployment Guide](#deployment-guide)
- [Testing](#testing)
- [Performance](#performance)
- [Accessibility](#accessibility)
- [Roadmap](#roadmap)
- [Credits](#credits)
- [License](#license)
- [Contact](#contact)

## Project Overview

Flavor Odyssey is a polished MVP and portfolio project built around one playable vertical slice: Joy Meadow. The player can enter the meadow, meet Lumi, interact with NPC systems, collect ingredients, craft Golden Vanilla Bloom, restore Joy, and view a Journal of Memories entry.

The project demonstrates full-stack product thinking:

- Typed backend contracts and generated frontend API types.
- FastAPI services with authentication, world, gameplay, journal, AI, and health foundations.
- Next.js App Router frontend with storybook UI, animation, audio, living weather, cinematics, and production fallbacks.
- AI-ready architecture that runs deterministically without requiring a real LLM key.
- Portfolio showcase mode for reviewers, capstone demos, hackathon judging, and GitHub visitors.

## Key Features

- Joy Meadow MVP gameplay loop with authenticated progress.
- Guest and registered authentication foundation.
- Generated OpenAPI contracts shared with the frontend.
- Storybook-inspired UI with magical panels, cookbook, satchel, journal, and settings.
- Lumi companion systems, NPC presentation, deterministic AI fallback, and memory-aware prompts.
- Living weather/time visuals, audio placeholders, cinematic overlays, and crafting presentation.
- Production readiness pass with storage, WebGL, audio, asset, and offline fallback behavior.
- Showcase mode with architecture viewer, feature overview, system information, credits, and screenshot placeholders.

## Screenshots

Final screenshots can be captured from the built app. Placeholder-ready slots are available in `/showcase` for:

| Screen          | Route                     |
| --------------- | ------------------------- |
| Landing Page    | `/`                       |
| Main Menu       | `/menu`                   |
| Gameplay        | `/game?island=joy_meadow` |
| Crafting        | `/recipes`                |
| NPC Interaction | `/game?island=joy_meadow` |
| Lumi            | `/game?island=joy_meadow` |
| Storybook       | `/showcase`               |
| Weather         | `/game?island=joy_meadow` |
| Journal         | `/journal`                |
| Settings        | `/settings`               |
| Credits         | `/about`                  |

## Gameplay Overview

The current MVP scope focuses on Joy Meadow:

1. Start or resume an authenticated session.
2. Open the world map and enter Joy Meadow.
3. Meet Lumi and meadow NPCs.
4. Collect `vanilla_orchid` and `honey_bloom`.
5. Start the quest `Restore the First Scoop`.
6. Craft `Golden Vanilla Bloom`.
7. Restore Joy Meadow.
8. Create and view `The Day Joy Returned` in the journal.

No additional islands, multiplayer, economy, combat, or advanced future systems are implemented in this version.

## Architecture Overview

Flavor Odyssey is organized as a modular monorepo:

- `frontend/` owns rendering, routing, state, audio, animation, showcase mode, and UI.
- `backend/` owns API routes, schemas, auth, world, gameplay, persistence, and service boundaries.
- `ai/` owns provider abstractions, agents, prompts, schemas, and deterministic test behavior.
- `shared/` owns OpenAPI output and generated contracts.
- `docs/` owns product, engineering, deployment, and release documentation.

More detail is available in [docs/Architecture.md](docs/Architecture.md) and [docs/Game_Architecture.md](docs/Game_Architecture.md).

## AI System Overview

The MVP AI layer is provider-driven and deterministic by default. It includes:

- Memory Agent.
- NPC Agent.
- Recipe Agent.
- Companion Agent.
- Narrative Helper.

The frontend can show generated or fallback text without requiring real LLM credentials. The architecture is ready for future provider integration while keeping tests stable. See [docs/AI_Architecture.md](docs/AI_Architecture.md).

## Technology Stack

| Area       | Tools                                                                                |
| ---------- | ------------------------------------------------------------------------------------ |
| Frontend   | Next.js, React, TypeScript, Tailwind CSS, Framer Motion, React Three Fiber, Three.js |
| Backend    | FastAPI, SQLAlchemy, PostgreSQL, Redis, pytest                                       |
| AI         | Provider abstraction, mock LLM provider, deterministic fallback agents               |
| Contracts  | OpenAPI, generated TypeScript contracts                                              |
| Testing    | Vitest, React Testing Library, pytest                                                |
| Deployment | Docker-ready structure, Vercel/Render/Fly/Railway-friendly docs                      |

## Folder Structure

```text
FlavorOdessey/
|-- frontend/
|-- backend/
|-- ai/
|-- shared/
|-- database/
|-- docs/
|-- assets/
|-- audio/
|-- infrastructure/
|-- tests/
`-- .github/
```

## Installation Guide

Prerequisites:

- Node.js 20+
- Python 3.11+
- Docker Desktop for Postgres and Redis

Install frontend dependencies:

```powershell
cd frontend
npm install
```

Install backend dependencies:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Copy environment values:

```powershell
Copy-Item .env.example .env
```

## Local Development

Start infrastructure:

```powershell
docker compose up db redis
```

Start backend:

```powershell
cd backend
uvicorn app.main:app --reload
```

Start frontend:

```powershell
cd frontend
npm run dev
```

Open:

```text
http://localhost:3000
```

## Deployment Guide

Production deployment should configure:

- `NEXT_PUBLIC_API_URL` as the deployed backend `https` URL.
- `NEXT_PUBLIC_WS_URL` as the deployed websocket `wss` URL when websocket events are enabled.
- `DATABASE_URL`, `REDIS_URL`, and `JWT_SECRET` for backend services.
- A managed Postgres and Redis provider for production data.

See [docs/Deployment.md](docs/Deployment.md).

## Testing

Frontend:

```powershell
cd frontend
npm run format
npm run typecheck
npm run lint
npm test
npm run build
```

Backend:

```powershell
cd backend
pytest
```

## Performance

Production readiness includes:

- Route-level lazy loading for major showcase/game screens.
- Asset preload fallback behavior.
- Particle count budgets.
- Page visibility pause behavior.
- Reduced motion support.
- WebGL/canvas fallback UI.
- Audio and storage fallback notices.

## Accessibility

The app includes:

- Keyboard-accessible controls.
- Screen reader labels for major routes and fallback panels.
- Reduced motion support through OS preference and in-app settings.
- Visible focus states.
- Friendly notices for offline, unavailable storage, unavailable audio, and unavailable WebGL.

## Roadmap

Completed for Version 1.0 portfolio MVP:

- Backend foundation, database, auth, contracts, world, gameplay, AI foundation, animation, audio, living world, crafting presentation, Lumi companion, weather/time, storybook UI, rendering pipeline, cinematics, production readiness, and portfolio release mode.

Future work:

- Replace placeholder art/audio with owned final assets.
- Add final screenshot captures and hosted demo link.
- Expand beyond Joy Meadow only after a future phase explicitly schedules it.
- Integrate a production LLM provider behind the existing AI provider abstraction.
- Add CI deployment automation and hosted staging environment.

## Credits

- Project owner: Shreeya Kamath.
- Engineering implementation: Codex-assisted iterative development.
- Framework ecosystem: Next.js, React, FastAPI, SQLAlchemy, Tailwind CSS, Framer Motion, Three.js, Vitest, and pytest.
- Placeholder assets and audio are local-safe and replaceable.

## License

License is currently a placeholder. See [LICENSE](LICENSE). Until a final license is selected, all rights are reserved by the project owner.

## Contact

- GitHub: [ShreeyaKamath/Flavour-Odessey](https://github.com/ShreeyaKamath/Flavour-Odessey)
- Portfolio use: capstone, internship, placement, hackathon, and engineering showcase.
