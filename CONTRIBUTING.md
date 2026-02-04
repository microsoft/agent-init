# Contributing

Thanks for contributing to Primer.

## Quick start

1. Fork and clone the repo.
2. Install dependencies: npm install
3. Build locally: npm run build
4. Run lint/typecheck/tests before opening a PR:
   - npm run lint
   - npm run typecheck
   - npm run test

## Development workflow

- Create a feature branch from main.
- Use clear, conventional commit messages (e.g. feat: add readiness report).
- Keep PRs focused and include context in the description.
- Add or update tests when behavior changes.

## Code style

- ESLint + Prettier are enforced in CI.
- Prefer small, composable functions with clear types.

## Reporting issues

- Use GitHub Issues for bugs and feature requests.
- Provide steps to reproduce and expected behavior.

## Releasing

Releases are automated with release-please when changes are merged to main.
