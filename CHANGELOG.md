# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Features

- **`--dry-run` on `instructions` command** — Preview what files would be generated without writing anything to disk. Works across all code paths (nested root, flat root, nested area, flat area). With `--json`, emits a unified `dryRunFiles` array with file paths and byte counts. ([#55](https://github.com/microsoft/agentrc/pull/55))
- **VS Code: Batch Instructions (`AgentRC: Generate Instructions (All Roots)`)** — New command for multi-root workspaces that generates instructions for every workspace root in one pass. Respects per-root `agentrc.config.json` strategy. Only visible when `workspaceFolderCount > 1`. ([#55](https://github.com/microsoft/agentrc/pull/55))
- **VS Code: Multi-root workspace support** — All extension commands now use `pickWorkspacePath()` showing a QuickPick when multiple roots are open. Single-root workspaces return immediately with no prompt change. ([#55](https://github.com/microsoft/agentrc/pull/55))
- **Enhanced .NET detection** — F# language detection via `.fsproj` files; `global.json` and `Directory.Build.props` now trigger .NET platform detection; `packages.lock.json` recognized as a NuGet lock file. ([#60](https://github.com/microsoft/agentrc/pull/60))
- **.NET framework detection** — New `detectDotnetFrameworks()` parses `*.csproj`/`*.fsproj` XML to identify frameworks: ASP.NET Core, Blazor WebAssembly, Blazor, Entity Framework, .NET MAUI, Xamarin, WPF, Windows Forms, xUnit, NUnit, MSTest, and Console apps. ([#60](https://github.com/microsoft/agentrc/pull/60))

### Improvements

- **Model default updated to `claude-sonnet-4.6`** — Default model for instruction generation, eval scaffolding, and batch operations updated from `claude-sonnet-4.5` to `claude-sonnet-4.6`. ([#55](https://github.com/microsoft/agentrc/pull/55))
- **TUI key bindings** — **R** key runs the readiness report (loading policy from `agentrc.config.json`); **N** key generates nested area instructions (replaces **F**). ([#55](https://github.com/microsoft/agentrc/pull/55))
- **VS Code readiness command** — Loads policy count from `agentrc.config.json` and surfaces it in the notification. ([#55](https://github.com/microsoft/agentrc/pull/55))
- **Area QuickPick** — Extension area picker now shows `applyTo` patterns in the detail field. ([#55](https://github.com/microsoft/agentrc/pull/55))

### Fixes

- **Windows: `.bat`/`.cmd` shim spawn** — On Windows, the Copilot CLI resolved from VS Code globalStorage (`copilot.bat`) now bypasses the SDK-managed spawn path and goes directly to external server mode, eliminating `spawn EINVAL` errors. ([#53](https://github.com/microsoft/agentrc/pull/53))
- **ESM/CJS interop** — Added a `createRequire` banner to the tsup bundle, fixing `Dynamic require of "util" is not supported` errors when CJS dependencies (e.g. `vscode-jsonrpc`) are bundled into ESM output. ([#52](https://github.com/microsoft/agentrc/pull/52))

### Terminology

- "AI readiness" → "readiness" across CLI output, docs, and extension labels.
- "Copilot instructions" → "instructions" in descriptions and UI.
- "file-based instructions" → "area instructions" in criteria messages and code comments.
- PR body text de-branded: "GitHub Copilot" → "AI coding assistants". ([#55](https://github.com/microsoft/agentrc/pull/55))

## [2.0.0]

### Complete Rewrite

AgentRC vNext is a complete rewrite as a TypeScript CLI tool (ESM, strict, ES2022) for priming repositories for AI-assisted development and evaluation.

### New Commands

- **`agentrc readiness`** — AI readiness report scoring repos across 9 pillars (style, build, testing, docs, dev-env, code-quality, observability, security, AI tooling) with a 5-level maturity model (Functional → Autonomous).
- **`agentrc readiness --visual`** — GitHub-themed HTML report with light/dark toggle, expandable pillar details, and maturity model descriptions.
- **`agentrc readiness --per-area`** — Per-area readiness scoring for monorepos with area-scoped criteria and aggregate thresholds.
- **`agentrc readiness --policy`** — Customizable readiness policies (disable/override criteria, tune thresholds) via JSON, JS/TS, or npm packages; chainable with last-wins semantics.
- **`agentrc batch-readiness`** — Consolidated visual readiness report across multiple repositories, with `--policy` support.
- **`agentrc generate instructions`** — Generate `copilot-instructions.md` via Copilot SDK, with `--per-app` support for monorepos.
- **`agentrc generate agents`** — Generate `AGENTS.md` guidance files.
- **`agentrc instructions --areas`** — Generate file-based `.instructions.md` files scoped to detected areas with `applyTo` glob patterns.
- **`agentrc eval --init`** — AI-powered eval scaffold generation that analyzes codebases and produces cross-cutting, area-aware eval cases.
- **`agentrc eval --list-models`** — List available Copilot CLI models.
- **`agentrc analyze`** — Standalone repo analysis command with structured `--json` output.

### VS Code Extension

- 8 command palette commands: Analyze, Generate Configs, Generate Instructions, AI Readiness Report, Run Eval, Scaffold Eval, Initialize Repository, Create PR.
- Sidebar tree views: Analysis (languages, frameworks, monorepo areas) and Readiness (9-pillar scores with color-coded criteria).
- Webview panels for readiness HTML reports and eval results.
- Dynamic status bar showing detected languages after analysis.
- PR creation with default-branch guard, selective file staging, and GitHub auth via VS Code API.
- esbuild-bundled CJS output; CI typecheck and release-time VSIX packaging.

### New Features

- **Azure DevOps integration** — Full support for batch processing, PR creation, and repo cloning via Azure DevOps PAT authentication.
- **Headless automation** — Global `--json` and `--quiet` flags on all commands; `CommandResult<T>` envelope with `ok`/`status`/`data`/`errors`. Headless batch mode via positional args or stdin piping.
- **Policy system** — Layered policy chain for readiness reports: disable/override criteria, add extras, tune pass-rate thresholds. Config-sourced policies restricted to JSON-only for security.
- **Per-area readiness** — 4 area-scoped criteria (`area-readme`, `area-build-script`, `area-test-script`, `area-instructions`) with 80% aggregate pass threshold.
- **File-based area instructions** — `.instructions.md` files with YAML frontmatter (`description`, `applyTo`) for VS Code Copilot area scoping.
- **Expanded monorepo detection** — Bazel (`MODULE.bazel`/`WORKSPACE`), Nx (`project.json`), Pants (`pants.toml`), Turborepo overlay, in addition to Cargo, Go, .NET, Gradle, Maven, npm/pnpm/yarn workspaces.
- **Smart area fallback** — Large repos with 10+ top-level dirs automatically discover areas via heuristic scanning with symlink-safe directory traversal.
- **Eval trajectory viewer** — Interactive HTML viewer comparing responses with/without instructions, including token usage, tool call metrics, and duration tracking.
- **Windows Copilot CLI support** — `.cmd`/`.bat` wrapper handling via `cmd /c`, npm-loader.js detection, and `CopilotCliConfig` type replacing bare string paths.
- **Copilot CLI discovery** — Cross-platform discovery with TTL caching and glob-based fallback for VS Code extension paths.
- **Centralized model defaults** — Default model set to `claude-sonnet-4.6` via `src/config.ts`.

### Improvements

- All file write paths now use `safeWriteFile()` — instructions, agents, and area files all reject symlinks and respect `--force`.
- Unified `agentrc pr` command: both GitHub and Azure DevOps generate all three artifacts (instructions + MCP + VS Code configs) with consistent branch naming.
- `CommandResult<T>` output envelope with structured JSON to stdout; human-readable output to stderr.
- `ProgressReporter` interface for silent or human-readable progress across CLI and headless modes.
- Symlink-safe directory scanning via `isScannableDirectory()` with `lstat` + `realpath` containment checks.
- Path traversal protection via `validateCachePath` for cloned repo paths and double-layer defense for area `applyTo` patterns.
- Credential sanitization in git push error messages to prevent token leaks.
- `buildAuthedUrl` utility supporting both GitHub (`x-access-token`) and Azure DevOps (`pat`) auth.
- `checkRepoHasInstructions` now re-throws non-404 errors instead of silently returning false.
- `init --yes` now generates instructions, MCP, and VS Code configs (previously only instructions).
- CSP meta tags added to eval and readiness HTML report generators.

### Removed

- Removed stub commands: `templates`, `update`, `config`.
- Removed `src/utils/cwd.ts` — replaced by Copilot SDK `workingDirectory` session config.

### Testing & Tooling

- Vitest test framework with 267 tests across 13 test files covering analyzer, generator, git, readiness, visual report, fs utilities, cache path validation, policies, boundaries, CLI, output utilities, and PR helpers.
- ESLint flat config with TypeScript, import ordering, and Prettier integration.
- CI workflow with lint, typecheck, tests (Node 20/22, Ubuntu/macOS/Windows), build verification, and extension typecheck.
- CI dogfooding: runs `agentrc analyze --json` and `agentrc readiness --json` on the repo itself.
- Release automation via release-please with VSIX packaging for the VS Code extension.
- Code coverage via `@vitest/coverage-v8`.

### Project Setup

- Added CONTRIBUTING.md, SECURITY.md, LICENSE (MIT), and CODEOWNERS.
- Added issue templates (bug report, feature request) and PR template.
- Added `.github/agents/` with multi-model code review agents (Opus, Gemini, Codex).
- Added `.github/prompts/` with reusable prompts (deslop, review, generate-improvements).
- Added examples folder with sample eval config and CLI usage guide.
- Added `.prettierrc.json` with project formatting rules.
