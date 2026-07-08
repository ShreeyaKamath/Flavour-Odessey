# Code Style

## TypeScript

- Use strict TypeScript.
- Prefer typed data structures over loose records.
- Keep business logic outside UI components.
- Use existing components and hooks before creating new abstractions.
- Add documentation comments for exported components and utilities.

## React

- Use functional components.
- Preserve keyboard and screen reader accessibility.
- Respect reduced motion.
- Use design tokens and existing utility classes.

## Python

- Use type hints.
- Keep FastAPI routes thin.
- Put domain logic in services.
- Preserve consistent error envelopes.

## Formatting

Frontend:

```powershell
npm run format
npm run lint
```

Backend:

Use Ruff/Black-compatible formatting.
