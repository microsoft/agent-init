# Primer

> Prime your repositories for AI-assisted development.

[![CI](https://github.com/pierceboggan/primer/actions/workflows/ci.yml/badge.svg)](https://github.com/pierceboggan/primer/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

Primer is a CLI tool that analyzes your codebase and generates `.github/copilot-instructions.md` files to help AI coding assistants understand your project better. It supports single repos, batch processing across organizations, and includes an evaluation framework to measure instruction effectiveness.

![Primer](primer.png)

## Features

- **Repository Analysis** - Detects languages, frameworks, and package managers
- **AI-Powered Generation** - Uses the Copilot SDK to analyze your codebase and generate context-aware instructions
- **Batch Processing** - Process multiple repos across organizations with a single command
- **Evaluation Framework** - Test and measure how well your instructions improve AI responses
- **Readiness Report** - Score AI readiness across key pillars with a fix-first checklist
- **GitHub Integration** - Clone repos, create branches, and open PRs automatically
- **Interactive TUI** - Beautiful terminal interface built with Ink
- **Config Generation** - Generate MCP and VS Code configurations

## Prerequisites

1. **Node.js 18+**
2. **GitHub Copilot CLI** - Installed via VS Code's Copilot Chat extension
3. **Copilot CLI Authentication** - Run `copilot` then `/login` to authenticate
4. **GitHub CLI (optional)** - For batch processing and PR creation: `brew install gh && gh auth login`
5. **Azure DevOps PAT (optional)** - For Azure DevOps batch/PR workflows: set `AZURE_DEVOPS_PAT`

## Installation

```bash
# Install from npm
npm install -g primer
```

### Quick Install

```bash
primer --help
```

### Local Development Install

```bash
# Clone and install dependencies
git clone https://github.com/pierceboggan/primer.git
cd primer
npm install

# Build and link the local CLI
npm run build
```

## Usage

### Quick Start (Init)

The easiest way to get started is with the `init` command:

```bash
# Interactive setup for current directory
primer init

# Accept defaults and generate instructions automatically
primer init --yes

# Work with a GitHub repository
primer init --github

# Work with an Azure DevOps repository
primer init --provider azure
```

### Interactive Mode (TUI)

```bash
# Run TUI in current directory
primer tui

# Run on a specific repo
primer tui --repo /path/to/repo

# Skip the animated intro
primer tui --no-animation
```

**Keys:**
- `[A]` Analyze - Detect languages, frameworks, and package manager
- `[G]` Generate - Generate copilot-instructions.md using Copilot SDK
- `[S]` Save - Save generated instructions (in preview mode)
- `[D]` Discard - Discard generated instructions (in preview mode)
- `[Q]` Quit

### Generate Instructions

```bash
# Generate instructions for current directory
primer instructions

# Generate for specific repo with custom output
primer instructions --repo /path/to/repo --output ./instructions.md

# Use a specific model
primer instructions --model gpt-5
```

### Batch Processing

Process multiple repositories across organizations:

```bash
# Launch batch TUI
primer batch

# Launch batch TUI for Azure DevOps
primer batch --provider azure

# Save results to file
primer batch --output results.json
```

**Batch TUI Keys:**
- `[Space]` Toggle selection
- `[A]` Select all repos
- `[Enter]` Confirm selection
- `[Y/N]` Confirm/cancel processing
- `[Q]` Quit

### Readiness Report

Assess how ready a repository is for AI agents and get a prioritized checklist of fixes:

```bash
# Run readiness report in current directory
primer readiness

# Run readiness report on a specific repo
primer readiness /path/to/repo

# Output JSON only
primer readiness --json

# Write JSON report to a file
primer readiness --output readiness.json
```

### Examples

See [examples/README.md](examples/README.md) for quick usage snippets and a sample eval config.

### Generate Configs

Generate configuration files for your repo:

```bash
# Generate MCP config
primer generate mcp

# Generate VS Code settings
primer generate vscode --force

# Generate custom prompts
primer generate prompts

# Generate agent configs
primer generate agents

# Generate .aiignore file
primer generate aiignore
```

### Manage Templates

View available instruction templates:

```bash
primer templates
```

### Configuration

View and manage Primer configuration:

```bash
primer config
```

### Update

Check for and apply updates:

```bash
primer update
```

### Create Pull Requests

Automatically create a PR to add Primer configs to a repository:

```bash
# Create PR for a GitHub repo
primer pr owner/repo-name

# Use custom branch name
primer pr owner/repo-name --branch primer/custom-branch

# Create PR for an Azure DevOps repo (org/project/repo)
primer pr my-org/my-project/my-repo --provider azure
```

### Evaluation Framework

Test how well your instructions improve AI responses:

```bash
# Create a starter eval config
primer eval --init

# Run evaluation
primer eval primer.eval.json --repo /path/to/repo

# Save results and use specific models
primer eval --output results.json --model gpt-5 --judge-model gpt-5
```

When `--output` is provided (or `outputPath` is set in the eval config), Primer writes a JSON report that includes per-case metrics and trajectory events, and also generates a companion HTML trajectory viewer next to the JSON file.

Example `primer.eval.json`:
```json
{
  "instructionFile": ".github/copilot-instructions.md",
   "outputPath": "eval-results.json",
  "cases": [
    {
      "id": "project-overview",
      "prompt": "Summarize what this project does and list the main entry points.",
      "expectation": "Should mention the primary purpose and key files/directories."
    }
  ]
}
```

## How It Works

1. **Analysis** - Scans the repository for:
   - Language files (`.ts`, `.js`, `.py`, `.go`, etc.)
   - Framework indicators (`package.json`, `tsconfig.json`, etc.)
   - Package manager lock files

2. **Generation** - Uses the Copilot SDK to:
   - Start a Copilot CLI session
   - Let the AI agent explore your codebase using tools (`glob`, `view`, `grep`)
   - Generate concise, project-specific instructions

3. **Batch Processing** - For multiple repos:
   - Select organizations and repositories via TUI
   - Clone, branch, generate, commit, push, and create PRs
   - Track success/failure for each repository

4. **Evaluation** - Measure instruction quality:
   - Run prompts with and without instructions
   - Use a judge model to score responses
   - Generate comparison reports

## Project Structure

```
primer/
├── src/
│   ├── index.ts              # Entry point
│   ├── cli.ts                # Commander CLI setup
│   ├── commands/             # CLI commands
│   │   ├── analyze.ts        # Repository analysis
│   │   ├── batch.tsx         # Batch processing
│   │   ├── config.ts         # Config management
│   │   ├── eval.ts           # Evaluation framework
│   │   ├── generate.ts       # Config generation
│   │   ├── init.ts           # Interactive setup
│   │   ├── instructions.tsx  # Instructions generation
│   │   ├── pr.ts             # PR creation
│   │   ├── templates.ts      # Template management
│   │   ├── tui.tsx           # TUI launcher
│   │   └── update.ts         # Update command
│   ├── services/             # Core business logic
│   │   ├── analyzer.ts       # Repository analysis
│   │   ├── evaluator.ts      # Eval runner
│   │   ├── generator.ts      # Config generation
│   │   ├── git.ts            # Git operations
│   │   ├── github.ts         # GitHub API
│   │   └── instructions.ts   # Copilot SDK integration
│   ├── ui/                   # Terminal UI
│   │   ├── AnimatedBanner.tsx
│   │   ├── BatchTui.tsx      # Batch processing UI
│   │   └── tui.tsx           # Main TUI
│   └── utils/                # Helpers
│       ├── fs.ts
│       └── logger.ts
├── package.json
├── tsconfig.json
├── primer.eval.json          # Example eval config
└── PLAN.md                   # Project roadmap
```

## Development

```bash
# Type check
npx tsc -p tsconfig.json --noEmit

# Lint
npm run lint

# Format
npm run format

# Test
npm run test

# Coverage
npm run test:coverage

# Build and link the local CLI
npm run build

# Run locally
primer
```

## Troubleshooting

### "Copilot CLI not found"
Install the GitHub Copilot Chat extension in VS Code. The CLI is bundled with it.

### "Copilot CLI not logged in"
Run `copilot` in your terminal, then type `/login` to authenticate.

### "GitHub authentication required" (batch/PR commands)
Install GitHub CLI and authenticate: `brew install gh && gh auth login`

Or set a token: `export GITHUB_TOKEN=<your-token>`

### Generation hangs or times out
- Ensure you're authenticated with the Copilot CLI
- Check your network connection
- Try a smaller repository first

## License

MIT
