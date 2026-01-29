import fs from "fs/promises";
import path from "path";
import fg from "fast-glob";
import { isGitRepo } from "./git";

export type RepoAnalysis = {
  path: string;
  isGitRepo: boolean;
  languages: string[];
  frameworks: string[];
  packageManager?: string;
};

const PACKAGE_MANAGERS: Array<{ file: string; name: string }> = [
  { file: "pnpm-lock.yaml", name: "pnpm" },
  { file: "yarn.lock", name: "yarn" },
  { file: "package-lock.json", name: "npm" },
  { file: "bun.lockb", name: "bun" },
  { file: "packages.lock.json", name: "nuget" }
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
  const hasDotnet = await hasDotnetSignalsDeep(repoPath, files);

  if (hasPackageJson) analysis.languages.push("JavaScript");
  if (hasTsConfig) analysis.languages.push("TypeScript");
  if (hasPyProject || hasRequirements) analysis.languages.push("Python");
  if (hasGoMod) analysis.languages.push("Go");
  if (hasCargo) analysis.languages.push("Rust");
  if (hasDotnet.hasSignals) {
    if (hasDotnet.hasCsProj) analysis.languages.push("C#");
    if (hasDotnet.hasFsProj) analysis.languages.push("F#");
    // Fallback to C# if we have signals but no specific project files (e.g., just .sln)
    if (!hasDotnet.hasCsProj && !hasDotnet.hasFsProj) analysis.languages.push("C#");
  }

  analysis.packageManager = await detectPackageManager(repoPath, files);

  if (hasPackageJson) {
    const packageJson = await readJson(path.join(repoPath, "package.json"));
    const deps = Object.keys({
      ...(packageJson?.dependencies ?? {}),
      ...(packageJson?.devDependencies ?? {})
    });
    analysis.frameworks.push(...detectFrameworks(deps, files));
  }

  // Detect .NET frameworks from project files
  if (hasDotnet.hasSignals) {
    const dotnetFrameworks = await detectDotnetFrameworks(repoPath);
    analysis.frameworks.push(...dotnetFrameworks);
  }

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
  if (hasDotnetSignals(files)) return "nuget";
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

function unique<T>(items: T[]): T[] {
  return Array.from(new Set(items));
}

function hasDotnetSignals(files: string[]): boolean {
  return files.some(
    (file) =>
      file.endsWith(".sln") ||
      file.endsWith(".csproj") ||
      file.endsWith(".fsproj") ||
      file === "global.json" ||
      file === "Directory.Build.props" ||
      file === "packages.lock.json"
  );
}

type DotnetSignals = {
  hasSignals: boolean;
  hasCsProj: boolean;
  hasFsProj: boolean;
};

async function hasDotnetSignalsDeep(repoPath: string, files: string[]): Promise<DotnetSignals> {
  // Check root files first (fast path)
  const rootSignals = hasDotnetSignals(files);

  // Glob for project files recursively
  const csprojFiles = await fg("**/*.csproj", { cwd: repoPath, onlyFiles: true });
  const fsprojFiles = await fg("**/*.fsproj", { cwd: repoPath, onlyFiles: true });

  return {
    hasSignals: rootSignals || csprojFiles.length > 0 || fsprojFiles.length > 0,
    hasCsProj: csprojFiles.length > 0,
    hasFsProj: fsprojFiles.length > 0
  };
}

async function detectDotnetFrameworks(repoPath: string): Promise<string[]> {
  const frameworks: string[] = [];

  // Glob all project files recursively
  const projectFiles = await fg("**/*.{csproj,fsproj}", { cwd: repoPath, onlyFiles: true });

  for (const projFile of projectFiles) {
    try {
      const content = await fs.readFile(path.join(repoPath, projFile), "utf8");
      const detected = parseDotnetProject(content);
      frameworks.push(...detected);
    } catch {
      // Ignore read errors
    }
  }

  return frameworks;
}

function parseDotnetProject(content: string): string[] {
  const frameworks: string[] = [];

  // Check SDK attribute for project type
  if (content.includes('Sdk="Microsoft.NET.Sdk.Web"')) frameworks.push("ASP.NET Core");
  if (content.includes('Sdk="Microsoft.NET.Sdk.BlazorWebAssembly"')) frameworks.push("Blazor WebAssembly");
  if (content.includes('Sdk="Microsoft.NET.Sdk.Razor"')) frameworks.push("Razor");

  // Check PackageReference includes
  const hasPackage = (pkg: string): boolean => content.includes(`Include="${pkg}`);

  // ASP.NET Core detection
  if (hasPackage("Microsoft.AspNetCore") || hasPackage("Microsoft.AspNetCore.App")) {
    frameworks.push("ASP.NET Core");
  }

  // Blazor detection
  if (hasPackage("Microsoft.AspNetCore.Components")) frameworks.push("Blazor");

  // Entity Framework detection
  if (hasPackage("Microsoft.EntityFrameworkCore")) frameworks.push("Entity Framework");

  // MAUI detection
  if (hasPackage("Microsoft.Maui") || hasPackage("Microsoft.Maui.Controls")) {
    frameworks.push(".NET MAUI");
  }

  // Xamarin detection
  if (hasPackage("Xamarin.Forms") || hasPackage("Xamarin.Essentials") || hasPackage("Mono.Android")) {
    frameworks.push("Xamarin");
  }

  // WPF detection
  if (content.includes("<UseWPF>true</UseWPF>")) frameworks.push("WPF");

  // WinForms detection
  if (content.includes("<UseWindowsForms>true</UseWindowsForms>")) frameworks.push("Windows Forms");

  // Test framework detection
  if (hasPackage("xunit") || hasPackage("xunit.core")) frameworks.push("xUnit");
  if (hasPackage("NUnit") || hasPackage("nunit.framework")) frameworks.push("NUnit");
  if (hasPackage("MSTest.TestFramework") || hasPackage("Microsoft.NET.Test.Sdk")) {
    frameworks.push("MSTest");
  }

  // Console app detection (only if no other specific framework detected)
  if (frameworks.length === 0) {
    const isExe = content.includes("<OutputType>Exe</OutputType>") || content.includes("<OutputType>WinExe</OutputType>");
    const isStandardSdk = content.includes('Sdk="Microsoft.NET.Sdk"');
    if (isExe && isStandardSdk) {
      frameworks.push("Console");
    }
  }

  return frameworks;
}
