# Primer

> Prime your repository for AI-assisted development.

Primer is a CLI tool that analyzes your codebase and generates `.github/copilot-instructions.md` files to help AI coding assistants understand your project better.

![Primer](primer.png)

## Features

- **Repository Analysis** - Detects languages, frameworks, and package managers
- **AI-Powered Generation** - Uses the Copilot SDK to analyze your codebase and generate context-aware instructions
- **Preview Before Save** - Review generated instructions before writing to disk
- **Interactive TUI** - Beautiful terminal interface built with Ink

## Prerequisites

1. **Node.js 18+**
2. **GitHub Copilot CLI** - Installed via VS Code's Copilot Chat extension
3. **Copilot CLI Authentication** - Run `copilot` then `/login` to authenticate

## Installation

```bash
# Clone and install
git clone https://github.com/your-org/primer.git
cd primer
npm install

# Build
npm run build

# Link globally (optional)
npm link
```

## Usage

### Interactive Mode (TUI)

```bash
# Run in current directory
npx tsx src/index.ts

# Run on a specific repo
npx tsx src/index.ts /path/to/repo
```

**Keys:**
- `[A]` Analyze - Detect languages, frameworks, and package manager
- `[G]` Generate - Generate copilot-instructions.md using Copilot SDK
- `[S]` Save - Save generated instructions (in preview mode)
- `[D]` Discard - Discard generated instructions (in preview mode)
- `[Q]` Quit

### Non-Interactive Mode

```bash
# Generate instructions for current directory
npx tsx src/commands/instructions.tsx

# Generate for specific repo
npx tsx src/commands/instructions.tsx --repo /path/to/repo
```

## How It Works

1. **Analysis** (`[A]`) - Scans the repository for:
   - Language files (`.ts`, `.js`, `.py`, `.go`, etc.)
   - Framework indicators (`package.json`, `tsconfig.json`, etc.)
   - Package manager lock files

2. **Generation** (`[G]`) - Uses the Copilot SDK to:
   - Start a Copilot CLI session
   - Let the AI agent explore your codebase using tools (`glob`, `view`, `grep`)
   - Generate concise, project-specific instructions

3. **Preview** - Shows the generated content before saving, allowing you to:
   - Review the instructions
   - Save to `.github/copilot-instructions.md`
   - Or discard and regenerate

## Project Structure

```
primer/
├── src/
│   ├── index.ts              # Entry point
│   ├── cli.ts                # Commander CLI setup
│   ├── commands/             # CLI commands
│   │   ├── analyze.ts
│   │   ├── generate.ts
│   │   └── instructions.tsx
│   ├── services/             # Core business logic
│   │   ├── analyzer.ts       # Repository analysis
│   │   ├── generator.ts      # Config generation
│   │   ├── instructions.ts   # Copilot SDK integration
│   │   └── github.ts         # GitHub API (future)
│   ├── ui/                   # Terminal UI
│   │   └── tui.tsx           # Ink-based TUI
│   └── utils/                # Helpers
│       ├── fs.ts
│       └── logger.ts
├── package.json
├── tsconfig.json
└── PLAN.md                   # Project roadmap
```

## Development

```bash
# Type check
npx tsc -p tsconfig.json --noEmit

# Run in dev mode
npx tsx src/index.ts
```

## Troubleshooting

### "Copilot CLI not found"
Install the GitHub Copilot Chat extension in VS Code. The CLI is bundled with it.

### "Copilot CLI not logged in"
Run `copilot` in your terminal, then type `/login` to authenticate.

### Generation hangs or times out
- Ensure you're authenticated with the Copilot CLI
- Check your network connection
- Try a smaller repository first

## License

MIT
