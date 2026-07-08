# Deployment

## Target Environments

- Local development.
- Staging demo.
- Production portfolio deployment.

## Frontend

Recommended hosting: Vercel or another Next.js-compatible host.

Required public environment:

```env
NEXT_PUBLIC_API_URL=https://your-backend.example.com
NEXT_PUBLIC_WS_URL=wss://your-backend.example.com/ws/game
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_BUILD_CHANNEL=production
NEXT_PUBLIC_GIT_SHA=<commit>
```

## Backend

Recommended hosting: Render, Fly.io, Railway, or another Python service host.

Required environment:

```env
DATABASE_URL=
REDIS_URL=
JWT_SECRET=
AI_PROVIDER=mock
AI_TIMEOUT_SECONDS=2
AI_MAX_RETRIES=1
```

## Health Check

Backend health route:

```text
GET /health
```

Expected response:

```json
{ "status": "ok", "service": "flavor-odyssey-backend" }
```

## Release Checklist

1. Run frontend format, typecheck, lint, tests, and build.
2. Run backend tests if backend changed.
3. Confirm `.env` values are production-safe.
4. Confirm `/showcase` and `/about` render.
5. Confirm protected gameplay routes handle backend unavailable states.
6. Capture screenshots for README or portfolio submission.
