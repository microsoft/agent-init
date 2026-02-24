# Primer

> Prime your repositories for AI-assisted development.

[![CI](https://github.com/pierceboggan/primer/actions/workflows/ci.yml/badge.svg)](https://github.com/pierceboggan/primer/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

Primer is a CLI and VS Code extension that helps teams prepare repositories for AI-assisted development. It generates custom instructions, assesses AI readiness across a maturity model, and supports batch processing across organizations.

## Quick Start

```bash
# Run directly (no install needed)
npx github:pierceboggan/primer readiness
```

`npx github:<owner>/primer ...` installs from the Git repository and runs the package `prepare` script, which builds the CLI before first use.

Or install locally:

```bash
git clone https://github.com/pierceboggan/primer.git
cd primer && npm install && npm run build && npm link

# 1. Check how AI-ready your repo is
primer readiness

# 2. Generate AI instructions
primer instructions

# 3. Generate MCP and VS Code configs
primer generate mcp
primer generate vscode

# Or do everything interactively
primer init
```

## Prerequisites

| Requirement                       | Notes                                                            |
| --------------------------------- | ---------------------------------------------------------------- |
| **Node.js 20+**                   | Runtime                                                          |
| **GitHub Copilot CLI**            | Bundled with the VS Code Copilot Chat extension                  |
| **Copilot authentication**        | Run `copilot` → `/login`                                         |
| **GitHub CLI** _(optional)_       | For batch processing and PRs: `brew install gh && gh auth login` |
| **Azure DevOps PAT** _(optional)_ | Set `AZURE_DEVOPS_PAT` for Azure DevOps workflows                |

## Commands

### `primer analyze` — Inspect Repository Structure

Detects languages, frameworks, monorepo/workspace structure, and area mappings:

```bash
primer analyze                                # terminal summary
primer analyze --json                         # machine-readable analysis
primer analyze --output analysis.json         # save JSON report
primer analyze --output analysis.md           # save Markdown report
primer analyze --output analysis.json --force # overwrite existing report
```

### `primer readiness` — Assess AI Readiness

Score a repo across 9 pillars grouped into **Repo Health** and **AI Setup**:

```bash
primer readiness                        # terminal summary
primer readiness --visual               # GitHub-themed HTML report
primer readiness --per-area             # include per-area breakdown
primer readiness --output readiness.json # save JSON report
primer readiness --output readiness.md   # save Markdown report
primer readiness --output readiness.html # save HTML report
primer readiness --policy ./examples/policies/strict.json # apply a custom policy
primer readiness --json                 # machine-readable JSON
primer readiness --fail-level 3         # CI gate: exit 1 if below level 3
```

**Maturity levels:**

| Level | Name         | What it means                                       |
| ----- | ------------ | --------------------------------------------------- |
| 1     | Functional   | Builds, tests, basic tooling in place               |
| 2     | Documented   | README, CONTRIBUTING, custom AI instructions exist  |
| 3     | Standardized | CI/CD, security policies, CODEOWNERS, observability |
| 4     | Optimized    | MCP servers, custom agents, AI skills configured    |
| 5     | Autonomous   | Full AI-native development with minimal oversight   |

### `primer instructions` — Generate Instructions

Generate `copilot-instructions.md` or `AGENTS.md` using the Copilot SDK:

```bash
primer instructions                      # copilot-instructions.md (default)
primer instructions --format agents-md   # AGENTS.md
primer instructions --per-app            # per-app in monorepos
primer instructions --areas              # root + all detected areas
primer instructions --area frontend      # single area
primer instructions --model claude-sonnet-4.5
```

### `primer eval` — Evaluate Instructions

Measure how instructions improve AI responses with a judge model:

```bash
primer eval --init                       # scaffold eval config from codebase
primer eval primer.eval.json             # run evaluation
primer eval --model gpt-4.1 --judge-model claude-sonnet-4.5
primer eval --fail-level 80              # CI gate: exit 1 if pass rate < 80%
```

### `primer generate` — Generate Configs

```bash
primer generate mcp                      # .vscode/mcp.json
primer generate vscode --force           # .vscode/settings.json (overwrite)
```

### `primer batch` / `primer pr` — Batch & PRs

```bash
primer batch                             # interactive TUI (GitHub)
primer batch --provider azure            # Azure DevOps
primer batch owner/repo1 owner/repo2 --json
primer batch-readiness --output team.html
primer pr owner/repo-name                # clone → generate → open PR
```

### `primer tui` — Interactive Mode

```bash
primer tui
```

### `primer init` — Guided Setup

Interactive or headless repo onboarding — detects your stack and walks through readiness, instructions, and config generation.

### Global Options

All commands support `--json` (structured JSON to stdout) and `--quiet` (suppress stderr). JSON output uses a `CommandResult<T>` envelope:

```json
{ "ok": true, "status": "success", "data": { ... } }
```

### Readiness Policies

Policies customize scoring criteria, override metadata, and tune thresholds:

```bash
primer readiness --policy ./examples/policies/strict.json
primer readiness --policy ./examples/policies/strict.json,./my-overrides.json  # chain multiple
```

```json
{
  "name": "my-org-policy",
  "criteria": {
    "disable": ["lint-config"],
    "override": { "readme": { "impact": "high", "level": 2 } }
  },
  "extras": { "disable": ["pre-commit"] },
  "thresholds": { "passRate": 0.9 }
}
```

Policies can also be set in `primer.config.json` (`{ "policies": ["./my-policy.json"] }`).

> **Security:** Config-sourced policies are restricted to JSON files only — JS/TS module policies must be passed via `--policy`.

See [docs/plugins.md](docs/plugins.md) for the full plugin authoring guide, including imperative TypeScript plugins, lifecycle hooks, and the trust model.

## Development

```bash
npm run typecheck        # type check
npm run lint             # ESLint (flat config + Prettier)
npm run test             # Vitest tests
npm run test:coverage    # with coverage
npm run build            # production build via tsup
npx tsx src/index.ts --help  # run from source
```

### VS Code Extension

```bash
cd vscode-extension
npm install && npm run build
# Press F5 to launch Extension Development Host
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for workflow and code style guidelines.

## Project Structure

```
src/
├── cli.ts                # Commander CLI wiring
├── commands/             # CLI subcommands (thin orchestrators)
├── services/             # Core logic
│   ├── readiness.ts       # 9-pillar scoring engine with pillar groups
│   ├── visualReport.ts    # HTML report generator
│   ├── instructions.ts    # Copilot SDK integration
│   ├── analyzer.ts        # Repo scanning (languages, frameworks, monorepos)
│   ├── evaluator.ts       # Eval runner + trajectory viewer
│   ├── generator.ts       # MCP/VS Code config generation
│   ├── policy.ts          # Readiness policy loading and chain resolution
│   ├── policy/            # Plugin engine (types, compiler, loader, adapter, shadow)
│   ├── git.ts             # Git operations (clone, branch, push)
│   ├── github.ts          # GitHub API (Octokit)
│   └── azureDevops.ts     # Azure DevOps API
├── ui/                   # Ink/React terminal UI
└── utils/                # Shared utilities (fs, logger, output)

vscode-extension/         # VS Code extension (commands, tree views, webview)
```

## Troubleshooting

**"Copilot CLI not found"** — Install the GitHub Copilot Chat extension in VS Code. The CLI is bundled with it.

**"Copilot CLI not logged in"** — Run `copilot` in your terminal, then `/login` to authenticate.

**"GitHub authentication required"** — Install GitHub CLI (`brew install gh && gh auth login`) or set `GITHUB_TOKEN` / `GH_TOKEN`.

## License

[MIT](LICENSE)
