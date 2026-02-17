import fs from "fs/promises";
import path from "path";

import { fileExists, safeReadDir, readJson } from "../utils/fs";

import type { RepoApp, RepoAnalysis, Area } from "./analyzer";
import { analyzeRepo, sanitizeAreaName, loadPrimerConfig } from "./analyzer";
import type { ExtraDefinition, PolicyConfig } from "./policy";
import { loadPolicy, resolveChain } from "./policy";

export type ReadinessPillar =
  | "style-validation"
  | "build-system"
  | "testing"
  | "documentation"
  | "dev-environment"
  | "code-quality"
  | "observability"
  | "security-governance"
  | "ai-tooling";

export type PillarGroup = "repo-health" | "ai-setup";

export const PILLAR_GROUPS: Record<ReadinessPillar, PillarGroup> = {
  "style-validation": "repo-health",
  "build-system": "repo-health",
  testing: "repo-health",
  documentation: "repo-health",
  "dev-environment": "repo-health",
  "code-quality": "repo-health",
  observability: "repo-health",
  "security-governance": "repo-health",
  "ai-tooling": "ai-setup"
};

export const PILLAR_GROUP_NAMES: Record<PillarGroup, string> = {
  "repo-health": "Repo Health",
  "ai-setup": "AI Setup"
};

export function groupPillars(
  pillars: ReadinessPillarSummary[]
): Array<{ group: PillarGroup; label: string; pillars: ReadinessPillarSummary[] }> {
  const groups: PillarGroup[] = ["repo-health", "ai-setup"];
  return groups.map((group) => ({
    group,
    label: PILLAR_GROUP_NAMES[group],
    pillars: pillars.filter((p) => PILLAR_GROUPS[p.id] === group)
  }));
}

export type ReadinessScope = "repo" | "app" | "area";

export type ReadinessStatus = "pass" | "fail" | "skip";

export type ReadinessCriterionResult = {
  id: string;
  title: string;
  pillar: ReadinessPillar;
  level: number;
  scope: ReadinessScope;
  impact: "high" | "medium" | "low";
  effort: "low" | "medium" | "high";
  status: ReadinessStatus;
  reason?: string;
  evidence?: string[];
  passRate?: number;
  appSummary?: { passed: number; total: number };
  appFailures?: string[];
  areaSummary?: { passed: number; total: number };
  areaFailures?: string[];
};

export type ReadinessExtraResult = {
  id: string;
  title: string;
  status: ReadinessStatus;
  reason?: string;
};

export type ReadinessPillarSummary = {
  id: ReadinessPillar;
  name: string;
  passed: number;
  total: number;
  passRate: number;
};

export type ReadinessLevelSummary = {
  level: number;
  name: string;
  passed: number;
  total: number;
  passRate: number;
  achieved: boolean;
};

export type AreaReadinessReport = {
  area: Area;
  criteria: ReadinessCriterionResult[];
  pillars: ReadinessPillarSummary[];
};

export type ReadinessReport = {
  repoPath: string;
  generatedAt: string;
  isMonorepo: boolean;
  apps: Array<{ name: string; path: string }>;
  pillars: ReadinessPillarSummary[];
  levels: ReadinessLevelSummary[];
  achievedLevel: number;
  criteria: ReadinessCriterionResult[];
  extras: ReadinessExtraResult[];
  areaReports?: AreaReadinessReport[];
  policies?: { chain: string[]; criteriaCount: number };
};

type ReadinessOptions = {
  repoPath: string;
  includeExtras?: boolean;
  perArea?: boolean;
  policies?: string[];
};

export type ReadinessContext = {
  repoPath: string;
  analysis: RepoAnalysis;
  apps: RepoApp[];
  rootFiles: string[];
  rootPackageJson?: Record<string, unknown>;
  areaPath?: string;
  areaFiles?: string[];
};

export type ReadinessCriterion = {
  id: string;
  title: string;
  pillar: ReadinessPillar;
  level: number;
  scope: ReadinessScope;
  impact: "high" | "medium" | "low";
  effort: "low" | "medium" | "high";
  check: (context: ReadinessContext, app?: RepoApp, area?: Area) => Promise<CheckResult>;
};

export type CheckResult = {
  status: ReadinessStatus;
  reason?: string;
  evidence?: string[];
};

export async function runReadinessReport(options: ReadinessOptions): Promise<ReadinessReport> {
  const repoPath = options.repoPath;
  const analysis = await analyzeRepo(repoPath);
  const rootFiles = await safeReadDir(repoPath);
  const rootPackageJson = await readJson(path.join(repoPath, "package.json"));
  const apps = analysis.apps?.length ? analysis.apps : [];

  const context: ReadinessContext = {
    repoPath,
    analysis,
    apps,
    rootFiles,
    rootPackageJson
  };

  // ── Policy resolution ──
  let policySources = options.policies;
  if (!policySources?.length) {
    // Check primer.config.json for policy config
    const primerConfig = await loadPrimerConfig(repoPath);
    if (primerConfig?.policies?.length) {
      policySources = primerConfig.policies;
    }
  }

  const baseCriteria = buildCriteria();
  const baseExtras = buildExtras();
  let resolvedCriteria: ReadinessCriterion[];
  let resolvedExtras: ExtraDefinition[];
  let passRateThreshold = 0.8;
  let policyInfo: { chain: string[]; criteriaCount: number } | undefined;

  if (policySources?.length) {
    const policyConfigs: PolicyConfig[] = [];
    // Config-sourced policies are restricted to JSON-only (no import())
    const isConfigSourced = policySources !== options.policies;
    for (const source of policySources) {
      policyConfigs.push(await loadPolicy(source, { jsonOnly: isConfigSourced }));
    }
    const resolved = resolveChain(baseCriteria, baseExtras, policyConfigs);
    resolvedCriteria = resolved.criteria;
    resolvedExtras = resolved.extras;
    passRateThreshold = resolved.thresholds.passRate;
    policyInfo = { chain: resolved.chain, criteriaCount: resolved.criteria.length };
  } else {
    resolvedCriteria = baseCriteria;
    resolvedExtras = baseExtras;
  }

  const criteriaResults: ReadinessCriterionResult[] = [];

  for (const criterion of resolvedCriteria) {
    if (criterion.scope === "repo") {
      const result = await criterion.check(context);
      criteriaResults.push({
        id: criterion.id,
        title: criterion.title,
        pillar: criterion.pillar,
        level: criterion.level,
        scope: criterion.scope,
        impact: criterion.impact,
        effort: criterion.effort,
        status: result.status,
        reason: result.reason,
        evidence: result.evidence
      });
      continue;
    }

    if (criterion.scope === "area") {
      if (!options.perArea) continue; // Exclude area criteria unless --per-area
      // Area criteria get a placeholder — populated by per-area loop below
      const areas = analysis.areas ?? [];
      if (areas.length === 0) continue; // No areas, nothing to aggregate
      criteriaResults.push({
        id: criterion.id,
        title: criterion.title,
        pillar: criterion.pillar,
        level: criterion.level,
        scope: criterion.scope,
        impact: criterion.impact,
        effort: criterion.effort,
        status: "skip",
        reason: "Run with --per-area for area breakdown."
      });
      continue;
    }

    const appResults = await Promise.all(
      apps.map(async (app) => ({
        app,
        result: await criterion.check(context, app)
      }))
    );

    if (!appResults.length) {
      criteriaResults.push({
        id: criterion.id,
        title: criterion.title,
        pillar: criterion.pillar,
        level: criterion.level,
        scope: criterion.scope,
        impact: criterion.impact,
        effort: criterion.effort,
        status: "skip",
        reason: "No application packages detected."
      });
      continue;
    }

    const passed = appResults.filter((entry) => entry.result.status === "pass").length;
    const total = appResults.length;
    const passRate = total ? passed / total : 0;
    const status: ReadinessStatus = passRate >= passRateThreshold ? "pass" : "fail";
    const failures = appResults
      .filter((entry) => entry.result.status !== "pass")
      .map((entry) => entry.app.name);

    criteriaResults.push({
      id: criterion.id,
      title: criterion.title,
      pillar: criterion.pillar,
      level: criterion.level,
      scope: criterion.scope,
      impact: criterion.impact,
      effort: criterion.effort,
      status,
      reason: status === "pass" ? undefined : `Only ${passed}/${total} apps pass this check.`,
      passRate,
      appSummary: { passed, total },
      appFailures: failures
    });
  }

  // Per-area breakdown
  let areaReports: AreaReadinessReport[] | undefined;
  const areas = analysis.areas ?? [];

  if (options.perArea && areas.length > 0) {
    const areaCriteria = resolvedCriteria.filter((c) => c.scope === "area");
    areaReports = [];

    for (const area of areas) {
      if (!area.path) continue;
      const areaFiles = await safeReadDir(area.path);
      const areaContext: ReadinessContext = {
        ...context,
        areaPath: area.path,
        areaFiles
      };

      const areaResults: ReadinessCriterionResult[] = [];
      for (const criterion of areaCriteria) {
        const result = await criterion.check(areaContext, undefined, area);
        areaResults.push({
          id: criterion.id,
          title: criterion.title,
          pillar: criterion.pillar,
          level: criterion.level,
          scope: criterion.scope,
          impact: criterion.impact,
          effort: criterion.effort,
          status: result.status,
          reason: result.reason,
          evidence: result.evidence
        });
      }

      const areaPillars = summarizePillars(areaResults);
      areaReports.push({ area, criteria: areaResults, pillars: areaPillars });
    }

    // Update aggregate area criteria in main results
    for (const criterion of criteriaResults) {
      if (criterion.scope !== "area") continue;
      const perAreaResults = areaReports
        .map((ar) => ar.criteria.find((c) => c.id === criterion.id))
        .filter(Boolean) as ReadinessCriterionResult[];
      if (!perAreaResults.length) continue;

      const passed = perAreaResults.filter((r) => r.status === "pass").length;
      const total = perAreaResults.length;
      const passRate = total ? passed / total : 0;
      criterion.status = passRate >= passRateThreshold ? "pass" : "fail";
      criterion.reason =
        criterion.status === "pass" ? undefined : `Only ${passed}/${total} areas pass this check.`;
      criterion.passRate = passRate;
      criterion.areaSummary = { passed, total };
      criterion.areaFailures = areaReports
        .filter((ar) => ar.criteria.find((c) => c.id === criterion.id)?.status !== "pass")
        .map((ar) => ar.area.name);
    }
  }

  // Compute summaries after area aggregation so they reflect final statuses
  const pillars = summarizePillars(criteriaResults);
  const levels = summarizeLevels(criteriaResults, passRateThreshold);
  const achievedLevel = levels
    .filter((level) => level.achieved)
    .reduce((acc, level) => Math.max(acc, level.level), 0);

  const extras = options.includeExtras === false ? [] : await runExtras(context, resolvedExtras);

  return {
    repoPath,
    generatedAt: new Date().toISOString(),
    isMonorepo: analysis.isMonorepo ?? false,
    apps: apps.map((app) => ({ name: app.name, path: app.path })),
    pillars,
    levels,
    achievedLevel,
    criteria: criteriaResults,
    extras,
    areaReports,
    policies: policyInfo
  };
}

export function buildCriteria(): ReadinessCriterion[] {
  return [
    {
      id: "lint-config",
      title: "Linting configured",
      pillar: "style-validation",
      level: 1,
      scope: "repo",
      impact: "high",
      effort: "low",
      check: async (context) => {
        const found = await hasLintConfig(context.repoPath);
        return {
          status: found ? "pass" : "fail",
          reason: found ? undefined : "Missing ESLint/Biome/Prettier configuration.",
          evidence: ["eslint.config.js", ".eslintrc", "biome.json", ".prettierrc"]
        };
      }
    },
    {
      id: "typecheck-config",
      title: "Type checking configured",
      pillar: "style-validation",
      level: 2,
      scope: "repo",
      impact: "medium",
      effort: "low",
      check: async (context) => {
        const found = await hasTypecheckConfig(context.repoPath);
        return {
          status: found ? "pass" : "fail",
          reason: found ? undefined : "Missing type checking config (tsconfig or equivalent).",
          evidence: ["tsconfig.json", "pyproject.toml", "mypy.ini"]
        };
      }
    },
    {
      id: "build-script",
      title: "Build script present",
      pillar: "build-system",
      level: 1,
      scope: "app",
      impact: "high",
      effort: "low",
      check: async (_context, app) => {
        const found = Boolean(app?.scripts?.build);
        return {
          status: found ? "pass" : "fail",
          reason: found ? undefined : "Missing build script in package.json."
        };
      }
    },
    {
      id: "ci-config",
      title: "CI workflow configured",
      pillar: "build-system",
      level: 2,
      scope: "repo",
      impact: "high",
      effort: "medium",
      check: async (context) => {
        const found = await hasGithubWorkflows(context.repoPath);
        return {
          status: found ? "pass" : "fail",
          reason: found ? undefined : "Missing .github/workflows CI configuration.",
          evidence: [".github/workflows"]
        };
      }
    },
    {
      id: "test-script",
      title: "Test script present",
      pillar: "testing",
      level: 1,
      scope: "app",
      impact: "high",
      effort: "low",
      check: async (_context, app) => {
        const found = Boolean(app?.scripts?.test);
        return {
          status: found ? "pass" : "fail",
          reason: found ? undefined : "Missing test script in package.json."
        };
      }
    },
    {
      id: "readme",
      title: "README present",
      pillar: "documentation",
      level: 1,
      scope: "repo",
      impact: "high",
      effort: "low",
      check: async (context) => {
        const found = await hasReadme(context.repoPath);
        return {
          status: found ? "pass" : "fail",
          reason: found ? undefined : "Missing README documentation.",
          evidence: ["README.md"]
        };
      }
    },
    {
      id: "contributing",
      title: "CONTRIBUTING guide present",
      pillar: "documentation",
      level: 2,
      scope: "repo",
      impact: "medium",
      effort: "low",
      check: async (context) => {
        const found = await fileExists(path.join(context.repoPath, "CONTRIBUTING.md"));
        return {
          status: found ? "pass" : "fail",
          reason: found ? undefined : "Missing CONTRIBUTING.md for contributor workflows."
        };
      }
    },
    {
      id: "lockfile",
      title: "Lockfile present",
      pillar: "dev-environment",
      level: 1,
      scope: "repo",
      impact: "high",
      effort: "low",
      check: async (context) => {
        const found = hasAnyFile(context.rootFiles, [
          "pnpm-lock.yaml",
          "yarn.lock",
          "package-lock.json",
          "bun.lockb"
        ]);
        return {
          status: found ? "pass" : "fail",
          reason: found ? undefined : "Missing package manager lockfile."
        };
      }
    },
    {
      id: "env-example",
      title: "Environment example present",
      pillar: "dev-environment",
      level: 2,
      scope: "repo",
      impact: "medium",
      effort: "low",
      check: async (context) => {
        const found = hasAnyFile(context.rootFiles, [".env.example", ".env.sample"]);
        return {
          status: found ? "pass" : "fail",
          reason: found ? undefined : "Missing .env.example or .env.sample for setup guidance."
        };
      }
    },
    {
      id: "format-config",
      title: "Formatter configured",
      pillar: "code-quality",
      level: 2,
      scope: "repo",
      impact: "medium",
      effort: "low",
      check: async (context) => {
        const found = await hasFormatterConfig(context.repoPath);
        return {
          status: found ? "pass" : "fail",
          reason: found ? undefined : "Missing Prettier/Biome formatting config."
        };
      }
    },
    {
      id: "codeowners",
      title: "CODEOWNERS present",
      pillar: "security-governance",
      level: 2,
      scope: "repo",
      impact: "medium",
      effort: "low",
      check: async (context) => {
        const found = await hasCodeowners(context.repoPath);
        return {
          status: found ? "pass" : "fail",
          reason: found ? undefined : "Missing CODEOWNERS file."
        };
      }
    },
    {
      id: "license",
      title: "LICENSE present",
      pillar: "security-governance",
      level: 1,
      scope: "repo",
      impact: "medium",
      effort: "low",
      check: async (context) => {
        const found = await hasLicense(context.repoPath);
        return {
          status: found ? "pass" : "fail",
          reason: found ? undefined : "Missing LICENSE file."
        };
      }
    },
    {
      id: "security-policy",
      title: "Security policy present",
      pillar: "security-governance",
      level: 3,
      scope: "repo",
      impact: "high",
      effort: "low",
      check: async (context) => {
        const found = await fileExists(path.join(context.repoPath, "SECURITY.md"));
        return {
          status: found ? "pass" : "fail",
          reason: found ? undefined : "Missing SECURITY.md policy."
        };
      }
    },
    {
      id: "dependabot",
      title: "Dependabot configured",
      pillar: "security-governance",
      level: 3,
      scope: "repo",
      impact: "medium",
      effort: "medium",
      check: async (context) => {
        const found = await fileExists(path.join(context.repoPath, ".github", "dependabot.yml"));
        return {
          status: found ? "pass" : "fail",
          reason: found ? undefined : "Missing .github/dependabot.yml configuration."
        };
      }
    },
    {
      id: "observability",
      title: "Observability tooling present",
      pillar: "observability",
      level: 3,
      scope: "repo",
      impact: "medium",
      effort: "medium",
      check: async (context) => {
        const deps = await readAllDependencies(context);
        const has = deps.some((dep) =>
          ["@opentelemetry/api", "@opentelemetry/sdk", "pino", "winston", "bunyan"].includes(dep)
        );
        return {
          status: has ? "pass" : "fail",
          reason: "No observability dependencies detected (OpenTelemetry/logging)."
        };
      }
    },
    {
      id: "custom-instructions",
      title: "Custom AI instructions or agent guidance",
      pillar: "ai-tooling",
      level: 1,
      scope: "repo",
      impact: "high",
      effort: "low",
      check: async (context) => {
        const rootFound = await hasCustomInstructions(context.repoPath);
        if (rootFound.length === 0) {
          return {
            status: "fail",
            reason:
              "Missing custom AI instructions (e.g. copilot-instructions.md, CLAUDE.md, AGENTS.md, .cursorrules).",
            evidence: [
              "copilot-instructions.md",
              "CLAUDE.md",
              "AGENTS.md",
              ".cursorrules",
              ".github/copilot-instructions.md"
            ]
          };
        }

        // Check for file-based instructions (.github/instructions/*.instructions.md)
        const fileBasedInstructions = await hasFileBasedInstructions(context.repoPath);
        const areas = context.analysis.areas ?? [];

        // For monorepos or repos with detected areas, check coverage
        if (areas.length > 0) {
          if (fileBasedInstructions.length === 0) {
            return {
              status: "pass",
              reason: `Root instructions found, but no file-based instructions for ${areas.length} detected areas. Run \`primer instructions --areas\` to generate.`,
              evidence: [...rootFound, ...areas.map((a) => `${a.name}: missing .instructions.md`)]
            };
          }
          return {
            status: "pass",
            reason: `Root + ${fileBasedInstructions.length} file-based instruction(s) found.`,
            evidence: [...rootFound, ...fileBasedInstructions]
          };
        }

        // For monorepos without areas, check per-app instructions (legacy behavior)
        if (context.analysis.isMonorepo && context.apps.length > 1) {
          const appsMissing: string[] = [];
          for (const app of context.apps) {
            const appFound = await hasCustomInstructions(app.path);
            if (appFound.length === 0) {
              appsMissing.push(app.name);
            }
          }
          if (appsMissing.length > 0) {
            return {
              status: "pass",
              reason: `Root instructions found, but ${appsMissing.length}/${context.apps.length} apps missing their own: ${appsMissing.join(", ")}`,
              evidence: [
                ...rootFound,
                ...appsMissing.map((name) => `${name}: missing app-level instructions`)
              ]
            };
          }
        }

        return {
          status: "pass",
          evidence: rootFound
        };
      }
    },
    {
      id: "mcp-config",
      title: "MCP configuration present",
      pillar: "ai-tooling",
      level: 2,
      scope: "repo",
      impact: "high",
      effort: "low",
      check: async (context) => {
        const found = await hasMcpConfig(context.repoPath);
        return {
          status: found.length > 0 ? "pass" : "fail",
          reason: "Missing MCP (Model Context Protocol) configuration (e.g. .vscode/mcp.json).",
          evidence:
            found.length > 0
              ? found
              : [".vscode/mcp.json", ".vscode/settings.json (mcp section)", "mcp.json"]
        };
      }
    },
    {
      id: "custom-agents",
      title: "Custom AI agents configured",
      pillar: "ai-tooling",
      level: 3,
      scope: "repo",
      impact: "medium",
      effort: "medium",
      check: async (context) => {
        const found = await hasCustomAgents(context.repoPath);
        return {
          status: found.length > 0 ? "pass" : "fail",
          reason: "No custom AI agents configured (e.g. .github/agents/, .copilot/agents/).",
          evidence:
            found.length > 0
              ? found
              : [".github/agents/", ".copilot/agents/", ".github/copilot/agents/"]
        };
      }
    },
    {
      id: "copilot-skills",
      title: "Copilot/Claude skills present",
      pillar: "ai-tooling",
      level: 3,
      scope: "repo",
      impact: "medium",
      effort: "medium",
      check: async (context) => {
        const found = await hasCopilotSkills(context.repoPath);
        return {
          status: found.length > 0 ? "pass" : "fail",
          reason: "No Copilot or Claude skills found (e.g. .copilot/skills/, .github/skills/).",
          evidence:
            found.length > 0 ? found : [".copilot/skills/", ".github/skills/", ".claude/skills/"]
        };
      }
    },
    // ── Area-scoped criteria (only run when areaPath is set) ──
    {
      id: "area-readme",
      title: "Area README present",
      pillar: "documentation",
      level: 1,
      scope: "area",
      impact: "medium",
      effort: "low",
      check: async (context) => {
        if (!context.areaPath || !context.areaFiles) {
          return { status: "skip", reason: "No area context." };
        }
        const found = context.areaFiles.some(
          (f) => f.toLowerCase() === "readme.md" || f.toLowerCase() === "readme"
        );
        return {
          status: found ? "pass" : "fail",
          reason: found ? undefined : "Missing README in area directory."
        };
      }
    },
    {
      id: "area-build-script",
      title: "Area build script present",
      pillar: "build-system",
      level: 1,
      scope: "area",
      impact: "high",
      effort: "low",
      check: async (context, _app, area) => {
        if (!context.areaPath || !context.areaFiles) {
          return { status: "skip", reason: "No area context." };
        }
        // Check area.scripts from enriched Area type
        if (area?.scripts?.build) {
          return { status: "pass" };
        }
        // Fallback: check for package.json with build script in area
        const pkgPath = path.join(context.areaPath, "package.json");
        const pkg = await readJson(pkgPath);
        const scripts = (pkg?.scripts ?? {}) as Record<string, string>;
        const found = Boolean(scripts.build);
        return {
          status: found ? "pass" : "fail",
          reason: found ? undefined : "Missing build script in area."
        };
      }
    },
    {
      id: "area-test-script",
      title: "Area test script present",
      pillar: "testing",
      level: 1,
      scope: "area",
      impact: "high",
      effort: "low",
      check: async (context, _app, area) => {
        if (!context.areaPath || !context.areaFiles) {
          return { status: "skip", reason: "No area context." };
        }
        if (area?.scripts?.test) {
          return { status: "pass" };
        }
        const pkgPath = path.join(context.areaPath, "package.json");
        const pkg = await readJson(pkgPath);
        const scripts = (pkg?.scripts ?? {}) as Record<string, string>;
        const found = Boolean(scripts.test);
        return {
          status: found ? "pass" : "fail",
          reason: found ? undefined : "Missing test script in area."
        };
      }
    },
    {
      id: "area-instructions",
      title: "Area-specific instructions present",
      pillar: "ai-tooling",
      level: 2,
      scope: "area",
      impact: "high",
      effort: "low",
      check: async (context, _app, area) => {
        if (!area) {
          return { status: "skip", reason: "No area context." };
        }
        const sanitized = sanitizeAreaName(area.name);
        const instructionPath = path.join(
          context.repoPath,
          ".github",
          "instructions",
          `${sanitized}.instructions.md`
        );
        const found = await fileExists(instructionPath);
        return {
          status: found ? "pass" : "fail",
          reason: found ? undefined : `Missing .github/instructions/${sanitized}.instructions.md`
        };
      }
    }
  ];
}

export function buildExtras(): ExtraDefinition[] {
  return [
    {
      id: "agents-doc",
      title: "AGENTS.md present",
      check: async (context) => ({
        status: (await fileExists(path.join(context.repoPath, "AGENTS.md"))) ? "pass" : "fail",
        reason: "Missing AGENTS.md to guide coding agents."
      })
    },
    {
      id: "pr-template",
      title: "Pull request template present",
      check: async (context) => ({
        status: (await hasPullRequestTemplate(context.repoPath)) ? "pass" : "fail",
        reason: "Missing PR template for consistent reviews."
      })
    },
    {
      id: "pre-commit",
      title: "Pre-commit hooks configured",
      check: async (context) => ({
        status: (await hasPrecommitConfig(context.repoPath)) ? "pass" : "fail",
        reason: "Missing pre-commit or Husky configuration for fast feedback."
      })
    },
    {
      id: "architecture-doc",
      title: "Architecture guide present",
      check: async (context) => ({
        status: (await hasArchitectureDoc(context.repoPath)) ? "pass" : "fail",
        reason: "Missing architecture documentation."
      })
    }
  ];
}

async function runExtras(
  context: ReadinessContext,
  extraDefs: ExtraDefinition[]
): Promise<ReadinessExtraResult[]> {
  const results: ReadinessExtraResult[] = [];
  for (const def of extraDefs) {
    const result = await def.check(context);
    results.push({
      id: def.id,
      title: def.title,
      status: result.status,
      reason: result.reason
    });
  }
  return results;
}

function summarizePillars(criteria: ReadinessCriterionResult[]): ReadinessPillarSummary[] {
  const pillarNames: Record<ReadinessPillar, string> = {
    "style-validation": "Style & Validation",
    "build-system": "Build System",
    testing: "Testing",
    documentation: "Documentation",
    "dev-environment": "Dev Environment",
    "code-quality": "Code Quality",
    observability: "Observability",
    "security-governance": "Security & Governance",
    "ai-tooling": "AI Tooling"
  };

  return (Object.keys(pillarNames) as ReadinessPillar[]).map((pillar) => {
    const items = criteria.filter((criterion) => criterion.pillar === pillar);
    const { passed, total } = countStatus(items);
    return {
      id: pillar,
      name: pillarNames[pillar],
      passed,
      total,
      passRate: total ? passed / total : 0
    };
  });
}

function summarizeLevels(
  criteria: ReadinessCriterionResult[],
  passRateThreshold = 0.8
): ReadinessLevelSummary[] {
  const levelNames: Record<number, string> = {
    1: "Functional",
    2: "Documented",
    3: "Standardized",
    4: "Optimized",
    5: "Autonomous"
  };

  const summaries: ReadinessLevelSummary[] = [];
  for (let level = 1; level <= 5; level += 1) {
    const items = criteria.filter((criterion) => criterion.level === level);
    const { passed, total } = countStatus(items);
    const passRate = total ? passed / total : 0;
    summaries.push({
      level,
      name: levelNames[level],
      passed,
      total,
      passRate,
      achieved: false
    });
  }

  for (const summary of summaries) {
    const allPrior = summaries.filter((candidate) => candidate.level <= summary.level);
    const achieved = allPrior.every(
      (candidate) => candidate.total > 0 && candidate.passRate >= passRateThreshold
    );
    summary.achieved = achieved;
  }

  return summaries;
}

function countStatus(items: ReadinessCriterionResult[]): { passed: number; total: number } {
  const relevant = items.filter((item) => item.status !== "skip");
  const passed = relevant.filter((item) => item.status === "pass").length;
  return { passed, total: relevant.length };
}

function hasAnyFile(files: string[], candidates: string[]): boolean {
  return candidates.some((candidate) => files.includes(candidate));
}

async function hasReadme(repoPath: string): Promise<boolean> {
  const files = await safeReadDir(repoPath);
  return files.some(
    (file) => file.toLowerCase() === "readme.md" || file.toLowerCase() === "readme"
  );
}

async function hasLintConfig(repoPath: string): Promise<boolean> {
  return hasAnyFile(await safeReadDir(repoPath), [
    "eslint.config.js",
    "eslint.config.mjs",
    ".eslintrc",
    ".eslintrc.js",
    ".eslintrc.cjs",
    ".eslintrc.json",
    ".eslintrc.yml",
    ".eslintrc.yaml",
    "biome.json",
    "biome.jsonc",
    ".prettierrc",
    ".prettierrc.json",
    ".prettierrc.js",
    ".prettierrc.cjs",
    "prettier.config.js",
    "prettier.config.cjs"
  ]);
}

async function hasFormatterConfig(repoPath: string): Promise<boolean> {
  return hasAnyFile(await safeReadDir(repoPath), [
    "biome.json",
    "biome.jsonc",
    ".prettierrc",
    ".prettierrc.json",
    ".prettierrc.js",
    ".prettierrc.cjs",
    "prettier.config.js",
    "prettier.config.cjs"
  ]);
}

async function hasTypecheckConfig(repoPath: string): Promise<boolean> {
  return hasAnyFile(await safeReadDir(repoPath), [
    "tsconfig.json",
    "tsconfig.base.json",
    "pyproject.toml",
    "mypy.ini"
  ]);
}

async function hasGithubWorkflows(repoPath: string): Promise<boolean> {
  return fileExists(path.join(repoPath, ".github", "workflows"));
}

async function hasCodeowners(repoPath: string): Promise<boolean> {
  const root = await fileExists(path.join(repoPath, "CODEOWNERS"));
  const github = await fileExists(path.join(repoPath, ".github", "CODEOWNERS"));
  return root || github;
}

async function hasLicense(repoPath: string): Promise<boolean> {
  const files = await safeReadDir(repoPath);
  return files.some((file) => file.toLowerCase().startsWith("license"));
}

async function hasPullRequestTemplate(repoPath: string): Promise<boolean> {
  const direct = await fileExists(path.join(repoPath, ".github", "PULL_REQUEST_TEMPLATE.md"));
  if (direct) return true;
  const dir = path.join(repoPath, ".github", "PULL_REQUEST_TEMPLATE");
  try {
    const entries = await fs.readdir(dir);
    return entries.some((entry) => entry.toLowerCase().endsWith(".md"));
  } catch {
    return false;
  }
}

async function hasPrecommitConfig(repoPath: string): Promise<boolean> {
  const precommit = await fileExists(path.join(repoPath, ".pre-commit-config.yaml"));
  if (precommit) return true;
  return fileExists(path.join(repoPath, ".husky"));
}

async function hasArchitectureDoc(repoPath: string): Promise<boolean> {
  const files = await safeReadDir(repoPath);
  if (files.some((file) => file.toLowerCase() === "architecture.md")) return true;
  return fileExists(path.join(repoPath, "docs", "architecture.md"));
}

async function hasCustomInstructions(repoPath: string): Promise<string[]> {
  const found: string[] = [];
  const candidates = [
    ".github/copilot-instructions.md",
    "CLAUDE.md",
    ".claude/CLAUDE.md",
    "AGENTS.md",
    ".github/AGENTS.md",
    ".cursorrules",
    ".cursorignore",
    ".windsurfrules",
    ".github/instructions.md",
    "copilot-instructions.md"
  ];
  for (const candidate of candidates) {
    if (await fileExists(path.join(repoPath, candidate))) {
      found.push(candidate);
    }
  }
  return found;
}

async function hasFileBasedInstructions(repoPath: string): Promise<string[]> {
  const instructionsDir = path.join(repoPath, ".github", "instructions");
  try {
    const entries = await fs.readdir(instructionsDir);
    return entries
      .filter((e) => e.endsWith(".instructions.md"))
      .map((e) => `.github/instructions/${e}`);
  } catch {
    return [];
  }
}

async function hasMcpConfig(repoPath: string): Promise<string[]> {
  const found: string[] = [];
  // Check .vscode/mcp.json
  if (await fileExists(path.join(repoPath, ".vscode", "mcp.json"))) {
    found.push(".vscode/mcp.json");
  }
  // Check root mcp.json
  if (await fileExists(path.join(repoPath, "mcp.json"))) {
    found.push("mcp.json");
  }
  // Check .vscode/settings.json for MCP section
  const settings = await readJson(path.join(repoPath, ".vscode", "settings.json"));
  if (settings && (settings["mcp"] || settings["github.copilot.chat.mcp.enabled"])) {
    found.push(".vscode/settings.json (mcp section)");
  }
  // Check .claude/mcp.json
  if (await fileExists(path.join(repoPath, ".claude", "mcp.json"))) {
    found.push(".claude/mcp.json");
  }
  return found;
}

async function hasCustomAgents(repoPath: string): Promise<string[]> {
  const found: string[] = [];
  const agentDirs = [".github/agents", ".copilot/agents", ".github/copilot/agents"];
  for (const dir of agentDirs) {
    if (await fileExists(path.join(repoPath, dir))) {
      found.push(dir);
    }
  }
  // Check for agent config files
  const agentFiles = [".github/copilot-agents.yml", ".github/copilot-agents.yaml"];
  for (const agentFile of agentFiles) {
    if (await fileExists(path.join(repoPath, agentFile))) {
      found.push(agentFile);
    }
  }
  return found;
}

async function hasCopilotSkills(repoPath: string): Promise<string[]> {
  const found: string[] = [];
  const skillDirs = [
    ".copilot/skills",
    ".github/skills",
    ".claude/skills",
    ".github/copilot/skills"
  ];
  for (const dir of skillDirs) {
    if (await fileExists(path.join(repoPath, dir))) {
      found.push(dir);
    }
  }
  return found;
}

async function readAllDependencies(context: ReadinessContext): Promise<string[]> {
  const dependencies: string[] = [];
  const apps = context.apps.length ? context.apps : [];
  for (const app of apps) {
    if (!app.packageJsonPath) continue;
    const pkg = await readJson(app.packageJsonPath);
    const deps = (pkg?.dependencies ?? {}) as Record<string, unknown>;
    const devDeps = (pkg?.devDependencies ?? {}) as Record<string, unknown>;
    dependencies.push(
      ...Object.keys({
        ...deps,
        ...devDeps
      })
    );
  }

  if (!apps.length && context.rootPackageJson) {
    const rootDeps = (context.rootPackageJson.dependencies ?? {}) as Record<string, unknown>;
    const rootDevDeps = (context.rootPackageJson.devDependencies ?? {}) as Record<string, unknown>;
    dependencies.push(
      ...Object.keys({
        ...rootDeps,
        ...rootDevDeps
      })
    );
  }

  return Array.from(new Set(dependencies));
}
