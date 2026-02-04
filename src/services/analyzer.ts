import fs from "fs/promises";
import path from "path";
import fg from "fast-glob";
import { isGitRepo } from "./git";

export type RepoApp = {
  name: string;
  path: string;
  packageJsonPath: string;
  scripts: Record<string, string>;
  hasTsConfig: boolean;
};

export type RepoAnalysis = {
  path: string;
  isGitRepo: boolean;
  languages: string[];
  frameworks: string[];
  packageManager?: string;
  isMonorepo?: boolean;
  workspaceType?: "npm" | "pnpm" | "yarn";
  workspacePatterns?: string[];
  apps?: RepoApp[];
};

const PACKAGE_MANAGERS: Array<{ file: string; name: string }> = [
  { file: "pnpm-lock.yaml", name: "pnpm" },
  { file: "yarn.lock", name: "yarn" },
  { file: "package-lock.json", name: "npm" },
  { file: "bun.lockb", name: "bun" }
];

export async function analyzeRepo(repoPath: string): Promise<RepoAnalysis> {
  const files = await safeReadDir(repoPath);
  const analysis: RepoAnalysis = {
    path: repoPath,
    isGitRepo: await isGitRepo(repoPath),
    languages: [],
    frameworks: []
  };

  const hasPackageJson = files.includes("package.json");
  const hasTsConfig = files.includes("tsconfig.json");
  const hasPyProject = files.includes("pyproject.toml");
  const hasRequirements = files.includes("requirements.txt");
  const hasGoMod = files.includes("go.mod");
  const hasCargo = files.includes("Cargo.toml");

  if (hasPackageJson) analysis.languages.push("JavaScript");
  if (hasTsConfig) analysis.languages.push("TypeScript");
  if (hasPyProject || hasRequirements) analysis.languages.push("Python");
  if (hasGoMod) analysis.languages.push("Go");
  if (hasCargo) analysis.languages.push("Rust");

  analysis.packageManager = await detectPackageManager(repoPath, files);

  let rootPackageJson: Record<string, unknown> | undefined;

  if (hasPackageJson) {
    rootPackageJson = await readJson(path.join(repoPath, "package.json"));
    const deps = Object.keys({
      ...(rootPackageJson?.dependencies ?? {}),
      ...(rootPackageJson?.devDependencies ?? {})
    });
    analysis.frameworks.push(...detectFrameworks(deps, files));
  }

  const workspace = await detectWorkspace(repoPath, files, rootPackageJson);
  if (workspace) {
    analysis.workspaceType = workspace.type;
    analysis.workspacePatterns = workspace.patterns;
  }

  const apps = await resolveWorkspaceApps(repoPath, workspace?.patterns ?? [], rootPackageJson);
  analysis.apps = apps;
  analysis.isMonorepo = apps.length > 1;

  analysis.languages = unique(analysis.languages);
  analysis.frameworks = unique(analysis.frameworks);

  return analysis;
}

async function detectPackageManager(repoPath: string, files: string[]): Promise<string | undefined> {
  for (const manager of PACKAGE_MANAGERS) {
    if (files.includes(manager.file)) return manager.name;
  }

  if (files.includes("package.json")) return "npm";
  if (files.includes("pyproject.toml")) return "pip";
  return undefined;
}

function detectFrameworks(deps: string[], files: string[]): string[] {
  const frameworks: string[] = [];
  const hasFile = (file: string): boolean => files.includes(file);

  if (deps.includes("next") || hasFile("next.config.js") || hasFile("next.config.mjs")) frameworks.push("Next.js");
  if (deps.includes("react") || deps.includes("react-dom")) frameworks.push("React");
  if (deps.includes("vue") || hasFile("vue.config.js")) frameworks.push("Vue");
  if (deps.includes("@angular/core") || hasFile("angular.json")) frameworks.push("Angular");
  if (deps.includes("svelte") || hasFile("svelte.config.js")) frameworks.push("Svelte");
  if (deps.includes("express")) frameworks.push("Express");
  if (deps.includes("@nestjs/core")) frameworks.push("NestJS");
  if (deps.includes("fastify")) frameworks.push("Fastify");

  return frameworks;
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

type WorkspaceConfig = {
  type: "npm" | "pnpm" | "yarn";
  patterns: string[];
};

async function detectWorkspace(
  repoPath: string,
  files: string[],
  packageJson?: Record<string, unknown>
): Promise<WorkspaceConfig | undefined> {
  if (files.includes("pnpm-workspace.yaml")) {
    const patterns = await readPnpmWorkspace(path.join(repoPath, "pnpm-workspace.yaml"));
    if (patterns.length) return { type: "pnpm", patterns };
  }

  const workspaces = packageJson?.workspaces;
  if (Array.isArray(workspaces)) {
    return { type: files.includes("yarn.lock") ? "yarn" : "npm", patterns: workspaces.map(String) };
  }

  if (workspaces && typeof workspaces === "object") {
    const packages = (workspaces as { packages?: unknown }).packages;
    if (Array.isArray(packages)) {
      return { type: files.includes("yarn.lock") ? "yarn" : "npm", patterns: packages.map(String) };
    }
  }

  return undefined;
}

async function readPnpmWorkspace(filePath: string): Promise<string[]> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    const lines = raw.split(/\r?\n/u);
    const patterns: string[] = [];
    let inPackages = false;
    for (const line of lines) {
      if (!inPackages && /^\s*packages\s*:/u.test(line)) {
        inPackages = true;
        continue;
      }
      if (inPackages) {
        const match = line.match(/^\s*-\s*(.+)$/u);
        if (match?.[1]) {
          patterns.push(match[1].trim().replace(/^['"]|['"]$/gu, ""));
          continue;
        }
        if (/^\S/u.test(line)) break;
      }
    }
    return patterns;
  } catch {
    return [];
  }
}

async function resolveWorkspaceApps(
  repoPath: string,
  patterns: string[],
  rootPackageJson?: Record<string, unknown>
): Promise<RepoApp[]> {
  const workspacePatterns = patterns
    .map((pattern) => pattern.replace(/\\/gu, "/"))
    .map((pattern) => (pattern.endsWith("package.json") ? pattern : path.posix.join(pattern, "package.json")));

  const packageJsonPaths = workspacePatterns.length
    ? await fg(workspacePatterns, { cwd: repoPath, absolute: true, onlyFiles: true, dot: false })
    : [];

  if (!packageJsonPaths.length && rootPackageJson) {
    const rootPath = path.join(repoPath, "package.json");
    return [await buildRepoApp(repoPath, rootPath, rootPackageJson)];
  }

  const apps = await Promise.all(
    packageJsonPaths.map(async (pkgPath) => {
      const pkg = await readJson(pkgPath);
      return buildRepoApp(path.dirname(pkgPath), pkgPath, pkg);
    })
  );

  return apps.filter(Boolean) as RepoApp[];
}

async function buildRepoApp(
  appPath: string,
  packageJsonPath: string,
  packageJson?: Record<string, unknown>
): Promise<RepoApp> {
  const scripts = (packageJson?.scripts ?? {}) as Record<string, string>;
  const name = typeof packageJson?.name === "string" ? packageJson.name : path.basename(appPath);
  const hasTsConfig = await fileExists(path.join(appPath, "tsconfig.json"));

  return {
    name,
    path: appPath,
    packageJsonPath,
    scripts,
    hasTsConfig
  };
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function unique<T>(items: T[]): T[] {
  return Array.from(new Set(items));
}
