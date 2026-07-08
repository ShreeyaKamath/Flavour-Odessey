# Contributing

Thank you for your interest in Flavor Odyssey.

## Before You Start

Read:

- `docs/00_SOURCE_OF_TRUTH.md`
- `docs/Contributing.md`
- `docs/Code_Style.md`

## Local Validation

Frontend:

```powershell
cd frontend
npm run format
npm run typecheck
npm run lint
npm test
npm run build
```

Backend tests are required when backend code changes:

```powershell
cd backend
pytest
```

## Pull Requests

- Keep pull requests focused.
- Include screenshots for UI changes.
- Include validation results.
- Do not add new gameplay, APIs, or AI systems unless the issue explicitly asks for them.
