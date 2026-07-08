# Testing

## Frontend

Run:

```powershell
cd frontend
npm run format
npm run typecheck
npm run lint
npm test
npm run build
```

Coverage focus:

- Auth store and protected routes.
- Generated API client behavior.
- World map and gameplay flow.
- Crafting, animation, audio, Lumi, NPC, cinematics, and production fallback helpers.
- Showcase and about screens.

## Backend

Run:

```powershell
cd backend
pytest
```

Backend tests should run whenever backend routes, schemas, services, migrations, or AI backend modules change.

## Manual Demo Checks

- Open `/`.
- Open `/showcase`.
- Open `/about`.
- Login or guest login.
- Open `/world`.
- Enter `/game?island=joy_meadow`.
- Verify error fallback behavior by stopping the backend.
