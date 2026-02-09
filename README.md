# Primer

> Prime your repositories for AI-assisted development.

[![CI](https://github.com/pierceboggan/primer/actions/workflows/ci.yml/badge.svg)](https://github.com/pierceboggan/primer/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

Primer is a CLI tool that helps teams prepare repositories for AI-assisted development. It generates custom instructions, assesses AI readiness with a maturity model, and supports batch processing across organizations — with an interactive TUI and beautiful visual reports.

## Features

- **AI Readiness Reports** — Score repos across 9 pillars with a maturity model (Functional → Autonomous), including an AI tooling pillar that checks for MCP, custom agents, Copilot skills, and custom instructions
- **Visual Reports** — GitHub-themed HTML reports with light/dark toggle, expandable pillar details, and maturity model descriptions
- **Instruction Generation** — Generate `copilot-instructions.md` or `AGENTS.md` using the Copilot SDK, with per-app support for monorepos
- **Batch Processing** — Process multiple repos across GitHub or Azure DevOps organizations
- **Evaluation Framework** — Measure how instructions improve AI responses with a judge model
- **Interactive TUI** — Ink-based terminal UI with submenus, model picker, activity log, and animated banner
- **Config Generation** — Generate MCP and VS Code configurations
- **GitHub Integration** — Clone repos, create branches, and open PRs automatically

## Prerequisites

1. **Node.js 20+**
2. **GitHub Copilot CLI** — Installed via VS Code's Copilot Chat extension
3. **Copilot CLI Authentication** — Run `copilot` then `/login` to authenticate
4. **GitHub CLI (optional)** — For batch processing and PR creation: `brew install gh && gh auth login`
5. **Azure DevOps PAT (optional)** — For Azure DevOps workflows: set `AZURE_DEVOPS_PAT`

## Installation

```bash
# Clone and install
git clone https://github.com/pierceboggan/primer.git
cd primer
npm install
npm run build
npm link
```

Then use `primer` anywhere:

```bash
primer --help
```

## Usage

### Quick Start

```bash
# Interactive setup for current directory
primer init

# Accept defaults and generate everything
primer init --yes
```

### Interactive TUI

```bash
primer tui
primer tui --repo /path/to/repo
```

**Main menu:**
- `[G]` Generate → choose Copilot instructions or AGENTS.md (with per-app support for monorepos)
- `[E]` Eval → run evals or init eval config
- `[B]` Batch → pick GitHub or Azure DevOps
- `[M]` / `[J]` → pick eval/judge model from available models (arrow keys + Enter)
- `[Q]` Quit

### Generate Instructions

```bash
# Generate copilot-instructions.md
primer generate instructions

# Generate AGENTS.md
primer generate agents

# Generate per-app in monorepos
primer generate instructions --per-app

# Generate MCP or VS Code configs
primer generate mcp
primer generate vscode --force
```

Or use the standalone command:

```bash
primer instructions --repo /path/to/repo --model claude-sonnet-4.5
```

### Readiness Report

Assess AI readiness across 9 pillars with a maturity model:

```bash
# Terminal output
primer readiness

# Visual HTML report (GitHub-themed, light/dark toggle)
primer readiness --visual

# JSON output
primer readiness --json

# Save to file
primer readiness --output report.html
```

**Maturity levels:**
| Level | Name | Description |
|-------|------|-------------|
| 1 | Functional | Builds, tests, basic tooling in place |
| 2 | Documented | README, CONTRIBUTING, custom AI instructions exist |
| 3 | Standardized | CI/CD, security policies, CODEOWNERS, observability |
| 4 | Optimized | MCP servers, custom agents, AI skills configured |
| 5 | Autonomous | Full AI-native development with minimal oversight |

**AI Tooling checks:**
- Custom instructions (`copilot-instructions.md`, `CLAUDE.md`, `AGENTS.md`, `.cursorrules`)
- MCP configuration (`.vscode/mcp.json`, settings)
- Custom AI agents (`.github/agents/`, `.copilot/agents/`)
- Copilot/Claude skills (`.copilot/skills/`, `.github/skills/`)

#### Batch Readiness

Consolidated visual report across multiple repositories:

```bash
primer batch-readiness
primer batch-readiness --output team-readiness.html
```

### Batch Processing

Process multiple repos across organizations:

```bash
# GitHub
primer batch

# Azure DevOps
primer batch --provider azure
```

### Evaluation Framework

Measure instruction effectiveness:

```bash
# Create eval config
primer eval --init

# Run evaluation (defaults to claude-sonnet-4.5)
primer eval primer.eval.json --repo /path/to/repo

# Custom models
primer eval --model claude-sonnet-4.5 --judge-model claude-sonnet-4.5
```

### Create Pull Requests

```bash
primer pr owner/repo-name
primer pr my-org/my-project/my-repo --provider azure
```

## Development

```bash
# Type check
npm run typecheck

# Lint
npm run lint

# Test (51 tests)
npm run test

# Test with coverage
npm run test:coverage

# Build
npm run build

# Run from source
npx tsx src/index.ts --help
```

## Project Structure

```
primer/
├── src/
│   ├── index.ts              # Entry point
│   ├── cli.ts                # Commander CLI setup
│   ├── commands/             # CLI commands
│   │   ├── batch.tsx          # Batch processing (GitHub)
│   │   ├── batchReadiness.tsx # Batch readiness reports
│   │   ├── eval.ts            # Evaluation framework
│   │   ├── generate.ts        # Generate instructions/configs
│   │   ├── init.ts            # Interactive setup
│   │   ├── instructions.tsx   # Instructions generation
│   │   ├── pr.ts              # PR creation
│   │   ├── readiness.ts       # Readiness command
│   │   └── tui.tsx            # TUI launcher
│   ├── services/             # Core logic
│   │   ├── analyzer.ts        # Repository analysis
│   │   ├── evaluator.ts       # Eval runner
│   │   ├── generator.ts       # Config generation
│   │   ├── git.ts             # Git operations
│   │   ├── github.ts          # GitHub API
│   │   ├── instructions.ts    # Copilot SDK integration
│   │   ├── readiness.ts       # Readiness scoring engine
│   │   ├── visualReport.ts    # HTML report generator
│   │   └── __tests__/         # Test suite
│   ├── ui/                   # Terminal UI (Ink/React)
│   │   ├── AnimatedBanner.tsx
│   │   ├── BatchTui.tsx
│   │   ├── BatchTuiAzure.tsx
│   │   ├── BatchReadinessTui.tsx
│   │   └── tui.tsx
│   └── utils/
│       ├── fs.ts
│       └── logger.ts
├── tsup.config.ts            # Bundler config
├── vitest.config.ts          # Test config
└── primer.eval.json          # Example eval config
```

## Troubleshooting

### "Copilot CLI not found"
Install the GitHub Copilot Chat extension in VS Code. The CLI is bundled with it.

### "Copilot CLI not logged in"
Run `copilot` in your terminal, then type `/login` to authenticate.

### "GitHub authentication required"
Install GitHub CLI and authenticate: `brew install gh && gh auth login`
Or set a token: `export GITHUB_TOKEN=<your-token>`

## License

MIT
