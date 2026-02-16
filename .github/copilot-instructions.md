# Copilot Instructions for This Repository

## Development Checklist

- Use ESM syntax everywhere (`"type": "module"` in package.json).
- TypeScript strict mode; target ES2022, module ESNext (see tsconfig.json).
- Use Commander for CLI, Ink/React for TUI, simple-git/Octokit for GitHub, Azure DevOps REST for Azure.
- Place CLI commands in `src/commands/`, business logic in `src/services/`, TUI components in `src/ui/`.
- All CLI commands MUST support `--json` and `--quiet` flags for automation-friendly output.
- Only overwrite config files with `--force`; use `safeWriteFile()` from `src/utils/fs.ts`.
- Windows/macOS/Linux compatibility required — use `path.join()`, avoid shell-specific syntax.
- Do not add new build/lint/test tools; use existing npm scripts.

## Overview

**Primer** is a TypeScript CLI for priming repositories for AI-assisted development — generating Copilot instructions, VS Code configs, MCP configs, and evaluating AI agent effectiveness.

- **Entrypoint:** `src/index.ts` → `runCli()` in `src/cli.ts`
- **Tech:** TypeScript (ESM, strict), Node.js, React 19 (Ink 6 for TUI), Copilot SDK

## Build & Test

```sh
npm run build          # tsup → dist/
npm run dev            # tsx watch for development
npm run typecheck      # tsc --noEmit
npm run lint           # eslint (flat config)
npm run format         # prettier --write
npm run test           # vitest
npm run test:coverage  # vitest with v8 coverage → ./coverage/
```

Run locally without building: `npx tsx src/index.ts <command> [options]`

## Architecture

### Commands (`src/commands/`)

Commands are thin orchestrators — they parse options, call services, and format output.

| Command           | File                 | Purpose                                                                |
| ----------------- | -------------------- | ---------------------------------------------------------------------- |
| `init`            | `init.ts`            | Interactive/headless repo setup (local, GitHub, Azure)                 |
| `analyze`         | `analyze.ts`         | Detect languages, frameworks, monorepo structure, areas                |
| `generate`        | `generate.ts`        | Generate instructions, agents, mcp, vscode configs                     |
| `instructions`    | `instructions.ts`    | Generate root + per-area `.instructions.md` files                      |
| `pr`              | `pr.ts`              | Create PR with configs on GitHub or Azure DevOps                       |
| `eval`            | `eval.ts`            | Compare responses with/without instructions; `--init` scaffolds config |
| `readiness`       | `readiness.ts`       | AI readiness assessment across 9 pillars                               |
| `tui`             | `tui.tsx`            | Full interactive TUI (model picker, areas, eval)                       |
| `batch`           | `batch.tsx`          | Bulk-process repos (GitHub or Azure); TUI or headless                  |
| `batch-readiness` | `batchReadiness.tsx` | Batch readiness HTML report generation                                 |

### Services (`src/services/`)

Services contain all business logic. Commands never access APIs or filesystem directly.

| Service           | Key Exports                                                            | Purpose                                                         |
| ----------------- | ---------------------------------------------------------------------- | --------------------------------------------------------------- |
| `analyzer.ts`     | `analyzeRepo()`, `loadPrimerConfig()`                                  | Repo analysis: languages, frameworks, monorepo detection, areas |
| `instructions.ts` | `generateCopilotInstructions()`, `generateAreaInstructions()`          | Copilot SDK sessions for instruction generation                 |
| `generator.ts`    | `generateConfigs()`                                                    | Write `.vscode/mcp.json` and `.vscode/settings.json`            |
| `evaluator.ts`    | `runEval()`                                                            | Run evals comparing with/without instructions                   |
| `evalScaffold.ts` | `generateEvalScaffold()`                                               | Auto-generate `primer.eval.json` test cases                     |
| `readiness.ts`    | `runReadinessReport()`                                                 | 9-pillar readiness assessment                                   |
| `git.ts`          | `cloneRepo()`, `checkoutBranch()`, `commitAll()`, `pushBranch()`       | Git operations with sanitized auth URLs                         |
| `github.ts`       | `createGitHubClient()`, `createPullRequest()`, `listAccessibleRepos()` | GitHub API via Octokit                                          |
| `azureDevops.ts`  | `listOrganizations()`, `listRepos()`, `createPullRequest()`            | Azure DevOps REST API; PAT auth                                 |
| `batch.ts`        | `processGitHubRepo()`, `processAzureRepo()`                            | Batch clone → generate → PR pipeline                            |
| `copilot.ts`      | `assertCopilotCliReady()`, `listCopilotModels()`                       | Validate Copilot CLI availability; discover models              |
| `visualReport.ts` | `generateVisualReport()`                                               | HTML readiness report with dark/light themes                    |

### UI (`src/ui/`)

Ink/React components for interactive terminal workflows:

- `tui.tsx` — Main TUI state machine (intro → idle → generating → …)
- `BatchTui.tsx` / `BatchTuiAzure.tsx` — GitHub/Azure batch processing UIs
- `BatchReadinessTui.tsx` — Batch readiness report UI
- `AnimatedBanner.tsx` — Intro animation (skip with `--no-animation`)

### Utils (`src/utils/`)

- `output.ts` — `CommandResult<T>` type (`{ ok, status, data?, errors? }`), `ProgressReporter` interface
- `fs.ts` — `safeWriteFile()` (rejects symlinks, requires `--force`), `validateCachePath()` (prevents path traversal)
- `logger.ts` — Structured logging
- `repo.ts` / `pr.ts` — Shared repo/PR helpers

## Conventions

- **Output discipline:** `stdout` is for JSON only (with `--json`); human-readable output goes to `stderr`
- **CommandResult pattern:** All commands return `CommandResult<T>` with `{ ok, status, data?, errors? }`
- **Safe writes:** `safeWriteFile()` rejects symlinks and skips existing files unless `--force`
- **Path safety:** `validateCachePath()` prevents traversal in `.primer-cache/`
- **Copilot SDK:** Sessions use `workingDirectory` in `SessionConfig` for scoping tool operations
- **Monorepo-aware:** Analyzer detects npm/pnpm/yarn/cargo/go/dotnet/gradle/maven workspaces; `Area` type scopes instructions via `applyTo` globs
- **Single glob pass** for convention source discovery (see `src/services/instructions.ts`)

## Prerequisites

- **Copilot CLI** must be installed and authenticated for SDK calls (`copilot.ts` validates this)
- **GitHub:** `GITHUB_TOKEN` or `GH_TOKEN` env var, or `gh` CLI for token extraction
- **Azure DevOps:** `AZURE_DEVOPS_PAT` env var for Azure operations
