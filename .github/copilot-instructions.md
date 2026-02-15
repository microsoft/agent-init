# Copilot Instructions for This Repository

## Development Checklist

- Use ESM syntax everywhere (see "type": "module" in package.json).
- TypeScript is strict; target ES2022, module ESNext (see tsconfig.json).
- Use Commander for CLI, Ink/React for TUI, and simple-git/Octokit for GitHub automation.
- Only overwrite config files (e.g., .vscode/settings.json, .vscode/mcp.json) with --force.
- All Copilot/VS Code settings reference this file and enable MCP.
- Place new CLI commands in src/commands/, core logic in src/services/, and TUI in src/ui/.
- Do not add new build/lint/test tools unless necessary; use existing npm scripts.
- Ensure Windows/macOS/Linux compatibility

## Overview

**Primer** is a TypeScript CLI tool for priming repositories for AI-assisted development and evaluation.

- **Tech Stack:** TypeScript (ESM, strict), Node.js, React (Ink for TUI)
- **Entrypoint:** `src/index.ts` (calls `runCli` in `src/cli.ts`)
- **Key Directories:**
  - `src/commands/` — CLI subcommands
  - `src/services/` — core logic (analyzer, instructions, generator, git, github, evaluator)
  - `src/ui/` — Ink/React-based terminal UI
  - `.github/` — Copilot instructions
  - `.vscode/` — Editor settings

## Architecture

- **CLI:** Uses `commander` to wire subcommands to service functions.
- **Analyzer:** Scans repo files to infer languages, frameworks, and package manager.
- **Instructions:** Generates `.github/copilot-instructions.md` from convention files.
- **Config Generation:** Writes `.vscode/settings.json` and `.vscode/mcp.json` (safe overwrite).
- **Git/GitHub:** Automates clone/branch/PR via `simple-git` and Octokit.
- **Evaluation:** Compares agent responses with/without instructions using Copilot sessions.
- **TUI:** `src/ui/tui.tsx` (Ink/React) for interactive terminal usage.

## Usage

- **Run locally (no build step):**
  - `npx tsx src/index.ts --help`
  - `npx tsx src/index.ts analyze [path] --json`
  - `npx tsx src/index.ts generate mcp|vscode [path] [--force]`
  - `npx tsx src/index.ts instructions [--repo <path>] [--output <path>] [--model gpt-5]`
  - `npx tsx src/index.ts tui [--repo <path>]`
  - `npx tsx src/index.ts pr <owner/name> [--branch primer/add-configs]`
  - `npx tsx src/index.ts eval [configPath] --repo <path> [--model gpt-5] [--judge-model gpt-5] [--output results.json]`

## Conventions

- **ESM everywhere** (`"type": "module"` in `package.json`)
- **Strict TypeScript** (`tsconfig.json` targets ES2022, module ESNext, strict mode)
- **Single glob pass** for convention sources (see `src/services/instructions.ts`)
- **Safe file writes:** Overwrites only with `--force`
- **VS Code Copilot settings** reference this file and enable MCP

## Prerequisites

- **Copilot CLI** must be installed and authenticated for SDK calls.
- **GitHub automation** requires `GITHUB_TOKEN` or `GH_TOKEN` in the environment.

## Key Files

- `.github/copilot-instructions.md` — This file
- `src/index.ts` — CLI entrypoint
- `src/services/` — Core logic
- `.vscode/settings.json` — Copilot/VS Code integration
