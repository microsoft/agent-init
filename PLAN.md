# Primer — Project Plan

> A beautiful, cross-platform CLI that primes your GitHub repositories for AI-assisted development.

---

## 🎯 Vision

Make any repository "AI-ready" with a single command — generating optimal configurations for AI coding assistants, MCP servers, and IDE settings tailored to the specific tech stack.

---

## ✨ Core Features

### 1. **Readiness Report**

- Score AI readiness across key pillars
- Provide fix-first checklists and maturity levels
- Support monorepos with app-scoped checks

### 2. **Configuration Generation**

| Config Type             | Description                                                  |
| ----------------------- | ------------------------------------------------------------ |
| **Custom Instructions** | `.github/copilot-instructions.md` generated via Copilot SDK  |
| **MCP Server Config**   | `.vscode/mcp.json` for Model Context Protocol servers        |
| **VS Code Settings**    | `.vscode/settings.json` with AI-optimized workspace settings |

### 3. **GitHub Integration**

- Authenticate via GitHub CLI (`gh auth`) or OAuth device flow
- List and select from accessible repositories
- Clone repos temporarily for analysis
- **Auto-create PRs** with generated configurations
- Support for GitHub Enterprise

### 4. **Local Repository Support**

- Detect local Git repositories
- Work offline with local-only mode
- Push changes to remote when ready

### 5. **Interactive & Non-Interactive Modes**

- Beautiful TUI with prompts and previews
- CI/CD-friendly `--yes` flag for automation
- JSON output for scripting

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLI Interface                         │
│  (Commander.js + Ink for React-based TUI)                   │
├─────────────────────────────────────────────────────────────┤
│                      Core Services                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   GitHub    │  │    Repo     │  │    Config           │  │
│  │   Service   │  │   Analyzer  │  │    Generator        │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Tech Stack Recommendation

| Component          | Choice                                                                                   | Rationale                                     |
| ------------------ | ---------------------------------------------------------------------------------------- | --------------------------------------------- |
| **Language**       | TypeScript                                                                               | Type safety, excellent tooling, npm ecosystem |
| **CLI Framework**  | [Commander.js](https://github.com/tj/commander.js)                                       | Mature, cross-platform, great DX              |
| **TUI**            | [Ink](https://github.com/vadimdemedes/ink)                                               | React for CLIs, beautiful components          |
| **Prompts**        | [@inquirer/prompts](https://github.com/SBoudrias/Inquirer.js)                            | Modern, accessible prompts                    |
| **GitHub API**     | [Octokit](https://github.com/octokit/octokit.js)                                         | Official GitHub SDK                           |
| **Git Operations** | [simple-git](https://github.com/steveukx/git-js)                                         | Cross-platform Git commands                   |
| **Styling**        | [chalk](https://github.com/chalk/chalk) + [boxen](https://github.com/sindresorhus/boxen) | Beautiful terminal output                     |
| **Bundling**       | [tsup](https://github.com/egoist/tsup)                                                   | Fast, zero-config bundler                     |
| **Distribution**   | npm + standalone binaries via [pkg](https://github.com/vercel/pkg)                       | Maximum reach                                 |

---

## 📦 Commands

```bash
# Initialize current directory
primer init

# Initialize a specific local path
primer init ./my-project

# Initialize a GitHub repo (opens selector if no repo specified)
primer init --github
primer init --github owner/repo

# Generate specific configurations only
primer generate mcp
primer generate vscode

# Generate instructions
primer instructions

# Create PR with all generated configs
primer pr owner/repo

# Readiness report
primer readiness
primer readiness --fail-level 3  # CI gate

# Run evaluations
primer eval primer.eval.json
primer eval --init              # Scaffold config
primer eval --fail-level 80     # CI gate (pass rate %)

# Analyze repository
primer analyze

# Run TUI
primer tui

# Batch processing
primer batch
primer batch-readiness
```

---

## 🔍 Repository Detection Logic

### Language Detection Priority

1. Check for lock files (`package-lock.json`, `yarn.lock`, `Cargo.lock`, `go.sum`, etc.)
2. Analyze file extensions distribution
3. Check for framework-specific files
4. Read existing config files (`tsconfig.json`, `pyproject.toml`, etc.)

### Framework Detection

| Language                  | Frameworks to Detect                                                  |
| ------------------------- | --------------------------------------------------------------------- |
| **JavaScript/TypeScript** | React, Vue, Angular, Next.js, Nuxt, Svelte, Express, Nest.js, Fastify |
| **Python**                | Django, Flask, FastAPI, Pandas/NumPy (data science)                   |
| **Go**                    | Gin, Echo, Fiber                                                      |
| **Rust**                  | Actix, Axum, Rocket                                                   |
| **Java**                  | Spring Boot, Quarkus                                                  |
| **C#**                    | ASP.NET Core, Blazor                                                  |
| **Ruby**                  | Rails, Sinatra                                                        |

### Project Type Classification

- **Frontend**: UI components, styling, client-side routing
- **Backend**: API routes, database schemas, authentication
- **Full-stack**: Both frontend and backend
- **Library**: Published package, API surface
- **CLI**: Command-line tools
- **Data Science**: Notebooks, data processing
- **Infrastructure**: Terraform, CloudFormation, Kubernetes

---

## 📝 Generated Configuration Examples

### Custom Instructions (`.github/copilot-instructions.md`)

```markdown
# Project: {name}

## Tech Stack

- Language: TypeScript
- Framework: Next.js 14 (App Router)
- Styling: Tailwind CSS
- Database: Prisma + PostgreSQL

## Coding Conventions

- Use functional components with hooks
- Prefer server components where possible
- Use `cn()` utility for conditional classes
- Follow existing patterns in `src/components/`

## File Structure

- `src/app/` - App router pages and layouts
- `src/components/` - Reusable UI components
- `src/lib/` - Utility functions and shared logic
- `src/server/` - Server-side code and API logic

## Testing

- Run tests: `npm test`
- Test files: `*.test.ts` colocated with source

## Important Notes

- This project uses {specific conventions}
- Avoid {anti-patterns specific to this codebase}
```

### MCP Config (`.vscode/mcp.json`)

```json
{
  "servers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${input:github_token}"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "${workspaceFolder}"]
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "DATABASE_URL": "${input:database_url}"
      }
    }
  },
  "inputs": [
    {
      "id": "github_token",
      "type": "promptString",
      "description": "GitHub Personal Access Token"
    },
    {
      "id": "database_url",
      "type": "promptString",
      "description": "PostgreSQL connection string"
    }
  ]
}
```

### VS Code Settings (`.vscode/settings.json`)

```json
{
  "github.copilot.chat.codeGeneration.instructions": [
    { "file": ".github/copilot-instructions.md" }
  ],
  "github.copilot.chat.reviewSelection.instructions": [
    { "text": "Focus on TypeScript best practices and Next.js conventions" }
  ],
  "chat.promptFiles": true,
  "chat.mcp.enabled": true,
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "typescript.preferences.importModuleSpecifier": "non-relative"
}
```

---

## 🎨 User Experience

### Interactive Mode Flow

```
┌────────────────────────────────────────────────────────────┐
│  🚀 Primer v1.0.0                                          │
│                                                            │
│  ? Where is your project?                                  │
│    ● Current directory (./my-project)                      │
│    ○ Different local path                                  │
│    ○ GitHub repository                                     │
│                                                            │
│  ────────────────────────────────────────────────────────  │
│                                                            │
│  📊 Analyzing repository...                                │
│                                                            │
│  Detected:                                                 │
│    Language:   TypeScript                                  │
│    Framework:  Next.js 14                                  │
│    Type:       Full-stack web application                  │
│    Package:    npm                                         │
│                                                            │
│  ────────────────────────────────────────────────────────  │
│                                                            │
│  ? What would you like to generate?                        │
│    ☑ Custom instructions (.github/copilot-instructions.md) │
│    ☑ VS Code settings (.vscode/settings.json)              │
│    ☑ MCP configuration (.vscode/mcp.json)                  │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Preview Before Writing

```
┌────────────────────────────────────────────────────────────┐
│  📄 Preview: .github/copilot-instructions.md               │
│  ────────────────────────────────────────────────────────  │
│                                                            │
│  # Project: my-nextjs-app                                  │
│                                                            │
│  ## Tech Stack                                             │
│  - Language: TypeScript                                    │
│  - Framework: Next.js 14 (App Router)                      │
│  ...                                                       │
│                                                            │
│  ────────────────────────────────────────────────────────  │
│  ? Action                                                  │
│    ● Write file                                            │
│    ○ Edit in $EDITOR                                       │
│    ○ Skip this file                                        │
│    ○ Cancel all                                            │
└────────────────────────────────────────────────────────────┘
```

---

## 🔐 Authentication

### GitHub Auth Flow

1. **Check for existing `gh` CLI auth**

   ```bash
   gh auth status
   ```

2. **If not authenticated, offer options:**
   - Use `gh auth login` (preferred)
   - Device flow OAuth (fallback)
   - Personal Access Token (manual)

3. **Store token securely**
   - Use system keychain via [keytar](https://github.com/atom/node-keytar)
   - Fallback to encrypted file in `~/.config/primer/`

### Required Scopes

- `repo` - Full repository access
- `read:user` - Read user profile

---

## 🚀 PR Automation

### Workflow

```
primer pr owner/repo
```

1. Fork repo (if no write access)
2. Create branch: `primer/add-configs`
3. Generate all configurations
4. Commit with conventional message: `chore: add AI configurations via Primer`
5. Open PR with:
   - Title: "🤖 Prime this repo for AI"
   - Body: Detailed description of added files
   - Labels: `ai`, `configuration` (if available)

### PR Template

```markdown
## 🤖 Primed for AI

This PR adds configurations to prime this repository for AI coding assistants.

### Added Files

| File                              | Purpose                                     |
| --------------------------------- | ------------------------------------------- |
| `.github/copilot-instructions.md` | Project context for GitHub Copilot          |
| `.vscode/settings.json`           | VS Code settings for optimal AI assistance  |
| `.vscode/mcp.json`                | Model Context Protocol server configuration |

### How to Use

1. Merge this PR
2. Open the project in VS Code
3. Start chatting with Copilot — it now understands your project!

---

_Generated by [Primer](https://github.com/your-org/primer)_
```

---

## 📁 Project Structure

```
primer/
├── src/
│   ├── index.ts              # Entry point
│   ├── cli.ts                # Commander setup
│   ├── config.ts             # Shared constants (DEFAULT_MODEL, etc.)
│   ├── commands/
│   │   ├── analyze.ts
│   │   ├── batch.tsx
│   │   ├── batchReadiness.tsx
│   │   ├── eval.ts
│   │   ├── generate.ts
│   │   ├── init.ts
│   │   ├── instructions.ts
│   │   ├── pr.ts
│   │   ├── readiness.ts
│   │   └── tui.tsx
│   ├── services/
│   │   ├── analyzer.ts       # Repo analysis logic
│   │   ├── azureDevops.ts    # Azure DevOps integration
│   │   ├── batch.ts          # Batch processing logic
│   │   ├── copilot.ts        # Copilot CLI integration
│   │   ├── evalScaffold.ts   # Eval config scaffolding
│   │   ├── evaluator.ts      # Eval runner
│   │   ├── generator.ts      # Config generation
│   │   ├── git.ts            # Local git operations
│   │   ├── github.ts         # GitHub API interactions
│   │   ├── instructions.ts   # Copilot SDK integration
│   │   ├── policy.ts         # Policy-driven readiness
│   │   ├── readiness.ts      # Readiness assessment
│   │   └── visualReport.ts   # HTML report generation
│   ├── ui/
│   │   ├── AnimatedBanner.tsx
│   │   ├── BatchReadinessTui.tsx
│   │   ├── BatchTui.tsx
│   │   ├── BatchTuiAzure.tsx
│   │   └── tui.tsx
│   └── utils/
│       ├── fs.ts             # File system helpers (safeWriteFile)
│       ├── logger.ts         # Styled console output
│       ├── output.ts         # CommandResult, ProgressReporter
│       ├── pr.ts             # PR body templates
│       └── repo.ts           # Repo URL parsing
├── vscode-extension/         # VS Code extension
│   ├── src/
│   │   ├── extension.ts
│   │   ├── services.ts       # Re-exports CLI services
│   │   ├── types.ts
│   │   ├── commands/
│   │   └── views/
│   └── package.json
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🧪 Testing Strategy

### Unit Tests

- Template rendering with different inputs
- Language/framework detection
- Config merging logic

### Integration Tests

- Full init flow (mocked filesystem)
- GitHub API interactions (mocked)
- PR creation flow

### E2E Tests

- Real repo analysis (test fixtures)
- Actual file generation

### Test Fixtures

Create example repos for each major stack:

- `fixtures/nextjs-app/`
- `fixtures/python-fastapi/`
- `fixtures/rust-cli/`
- `fixtures/monorepo/`

---

## 🌟 Additional Feature Ideas

### Phase 2

- [ ] **Team Sync** — Share configs across org/team repos
- [ ] **Config Validation** — Lint generated configs
- [ ] **Diff View** — Show what will change in existing files
- [ ] **Rollback** — Undo generated changes

### Phase 3

- [ ] **AI Enhancement** — Use AI to generate better project-specific instructions
- [ ] **Telemetry** — Anonymous usage stats (opt-in)
- [ ] **VS Code Extension** — GUI version of the CLI
- [ ] **GitHub Action** — Auto-update configs on repo changes
- [ ] **Monorepo Support** — Generate configs per package

### Community Features

- [ ] **Repo Showcase** — Examples of well-configured repos

---

## 📅 Implementation Phases

### Phase 1: MVP (2-3 weeks)

- [x] Project setup (TypeScript, Commander, tsup)
- [x] Basic CLI with `init` and `generate` commands
- [x] Local repo analysis
- [x] Custom instructions generation via Copilot SDK
- [x] Generate VS Code settings and MCP configuration
- [x] Basic interactive prompts

### Phase 2: GitHub Integration (1-2 weeks)

- [x] GitHub authentication
- [x] Remote repo access
- [x] PR creation
- [x] Fork workflow

### Phase 3: Polish (1 week)

- [x] Beautiful TUI with previews
- [x] More language/framework support
- [x] MCP configurations
- [x] Documentation and examples

### Phase 4: Distribution (1 week)

- [x] npm publish
- [ ] Standalone binaries
- [ ] Homebrew formula
- [x] CI/CD setup

---

## 🛠️ Development Commands

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Lint and format
npm run lint
npm run format

# Type check
npm run typecheck

# Run tests
npm run test

# Coverage
npm run test:coverage

# Link globally for testing
npm link
```

---

## 📚 Resources

- [GitHub CLI](https://cli.github.com/) — Auth reference
- [Octokit Docs](https://octokit.github.io/rest.js/) — GitHub API
- [Ink Components](https://github.com/vadimdemedes/ink) — TUI inspiration
- [Conventional Commits](https://www.conventionalcommits.org/) — Commit message format

---

## 🎯 Success Metrics

1. **Adoption**: npm downloads, GitHub stars
2. **Engagement**: PRs created via CLI
3. **Quality**: User feedback, issue reports
4. **Coverage**: Languages/frameworks supported

---

_This plan is a living document. Update as the project evolves._
