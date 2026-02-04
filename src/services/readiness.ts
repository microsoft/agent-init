import fs from "fs/promises";
import path from "path";
import { analyzeRepo, RepoApp, RepoAnalysis } from "./analyzer";

export type ReadinessPillar =
  | "style-validation"
  | "build-system"
  | "testing"
  | "documentation"
  | "dev-environment"
  | "code-quality"
  | "observability"
  | "security-governance";

export type ReadinessScope = "repo" | "app";

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
};

type ReadinessOptions = {
  repoPath: string;
  includeExtras?: boolean;
};

type ReadinessContext = {
  repoPath: string;
  analysis: RepoAnalysis;
  apps: RepoApp[];
  rootFiles: string[];
  rootPackageJson?: Record<string, unknown>;
};

type ReadinessCriterion = {
  id: string;
  title: string;
  pillar: ReadinessPillar;
  level: number;
  scope: ReadinessScope;
  impact: "high" | "medium" | "low";
  effort: "low" | "medium" | "high";
  check: (context: ReadinessContext, app?: RepoApp) => Promise<CheckResult>;
};

type CheckResult = {
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

  const criteria = buildCriteria();
  const criteriaResults: ReadinessCriterionResult[] = [];

  for (const criterion of criteria) {
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
    const status: ReadinessStatus = passRate >= 0.8 ? "pass" : "fail";
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

  const pillars = summarizePillars(criteriaResults);
  const levels = summarizeLevels(criteriaResults);
  const achievedLevel = levels.filter((level) => level.achieved).reduce((acc, level) => Math.max(acc, level.level), 0);

  const extras = options.includeExtras === false ? [] : await runExtras(context);

  return {
    repoPath,
    generatedAt: new Date().toISOString(),
    isMonorepo: analysis.isMonorepo ?? false,
    apps: apps.map((app) => ({ name: app.name, path: app.path })),
    pillars,
    levels,
    achievedLevel,
    criteria: criteriaResults,
    extras
  };
}

function buildCriteria(): ReadinessCriterion[] {
  return [
    {
      id: "lint-config",
      title: "Linting configured",
      pillar: "style-validation",
      level: 1,
      scope: "repo",
      impact: "high",
      effort: "low",
      check: async (context) => ({
        status: (await hasLintConfig(context.repoPath)) ? "pass" : "fail",
        reason: "Missing ESLint/Biome/Prettier configuration.",
        evidence: ["eslint.config.js", ".eslintrc", "biome.json", ".prettierrc"]
      })
    },
    {
      id: "typecheck-config",
      title: "Type checking configured",
      pillar: "style-validation",
      level: 2,
      scope: "repo",
      impact: "medium",
      effort: "low",
      check: async (context) => ({
        status: (await hasTypecheckConfig(context.repoPath)) ? "pass" : "fail",
        reason: "Missing type checking config (tsconfig or equivalent).",
        evidence: ["tsconfig.json", "pyproject.toml", "mypy.ini"]
      })
    },
    {
      id: "build-script",
      title: "Build script present",
      pillar: "build-system",
      level: 1,
      scope: "app",
      impact: "high",
      effort: "low",
      check: async (_context, app) => ({
        status: app?.scripts?.build ? "pass" : "fail",
        reason: "Missing build script in package.json."
      })
    },
    {
      id: "ci-config",
      title: "CI workflow configured",
      pillar: "build-system",
      level: 2,
      scope: "repo",
      impact: "high",
      effort: "medium",
      check: async (context) => ({
        status: (await hasGithubWorkflows(context.repoPath)) ? "pass" : "fail",
        reason: "Missing .github/workflows CI configuration.",
        evidence: [".github/workflows"]
      })
    },
    {
      id: "test-script",
      title: "Test script present",
      pillar: "testing",
      level: 1,
      scope: "app",
      impact: "high",
      effort: "low",
      check: async (_context, app) => ({
        status: app?.scripts?.test ? "pass" : "fail",
        reason: "Missing test script in package.json."
      })
    },
    {
      id: "readme",
      title: "README present",
      pillar: "documentation",
      level: 1,
      scope: "repo",
      impact: "high",
      effort: "low",
      check: async (context) => ({
        status: (await hasReadme(context.repoPath)) ? "pass" : "fail",
        reason: "Missing README documentation.",
        evidence: ["README.md"]
      })
    },
    {
      id: "contributing",
      title: "CONTRIBUTING guide present",
      pillar: "documentation",
      level: 2,
      scope: "repo",
      impact: "medium",
      effort: "low",
      check: async (context) => ({
        status: (await fileExists(path.join(context.repoPath, "CONTRIBUTING.md"))) ? "pass" : "fail",
        reason: "Missing CONTRIBUTING.md for contributor workflows."
      })
    },
    {
      id: "lockfile",
      title: "Lockfile present",
      pillar: "dev-environment",
      level: 1,
      scope: "repo",
      impact: "high",
      effort: "low",
      check: async (context) => ({
        status: hasAnyFile(context.rootFiles, ["pnpm-lock.yaml", "yarn.lock", "package-lock.json", "bun.lockb"]) ? "pass" : "fail",
        reason: "Missing package manager lockfile."
      })
    },
    {
      id: "env-example",
      title: "Environment example present",
      pillar: "dev-environment",
      level: 2,
      scope: "repo",
      impact: "medium",
      effort: "low",
      check: async (context) => ({
        status: hasAnyFile(context.rootFiles, [".env.example", ".env.sample"]) ? "pass" : "fail",
        reason: "Missing .env.example or .env.sample for setup guidance."
      })
    },
    {
      id: "format-config",
      title: "Formatter configured",
      pillar: "code-quality",
      level: 2,
      scope: "repo",
      impact: "medium",
      effort: "low",
      check: async (context) => ({
        status: (await hasFormatterConfig(context.repoPath)) ? "pass" : "fail",
        reason: "Missing Prettier/Biome formatting config."
      })
    },
    {
      id: "codeowners",
      title: "CODEOWNERS present",
      pillar: "security-governance",
      level: 2,
      scope: "repo",
      impact: "medium",
      effort: "low",
      check: async (context) => ({
        status: (await hasCodeowners(context.repoPath)) ? "pass" : "fail",
        reason: "Missing CODEOWNERS file."
      })
    },
    {
      id: "license",
      title: "LICENSE present",
      pillar: "security-governance",
      level: 1,
      scope: "repo",
      impact: "medium",
      effort: "low",
      check: async (context) => ({
        status: (await hasLicense(context.repoPath)) ? "pass" : "fail",
        reason: "Missing LICENSE file."
      })
    },
    {
      id: "security-policy",
      title: "Security policy present",
      pillar: "security-governance",
      level: 3,
      scope: "repo",
      impact: "high",
      effort: "low",
      check: async (context) => ({
        status: (await fileExists(path.join(context.repoPath, "SECURITY.md"))) ? "pass" : "fail",
        reason: "Missing SECURITY.md policy."
      })
    },
    {
      id: "dependabot",
      title: "Dependabot configured",
      pillar: "security-governance",
      level: 3,
      scope: "repo",
      impact: "medium",
      effort: "medium",
      check: async (context) => ({
        status: (await fileExists(path.join(context.repoPath, ".github", "dependabot.yml"))) ? "pass" : "fail",
        reason: "Missing .github/dependabot.yml configuration."
      })
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
        const has = deps.some((dep) => ["@opentelemetry/api", "@opentelemetry/sdk", "pino", "winston", "bunyan"].includes(dep));
        return {
          status: has ? "pass" : "fail",
          reason: "No observability dependencies detected (OpenTelemetry/logging)."
        };
      }
    }
  ];
}

async function runExtras(context: ReadinessContext): Promise<ReadinessExtraResult[]> {
  const results: ReadinessExtraResult[] = [];

  results.push({
    id: "agents-doc",
    title: "AGENTS.md present",
    status: (await fileExists(path.join(context.repoPath, "AGENTS.md"))) ? "pass" : "fail",
    reason: "Missing AGENTS.md to guide coding agents."
  });

  results.push({
    id: "pr-template",
    title: "Pull request template present",
    status: (await hasPullRequestTemplate(context.repoPath)) ? "pass" : "fail",
    reason: "Missing PR template for consistent reviews."
  });

  results.push({
    id: "pre-commit",
    title: "Pre-commit hooks configured",
    status: (await hasPrecommitConfig(context.repoPath)) ? "pass" : "fail",
    reason: "Missing pre-commit or Husky configuration for fast feedback."
  });

  results.push({
    id: "architecture-doc",
    title: "Architecture guide present",
    status: (await hasArchitectureDoc(context.repoPath)) ? "pass" : "fail",
    reason: "Missing architecture documentation."
  });

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
    "security-governance": "Security & Governance"
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

function summarizeLevels(criteria: ReadinessCriterionResult[]): ReadinessLevelSummary[] {
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
    const achieved = allPrior.every((candidate) => candidate.total === 0 || candidate.passRate >= 0.8);
    summary.achieved = achieved;
  }

  return summaries;
}

function countStatus(items: ReadinessCriterionResult[]): { passed: number; total: number } {
  const relevant = items.filter((item) => item.status !== "skip");
  const passed = relevant.filter((item) => item.status === "pass").length;
  return { passed, total: relevant.length };
}

async function safeReadDir(dirPath: string): Promise<string[]> {
  try {
    return await fs.readdir(dirPath);
  } catch {
    return [];
  }
}

async function readJson(filePath: string): Promise<Record<string, unknown> | undefined> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return undefined;
  }
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function hasAnyFile(files: string[], candidates: string[]): boolean {
  return candidates.some((candidate) => files.includes(candidate));
}

async function hasReadme(repoPath: string): Promise<boolean> {
  const files = await safeReadDir(repoPath);
  return files.some((file) => file.toLowerCase() === "readme.md" || file.toLowerCase() === "readme");
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

async function readAllDependencies(context: ReadinessContext): Promise<string[]> {
  const dependencies: string[] = [];
  const apps = context.apps.length ? context.apps : [];
  for (const app of apps) {
    const pkg = await readJson(app.packageJsonPath);
    const deps = (pkg?.dependencies ?? {}) as Record<string, unknown>;
    const devDeps = (pkg?.devDependencies ?? {}) as Record<string, unknown>;
    dependencies.push(...Object.keys({
      ...deps,
      ...devDeps
    }));
  }

  if (!apps.length && context.rootPackageJson) {
    const rootDeps = (context.rootPackageJson.dependencies ?? {}) as Record<string, unknown>;
    const rootDevDeps = (context.rootPackageJson.devDependencies ?? {}) as Record<string, unknown>;
    dependencies.push(...Object.keys({
      ...rootDeps,
      ...rootDevDeps
    }));
  }

  return Array.from(new Set(dependencies));
}