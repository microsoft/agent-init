# Primer

> Prime your repositories for AI-assisted development.

[![CI](https://github.com/digitarald/primer/actions/workflows/ci.yml/badge.svg)](https://github.com/digitarald/primer/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

Primer is a CLI and VS Code extension that helps teams prepare repositories for AI-assisted development. It generates custom instructions, assesses AI readiness across a maturity model, and supports batch processing across organizations.

## Quick Start

```bash
# Clone and install
git clone https://github.com/digitarald/primer.git
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

## Core Workflows

### Assess AI Readiness

Score a repo across 9 pillars grouped into **Repo Health** (style, build, testing, docs, dev environment, code quality, observability, security) and **AI Setup** (instructions, MCP, agents, skills):

```bash
primer readiness                        # terminal summary
primer readiness --visual               # GitHub-themed HTML report
primer readiness --per-area             # include per-area breakdown
primer readiness --policy ./strict.json # apply a custom policy
primer readiness --json                 # machine-readable JSON
```

**Maturity levels:**

| Level | Name         | What it means                                       |
| ----- | ------------ | --------------------------------------------------- |
| 1     | Functional   | Builds, tests, basic tooling in place               |
| 2     | Documented   | README, CONTRIBUTING, custom AI instructions exist  |
| 3     | Standardized | CI/CD, security policies, CODEOWNERS, observability |
| 4     | Optimized    | MCP servers, custom agents, AI skills configured    |
| 5     | Autonomous   | Full AI-native development with minimal oversight   |

### Generate Instructions

Generate `copilot-instructions.md` or `AGENTS.md` using the Copilot SDK:

```bash
primer instructions                                 # copilot-instructions.md (default)
primer instructions --format agents-md               # AGENTS.md
primer instructions --per-app                        # per-app in monorepos
primer instructions --areas                          # root + all detected areas
primer instructions --areas-only                     # area files only (skip root)
primer instructions --area frontend                  # single area
primer instructions --output /path/to/file.md        # custom output path
primer instructions --model claude-sonnet-4.5        # pick model
```

### Evaluate Instructions

Measure how instructions improve AI responses with a judge model:

```bash
primer eval --init                        # scaffold eval config from codebase
primer eval primer.eval.json              # run evaluation
primer eval --model gpt-4.1 --judge-model claude-sonnet-4.5
primer eval --list-models                 # list available models
```

### Generate Configs

Generate MCP and VS Code configuration files:

```bash
primer generate mcp                       # .vscode/mcp.json
primer generate vscode --force            # .vscode/settings.json (overwrite)
```

### Batch Processing

Process multiple repos across an organization:

```bash
primer batch                              # interactive TUI (GitHub)
primer batch --provider azure             # Azure DevOps
primer batch owner/repo1 owner/repo2 --json  # headless
primer batch-readiness --output team.html    # consolidated readiness report
```

### Create PRs

Clone a repo, generate configs, and open a PR:

```bash
primer pr owner/repo-name
primer pr my-org/my-project/my-repo --provider azure
```

## Readiness Policies

Policies customize which criteria are evaluated, override metadata, and tune pass-rate thresholds:

```bash
primer readiness --policy ./my-policy.json
primer readiness --policy ./base.json,./strict.json  # chain multiple
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

Policies can also be set in `primer.config.json` to apply automatically:

```json
{ "policies": ["./my-policy.json"] }
```

> **Security:** Config-sourced policies are restricted to JSON files only — JS/TS module policies must be passed via `--policy`.

## Global Options

All commands support `--json` (structured JSON to stdout) and `--quiet` (suppress stderr progress). JSON output uses a `CommandResult<T>` envelope:

```json
{ "ok": true, "status": "success", "data": { ... } }
```

## Interactive TUI

```bash
primer tui
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
