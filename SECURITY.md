# Security Policy

## Supported Version

The current supported portfolio version is `1.0.0`.

## Reporting a Vulnerability

Please report security issues privately to the project owner before opening a public issue.

Include:

- Affected area.
- Steps to reproduce.
- Expected impact.
- Suggested fix if known.

## Security Notes

- Do not commit secrets.
- Use environment variables for tokens, database URLs, and provider keys.
- Keep `JWT_SECRET` configured outside local development.
- The AI provider can run in deterministic/mock mode without external keys.
