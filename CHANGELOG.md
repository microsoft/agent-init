# Changelog

All notable changes to this project will be documented in this file.

## [2.1.0](https://github.com/pierceboggan/primer/compare/primer-v2.0.0...primer-v2.1.0) (2026-02-24)


### Features

* add custom policy support ([efd88f0](https://github.com/pierceboggan/primer/commit/efd88f05003b6e923aa566a274a3dd295b9e14b4))
* add maxWidth prop to banners ([30645e6](https://github.com/pierceboggan/primer/commit/30645e674e0e4acf2c1320ba9e536c7fe903df44))
* add multi-model code review prompt and synthesize findings into a prioritized fix list ([2c8843e](https://github.com/pierceboggan/primer/commit/2c8843eee26ff368c28ed9815e535e0c9196f097))
* add per-area readiness scoring, file-based instructions, and area-aware eval scaffold ([d55821e](https://github.com/pierceboggan/primer/commit/d55821e10c3854aaf42d3ffa3f1facde199c4ffe))
* add plugin-based policy engine with shadow mode ([067e675](https://github.com/pierceboggan/primer/commit/067e67530b1eba31a72d1d033fc45f26ff903897))
* add plugin-based policy engine with shadow mode ([e7f58d3](https://github.com/pierceboggan/primer/commit/e7f58d34956cdbb158931f8075dc0fe0c54df9f6))
* add VS Code extension wrapping CLI for key workflows ([b03d21b](https://github.com/pierceboggan/primer/commit/b03d21bea5ff2c910095d9b84ae3d58adcdcf957))
* add VS Code extension wrapping CLI for key workflows ([6bef466](https://github.com/pierceboggan/primer/commit/6bef46621ee03735c6731adb2a600cd931236715))
* add Windows Copilot CLI support with cliArgs and .bat/.cmd handling ([f2791b8](https://github.com/pierceboggan/primer/commit/f2791b842379734536295da37184595f7f2eba48))
* add Windows Copilot CLI support with cliArgs and .bat/.cmd handling ([f1592e4](https://github.com/pierceboggan/primer/commit/f1592e40ebd6793504d86c4383547b153cdcf8d0))
* **analyzer:** add .slnx support and fix package manager detection for Cargo/Go ([3109f7e](https://github.com/pierceboggan/primer/commit/3109f7e5cad7d937aa7d75100b39090eefc1b158))
* **analyzer:** add Bazel/Nx/Pants/Turborepo detection, smart fallback heuristics, and symlink-safe scanning ([b6d5cc2](https://github.com/pierceboggan/primer/commit/b6d5cc2157254b4f0e20b4e6bb90b9c1b9f994b3))
* **analyzer:** enhance repo analysis for non-JS ecosystems and improve workspace detection ([3257b1a](https://github.com/pierceboggan/primer/commit/3257b1af9160f769a9a3b94dd158c0fc2a075a91))
* **cli:** add option to list available Copilot models ([ac7f562](https://github.com/pierceboggan/primer/commit/ac7f562699dd180ab41e5613883980b918a1defc))
* consolidate vnext workstream (supersedes [#12](https://github.com/pierceboggan/primer/issues/12)) ([be2b2b6](https://github.com/pierceboggan/primer/commit/be2b2b69369120c8ada29cdb57dcdfc92e31fda3))
* **copilot:** create function to extract and list Copilot models from CLI help ([ac7f562](https://github.com/pierceboggan/primer/commit/ac7f562699dd180ab41e5613883980b918a1defc))
* enhance eval case generation prompts for deeper architectural analysis ([764d00c](https://github.com/pierceboggan/primer/commit/764d00cd43c7d6eff51e506f7f80999797e031aa))
* enhance instruction generation and PR body creation ([8b7722c](https://github.com/pierceboggan/primer/commit/8b7722c8bc356c256c2d538c8b750289c15d65c4))
* enhance language and package manager detection in analyzer service ([8b7722c](https://github.com/pierceboggan/primer/commit/8b7722c8bc356c256c2d538c8b750289c15d65c4))
* enhance TUI with eval and batch processing features ([77fc44e](https://github.com/pierceboggan/primer/commit/77fc44e6a52b9efabca0a3d7eb5970e4b5cb9b1c))
* **eval:** implement model listing functionality in eval command ([ac7f562](https://github.com/pierceboggan/primer/commit/ac7f562699dd180ab41e5613883980b918a1defc))
* **eval:** implement timeout handling for scaffold generation and improve error reporting ([cd48e73](https://github.com/pierceboggan/primer/commit/cd48e73cd1adb10e71e61a097e04a2538c29d620))
* **evaluator:** enhance trajectory viewer with phase filtering for tool calls ([ac7f562](https://github.com/pierceboggan/primer/commit/ac7f562699dd180ab41e5613883980b918a1defc))
* headless CLI with --json/--quiet, batch service, structured output ([f449a76](https://github.com/pierceboggan/primer/commit/f449a762c2f64b7452210a63d22fc6f042b87de1))
* headless CLI with --json/--quiet, batch service, structured output ([d9e75ca](https://github.com/pierceboggan/primer/commit/d9e75caa8b81d2e76c160310b307eda76daa7492))
* **readiness:** add instructions-consistency criterion to detect diverging AI instruction files ([444b3b0](https://github.com/pierceboggan/primer/commit/444b3b07ea609d8310668843def10bf55fbc6d88))
* **tui:** add readiness report feature with detailed output and user interaction ([ac7f562](https://github.com/pierceboggan/primer/commit/ac7f562699dd180ab41e5613883980b918a1defc))
* update trajectory viewer with new design and metrics display ([d1db068](https://github.com/pierceboggan/primer/commit/d1db06827587bc1a8da15b376916c85379c33c2c))
* VS Code extension onboarding — walkthrough, grouped readiness, format picker ([0384387](https://github.com/pierceboggan/primer/commit/0384387b7e7b79b4f66fb78ffeb16caa0813be4d))


### Bug Fixes

* add missing output directory ([9b2e8f3](https://github.com/pierceboggan/primer/commit/9b2e8f3d160bfe104e070dd6a71df96aa35cac61))
* address PR review — fix pkg name, version, PAT leak, error handling, dead stubs, typo ([24b110d](https://github.com/pierceboggan/primer/commit/24b110da23b2ae174977d577ea2c10185bca56bd))
* align table formatting in README ([95784a5](https://github.com/pierceboggan/primer/commit/95784a5caa13590e7ba9c67aca2b6b97aad217ab))
* audit command-service wiring gaps ([503b870](https://github.com/pierceboggan/primer/commit/503b870c79dd81d5bb95a86d66a534747eeaf06b))
* **azureDevops:** encode memberId in accounts URL ([3257b1a](https://github.com/pierceboggan/primer/commit/3257b1af9160f769a9a3b94dd158c0fc2a075a91))
* disable no-undef for TypeScript files ([954a95d](https://github.com/pierceboggan/primer/commit/954a95d4ad2bc3cf701c0ffe6d6c899d7ce9ac63))
* exclude vscode-extension from root ESLint config ([018610c](https://github.com/pierceboggan/primer/commit/018610c920edcdd8b9930dc10835048a34df9d50))
* guard Ink render() calls with try/catch, improve area filter type safety ([bb1e19d](https://github.com/pierceboggan/primer/commit/bb1e19dd01ed3b7bc12261bfe5a19cf9f8c165ef))
* improve path validation logic ([97ce317](https://github.com/pierceboggan/primer/commit/97ce317afd13b8b1f8b6e88bf89c9e766a1ba89b))
* remove dead code, fix import spacing and double blank lines ([6f3bcfd](https://github.com/pierceboggan/primer/commit/6f3bcfd330b276fbe95aaad22dedc4fa1c94f002))
* replace console.log with process.stderr.write in prettyPrintSummary ([b061e02](https://github.com/pierceboggan/primer/commit/b061e024f7614b29aae5fb014057e9c8d47ca3b6))
* resolve all ESLint errors — add node globals, disable base no-unused-vars, fix unused imports, auto-fix import order ([e7d3286](https://github.com/pierceboggan/primer/commit/e7d3286d274d3bb3115743d3d3e2eadaaf43d54b))
* sanitize error messages in git push ([8b7722c](https://github.com/pierceboggan/primer/commit/8b7722c8bc356c256c2d538c8b750289c15d65c4))
* **tui:** fix Esc key handling, guard idle keys, remove dead modelPicker state ([55cc9d4](https://github.com/pierceboggan/primer/commit/55cc9d4f6947d387a5fa0bc3a187a9974e0c8149))
* **ui:** handle errors during repo loading and processing ([3257b1a](https://github.com/pierceboggan/primer/commit/3257b1af9160f769a9a3b94dd158c0fc2a075a91))
* validate Azure DevOps slugs and improve error handling ([8b7722c](https://github.com/pierceboggan/primer/commit/8b7722c8bc356c256c2d538c8b750289c15d65c4))
* **vscode-extension:** resolve vsce packaging blockers ([e44b4ec](https://github.com/pierceboggan/primer/commit/e44b4ecb2796136ea030f2a53cd7278986eea0de))
* **vscode:** harden extension commands with overwrite flows, shared PR service, and UX polish ([03c3446](https://github.com/pierceboggan/primer/commit/03c3446e40f8f42b4b7d61224cb202ab7bed7fab))
* **vscode:** harden extension commands with overwrite flows, shared PR service, and UX polish ([9e55d36](https://github.com/pierceboggan/primer/commit/9e55d36d1da3ded956af32035f32459b9a2510f6))
* wire --model to init/pr commands, add try/catch for generateConfigs ([7c93a53](https://github.com/pierceboggan/primer/commit/7c93a5369711cdf3ef17807f644d27bd296a60a8))
* wire up progress reporting for eval --init ([0baf939](https://github.com/pierceboggan/primer/commit/0baf939442ef6efb0b9dd5703b14df9d5ce31b29))
* wire up progress reporting for eval run and generate instructions ([a5456ce](https://github.com/pierceboggan/primer/commit/a5456ce89b1ec7490e1a274b147ba09674ba2674))

## [2.0.0]

### Complete Rewrite

Primer vNext is a complete rewrite as a TypeScript CLI tool (ESM, strict, ES2022) for priming repositories for AI-assisted development and evaluation.

### New Commands

- **`primer readiness`** — AI readiness report scoring repos across 9 pillars (style, build, testing, docs, dev-env, code-quality, observability, security, AI tooling) with a 5-level maturity model (Functional → Autonomous).
- **`primer readiness --visual`** — GitHub-themed HTML report with light/dark toggle, expandable pillar details, and maturity model descriptions.
- **`primer readiness --per-area`** — Per-area readiness scoring for monorepos with area-scoped criteria and aggregate thresholds.
- **`primer readiness --policy`** — Customizable readiness policies (disable/override criteria, tune thresholds) via JSON, JS/TS, or npm packages; chainable with last-wins semantics.
- **`primer batch-readiness`** — Consolidated visual readiness report across multiple repositories, with `--policy` support.
- **`primer generate instructions`** — Generate `copilot-instructions.md` via Copilot SDK, with `--per-app` support for monorepos.
- **`primer generate agents`** — Generate `AGENTS.md` guidance files.
- **`primer instructions --areas`** — Generate file-based `.instructions.md` files scoped to detected areas with `applyTo` glob patterns.
- **`primer eval --init`** — AI-powered eval scaffold generation that analyzes codebases and produces cross-cutting, area-aware eval cases.
- **`primer eval --list-models`** — List available Copilot CLI models.
- **`primer analyze`** — Standalone repo analysis command with structured `--json` output.

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
- **Centralized model defaults** — Default model set to `claude-sonnet-4.5` via `src/config.ts`.

### Improvements

- All file write paths now use `safeWriteFile()` — instructions, agents, and area files all reject symlinks and respect `--force`.
- Unified `primer pr` command: both GitHub and Azure DevOps generate all three artifacts (instructions + MCP + VS Code configs) with consistent branch naming.
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
- CI dogfooding: runs `primer analyze --json` and `primer readiness --json` on the repo itself.
- Release automation via release-please with VSIX packaging for the VS Code extension.
- Code coverage via `@vitest/coverage-v8`.

### Project Setup

- Added CONTRIBUTING.md, SECURITY.md, LICENSE (MIT), and CODEOWNERS.
- Added issue templates (bug report, feature request) and PR template.
- Added `.github/agents/` with multi-model code review agents (Opus, Gemini, Codex).
- Added `.github/prompts/` with reusable prompts (deslop, review, generate-improvements).
- Added examples folder with sample eval config and CLI usage guide.
- Added `.prettierrc.json` with project formatting rules.
