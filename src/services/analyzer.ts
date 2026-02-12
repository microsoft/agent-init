import fs from "fs/promises";
import path from "path";
import fg from "fast-glob";
import { isGitRepo } from "./git";
import { fileExists, safeReadDir, readJson } from "../utils/fs";

export type RepoApp = {
  name: string;
  path: string;
  ecosystem?: "node" | "rust" | "go" | "dotnet" | "java" | "python" | "ruby" | "php";
  manifestPath?: string;
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
  workspaceType?: "npm" | "pnpm" | "yarn" | "cargo" | "go" | "dotnet" | "gradle" | "maven";
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
  const hasCsproj = files.some(f => f.endsWith(".csproj") || f.endsWith(".sln"));
  const hasPomXml = files.includes("pom.xml");
  const hasBuildGradle = files.includes("build.gradle") || files.includes("build.gradle.kts");
  const hasGemfile = files.includes("Gemfile");
  const hasComposerJson = files.includes("composer.json");

  if (hasPackageJson) analysis.languages.push("JavaScript");
  if (hasTsConfig) analysis.languages.push("TypeScript");
  if (hasPyProject || hasRequirements) analysis.languages.push("Python");
  if (hasGoMod) analysis.languages.push("Go");
  if (hasCargo) analysis.languages.push("Rust");
  if (hasCsproj) analysis.languages.push("C#");
  if (hasPomXml || hasBuildGradle) analysis.languages.push("Java");
  if (hasGemfile) analysis.languages.push("Ruby");
  if (hasComposerJson) analysis.languages.push("PHP");

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

  let apps = await resolveWorkspaceApps(repoPath, workspace?.patterns ?? [], rootPackageJson);

  // If JS workspace didn't find multiple apps, try non-JS monorepo detection
  if (apps.length <= 1) {
    const nonJs = await detectNonJsMonorepo(repoPath, files);
    if (nonJs.apps.length > 1) {
      apps = nonJs.apps;
      if (nonJs.type) analysis.workspaceType = nonJs.type;
      if (nonJs.patterns) analysis.workspacePatterns = nonJs.patterns;
    }
  }

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
  if (files.includes("pom.xml")) return "maven";
  if (files.includes("build.gradle") || files.includes("build.gradle.kts")) return "gradle";
  if (files.includes("Gemfile")) return "bundler";
  if (files.includes("composer.json")) return "composer";
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

async function safeReadFile(filePath: string): Promise<string | undefined> {
  try {
    return await fs.readFile(filePath, "utf8");
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
      // Skip comment-only lines
      if (/^\s*#/u.test(line)) continue;
      if (!inPackages && /^\s*packages\s*:/u.test(line)) {
        // Handle inline array: packages: ["apps/*", "libs/*"]
        const inline = line.match(/packages\s*:\s*\[([^\]]+)\]/u);
        if (inline) {
          const items = inline[1].split(",").map(s =>
            s.trim().replace(/^['"]|['"]$/gu, "")
          );
          return items.filter(Boolean);
        }
        inPackages = true;
        continue;
      }
      if (inPackages) {
        const match = line.match(/^\s*-\s*(.+)$/u);
        if (match?.[1]) {
          // Strip trailing comments and quotes
          const value = match[1].split("#")[0].trim().replace(/^['"]|['"]$/gu, "");
          if (value) patterns.push(value);
          continue;
        }
        // Non-indented, non-empty line means a new top-level key
        if (/^\S/u.test(line) && line.trim()) break;
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
    ecosystem: "node",
    manifestPath: packageJsonPath,
    packageJsonPath,
    scripts,
    hasTsConfig
  };
}

function buildNonJsApp(
  name: string,
  appPath: string,
  ecosystem: NonNullable<RepoApp["ecosystem"]>,
  manifestPath: string
): RepoApp {
  return {
    name,
    path: appPath,
    ecosystem,
    manifestPath,
    packageJsonPath: "",
    scripts: {},
    hasTsConfig: false
  };
}

// ─── Non-JS monorepo detection ───

type NonJsMonorepoResult = {
  type?: "cargo" | "go" | "dotnet" | "gradle" | "maven";
  patterns?: string[];
  apps: RepoApp[];
};

async function detectNonJsMonorepo(repoPath: string, files: string[]): Promise<NonJsMonorepoResult> {
  const cargoApps = await detectCargoWorkspace(repoPath);
  if (cargoApps.length > 1) return { type: "cargo", apps: cargoApps };

  const goApps = await detectGoWorkspace(repoPath);
  if (goApps.length > 1) return { type: "go", apps: goApps };

  const dotnetApps = await detectDotnetSolution(repoPath, files);
  if (dotnetApps.length > 1) return { type: "dotnet", apps: dotnetApps };

  const gradleApps = await detectGradleMultiProject(repoPath, files);
  if (gradleApps.length > 1) return { type: "gradle", apps: gradleApps };

  const mavenApps = await detectMavenMultiModule(repoPath);
  if (mavenApps.length > 1) return { type: "maven", apps: mavenApps };

  return { apps: [] };
}

async function detectCargoWorkspace(repoPath: string): Promise<RepoApp[]> {
  const content = await safeReadFile(path.join(repoPath, "Cargo.toml"));
  if (!content) return [];

  // Extract [workspace] section up to the next section header
  const workspaceSection = content.match(/\[workspace\]([\s\S]*?)(?:\n\[|$)/u);
  if (!workspaceSection) return [];

  const membersMatch = workspaceSection[1].match(/members\s*=\s*\[([\s\S]*?)\]/u);
  if (!membersMatch) return [];

  const patterns = [...membersMatch[1].matchAll(/"([^"]+)"/gu)].map(m => m[1]);
  if (!patterns.length) return [];

  const tomlPaths = await fg(
    patterns.map(p => path.posix.join(p, "Cargo.toml")),
    { cwd: repoPath, absolute: true, onlyFiles: true }
  );

  return Promise.all(tomlPaths.map(async (tomlPath) => {
    const dir = path.dirname(tomlPath);
    const toml = await safeReadFile(tomlPath);
    const nameMatch = toml?.match(/^\s*name\s*=\s*"([^"]+)"/mu);
    return buildNonJsApp(
      nameMatch?.[1] ?? path.basename(dir),
      dir,
      "rust",
      tomlPath
    );
  }));
}

async function detectGoWorkspace(repoPath: string): Promise<RepoApp[]> {
  const content = await safeReadFile(path.join(repoPath, "go.work"));
  if (!content) return [];

  const modules: string[] = [];

  // Block form: use ( ./cmd/server \n ./pkg/lib )
  const blockMatch = content.match(/use\s*\(([\s\S]*?)\)/u);
  if (blockMatch) {
    for (const line of blockMatch[1].split(/\r?\n/u)) {
      const trimmed = line.replace(/\/\/.*$/u, "").trim();
      if (trimmed) modules.push(trimmed);
    }
  }

  // Single-line form: use ./cmd/server
  for (const match of content.matchAll(/^use\s+(\S+)\s*$/gmu)) {
    modules.push(match[1]);
  }

  const apps: RepoApp[] = [];
  for (const mod of modules) {
    const modPath = path.resolve(repoPath, mod);
    const goModPath = path.join(modPath, "go.mod");
    if (!await fileExists(goModPath)) continue;

    const goMod = await safeReadFile(goModPath);
    const nameMatch = goMod?.match(/^module\s+(\S+)/mu);
    const shortName = nameMatch?.[1]?.split("/").pop() ?? path.basename(modPath);
    apps.push(buildNonJsApp(shortName, modPath, "go", goModPath));
  }

  return apps;
}

async function detectDotnetSolution(repoPath: string, files: string[]): Promise<RepoApp[]> {
  const slnFile = files.find(f => f.endsWith(".sln"));
  if (!slnFile) return [];

  const content = await safeReadFile(path.join(repoPath, slnFile));
  if (!content) return [];

  // Match: Project("{guid}") = "Name", "path\to\Project.csproj", "{guid}"
  const projectRegex = /Project\("[^"]*"\)\s*=\s*"([^"]+)",\s*"([^"]+\.(?:cs|fs|vb)proj)"/giu;
  const apps: RepoApp[] = [];

  for (const match of content.matchAll(projectRegex)) {
    const name = match[1];
    const projRelPath = match[2].replace(/\\/gu, "/");
    const projPath = path.resolve(repoPath, projRelPath);
    const appDir = path.dirname(projPath);

    if (await fileExists(projPath)) {
      apps.push(buildNonJsApp(name, appDir, "dotnet", projPath));
    }
  }

  return apps;
}

async function detectGradleMultiProject(repoPath: string, files: string[]): Promise<RepoApp[]> {
  const settingsFile = files.includes("settings.gradle.kts") ? "settings.gradle.kts"
    : files.includes("settings.gradle") ? "settings.gradle"
    : null;
  if (!settingsFile) return [];

  const content = await safeReadFile(path.join(repoPath, settingsFile));
  if (!content) return [];

  // Extract all Gradle project references (':app', ':lib:core') from the file
  const projectNames: string[] = [];
  for (const match of content.matchAll(/['"](:(?:[\w.-]+:)*[\w.-]+)['"]/gu)) {
    projectNames.push(match[1].replace(/^:/u, "").replace(/:/gu, "/"));
  }

  const uniqueProjects = [...new Set(projectNames)];
  const apps: RepoApp[] = [];

  for (const project of uniqueProjects) {
    const projectDir = path.resolve(repoPath, project);
    const ktsPath = path.join(projectDir, "build.gradle.kts");
    const groovyPath = path.join(projectDir, "build.gradle");

    const buildFile = await fileExists(ktsPath) ? ktsPath
      : await fileExists(groovyPath) ? groovyPath
      : null;

    if (buildFile) {
      apps.push(buildNonJsApp(path.basename(project), projectDir, "java", buildFile));
    }
  }

  return apps;
}

async function detectMavenMultiModule(repoPath: string): Promise<RepoApp[]> {
  const content = await safeReadFile(path.join(repoPath, "pom.xml"));
  if (!content) return [];

  const apps: RepoApp[] = [];
  for (const match of content.matchAll(/<module>([^<]+)<\/module>/gu)) {
    const modName = match[1].trim();
    const modDir = path.resolve(repoPath, modName);
    const pomPath = path.join(modDir, "pom.xml");

    if (await fileExists(pomPath)) {
      apps.push(buildNonJsApp(path.basename(modName), modDir, "java", pomPath));
    }
  }

  return apps;
}

function unique<T>(items: T[]): T[] {
  return Array.from(new Set(items));
}
