## Teach AI About Your Code

Generate custom instruction files that help Copilot (and other AI tools) understand your codebase conventions, architecture, and preferences.

### Choose your format

- **copilot-instructions.md** — GitHub Copilot's native format, placed in `.github/`
- **AGENTS.md** — Broader agent instructions at the repo root

### Monorepo support

For monorepos, Primer can generate **per-area** instruction files scoped with `applyTo` glob patterns. Each area (frontend, backend, infra) gets its own tailored instructions.

### How it works

Primer uses the **Copilot SDK** to analyze your code and generate context-aware instructions. It reads your project structure, conventions, dependencies, and existing documentation to produce instructions that capture what makes your codebase unique.

Pick your format and areas when prompted — your instructions file opens automatically when done.
