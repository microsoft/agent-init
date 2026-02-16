# Primer — VS Code Extension

Prime repositories for AI-assisted development directly from VS Code.

## Features

### Command Palette

All commands are available via the Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`):

| Command                                   | Description                                          |
| ----------------------------------------- | ---------------------------------------------------- |
| **Primer: Analyze Repository**            | Detect languages, frameworks, monorepo structure     |
| **Primer: Generate Configs**              | Generate MCP or VS Code settings                     |
| **Primer: Generate Copilot Instructions** | Generate `.github/copilot-instructions.md`           |
| **Primer: AI Readiness Report**           | Run 9-pillar readiness assessment with visual report |
| **Primer: Run Eval**                      | Compare AI responses with/without instructions       |
| **Primer: Scaffold Eval Config**          | Auto-generate `primer.eval.json` test cases          |
| **Primer: Initialize Repository**         | Full setup: analyze + instructions + configs         |
| **Primer: Create Pull Request**           | Commit and push changes, create PR on GitHub         |

### Sidebar

The **Primer** activity bar provides two tree views:

- **Analysis** — Languages, frameworks, monorepo areas detected in the workspace
- **Readiness** — 9-pillar AI readiness scores with drill-down into criteria

### Webview Reports

- **Readiness Report** — Full HTML dashboard with dark/light theme
- **Eval Results** — Interactive viewer for eval comparisons

### Status Bar

A **Primer** status bar item provides quick access to repository analysis.

## Settings

| Setting              | Default             | Description                               |
| -------------------- | ------------------- | ----------------------------------------- |
| `primer.model`       | `claude-sonnet-4.5` | Default Copilot model for generation      |
| `primer.autoAnalyze` | `false`             | Auto-analyze repository on workspace open |

## Requirements

- VS Code 1.100.0+
- GitHub authentication (for Copilot instructions, eval, and PR creation)
- [Copilot CLI](https://docs.github.com/en/copilot) installed and authenticated (for SDK-dependent features)

## Development

```sh
cd vscode-extension
npm install
npm run build       # Build with esbuild
npm run watch       # Watch mode
npm run typecheck   # TypeScript check
```

Press **F5** to launch the Extension Development Host for testing.
