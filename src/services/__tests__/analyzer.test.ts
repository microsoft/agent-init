import fs from "fs/promises";
import os from "os";
import path from "path";
import { afterEach, describe, expect, it } from "vitest";

import { analyzeRepo } from "../analyzer";

describe("analyzeRepo", () => {
  const tmpDirs: string[] = [];

  async function makeTmpDir(): Promise<string> {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "primer-test-"));
    tmpDirs.push(dir);
    return dir;
  }

  afterEach(async () => {
    for (const dir of tmpDirs) {
      await fs.rm(dir, { recursive: true, force: true }).catch(() => {});
    }
    tmpDirs.length = 0;
  });

  it("detects TypeScript and npm workspace", async () => {
    const repoPath = await makeTmpDir();
    const packageJson = {
      name: "demo",
      workspaces: ["packages/*"],
      dependencies: { react: "^19.0.0" }
    };

    await fs.writeFile(path.join(repoPath, "package.json"), JSON.stringify(packageJson, null, 2));
    await fs.writeFile(path.join(repoPath, "tsconfig.json"), "{}", "utf8");
    await fs.mkdir(path.join(repoPath, "packages", "app"), { recursive: true });
    await fs.writeFile(
      path.join(repoPath, "packages", "app", "package.json"),
      JSON.stringify({ name: "app", scripts: { build: "tsc" } }, null, 2)
    );

    const result = await analyzeRepo(repoPath);

    expect(result.languages).toContain("TypeScript");
    expect(result.workspaceType).toBe("npm");
    expect(result.apps?.length).toBe(1);
  });

  it("detects C# language", async () => {
    const repoPath = await makeTmpDir();
    await fs.writeFile(path.join(repoPath, "MyProject.csproj"), "<Project/>", "utf8");

    const result = await analyzeRepo(repoPath);
    expect(result.languages).toContain("C#");
  });

  it("detects Java via pom.xml", async () => {
    const repoPath = await makeTmpDir();
    await fs.writeFile(path.join(repoPath, "pom.xml"), "<project/>", "utf8");

    const result = await analyzeRepo(repoPath);
    expect(result.languages).toContain("Java");
    expect(result.packageManager).toBe("maven");
  });

  it("detects Java via build.gradle", async () => {
    const repoPath = await makeTmpDir();
    await fs.writeFile(path.join(repoPath, "build.gradle"), "plugins {}", "utf8");

    const result = await analyzeRepo(repoPath);
    expect(result.languages).toContain("Java");
    expect(result.packageManager).toBe("gradle");
  });

  it("detects Ruby", async () => {
    const repoPath = await makeTmpDir();
    await fs.writeFile(path.join(repoPath, "Gemfile"), "source 'https://rubygems.org'", "utf8");

    const result = await analyzeRepo(repoPath);
    expect(result.languages).toContain("Ruby");
    expect(result.packageManager).toBe("bundler");
  });

  it("detects PHP", async () => {
    const repoPath = await makeTmpDir();
    await fs.writeFile(path.join(repoPath, "composer.json"), "{}", "utf8");

    const result = await analyzeRepo(repoPath);
    expect(result.languages).toContain("PHP");
    expect(result.packageManager).toBe("composer");
  });

  it("returns empty analysis for empty directory", async () => {
    const repoPath = await makeTmpDir();

    const result = await analyzeRepo(repoPath);
    expect(result.languages).toEqual([]);
    expect(result.frameworks).toEqual([]);
    expect(result.packageManager).toBeUndefined();
  });

  it("detects pnpm workspace with comments in YAML", async () => {
    const repoPath = await makeTmpDir();
    await fs.writeFile(path.join(repoPath, "package.json"), JSON.stringify({ name: "root" }));
    await fs.writeFile(path.join(repoPath, "pnpm-lock.yaml"), "lockfileVersion: 9");
    await fs.writeFile(
      path.join(repoPath, "pnpm-workspace.yaml"),
      [
        "# workspace config",
        "packages:",
        "  - 'apps/*' # main apps",
        "  - 'libs/*'",
        "# end"
      ].join("\n")
    );
    await fs.mkdir(path.join(repoPath, "apps", "web"), { recursive: true });
    await fs.writeFile(
      path.join(repoPath, "apps", "web", "package.json"),
      JSON.stringify({ name: "web", scripts: { build: "tsc" } })
    );

    const result = await analyzeRepo(repoPath);
    expect(result.workspaceType).toBe("pnpm");
    expect(result.workspacePatterns).toContain("apps/*");
    expect(result.workspacePatterns).toContain("libs/*");
    // Should not include comment text in patterns
    expect(result.workspacePatterns?.some(p => p.includes("#"))).toBe(false);
  });

  it("detects pnpm inline array workspace", async () => {
    const repoPath = await makeTmpDir();
    await fs.writeFile(path.join(repoPath, "package.json"), JSON.stringify({ name: "root" }));
    await fs.writeFile(path.join(repoPath, "pnpm-lock.yaml"), "lockfileVersion: 9");
    await fs.writeFile(
      path.join(repoPath, "pnpm-workspace.yaml"),
      "packages: [\"apps/*\", \"libs/*\"]\n"
    );

    const result = await analyzeRepo(repoPath);
    expect(result.workspaceType).toBe("pnpm");
    expect(result.workspacePatterns).toContain("apps/*");
    expect(result.workspacePatterns).toContain("libs/*");
  });
});
