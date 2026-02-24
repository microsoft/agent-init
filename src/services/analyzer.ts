import fs from "fs/promises";
import path from "path";

import fg from "fast-glob";

import { fileExists, safeReadDir, readJson } from "../utils/fs";

import { isGitRepo } from "./git";

export type RepoApp = {
  name: string;
  path: string;
  ecosystem?: "node" | "rust" | "go" | "dotnet" | "java" | "python" | "ruby" | "php";
  manifestPath?: string;
  packageJsonPath: string;
  scripts: Record<string, string>;
  hasTsConfig: boolean;
};

export type Area = {
  name: string;
  description?: string;
  applyTo: string | string[];
  path?: string;
  ecosystem?: RepoApp["ecosystem"];
  source: "auto" | "config";
  scripts?: Record<string, string>;
  hasTsConfig?: boolean;
};

export type RepoAnalysis = {
  path: string;
  isGitRepo: boolean;
  languages: string[];
  frameworks: string[];
  packageManager?: string;
  isMonorepo?: boolean;
  workspaceType?:
    | "npm"
    | "pnpm"
    | "yarn"
    | "cargo"
    | "go"
    | "dotnet"
    | "gradle"
    | "maven"
    | "bazel"
    | "nx"
    | "pants"
    | "turborepo";
  workspacePatterns?: string[];
  apps?: RepoApp[];
  areas?: Area[];
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
  const hasCsproj = files.some((f) => f.endsWith(".csproj") || f.endsWith(".sln"));
  const hasPomXml = files.includes("pom.xml");
  const hasBuildGradle = files.includes("build.gradle") || files.includes("build.gradle.kts");
  const hasGemfile = files.includes("Gemfile");
  const hasComposerJson = files.includes("composer.json");
  const hasCMakeLists = files.includes("CMakeLists.txt");
  const hasMakefile = files.includes("Makefile") || files.includes("GNUmakefile");
  const hasMesonBuild = files.includes("meson.build");
  const hasConfigure = files.includes("configure") || files.includes("configure.ac");
  const hasMozBuild = files.includes("moz.build");

  if (hasPackageJson) analysis.languages.push("JavaScript");
  if (hasTsConfig) analysis.languages.push("TypeScript");
  if (hasPyProject || hasRequirements) analysis.languages.push("Python");
  if (hasGoMod) analysis.languages.push("Go");
  if (hasCargo) analysis.languages.push("Rust");
  if (hasCsproj) analysis.languages.push("C#");
  if (hasPomXml || hasBuildGradle) analysis.languages.push("Java");
  if (hasGemfile) analysis.languages.push("Ruby");
  if (hasComposerJson) analysis.languages.push("PHP");
  if (hasCMakeLists || hasMesonBuild || hasConfigure || hasMozBuild) analysis.languages.push("C++");
  if (hasMakefile && !analysis.languages.length) analysis.languages.push("C");

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

  if (workspace && files.includes("turbo.json") && apps.length > 1) {
    analysis.workspaceType = "turborepo";
  }

  if (files.includes("nx.json") && apps.length > 1 && analysis.workspaceType !== "turborepo") {
    analysis.workspaceType = "nx";
  }

  analysis.apps = apps;
  analysis.isMonorepo = apps.length > 1;

  analysis.languages = unique(analysis.languages);
  analysis.frameworks = unique(analysis.frameworks);

  // Detect areas from apps and folder heuristics
  analysis.areas = await detectAreas(repoPath, analysis);

  return analysis;
}

async function detectPackageManager(
  _repoPath: string,
  files: string[]
): Promise<string | undefined> {
  for (const manager of PACKAGE_MANAGERS) {
    if (files.includes(manager.file)) return manager.name;
  }

  if (files.includes("package.json")) return "npm";
  if (files.includes("pyproject.toml")) return "pip";
  if (files.includes("pom.xml")) return "maven";
  if (files.includes("build.gradle") || files.includes("build.gradle.kts")) return "gradle";
  if (files.includes("Gemfile")) return "bundler";
  if (files.includes("composer.json")) return "composer";
  if (
    files.includes("MODULE.bazel") ||
    files.includes("WORKSPACE") ||
    files.includes("WORKSPACE.bazel")
  )
    return "bazel";
  if (files.includes("pants.toml")) return "pants";
  if (files.includes("nx.json")) return "nx";
  return undefined;
}

function detectFrameworks(deps: string[], files: string[]): string[] {
  const frameworks: string[] = [];
  const hasFile = (file: string): boolean => files.includes(file);

  if (deps.includes("next") || hasFile("next.config.js") || hasFile("next.config.mjs"))
    frameworks.push("Next.js");
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

async function isScannableDirectory(repoPath: string, candidatePath: string): Promise<boolean> {
  try {
    const stat = await fs.lstat(candidatePath);
    if (stat.isSymbolicLink() || !stat.isDirectory()) return false;

    const resolvedRoot = await fs.realpath(repoPath).catch(() => path.resolve(repoPath));
    const resolvedCandidate = await fs
      .realpath(candidatePath)
      .catch(() => path.resolve(candidatePath));

    return (
      resolvedCandidate === resolvedRoot || resolvedCandidate.startsWith(resolvedRoot + path.sep)
    );
  } catch {
    return false;
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
          const items = inline[1].split(",").map((s) => s.trim().replace(/^['"]|['"]$/gu, ""));
          return items.filter(Boolean);
        }
        inPackages = true;
        continue;
      }
      if (inPackages) {
        const match = line.match(/^\s*-\s*(.+)$/u);
        if (match?.[1]) {
          // Strip trailing comments and quotes
          const value = match[1]
            .split("#")[0]
            .trim()
            .replace(/^['"]|['"]$/gu, "");
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
    .map((pattern) =>
      pattern.endsWith("package.json") ? pattern : path.posix.join(pattern, "package.json")
    );

  const packageJsonPaths = workspacePatterns.length
    ? (
        await fg(workspacePatterns, { cwd: repoPath, absolute: true, onlyFiles: true, dot: false })
      ).map((p) => path.normalize(p))
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
  ecosystem: RepoApp["ecosystem"],
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
  type?: RepoAnalysis["workspaceType"];
  patterns?: string[];
  apps: RepoApp[];
};

async function detectNonJsMonorepo(
  repoPath: string,
  files: string[]
): Promise<NonJsMonorepoResult> {
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

  const bazelApps = await detectBazelWorkspace(repoPath, files);
  if (bazelApps.length > 1) return { type: "bazel", apps: bazelApps };

  const nxApps = await detectNxWorkspace(repoPath, files);
  if (nxApps.length > 1) return { type: "nx", apps: nxApps };

  const pantsApps = await detectPantsWorkspace(repoPath, files);
  if (pantsApps.length > 1) return { type: "pants", apps: pantsApps };

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

  const patterns = [...membersMatch[1].matchAll(/"([^"]+)"/gu)].map((m) => m[1]);
  if (!patterns.length) return [];

  const tomlPaths = (
    await fg(
      patterns.map((p) => path.posix.join(p, "Cargo.toml")),
      { cwd: repoPath, absolute: true, onlyFiles: true }
    )
  ).map((p) => path.normalize(p));

  return Promise.all(
    tomlPaths.map(async (tomlPath) => {
      const dir = path.dirname(tomlPath);
      const toml = await safeReadFile(tomlPath);
      const nameMatch = toml?.match(/^\s*name\s*=\s*"([^"]+)"/mu);
      return buildNonJsApp(nameMatch?.[1] ?? path.basename(dir), dir, "rust", tomlPath);
    })
  );
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
    if (!(await fileExists(goModPath))) continue;

    const goMod = await safeReadFile(goModPath);
    const nameMatch = goMod?.match(/^module\s+(\S+)/mu);
    const shortName = nameMatch?.[1]?.split("/").pop() ?? path.basename(modPath);
    apps.push(buildNonJsApp(shortName, modPath, "go", goModPath));
  }

  return apps;
}

async function detectDotnetSolution(repoPath: string, files: string[]): Promise<RepoApp[]> {
  const slnFile = files.find((f) => f.endsWith(".sln"));
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
  const settingsFile = files.includes("settings.gradle.kts")
    ? "settings.gradle.kts"
    : files.includes("settings.gradle")
      ? "settings.gradle"
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

    const buildFile = (await fileExists(ktsPath))
      ? ktsPath
      : (await fileExists(groovyPath))
        ? groovyPath
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

async function detectBazelWorkspace(repoPath: string, files: string[]): Promise<RepoApp[]> {
  const hasBazel =
    files.includes("MODULE.bazel") ||
    files.includes("WORKSPACE") ||
    files.includes("WORKSPACE.bazel");
  if (!hasBazel) return [];

  // Scan first-level directories for BUILD / BUILD.bazel files
  const entries = await safeReadDir(repoPath);
  const apps: RepoApp[] = [];

  for (const entry of entries) {
    if (entry.startsWith(".")) continue;
    const fullPath = path.join(repoPath, entry);
    if (!(await isScannableDirectory(repoPath, fullPath))) continue;
    const children = await safeReadDir(fullPath);
    const buildFile = children.includes("BUILD")
      ? "BUILD"
      : children.includes("BUILD.bazel")
        ? "BUILD.bazel"
        : undefined;
    if (!buildFile) continue;

    apps.push(buildNonJsApp(entry, fullPath, undefined, path.join(fullPath, buildFile)));
  }

  return apps;
}

async function detectNxWorkspace(repoPath: string, files: string[]): Promise<RepoApp[]> {
  if (!files.includes("nx.json")) return [];

  // Find project.json files (depth-limited via glob pattern)
  const projectJsonPaths = (
    await fg(["*/project.json", "*/*/project.json", "*/*/*/project.json"], {
      cwd: repoPath,
      absolute: true,
      onlyFiles: true,
      dot: false,
      followSymbolicLinks: false,
      ignore: ["**/.git/**", "**/node_modules/**", "**/dist/**", "**/build/**", "**/out/**"]
    })
  ).map((p) => path.normalize(p));

  const apps: RepoApp[] = [];
  for (const projPath of projectJsonPaths) {
    const projDir = path.dirname(projPath);
    const projJson = await readJson(projPath);
    const name = typeof projJson?.name === "string" ? projJson.name : path.basename(projDir);
    // Detect ecosystem from sibling files
    const children = await safeReadDir(projDir);
    const ecosystem: RepoApp["ecosystem"] = children.includes("package.json")
      ? "node"
      : children.includes("Cargo.toml")
        ? "rust"
        : children.includes("go.mod")
          ? "go"
          : children.includes("pyproject.toml")
            ? "python"
            : undefined;
    apps.push({
      name,
      path: projDir,
      ecosystem,
      manifestPath: projPath,
      packageJsonPath: children.includes("package.json") ? path.join(projDir, "package.json") : "",
      scripts: {},
      hasTsConfig: children.includes("tsconfig.json")
    });
  }

  return apps;
}

async function detectPantsWorkspace(repoPath: string, files: string[]): Promise<RepoApp[]> {
  if (!files.includes("pants.toml")) return [];

  // Scan first-level directories for BUILD files
  const entries = await safeReadDir(repoPath);
  const apps: RepoApp[] = [];

  for (const entry of entries) {
    if (entry.startsWith(".")) continue;
    const fullPath = path.join(repoPath, entry);
    if (!(await isScannableDirectory(repoPath, fullPath))) continue;
    const children = await safeReadDir(fullPath);
    const buildFile = children.includes("BUILD")
      ? "BUILD"
      : children.includes("BUILD.pants")
        ? "BUILD.pants"
        : undefined;
    if (!buildFile) continue;

    // Infer ecosystem from sibling files
    const ecosystem: RepoApp["ecosystem"] = children.includes("pyproject.toml")
      ? "python"
      : children.includes("go.mod")
        ? "go"
        : children.includes("Cargo.toml")
          ? "rust"
          : undefined;
    apps.push(buildNonJsApp(entry, fullPath, ecosystem, path.join(fullPath, buildFile)));
  }

  return apps;
}

function unique<T>(items: T[]): T[] {
  return Array.from(new Set(items));
}

// ─── Area detection ───

const AREA_HEURISTIC_DIRS = [
  "frontend",
  "backend",
  "api",
  "web",
  "mobile",
  "app",
  "server",
  "client",
  "infra",
  "infrastructure",
  "shared",
  "common",
  "lib",
  "libs",
  "packages",
  "services",
  "docs",
  "scripts",
  "tools",
  "cli",
  "sdk",
  "core",
  "admin",
  "portal",
  "dashboard",
  "worker",
  "functions",
  // Browser / engine components
  "browser",
  "devtools",
  "toolkit",
  "dom",
  "layout",
  "media",
  "security",
  "testing",
  "extensions",
  "modules",
  "editor",
  "remote",
  "storage"
];

// Directories to skip in fallback area detection
const FALLBACK_SKIP_DIRS = new Set([
  "node_modules",
  ".git",
  ".hg",
  ".svn",
  "target",
  "build",
  "dist",
  "out",
  "output",
  ".output",
  ".next",
  "vendor",
  "third_party",
  "other-licenses",
  "coverage",
  "__pycache__",
  ".cache",
  ".vscode",
  ".idea",
  ".github",
  ".gitlab",
  ".circleci",
  "supply-chain",
  "gradle",
  ".cargo"
]);

const MIN_FALLBACK_CHILDREN = 3;
const MIN_AREAS_FOR_FALLBACK = 3;
const MIN_TOPLEVEL_DIRS_FOR_FALLBACK = 10;

const MANIFEST_FILES = [
  "package.json",
  "pyproject.toml",
  "requirements.txt",
  "go.mod",
  "Cargo.toml",
  "pom.xml",
  "build.gradle",
  "build.gradle.kts",
  "Gemfile",
  "composer.json",
  "setup.py",
  "setup.cfg",
  "CMakeLists.txt",
  "meson.build",
  "BUILD",
  "BUILD.bazel",
  "moz.build"
];

const CODE_EXTENSIONS = [
  ".ts",
  ".js",
  ".py",
  ".go",
  ".rs",
  ".java",
  ".cs",
  ".rb",
  ".php",
  ".c",
  ".cc",
  ".cpp",
  ".h",
  ".hpp",
  ".swift",
  ".kt",
  ".scala"
];

function areasFromApps(repoPath: string, apps: RepoApp[]): Area[] {
  return apps.map((app) => {
    const rel = path.relative(repoPath, app.path).replace(/\\/gu, "/");
    return {
      name: app.name,
      applyTo: `${rel}/**`,
      path: app.path,
      ecosystem: app.ecosystem,
      source: "auto" as const,
      scripts: Object.keys(app.scripts).length > 0 ? app.scripts : undefined,
      hasTsConfig: app.hasTsConfig || undefined
    };
  });
}

async function areasFromHeuristics(repoPath: string): Promise<Area[]> {
  const entries = await safeReadDir(repoPath);
  const areas: Area[] = [];

  for (const entry of entries) {
    const lower = entry.toLowerCase();
    if (!AREA_HEURISTIC_DIRS.includes(lower)) continue;

    const fullPath = path.join(repoPath, entry);
    if (!(await isScannableDirectory(repoPath, fullPath))) continue;

    // Check if the directory has meaningful content (manifest or code files)
    const children = await safeReadDir(fullPath);
    const hasManifest = children.some((c) => MANIFEST_FILES.includes(c));
    const hasCode = children.some((c) => CODE_EXTENSIONS.some((ext) => c.endsWith(ext)));
    const hasSrcDir = children.includes("src");

    if (!hasManifest && !hasCode && !hasSrcDir) continue;

    // Read scripts from manifest if present
    let scripts: Record<string, string> | undefined;
    let hasTsConfig: boolean | undefined;
    if (children.includes("package.json")) {
      const pkg = await readJson(path.join(fullPath, "package.json"));
      const pkgScripts = (pkg?.scripts ?? {}) as Record<string, string>;
      if (Object.keys(pkgScripts).length > 0) scripts = pkgScripts;
    }
    if (children.includes("tsconfig.json")) {
      hasTsConfig = true;
    }

    areas.push({
      name: entry,
      applyTo: `${entry}/**`,
      path: fullPath,
      source: "auto",
      scripts,
      hasTsConfig
    });
  }

  return areas;
}

/**
 * Fallback area detection for large repos (e.g., Firefox, Chromium) where
 * neither workspace managers nor the heuristic directory list provide good coverage.
 * Scans first-level directories that contain code or manifests and meet a
 * small minimum-size threshold to reduce noise.
 */
async function areasFromFallback(repoPath: string, existingAreas: Area[]): Promise<Area[]> {
  const existingNames = new Set(existingAreas.map((a) => a.name.toLowerCase()));
  const entries = await safeReadDir(repoPath);
  const areas: Area[] = [];

  for (const entry of entries) {
    if (entry.startsWith(".")) continue;
    if (FALLBACK_SKIP_DIRS.has(entry.toLowerCase())) continue;
    if (existingNames.has(entry.toLowerCase())) continue;

    const fullPath = path.join(repoPath, entry);
    if (!(await isScannableDirectory(repoPath, fullPath))) continue;

    const children = await safeReadDir(fullPath);
    if (children.length < MIN_FALLBACK_CHILDREN) continue;

    const hasManifest = children.some((c) => MANIFEST_FILES.includes(c));
    const hasCode = children.some((c) => CODE_EXTENSIONS.some((ext) => c.endsWith(ext)));
    const hasSrcDir = children.includes("src");

    if (!hasManifest && !hasCode && !hasSrcDir) continue;

    areas.push({
      name: entry,
      applyTo: `${entry}/**`,
      path: fullPath,
      source: "auto"
    });
  }

  return areas;
}

async function detectAreas(repoPath: string, analysis: RepoAnalysis): Promise<Area[]> {
  let autoAreas: Area[];

  if (analysis.isMonorepo && analysis.apps && analysis.apps.length > 1) {
    const appAreas = areasFromApps(repoPath, analysis.apps);
    // Also run heuristics to catch non-app directories (docs, infra, etc.)
    const heuristicAreas = await areasFromHeuristics(repoPath);
    // Merge: app areas take precedence by name
    const byName = new Map(heuristicAreas.map((a) => [a.name.toLowerCase(), a]));
    for (const a of appAreas) {
      byName.set(a.name.toLowerCase(), a);
    }
    autoAreas = Array.from(byName.values());
  } else {
    autoAreas = await areasFromHeuristics(repoPath);
  }

  // Smart fallback: if few areas detected but repo has many top-level dirs,
  // scan all first-level directories for code content
  const topLevelEntries = await safeReadDir(repoPath);
  const topLevelDirCount = (
    await Promise.all(
      topLevelEntries
        .filter((e) => !e.startsWith("."))
        .map(async (e) => isScannableDirectory(repoPath, path.join(repoPath, e)))
    )
  ).filter(Boolean).length;

  if (
    autoAreas.length < MIN_AREAS_FOR_FALLBACK &&
    topLevelDirCount > MIN_TOPLEVEL_DIRS_FOR_FALLBACK
  ) {
    const fallbackAreas = await areasFromFallback(repoPath, autoAreas);
    const byName = new Map(autoAreas.map((a) => [a.name.toLowerCase(), a]));
    for (const a of fallbackAreas) {
      if (!byName.has(a.name.toLowerCase())) {
        byName.set(a.name.toLowerCase(), a);
      }
    }
    autoAreas = Array.from(byName.values());
  }

  // Merge with config areas
  const config = await loadPrimerConfig(repoPath);
  if (!config?.areas?.length) return autoAreas;

  const resolvedRoot = path.resolve(repoPath);
  const configAreas: Area[] = [];
  for (const ca of config.areas) {
    // Derive path: extract leading directory from first applyTo pattern, ignoring glob-only patterns
    const patterns = Array.isArray(ca.applyTo) ? ca.applyTo : [ca.applyTo];
    const firstSegment = patterns[0].split("/")[0];
    const basePath =
      firstSegment.includes("*") || firstSegment.includes("?")
        ? repoPath
        : path.join(repoPath, firstSegment);

    // Prevent path traversal — config areas must stay inside the repo
    const resolved = path.resolve(basePath);
    if (resolved !== resolvedRoot && !resolved.startsWith(resolvedRoot + path.sep)) continue;

    // Enrich config areas with scripts/hasTsConfig
    let scripts: Record<string, string> | undefined;
    let hasTsConfig: boolean | undefined;
    try {
      const children = await safeReadDir(basePath);
      if (children.includes("package.json")) {
        const pkg = await readJson(path.join(basePath, "package.json"));
        const pkgScripts = (pkg?.scripts ?? {}) as Record<string, string>;
        if (Object.keys(pkgScripts).length > 0) scripts = pkgScripts;
      }
      if (children.includes("tsconfig.json")) hasTsConfig = true;
    } catch {
      // Directory may not exist yet for config areas
    }

    configAreas.push({
      name: ca.name,
      description: ca.description,
      applyTo: ca.applyTo,
      path: basePath,
      source: "config" as const,
      scripts,
      hasTsConfig
    });
  }

  // Config areas override auto-detected by name (case-insensitive)
  const autoByName = new Map(autoAreas.map((a) => [a.name.toLowerCase(), a]));
  for (const ca of configAreas) {
    autoByName.set(ca.name.toLowerCase(), ca);
  }

  return Array.from(autoByName.values());
}

// ─── Primer config ───

export type PrimerConfigArea = {
  name: string;
  applyTo: string | string[];
  description?: string;
};

export type PrimerConfig = {
  areas?: PrimerConfigArea[];
  policies?: string[];
};

export async function loadPrimerConfig(repoPath: string): Promise<PrimerConfig | undefined> {
  // Try repo root first, then .github/
  const candidates = [
    path.join(repoPath, "primer.config.json"),
    path.join(repoPath, ".github", "primer.config.json")
  ];

  for (const candidate of candidates) {
    const json = await readJson(candidate);
    if (!json) continue;

    // Validate shape
    if (json.areas !== undefined && !Array.isArray(json.areas)) {
      return undefined;
    }
    const areas: PrimerConfigArea[] = [];
    if (Array.isArray(json.areas)) {
      for (const entry of json.areas) {
        if (
          typeof entry === "object" &&
          entry !== null &&
          typeof (entry as Record<string, unknown>).name === "string" &&
          (entry as Record<string, unknown>).applyTo !== undefined
        ) {
          const e = entry as Record<string, unknown>;
          if (!(e.name as string).trim()) continue;
          const rawApplyTo = e.applyTo;
          // Validate applyTo is a string or array of strings
          let applyTo: string | string[];
          if (typeof rawApplyTo === "string") {
            applyTo = rawApplyTo;
          } else if (Array.isArray(rawApplyTo) && rawApplyTo.every((v) => typeof v === "string")) {
            applyTo = rawApplyTo as string[];
          } else {
            continue;
          }
          if (
            (typeof applyTo === "string" && !applyTo.trim()) ||
            (Array.isArray(applyTo) && applyTo.length === 0)
          )
            continue;
          // Reject patterns with path traversal segments
          const allPatterns = Array.isArray(applyTo) ? applyTo : [applyTo];
          if (allPatterns.some((p) => p.split("/").includes(".."))) continue;
          areas.push({
            name: e.name as string,
            applyTo,
            description: typeof e.description === "string" ? e.description : undefined
          });
        }
      }
    }

    // Parse policies array
    let policies: string[] | undefined;
    if (Array.isArray(json.policies)) {
      policies = json.policies.filter((p): p is string => typeof p === "string" && p.trim() !== "");
    }

    return { areas, policies: policies?.length ? policies : undefined };
  }

  return undefined;
}

export function sanitizeAreaName(name: string): string {
  const sanitized = name
    .toLowerCase()
    .replace(/[^a-z0-9-]/gu, "-")
    .replace(/-+/gu, "-")
    .replace(/^-|-$/gu, "");
  return sanitized || "unnamed";
}
