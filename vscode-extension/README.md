# Primer — AI Repository Setup

Prime your repositories for AI-assisted development, right from VS Code.

## Getting Started

Open the Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`) and search for **Primer** — or click the **Primer** icon in the Activity Bar to start from the sidebar.

First time? Run **Primer: Get Started** (or open the walkthrough from the Welcome tab) for a guided 5-step setup.

## Features

### Analyze Repository

Detect languages, frameworks, package managers, and monorepo structure. Results populate the **Analysis** tree view in the sidebar.

`Primer: Analyze Repository`

### AI Readiness Assessment

Score your repo across **9 pillars** grouped into **Repo Health** and **AI Setup**, with maturity levels from Functional (1) to Autonomous (5).

- Interactive HTML report with dark/light theme
- Drill-down into criteria in the **Readiness** tree view
- Pass/fail icons with evidence for each criterion

`Primer: AI Readiness Report`

### Generate Instructions

Create AI instruction files using the Copilot SDK. Choose your format:

- **copilot-instructions.md** — GitHub Copilot's native format
- **AGENTS.md** — Broader agent format at repo root

For monorepos, pick specific areas to generate per-area instruction files with `applyTo` scoping.

`Primer: Generate Copilot Instructions`

### Generate Configs

Set up MCP servers (`.vscode/mcp.json`) and VS Code settings (`.vscode/settings.json`) tuned to your project.

`Primer: Generate Configs`

### Evaluate Instructions

Measure how much your instructions improve AI responses by comparing with/without using a judge model. Results display in an interactive viewer inside VS Code.

`Primer: Run Eval` · `Primer: Scaffold Eval Config`

### Initialize Repository

One command to analyze, generate instructions, and create configs:

`Primer: Initialize Repository`

### Create Pull Request

Commit Primer-generated files and open a PR directly from VS Code:

`Primer: Create Pull Request`

## Sidebar Views

The **Primer** Activity Bar icon opens two tree views:

| View          | Contents                                                                                          |
| ------------- | ------------------------------------------------------------------------------------------------- |
| **Analysis**  | Languages, frameworks, monorepo areas — with action buttons for instructions and configs          |
| **Readiness** | Maturity level, pillar groups (Repo Health / AI Setup), criteria pass/fail with evidence tooltips |

Both views show welcome screens with action buttons when no data is loaded yet.

## Settings

| Setting              | Default             | Description                                        |
| -------------------- | ------------------- | -------------------------------------------------- |
| `primer.model`       | `claude-sonnet-4.5` | Default Copilot model for generation               |
| `primer.autoAnalyze` | `false`             | Automatically analyze repository on workspace open |

## Requirements

- **VS Code 1.100.0+**
- **GitHub Copilot Chat extension** (provides the Copilot CLI)
- **Copilot authentication** — run `copilot` → `/login` in your terminal
- **GitHub CLI** _(optional)_ — for PR creation: `brew install gh && gh auth login`

## Links

- [Primer CLI on GitHub](https://github.com/digitarald/primer)
- [Contributing Guide](https://github.com/digitarald/primer/blob/main/CONTRIBUTING.md)
- [License (MIT)](https://github.com/digitarald/primer/blob/main/LICENSE)
