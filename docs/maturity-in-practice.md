# SDLC Readiness Assessment: Toward Level-5 Agentic Delivery

> What would it look like if agents could handle most of the authoring work — and engineers spent their time on judgment, architecture, and the problems that actually need human creativity?
> That is the promise of Level 5. Getting there is genuinely hard. This document tries to be honest about that, while exploring what the path looks like from the inside.

---

## About AgentRC

The checks and maturity levels in this document are drawn from [AgentRC](https://github.com/microsoft/agentrc), an open-source tool built to assess and improve AI-readiness across GitHub repositories. AgentRC scans a repo against a defined set of signals at each maturity level, generates a readiness report, and can open PRs with targeted fixes — custom instructions, CI gates, MCP configuration, and more.

This document is the explanatory companion. For the canonical level definitions, assessment signals, and rollout guidance, see [AgentRC: The Agentic SDLC Report Card](maturity-models.md). The framework here is meant to be useful as a thinking tool alongside that reference. AgentRC is what operationalizes it.

---

## Starting With Honesty

There is a version of this idea that makes agentic delivery sound almost inevitable — stack the right configuration files, point the agent at the repo, and watch the PRs roll in. That version is not this document.

Full autonomous delivery is one of the more interesting and difficult challenges in software engineering right now. It requires more than a well-configured repo. It requires teams to develop new instincts: how to write tasks clearly enough for an agent to execute, how to evaluate agent output without re-reading every line, how to know when to trust the agent and when to pull it back. It requires process changes that most organizations have not made yet. And it requires a kind of ongoing maintenance — keeping instructions, evals, and tooling calibrated — that does not map neatly onto existing engineering rhythms.

Repo configuration matters. The checks in this document are real prerequisites. But they are closer to the floor than the ceiling. A repo with perfect instructions and CI gates is still a long way from a team that ships confidently with agents in the loop.

The reason to think carefully about this anyway is that the direction is right. The teams making meaningful progress are the ones who started somewhere, stayed honest about where the friction was, and kept adjusting. This framework is meant to help with that — not to promise a destination, but to make the terrain a little more legible.

---

## A Note on What the Levels Actually Measure

Each level below describes a structural state — what a repo enables, and what it is still working against. The levels are cumulative; it is difficult to operate reliably at Level 3 without the foundations from Level 2 in place.

But here is what the levels do not capture: the operational and cultural work that lives between them. Getting configurations in place is the easier part. Getting a team to actually trust and exercise those configurations — to let agents run tasks end-to-end, to calibrate review habits, to build shared intuition about where agents add value and where they do not — that is the harder part, and it does not show up in a file audit.

The metric this framework uses as a rough signal is **engineering hours per PR**, measured from issue creation to merged commit. Early levels tend to reduce post-commit waste — rework, review churn, CI failures. Higher levels start compressing pre-commit authoring time. At Level 5, the metric itself starts to shift — from cost per PR toward features shipped per engineer per sprint.

That trajectory is real, but it is not automatic. It emerges from sustained investment in tooling, process, and team trust.

| Level | Name         | What becomes possible                | Where friction tends to fall                |
| ----- | ------------ | ------------------------------------ | ------------------------------------------- |
| 1     | Functional   | AI-assisted with close human review  | CI, setup, environment reproducibility      |
| 2     | Documented   | AI output that fits the codebase     | Author rework, convention gaps              |
| 3     | Standardized | Supervised autonomous operation      | Cross-repo consistency, policy drift        |
| 4     | Optimized    | Trusted end-to-end task execution    | Orchestration overhead, tooling integration |
| 5     | Autonomous   | Agents handling authoring end-to-end | Trust, evaluation, ongoing calibration      |

---

## Reading the Five Levels

The five levels are still the right ladder. What this document is trying to add is not a second set of definitions, but a way to interpret them.

If you want the authoritative checklist, the detailed evidence, or the exact assessment signals, use [the report card](maturity-models.md). What follows is the shorter version of what each level tends to mean from the inside:

| Level            | What it usually feels like in practice                                                                                                                      | Canonical reference                                 |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| 1 — Functional   | The repo is barely legible enough for humans and agents to build and test without guesswork. Most friction is environmental.                                | [Level 1](maturity-models.md#level-1--functional)   |
| 2 — Documented   | The repo starts explaining itself. Review churn falls because conventions and inputs are written down instead of rediscovered in every PR.                  | [Level 2](maturity-models.md#level-2--documented)   |
| 3 — Standardized | The setup stops depending on individual heroics. Security, dependency hygiene, and encoded workflows make AI-readiness durable.                             | [Level 3](maturity-models.md#level-3--standardized) |
| 4 — Optimized    | Teams begin trusting agents with bounded end-to-end work. The hard part shifts from configuration to habit, trust, and delegation.                          | [Level 4](maturity-models.md#level-4--optimized)    |
| 5 — Autonomous   | Agents handle authoring for suitable work, and the real challenge becomes governance: evals, drift prevention, review discipline, and organizational trust. | [Level 5](maturity-models.md#level-5--autonomous)   |

---

## Four Transitions That Matter More Than the File Audit

### 1. From missing structure to explicit structure

The jump from Level 1 to Level 2 is mostly about making the repo legible. The work is tangible: build scripts, test commands, instructions, templates, CI, documented expectations. The friction is painful, but it is familiar. Most teams know how to improve it once they decide it matters.

This is why early maturity work often feels deceptively tractable. The fixes are visible. The artifacts are easy to point at. And the wins show up quickly in fewer broken PRs, fewer review loops, and less time wasted on context reconstruction.

### 2. From explicit structure to repeatable systems

The jump from Level 2 to Level 3 is where teams stop relying on memory and start relying on enforcement. Security policy, dependency hygiene, reusable skills, custom agents, and observability all serve the same purpose: making AI-readiness durable instead of incidental.

The key idea here is not sophistication. It is survivability. A repo at Level 3 should still be understandable and operable after the most experienced engineer on the team goes on vacation, changes jobs, or simply stops being the person who remembers how to chain all the steps together.

### 3. From configuration to behavior

The jump from Level 3 to Level 4 is the most commonly misunderstood one. Teams often think they are blocked on tooling when they are really blocked on trust. By Level 4, the tooling mostly exists. The question is whether anyone is actually using it to hand off bounded work end-to-end.

That is why Level 4 is hard to assess through simple file checks alone. It is a lived state. You see it in PR history, in repeated delegation, in review habits, and in the team's growing intuition about which categories of work agents can carry safely.

### 4. From trust to governance

The jump from Level 4 to Level 5 is different again. Level 4 proves that agents can do meaningful work. Level 5 proves that the _system_ can keep that quality from drifting. The center of gravity moves from delegated execution to continuous governance.

That is why Level 5 starts to look less like a one-time setup project and more like test infrastructure. Evals in CI, explicit quality thresholds, retained history, and regular instruction maintenance are not nice-to-haves at that point. They are what keep autonomous output from silently decaying as the repo, the models, and the surrounding organization all change.

---

## What the Levels Miss

A good maturity model can add a bit of value. It can tell us whether the repo has the right structure. It can sometimes tell us whether enforcement exists. It is less valuable at telling us whether the team has the culture and ceremonies to use those capabilities well.

That is why the human side of the framework matters so much:

- whether reviewers know how to review agent output without redoing the work
- whether issues are written clearly enough for agents to execute
- whether the team has a shared sense of what is safe to delegate
- whether eval failures lead to improving instructions and context, not just patching the immediate output

Those things often determine whether a team stalls at Level 3, grows into Level 4, or can hold Level 5 without losing confidence.

---

## Where to Start

The right place to begin depends on where the actual friction is — and on what the team is willing to change, not just configure.

A few patterns that tend to come up:

- If agents are generating code that misses the codebase's conventions, the gap is usually at Level 2 — instructions and documentation are worth examining first.
- If review cycles are long and the same issues keep surfacing, the gap is often at Level 1 or 2 — structure and CI help make the problems visible and addressable.
- If individual repos are inconsistent — same prompt, different behavior — that is often a Level 3 signal around standardization and enforcement.
- If tooling is in place but the team is still doing a lot of manual orchestration, that is a Level 4 question about whether the workflows are actually being exercised.
- If agents are doing real work but quality is inconsistent or hard to measure, that is the Level 5 challenge of evaluation and trust.

The levels are not a curriculum to complete in sequence. They are a way of thinking about where the current friction lives — and what kind of investment is likely to address it.

---

## A Closing Thought

Most teams working toward agentic delivery are figuring it out as they go. The tooling is still maturing. The patterns are still being established. The teams making real progress are not the ones with the most sophisticated setup — they are the ones that started somewhere, measured honestly, and kept learning.

Every level of this framework generates real value before the next one becomes relevant. Getting to Level 2 is worth doing even if Level 5 feels distant. The goal is not to arrive at full autonomy on a timeline — it is to keep moving in a direction that compounds.

---

_This assessment framework is based on the [AgentRC](https://github.com/microsoft/agentrc) maturity model. For the full assessment checklist and how to run it, see [AgentRC: The Agentic SDLC Report Card](maturity-models.md)._
