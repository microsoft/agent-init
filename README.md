# Primer

> Prime your repositories for AI-assisted development.

[![CI](https://github.com/pierceboggan/primer/actions/workflows/ci.yml/badge.svg)](https://github.com/pierceboggan/primer/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

Primer is a CLI tool that helps teams prepare repositories for AI-assisted development. It generates custom instructions, assesses AI readiness with a maturity model, and supports batch processing across organizations — with an interactive TUI and beautiful visual reports.

```bash
npx github:pierceboggan/primer readiness --visual
```

## Features

- **AI Readiness Reports** — Score repos across 9 pillars with a maturity model (Functional → Autonomous), including an AI tooling pillar that checks for MCP, custom agents, Copilot skills, and custom instructions. Supports per-area breakdowns for monorepos and multi-domain projects
- **Visual Reports** — GitHub-themed HTML reports with light/dark toggle, expandable pillar details, and maturity model descriptions
- **Instruction Generation** — Generate `copilot-instructions.md` or `AGENTS.md` using the Copilot SDK, with per-app support for monorepos. Generate file-based `.instructions.md` files for detected areas (frontend, backend, infra, etc.)
- **Batch Processing** — Process multiple repos across GitHub or Azure DevOps organizations
- **Evaluation Framework** — Measure how instructions improve AI responses with a judge model
- **Interactive TUI** — Ink-based terminal UI with submenus, model picker, activity log, and animated banner
- **Config Generation** — Generate MCP and VS Code configurations
- **GitHub Integration** — Clone repos, create branches, and open PRs automatically

## Prerequisites

| Requirement                       | Notes                                                                    |
| --------------------------------- | ------------------------------------------------------------------------ |
| **Node.js 20+**                   | Runtime                                                                  |
| **GitHub Copilot CLI**            | Bundled with the VS Code Copilot Chat extension                          |
| **Copilot authentication**        | Run `copilot` → `/login`                                                 |
| **GitHub CLI** _(optional)_       | For batch processing and PR creation: `brew install gh && gh auth login` |
| **Azure DevOps PAT** _(optional)_ | Set `AZURE_DEVOPS_PAT` for Azure DevOps workflows                        |

## Installation

```bash
git clone https://github.com/pierceboggan/primer.git
cd primer
npm install
npm run build
npm link
```

Verify:

```bash
primer --help
```

## Quick Start

```bash
# Interactive setup — generates instructions, MCP, and VS Code configs
primer init

# Non-interactive with defaults
primer init --yes
```

## Global Options

All commands support these flags:

| Flag      | Description                                         |
| --------- | --------------------------------------------------- |
| `--json`  | Output structured JSON to stdout (machine-readable) |
| `--quiet` | Suppress all non-essential output                   |

When `--json` is set, commands emit a `CommandResult<T>` envelope:

```json
{
  "ok": true,
  "status": "success",
  "data": { ... }
}
```

Status is one of `"success"`, `"partial"`, `"noop"`, or `"error"`. Errors include an `errors` array.

## Commands

### `primer readiness`

Score a repo's AI readiness across 9 pillars:

```bash
primer readiness                        # terminal summary
primer readiness --visual               # GitHub-themed HTML report
primer readiness --json                 # machine-readable JSON
primer readiness --per-area             # include per-area breakdown
primer readiness --policy ./strict.json # apply a custom policy
primer readiness /path/to/repo --output report.html
```

**Maturity levels:**

| Level | Name         | Description                                         |
| ----- | ------------ | --------------------------------------------------- |
| 1     | Functional   | Builds, tests, basic tooling in place               |
| 2     | Documented   | README, CONTRIBUTING, custom AI instructions exist  |
| 3     | Standardized | CI/CD, security policies, CODEOWNERS, observability |
| 4     | Optimized    | MCP servers, custom agents, AI skills configured    |
| 5     | Autonomous   | Full AI-native development with minimal oversight   |

**AI Tooling checks** include `copilot-instructions.md`, `CLAUDE.md`, `AGENTS.md`, `.cursorrules`, MCP configs, custom agents, and Copilot/Claude skills.

#### Policies

Policies let you customize which readiness criteria are evaluated, override their metadata, and tune pass-rate thresholds. Multiple policies chain together (last wins).

```bash
# Apply a local JSON policy
primer readiness --policy ./my-policy.json

# Chain multiple policies (comma-separated)
primer readiness --policy ./base.json,./strict.json

# Also works with batch-readiness
primer batch-readiness --policy ./org-policy.json
```

A policy file looks like:

```json
{
  "name": "my-org-policy",
  "criteria": {
    "disable": ["lint-config"],
    "override": { "readme": { "impact": "high", "level": 2 } }
  },
  "extras": {
    "disable": ["pre-commit"]
  },
  "thresholds": {
    "passRate": 0.9
  }
}
```

Policies can also be set in `primer.config.json` so they apply automatically:

```json
{
  "policies": ["./my-policy.json"]
}
```

> **Security:** Config-sourced policies are restricted to JSON files only — JS/TS module and npm package policies must be passed via `--policy` to prevent untrusted code execution.

### `primer batch-readiness`

Consolidated visual readiness report across multiple repositories:

```bash
primer batch-readiness
primer batch-readiness --output team-readiness.html
```

### `primer generate`

Generate AI configuration files using the Copilot SDK:

```bash
primer generate instructions             # copilot-instructions.md
primer generate agents                    # AGENTS.md
primer generate instructions --per-app    # per-app in monorepos
primer generate mcp                       # .vscode/mcp.json
primer generate vscode --force            # .vscode/settings.json (overwrite)
```

Standalone shortcut for instructions:

```bash
primer instructions --repo /path/to/repo --model claude-sonnet-4.5
```

#### File-based area instructions

Generate `.instructions.md` files scoped to detected areas (e.g., frontend, backend, infra). These use `applyTo` glob patterns so Copilot applies the right context per file:

```bash
primer instructions --areas              # root + all detected areas
primer instructions --areas-only         # area files only (skip root)
primer instructions --area frontend      # single area
primer instructions --areas --force      # overwrite existing area files
```

### `primer eval`

Measure how instructions improve AI responses:

```bash
primer eval --init                        # scaffold eval config from codebase analysis
primer eval primer.eval.json --repo .     # run evaluation (default model: claude-sonnet-4.5)
primer eval --model gpt-4.1 --judge-model claude-sonnet-4.5
primer eval --list-models                 # list available Copilot CLI models
```

Results include an interactive HTML trajectory viewer comparing responses with/without instructions, with token usage, tool-call counts, and duration.

### `primer batch`

Batch-process repos across an organization:

```bash
primer batch                              # GitHub repos (interactive TUI)
primer batch --provider azure             # Azure DevOps repos (interactive TUI)
```

**Headless mode** — pass repos as arguments or via stdin for CI/automation:

```bash
# GitHub repos
primer batch owner/repo1 owner/repo2 --json
echo "owner/repo1\nowner/repo2" | primer batch --json

# Azure DevOps repos
primer batch org/project/repo1 org/project/repo2 --provider azure --json
```

### `primer analyze`

Analyze a repository's tech stack:

```bash
primer analyze                            # human-readable summary
primer analyze /path/to/repo --json       # structured JSON output
```

### `primer pr`

Clone a repo, generate configs, and open a PR:

```bash
primer pr owner/repo-name
primer pr my-org/my-project/my-repo --provider azure
```

### `primer tui`

Interactive terminal UI:

```bash
primer tui
primer tui --repo /path/to/repo --no-animation
```

| Key       | Action                             |
| --------- | ---------------------------------- |
| `G`       | Generate instructions or AGENTS.md |
| `E`       | Run evals or init eval config      |
| `B`       | Batch — GitHub or Azure DevOps     |
| `M` / `J` | Pick eval / judge model            |
| `Q`       | Quit                               |

## Development

```bash
npm run typecheck        # type check
npm run lint             # ESLint (flat config + Prettier)
npm run test             # 51+ Vitest tests
npm run test:coverage    # with coverage via @vitest/coverage-v8
npm run build            # production build via tsup

# Run from source (no build needed)
npx tsx src/index.ts --help
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for workflow and code style guidelines.

## Project Structure

```
src/
├── index.ts              # Entry point
├── cli.ts                # Commander CLI wiring
├── config.ts             # Default models (claude-sonnet-4.5)
├── commands/             # CLI subcommands
├── services/             # Core logic
│   ├── analyzer.ts        # Repo scanning (languages, frameworks, monorepos)
│   ├── batch.ts           # Shared batch processing (GitHub + Azure DevOps)
│   ├── readiness.ts       # 9-pillar scoring engine (with per-area support)
│   ├── visualReport.ts    # HTML report generator
│   ├── instructions.ts    # Copilot SDK integration
│   ├── evaluator.ts       # Eval runner + trajectory viewer
│   ├── evalScaffold.ts    # AI-powered eval config generation
│   ├── generator.ts       # MCP/VS Code config generation
│   ├── git.ts             # Git operations (clone, branch, push)
│   ├── github.ts          # GitHub API (Octokit)
│   ├── azureDevops.ts     # Azure DevOps API
│   └── __tests__/         # Test suite
├── ui/                   # Ink/React terminal UI
└── utils/                # Shared utilities (fs, logger, cwd, output)
```

## Troubleshooting

**"Copilot CLI not found"** — Install the GitHub Copilot Chat extension in VS Code. The CLI is bundled with it.

**"Copilot CLI not logged in"** — Run `copilot` in your terminal, then `/login` to authenticate.

**"GitHub authentication required"** — Install GitHub CLI (`brew install gh && gh auth login`) or set `GITHUB_TOKEN` / `GH_TOKEN`.

## License

[MIT](LICENSE)
