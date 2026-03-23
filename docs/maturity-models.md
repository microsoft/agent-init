# AgentRC: The Agentic SDLC Report Card

**Repo:** [github.com/microsoft/agentrc](https://github.com/microsoft/agentrc)

AgentRC is an open assessment framework for GitHub repos. Run it against any repo to produce a readiness score, and follow a concrete checklist to unlock progressively more capable AI-assisted — and eventually AI-autonomous — development.

**What it measures:** Engineering hours per PR, from issue creation to merged commit.
**What it produces:** A prioritized, actionable report card showing exactly where time is being lost and what to fix first.
**Where it leads:** A clear, incremental path from "AI helps sometimes" to "agents ship features end-to-end."

> This is the canonical reference for the maturity model and its assessment signals. For a more reflective companion on what the path feels like in practice — trust, habits, culture, and why Level 5 is hard — see [SDLC Readiness Assessment](sdlc-assessment.md).

---

## The Problem

The gap between what AI coding tools promise and what they reliably deliver in practice almost always comes down to the _repo environment_ — not the models.

AI output fails in predictable ways when repos lack the right context and structure:

- No AI instructions → agents guess at conventions → PRs violate standards → rework
- No CI → broken code merges silently → bugs surface in production, not at commit
- No type checking or linting → style noise clutters every review → reviewer attention on mechanics, not logic
- No MCP config → agents operate without live tool access → code built on wrong assumptions

AgentRC finds these gaps, ranks them by the hours they cost, and tells us exactly what to add or fix.

---

## How the Time Math Works

Understanding where hours go is what makes the fixes legible — to you and to anyone you need to bring along.

**Engineering hours per PR** — measured end-to-end, from issue creation to merged commit — breaks into two buckets:

**Pre-commit (planning + authoring loop)**

- Issue/task scoping ("what exactly needs to be built, and how?")
- Context-gathering ("what does this repo expect?")
- Prompt iteration and AI output correction
- In-editor rework of non-idiomatic or incorrect output
- Manual chaining of steps an agent could execute autonomously

**Post-commit (review/validation loop)**

- Author rework (fixing AI output that slipped through to review)
- Reviewer time (multiple feedback cycles)
- CI retry time (failed builds/tests)
- Setup/debug time when environment assumptions are wrong

At lower maturity levels, the biggest wins are **post-commit** — less rework, faster reviews.
At higher levels, AI starts collapsing **pre-commit** work — and at Level 5, agents handle authoring entirely, driving hours toward review-only overhead.

If you want a simple model to frame the impact:

| Variable | Meaning                             |
| -------- | ----------------------------------- |
| P        | PRs per month                       |
| H        | Avg engineering hours per PR        |
| C        | Fully loaded cost per engineer hour |

**Monthly PR cost:** `P x H x C`

AgentRC does not promise a specific % improvement upfront. It measures `H`, identifies where hours are lost, and tracks reduction over time. As maturity increases, post-commit costs fall first; then pre-commit authoring time follows.

---

## How to Run It

### Start with One Repo

Pick a representative repo and run `agentrc` against it. It will produce a readiness report with gaps ranked by estimated hour impact. From there:

1. **Baseline** — review the report; understand the current score and where hours are going
2. **Fix the top gaps** — prioritized for you: high impact, low effort first
3. **Add AI instructions** — Copilot instructions, AGENTS.md, or equivalent; encode conventions so agents stop guessing
4. **Standardize the dev environment** — MCP config, VS Code settings for agentic workflows
5. **Lock it in** — add a CI gate enforcing a minimum readiness level so the gains do not regress

**Typical result:** 0.5–1.5 hours saved per PR, measurable before and after.

| What gets fixed | What improves         |
| --------------- | --------------------- |
| AI misfires     | Fewer author rewrites |
| Review churn    | Fewer feedback cycles |
| CI retries      | Fewer failed PR loops |
| Setup friction  | Faster PR creation    |

---

### Scale Across a Portfolio

Once the model is validated on one repo, run `agentrc` across a larger set of repos — or a representative sample. The process:

1. **Portfolio baseline** — capture the distribution of maturity levels across repos
2. **Segment by cost profile:**

| Category   | Description                  |
| ---------- | ---------------------------- |
| Quick Wins | Instruction/config gaps only |
| Stabilize  | Build/test/CI issues         |
| Strategic  | Monorepos / critical systems |

3. **Set a standard** — define what "Level 3" (or higher) means for an org and apply it consistently
4. **Automate remediation** — generate instructions and configs, open PRs repo-by-repo
5. **Enforce via CI** — readiness gates prevent drift as codebases evolve

**Key outcome:** Engineering hours per PR stop varying based on _which repo_ is touched. Review time becomes predictable; reviewer cognitive load drops; savings compound rather than decay.

---

## The Report Card: 5 Levels

---

## Level 1 — Functional

> **What this level unlocks:** A repo at Level 1 is safe for AI-assisted development — a human can clone, build, and test it with confidence. Agents can produce output, but need close human review because there are no enforced conventions or CI gates to catch mistakes automatically.

**Where time is lost**

- PRs fail due to undocumented or fragile build/test paths
- CI failures and developer debugging setup time
- Agent-submitted PRs arrive without context, requiring back-and-forth before reviewers can evaluate them

**What changes at Level 1**

- Build/test paths become explicit and measurable
- CI babysitting and setup/debug time are reduced

### Assessment Checks at Level 1

| Check                                      | What It Looks For                                                 | Why It Matters                                                                                                | Risk When It Fails                                                                                                                                           |
| ------------------------------------------ | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Linting configured**                     | ESLint, Biome, or Prettier config file                            | Without a linter, AI generates stylistically inconsistent code that triggers review comments on every PR      | Every PR gets style-related review churn; author rework before first substantive feedback                                                                    |
| **Build script present**                   | `build` script in package.json (per app)                          | Agents need an unambiguous build command to know whether their code compiles                                  | Agents can't verify their own output; broken code regularly reaches reviewers                                                                                |
| **Test script present**                    | `test` script in package.json (per app)                           | Agents need a deterministic test command to validate generated code before submitting                         | Agents have no feedback loop; regressions surface as review surprises rather than pre-commit failures                                                        |
| **README present**                         | README.md at repo root                                            | The README is the first context AI agents read; without it they guess at project purpose and conventions      | AI generates code misaligned with project goals; reviewers spend time re-explaining intent                                                                   |
| **Lockfile present**                       | package-lock.json, pnpm-lock.yaml, yarn.lock, or bun.lockb        | Without a lockfile, dependency resolution is non-deterministic and agents can't reproduce the dev environment | CI failures from dependency drift; unreproducible builds block every PR                                                                                      |
| **LICENSE present**                        | LICENSE file at repo root                                         | Required for legal clarity on code contributions, including AI-generated code                                 | Legal risk on AI-generated contributions; missing OSS compliance gates block enterprise customers                                                            |
| **Custom instructions present**            | copilot-instructions.md, AGENTS.md, CLAUDE.md, .cursorrules, etc. | Without custom instructions, AI has no knowledge of your repo's specific conventions, stack, or patterns      | AI output is generic and often architecturally wrong; every PR requires heavy correction before it's review-ready                                            |
| **PR template present**                    | .github/pull_request_template.md                                  | Structures every PR — human or agent-submitted — so reviewers get consistent, complete context                | Agent-submitted PRs arrive with no description, no test plan, no context; reviewers spend time extracting information that should have been provided upfront |
| **Area README present** _(monorepo)_       | README.md in each detected area directory                         | Per-area documentation scopes agent context to the right subsystem                                            | Agents conflate cross-area conventions and produce misguided code in complex monorepos                                                                       |
| **Area build script present** _(monorepo)_ | `build` script in each area's package.json                        | Each area needs its own build command so agents can work autonomously per subsystem                           | Agents can't build or validate area-isolated changes; multi-area PRs become fragile                                                                          |
| **Area test script present** _(monorepo)_  | `test` script in each area's package.json                         | Per-area test commands let agents validate changes without running the full suite                             | Agents can't verify area-scoped changes; cross-area noise clutters CI feedback                                                                               |

---

## Level 2 — Documented

> **What this level unlocks:** A repo at Level 2 is safe for AI-assisted development with meaningful autonomy. Agents understand conventions, have a CI gate to catch regressions, and can be connected to live tools via MCP. Human review is still essential, but the volume of rework comments drops significantly.

**Where time is lost**

- AI output looks correct but violates repo conventions
- Author rework and reviewers re-explaining norms
- Agents act on underspecified issues, producing work that misses requirements

**What changes at Level 2**

- Repo-specific AI instructions are in place
- Instruction consistency is enforced
- Author rewrites and review cycles are reduced

### Assessment Checks at Level 2

| Check                                               | What It Looks For                                                                             | Why It Matters                                                                                                                       | Risk When It Fails                                                                                                                                                                    |
| --------------------------------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Issue templates present**                         | .github/ISSUE_TEMPLATE/ with at least one structured template                                 | Structured issue templates give agents consistent, parseable input — they define what information a task requires before work begins | Agent receives a free-text issue with missing context; it guesses at requirements, producing code that solves the wrong problem or requires human clarification before work can start |
| **Type checking configured**                        | tsconfig.json, pyproject.toml, or mypy.ini                                                    | Type checking gives agents a compile-time correctness signal they can rely on before submitting                                      | Agents produce type-incorrect code that passes syntax checks but causes runtime failures                                                                                              |
| **CI workflow configured**                          | .github/workflows/ directory                                                                  | Without CI, there's no consistent gate ensuring AI-generated code actually works                                                     | Broken code merges silently; the "did it work?" question falls entirely on human reviewers                                                                                            |
| **CONTRIBUTING guide present**                      | CONTRIBUTING.md at repo root                                                                  | Agents use CONTRIBUTING.md to understand PR norms, branch conventions, and review expectations                                       | Agents submit PRs that violate team process, causing rejection cycles unrelated to code quality                                                                                       |
| **Environment example present**                     | .env.example or .env.sample                                                                   | Agents need to know what environment variables a project expects to scaffold working code                                            | Agents hardcode values or omit config; PRs fail at runtime and require correction before merge                                                                                        |
| **Formatter configured**                            | Prettier or Biome config file                                                                 | Consistent formatting removes an entire class of review comments automatically                                                       | Every AI PR generates formatting noise; reviewers spend attention on mechanics instead of logic                                                                                       |
| **CODEOWNERS present**                              | CODEOWNERS at root or .github/                                                                | Without CODEOWNERS, AI-generated PRs go to wrong reviewers or sit unassigned                                                         | Autonomous PRs get stuck with no accountability structure; review latency eliminates time savings                                                                                     |
| **AI instruction files consistent**                 | Compares content of multiple instruction files (Copilot, AGENTS.md, CLAUDE.md) for divergence | Divergent instruction files send conflicting signals to different agents                                                             | One agent follows your conventions; another ignores them — unpredictable, hard-to-review PRs                                                                                          |
| **MCP configuration present**                       | .vscode/mcp.json, mcp.json, or MCP section in settings.json                                   | MCP connects agents to live tools (databases, APIs, services); without it agents operate blind                                       | Agents produce code assuming wrong APIs or data structures; runtime failures surface post-merge                                                                                       |
| **Area-specific instructions present** _(monorepo)_ | .github/instructions/{area}.instructions.md per detected area                                 | Per-area instructions let agents apply the right conventions to the right subsystem                                                  | Agents apply root-level patterns across specialized subsystems; architecture drift compounds over time                                                                                |

---

## Level 3 — Standardized

> **What this level unlocks:** A repo at Level 3 is ready for supervised autonomous operation — agents can be trusted to draft complete, policy-compliant PRs and handle multi-step tasks. Security guardrails, dependency hygiene, and observability are in place so that what agents produce can be safely shipped with targeted human review rather than full re-inspection.

**Where time is lost**

- Inconsistent repo behaviors increase reviewer context switching
- CI variance, ownership confusion, and policy exceptions add overhead

**What changes at Level 3**

- CI-enforced readiness standards are in place
- Reviewer overhead and escalation time are reduced

### Assessment Checks at Level 3

| Check                             | What It Looks For                                       | Why It Matters                                                                                                            | Risk When It Fails                                                                                                         |
| --------------------------------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **Security policy present**       | SECURITY.md at repo root                                | Defines how vulnerabilities are reported and handled; gives agents a reference for secure coding expectations             | Agents generate insecure patterns with no organizational backstop; no disclosure process for AI-introduced vulnerabilities |
| **Dependabot configured**         | .github/dependabot.yml                                  | Automated dependency updates keep AI-generated code from relying on vulnerable packages                                   | Agents write code referencing stale or CVE-affected dependencies; security debt compounds silently                         |
| **Observability tooling present** | OpenTelemetry, Pino, Winston, or Bunyan in dependencies | Agents generating code with no logging or tracing produce systems impossible to debug in production                       | AI-authored code ships with no observability hooks; production failures become blind spots                                 |
| **Custom AI agents configured**   | .github/agents/, .copilot/agents/, or agent config YAML | Custom agents encode project-specific automation workflows; without them every agentic task requires manual orchestration | Agent capabilities plateau at manual-assist; no path to repeatable, scalable autonomous task execution                     |
| **Copilot/Claude skills present** | .copilot/skills/, .github/skills/, or .claude/skills/   | Skills give agents specialized, repeatable capabilities for common repo workflows                                         | Agents reinvent the wheel on every invocation; no compound improvement in task quality over time                           |

---

## Level 4 — Optimized

> **What this level unlocks:** At Level 4, agents can be trusted to execute well-defined end-to-end tasks — read an issue, write code, run tests, open a PR — without human scaffolding at each step. Pre-commit authoring time starts falling meaningfully as autonomous task execution becomes routine.

> **Note on checks:** AgentRC does not yet define discrete automated checks at Level 4. Reaching this level means all Level 1–3 checks pass _and_ the MCP, agent, and skill infrastructure validated at Level 3 is actively being exercised in real workflows. The gap to close here is operational, not structural. In practice, this means Level 4 is best evidenced through workflow signals rather than simple file-presence checks.

**Where time is lost**

- Developers manually chain steps AI could execute end-to-end
- Context switching between tools and tasks
- Pre-commit authoring time for routine and repeatable changes

**What changes at Level 4**

- MCP-enabled tool use gives agents real repo access
- Agent skills handle multi-step work (read issue → write code → run tests → open PR)
- Repo context and instructions let agents act without scaffolding
- Pre-commit authoring time and manual orchestration overhead are reduced

**Evidence you are really at Level 4**

- PR history shows repeated agent-authored or agent-assisted end-to-end work, not just isolated demos
- MCP, skills, and custom agents are being used in daily workflows, not merely configured in files
- Teams have working conventions for which task types are safe to delegate and how those PRs are reviewed
- Routine changes land with less manual chaining and fewer follow-up fix-up commits from the original author

**Candidate evidence checks at Level 4**

- Agent-authored or agent-assisted PRs appear repeatedly over recent history, not just once
- MCP, skill, or custom-agent configuration that exists in the repo is referenced by active workflows or developer tooling
- Issue and PR templates provide enough structure for agents to carry work from issue to reviewed PR
- Repeated task categories such as migrations, refactors, or test expansions are commonly delegated end-to-end

**What Level 4 still lacks**

- Autonomous quality is not yet governed by a continuous evaluation loop
- Teams still decide case-by-case when to delegate rather than treating agents as the default authoring path
- Drift in instructions or repo context can quietly accumulate because there is no CI-enforced eval threshold watching for it

---

## Level 5 — Autonomous

> **What this level unlocks:** At Level 5, agents handle authoring entirely. Human time becomes review and approval, not execution. The investment compounds: CI gates and continuous evaluation prevent the context from going stale as the codebase evolves.

> **Note on checks:** AgentRC does not define discrete file-presence checks at Level 5. Autonomous maturity is measured not by the presence of new files but by the _ongoing performance_ of agent workflows — specifically, the `agentrc eval` pass rate enforced in CI. A repo at Level 5 has a CI gate (e.g., `agentrc eval --fail-level 80`) that prevents instruction drift and confirms that agent output continues to improve over time. Failure here means autonomous PRs quietly regress in quality without anyone noticing until production. Unlike Level 4, Level 5 has a stronger path to explicit operational checks because the quality signal can be enforced directly in CI.

**Where time is lost**

- Human engineering time is still required to author, iterate, and submit work — even for changes agents are fully capable of delivering
- Manual prompt iteration for well-understood task types

**What changes at Level 5**

- Fully autonomous agent workflows: agent reads issue → writes code → runs tests → opens PR — without human scaffolding
- Repo context, instructions, and MCP tooling provide everything agents need to act independently
- CI-enforced readiness gates prevent drift so the investment compounds
- Essentially all pre-commit authoring time is eliminated for agent-handled work
- H approaches its floor: human time is review and approval only

**Evidence you are really at Level 5**

- `agentrc eval` results are enforced in CI and regressions block merges
- Eval fixtures or benchmark cases exist and are maintained as the codebase evolves
- Autonomous PRs are consistently reviewable with minimal human edits
- Historical eval reports, dashboards, or workflow artifacts show that agent quality is being monitored over time
- Instruction and context updates happen as ongoing maintenance, not only after obvious failures

**Candidate evidence checks at Level 5**

- `agentrc eval` configuration is present and exercised in CI
- CI enforces an eval threshold and blocks merges on regression
- Eval outputs are retained as workflow artifacts or comparable historical records
- Required status checks or branch protections include the eval result
- Eval fixtures or benchmark cases are updated as the repo evolves, indicating that instruction drift is being managed intentionally

**What changes culturally at Level 5**

- The team stops asking "can I hand this off safely?" and starts asking "is the system still producing acceptable work?"
- AI readiness is treated like test infrastructure: monitored, gated, and continuously improved
- Engineers spend more time on review, policy, and instruction maintenance than on routine authoring for agent-handled work

**The metric shifts at Level 5:**
"Hours per PR" reaches diminishing returns when H is already minimal. The more meaningful signal becomes **features shipped per engineer per sprint** — measuring what the team _produces_, not just what each unit _costs_.
