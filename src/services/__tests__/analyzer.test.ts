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

  it("detects Cargo workspace (Rust monorepo)", async () => {
    const repoPath = await makeTmpDir();
    await fs.writeFile(
      path.join(repoPath, "Cargo.toml"),
      [
        "[workspace]",
        'members = ["crates/core", "crates/cli"]',
        "",
        "[package]",
        'name = "root"'
      ].join("\n")
    );
    await fs.mkdir(path.join(repoPath, "crates", "core"), { recursive: true });
    await fs.writeFile(
      path.join(repoPath, "crates", "core", "Cargo.toml"),
      '[package]\nname = "my-core"\nversion = "0.1.0"'
    );
    await fs.mkdir(path.join(repoPath, "crates", "cli"), { recursive: true });
    await fs.writeFile(
      path.join(repoPath, "crates", "cli", "Cargo.toml"),
      '[package]\nname = "my-cli"\nversion = "0.1.0"'
    );

    const result = await analyzeRepo(repoPath);
    expect(result.languages).toContain("Rust");
    expect(result.isMonorepo).toBe(true);
    expect(result.workspaceType).toBe("cargo");
    expect(result.apps?.length).toBe(2);
    expect(result.apps?.map(a => a.name).sort()).toEqual(["my-cli", "my-core"]);
    expect(result.apps?.[0].ecosystem).toBe("rust");
  });

  it("detects Go workspace (go.work)", async () => {
    const repoPath = await makeTmpDir();
    await fs.writeFile(
      path.join(repoPath, "go.work"),
      [
        "go 1.21",
        "",
        "use (",
        "    ./cmd/server",
        "    ./pkg/lib",
        ")"
      ].join("\n")
    );
    await fs.mkdir(path.join(repoPath, "cmd", "server"), { recursive: true });
    await fs.writeFile(
      path.join(repoPath, "cmd", "server", "go.mod"),
      "module github.com/example/server\n\ngo 1.21"
    );
    await fs.mkdir(path.join(repoPath, "pkg", "lib"), { recursive: true });
    await fs.writeFile(
      path.join(repoPath, "pkg", "lib", "go.mod"),
      "module github.com/example/lib\n\ngo 1.21"
    );

    const result = await analyzeRepo(repoPath);
    expect(result.isMonorepo).toBe(true);
    expect(result.workspaceType).toBe("go");
    expect(result.apps?.length).toBe(2);
    expect(result.apps?.map(a => a.name).sort()).toEqual(["lib", "server"]);
    expect(result.apps?.[0].ecosystem).toBe("go");
  });

  it("detects .NET solution (monorepo)", async () => {
    const repoPath = await makeTmpDir();
    const slnContent = [
      "Microsoft Visual Studio Solution File, Format Version 12.00",
      '# Visual Studio Version 17',
      'Project("{FAE04EC0-301F-11D3-BF4B-00C04F79EFBC}") = "WebApp", "src\\WebApp\\WebApp.csproj", "{GUID1}"',
      "EndProject",
      'Project("{FAE04EC0-301F-11D3-BF4B-00C04F79EFBC}") = "CoreLib", "src\\CoreLib\\CoreLib.csproj", "{GUID2}"',
      "EndProject"
    ].join("\n");
    await fs.writeFile(path.join(repoPath, "MySolution.sln"), slnContent);
    await fs.mkdir(path.join(repoPath, "src", "WebApp"), { recursive: true });
    await fs.writeFile(path.join(repoPath, "src", "WebApp", "WebApp.csproj"), "<Project/>");
    await fs.mkdir(path.join(repoPath, "src", "CoreLib"), { recursive: true });
    await fs.writeFile(path.join(repoPath, "src", "CoreLib", "CoreLib.csproj"), "<Project/>");

    const result = await analyzeRepo(repoPath);
    expect(result.languages).toContain("C#");
    expect(result.isMonorepo).toBe(true);
    expect(result.workspaceType).toBe("dotnet");
    expect(result.apps?.length).toBe(2);
    expect(result.apps?.map(a => a.name).sort()).toEqual(["CoreLib", "WebApp"]);
    expect(result.apps?.[0].ecosystem).toBe("dotnet");
  });

  it("detects Gradle multi-project", async () => {
    const repoPath = await makeTmpDir();
    await fs.writeFile(
      path.join(repoPath, "settings.gradle"),
      "rootProject.name = 'my-app'\ninclude ':app', ':lib'"
    );
    await fs.writeFile(path.join(repoPath, "build.gradle"), "plugins {}", "utf8");
    await fs.mkdir(path.join(repoPath, "app"), { recursive: true });
    await fs.writeFile(path.join(repoPath, "app", "build.gradle"), "plugins {}");
    await fs.mkdir(path.join(repoPath, "lib"), { recursive: true });
    await fs.writeFile(path.join(repoPath, "lib", "build.gradle"), "plugins {}");

    const result = await analyzeRepo(repoPath);
    expect(result.languages).toContain("Java");
    expect(result.isMonorepo).toBe(true);
    expect(result.workspaceType).toBe("gradle");
    expect(result.apps?.length).toBe(2);
    expect(result.apps?.map(a => a.name).sort()).toEqual(["app", "lib"]);
    expect(result.apps?.[0].ecosystem).toBe("java");
  });

  it("detects Gradle Kotlin DSL multi-project", async () => {
    const repoPath = await makeTmpDir();
    await fs.writeFile(
      path.join(repoPath, "settings.gradle.kts"),
      'rootProject.name = "my-app"\ninclude(":app", ":server")'
    );
    await fs.writeFile(path.join(repoPath, "build.gradle.kts"), "plugins {}", "utf8");
    await fs.mkdir(path.join(repoPath, "app"), { recursive: true });
    await fs.writeFile(path.join(repoPath, "app", "build.gradle.kts"), "plugins {}");
    await fs.mkdir(path.join(repoPath, "server"), { recursive: true });
    await fs.writeFile(path.join(repoPath, "server", "build.gradle.kts"), "plugins {}");

    const result = await analyzeRepo(repoPath);
    expect(result.isMonorepo).toBe(true);
    expect(result.workspaceType).toBe("gradle");
    expect(result.apps?.length).toBe(2);
    expect(result.apps?.map(a => a.name).sort()).toEqual(["app", "server"]);
  });

  it("detects Maven multi-module", async () => {
    const repoPath = await makeTmpDir();
    await fs.writeFile(
      path.join(repoPath, "pom.xml"),
      [
        "<project>",
        "  <modules>",
        "    <module>api</module>",
        "    <module>web</module>",
        "  </modules>",
        "</project>"
      ].join("\n")
    );
    await fs.mkdir(path.join(repoPath, "api"), { recursive: true });
    await fs.writeFile(path.join(repoPath, "api", "pom.xml"), "<project/>");
    await fs.mkdir(path.join(repoPath, "web"), { recursive: true });
    await fs.writeFile(path.join(repoPath, "web", "pom.xml"), "<project/>");

    const result = await analyzeRepo(repoPath);
    expect(result.languages).toContain("Java");
    expect(result.isMonorepo).toBe(true);
    expect(result.workspaceType).toBe("maven");
    expect(result.apps?.length).toBe(2);
    expect(result.apps?.map(a => a.name).sort()).toEqual(["api", "web"]);
  });

  it("sets ecosystem to node for JS workspace apps", async () => {
    const repoPath = await makeTmpDir();
    const packageJson = {
      name: "demo",
      workspaces: ["packages/*"]
    };
    await fs.writeFile(path.join(repoPath, "package.json"), JSON.stringify(packageJson));
    await fs.mkdir(path.join(repoPath, "packages", "a"), { recursive: true });
    await fs.writeFile(
      path.join(repoPath, "packages", "a", "package.json"),
      JSON.stringify({ name: "a" })
    );
    await fs.mkdir(path.join(repoPath, "packages", "b"), { recursive: true });
    await fs.writeFile(
      path.join(repoPath, "packages", "b", "package.json"),
      JSON.stringify({ name: "b" })
    );

    const result = await analyzeRepo(repoPath);
    expect(result.isMonorepo).toBe(true);
    expect(result.apps?.[0].ecosystem).toBe("node");
    expect(result.apps?.[0].manifestPath).toBeTruthy();
  });
});
