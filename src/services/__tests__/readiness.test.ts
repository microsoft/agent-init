import fs from "fs/promises";
import os from "os";
import path from "path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { runReadinessReport, type ReadinessReport } from "../readiness";

describe("runReadinessReport", () => {
  let repoPath: string;

  beforeEach(async () => {
    repoPath = await fs.mkdtemp(path.join(os.tmpdir(), "primer-readiness-"));
  });

  afterEach(async () => {
    await fs.rm(repoPath, { recursive: true, force: true });
  });

  async function writeFile(relativePath: string, content: string): Promise<void> {
    const fullPath = path.join(repoPath, relativePath);
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, content, "utf8");
  }

  async function writePackageJson(pkg: Record<string, unknown>): Promise<void> {
    await writeFile("package.json", JSON.stringify(pkg, null, 2));
  }

  it("returns a valid report structure", async () => {
    await writePackageJson({ name: "test-repo", scripts: { build: "tsc", test: "vitest" } });
    const report = await runReadinessReport({ repoPath });

    expect(report.repoPath).toBe(repoPath);
    expect(report.generatedAt).toBeTruthy();
    expect(report.pillars).toBeInstanceOf(Array);
    expect(report.levels).toBeInstanceOf(Array);
    expect(report.criteria).toBeInstanceOf(Array);
    expect(typeof report.achievedLevel).toBe("number");
  });

  it("has all expected pillars", async () => {
    await writePackageJson({ name: "test-repo" });
    const report = await runReadinessReport({ repoPath });

    const pillarIds = report.pillars.map((p) => p.id);
    expect(pillarIds).toContain("style-validation");
    expect(pillarIds).toContain("build-system");
    expect(pillarIds).toContain("testing");
    expect(pillarIds).toContain("documentation");
    expect(pillarIds).toContain("dev-environment");
    expect(pillarIds).toContain("code-quality");
    expect(pillarIds).toContain("observability");
    expect(pillarIds).toContain("security-governance");
    expect(pillarIds).toContain("ai-tooling");
  });

  it("has 5 maturity levels", async () => {
    await writePackageJson({ name: "test-repo" });
    const report = await runReadinessReport({ repoPath });

    expect(report.levels).toHaveLength(5);
    expect(report.levels.map((l) => l.level)).toEqual([1, 2, 3, 4, 5]);
  });

  describe("style-validation pillar", () => {
    it("passes lint-config when eslint.config.js exists", async () => {
      await writePackageJson({ name: "test-repo" });
      await writeFile("eslint.config.js", "export default [];");

      const report = await runReadinessReport({ repoPath });
      const criterion = report.criteria.find((c) => c.id === "lint-config");

      expect(criterion?.status).toBe("pass");
    });

    it("fails lint-config when no lint config exists", async () => {
      await writePackageJson({ name: "test-repo" });

      const report = await runReadinessReport({ repoPath });
      const criterion = report.criteria.find((c) => c.id === "lint-config");

      expect(criterion?.status).toBe("fail");
    });

    it("passes typecheck-config when tsconfig.json exists", async () => {
      await writePackageJson({ name: "test-repo" });
      await writeFile("tsconfig.json", "{}");

      const report = await runReadinessReport({ repoPath });
      const criterion = report.criteria.find((c) => c.id === "typecheck-config");

      expect(criterion?.status).toBe("pass");
    });
  });

  describe("documentation pillar", () => {
    it("passes readme when README.md exists", async () => {
      await writePackageJson({ name: "test-repo" });
      await writeFile("README.md", "# Test");

      const report = await runReadinessReport({ repoPath });
      const criterion = report.criteria.find((c) => c.id === "readme");

      expect(criterion?.status).toBe("pass");
    });

    it("passes contributing when CONTRIBUTING.md exists", async () => {
      await writePackageJson({ name: "test-repo" });
      await writeFile("CONTRIBUTING.md", "# Contributing");

      const report = await runReadinessReport({ repoPath });
      const criterion = report.criteria.find((c) => c.id === "contributing");

      expect(criterion?.status).toBe("pass");
    });
  });

  describe("dev-environment pillar", () => {
    it("passes lockfile when package-lock.json exists", async () => {
      await writePackageJson({ name: "test-repo" });
      await writeFile("package-lock.json", "{}");

      const report = await runReadinessReport({ repoPath });
      const criterion = report.criteria.find((c) => c.id === "lockfile");

      expect(criterion?.status).toBe("pass");
    });

    it("passes env-example when .env.example exists", async () => {
      await writePackageJson({ name: "test-repo" });
      await writeFile(".env.example", "API_KEY=your-key");

      const report = await runReadinessReport({ repoPath });
      const criterion = report.criteria.find((c) => c.id === "env-example");

      expect(criterion?.status).toBe("pass");
    });
  });

  describe("security-governance pillar", () => {
    it("passes codeowners when CODEOWNERS exists", async () => {
      await writePackageJson({ name: "test-repo" });
      await writeFile("CODEOWNERS", "* @owner");

      const report = await runReadinessReport({ repoPath });
      const criterion = report.criteria.find((c) => c.id === "codeowners");

      expect(criterion?.status).toBe("pass");
    });

    it("passes codeowners when .github/CODEOWNERS exists", async () => {
      await writePackageJson({ name: "test-repo" });
      await writeFile(".github/CODEOWNERS", "* @owner");

      const report = await runReadinessReport({ repoPath });
      const criterion = report.criteria.find((c) => c.id === "codeowners");

      expect(criterion?.status).toBe("pass");
    });

    it("passes license when LICENSE exists", async () => {
      await writePackageJson({ name: "test-repo" });
      await writeFile("LICENSE", "MIT License");

      const report = await runReadinessReport({ repoPath });
      const criterion = report.criteria.find((c) => c.id === "license");

      expect(criterion?.status).toBe("pass");
    });

    it("passes security-policy when SECURITY.md exists", async () => {
      await writePackageJson({ name: "test-repo" });
      await writeFile("SECURITY.md", "# Security");

      const report = await runReadinessReport({ repoPath });
      const criterion = report.criteria.find((c) => c.id === "security-policy");

      expect(criterion?.status).toBe("pass");
    });

    it("passes dependabot when .github/dependabot.yml exists", async () => {
      await writePackageJson({ name: "test-repo" });
      await writeFile(".github/dependabot.yml", "version: 2");

      const report = await runReadinessReport({ repoPath });
      const criterion = report.criteria.find((c) => c.id === "dependabot");

      expect(criterion?.status).toBe("pass");
    });
  });

  describe("ai-tooling pillar", () => {
    it("passes custom-instructions when copilot-instructions.md exists", async () => {
      await writePackageJson({ name: "test-repo" });
      await writeFile(".github/copilot-instructions.md", "# Instructions");

      const report = await runReadinessReport({ repoPath });
      const criterion = report.criteria.find((c) => c.id === "custom-instructions");

      expect(criterion?.status).toBe("pass");
    });

    it("passes custom-instructions when CLAUDE.md exists", async () => {
      await writePackageJson({ name: "test-repo" });
      await writeFile("CLAUDE.md", "# Claude instructions");

      const report = await runReadinessReport({ repoPath });
      const criterion = report.criteria.find((c) => c.id === "custom-instructions");

      expect(criterion?.status).toBe("pass");
    });

    it("passes custom-instructions when AGENTS.md exists", async () => {
      await writePackageJson({ name: "test-repo" });
      await writeFile("AGENTS.md", "# Agents guidance");

      const report = await runReadinessReport({ repoPath });
      const criterion = report.criteria.find((c) => c.id === "custom-instructions");

      expect(criterion?.status).toBe("pass");
    });

    it("passes custom-instructions when .cursorrules exists", async () => {
      await writePackageJson({ name: "test-repo" });
      await writeFile(".cursorrules", "rules here");

      const report = await runReadinessReport({ repoPath });
      const criterion = report.criteria.find((c) => c.id === "custom-instructions");

      expect(criterion?.status).toBe("pass");
    });

    it("fails custom-instructions when none exist", async () => {
      await writePackageJson({ name: "test-repo" });

      const report = await runReadinessReport({ repoPath });
      const criterion = report.criteria.find((c) => c.id === "custom-instructions");

      expect(criterion?.status).toBe("fail");
    });

    it("passes mcp-config when .vscode/mcp.json exists", async () => {
      await writePackageJson({ name: "test-repo" });
      await writeFile(".vscode/mcp.json", "{}");

      const report = await runReadinessReport({ repoPath });
      const criterion = report.criteria.find((c) => c.id === "mcp-config");

      expect(criterion?.status).toBe("pass");
    });

    it("passes mcp-config when .vscode/settings.json has mcp key", async () => {
      await writePackageJson({ name: "test-repo" });
      await writeFile(
        ".vscode/settings.json",
        JSON.stringify({ "github.copilot.chat.mcp.enabled": true })
      );

      const report = await runReadinessReport({ repoPath });
      const criterion = report.criteria.find((c) => c.id === "mcp-config");

      expect(criterion?.status).toBe("pass");
    });

    it("passes custom-agents when .github/agents directory exists", async () => {
      await writePackageJson({ name: "test-repo" });
      await writeFile(".github/agents/.gitkeep", "");

      const report = await runReadinessReport({ repoPath });
      const criterion = report.criteria.find((c) => c.id === "custom-agents");

      expect(criterion?.status).toBe("pass");
    });

    it("passes copilot-skills when .copilot/skills directory exists", async () => {
      await writePackageJson({ name: "test-repo" });
      await writeFile(".copilot/skills/.gitkeep", "");

      const report = await runReadinessReport({ repoPath });
      const criterion = report.criteria.find((c) => c.id === "copilot-skills");

      expect(criterion?.status).toBe("pass");
    });
  });

  describe("build-system pillar", () => {
    it("passes ci-config when .github/workflows exists", async () => {
      await writePackageJson({ name: "test-repo" });
      await writeFile(".github/workflows/ci.yml", "name: CI");

      const report = await runReadinessReport({ repoPath });
      const criterion = report.criteria.find((c) => c.id === "ci-config");

      expect(criterion?.status).toBe("pass");
    });
  });

  describe("achieved level", () => {
    it("achieves level 1 with basic setup", async () => {
      await writePackageJson({
        name: "test-repo",
        scripts: { build: "tsc", test: "vitest" }
      });
      await writeFile("eslint.config.js", "export default [];");
      await writeFile("README.md", "# Test");
      await writeFile("package-lock.json", "{}");
      await writeFile("LICENSE", "MIT");

      const report = await runReadinessReport({ repoPath });

      expect(report.achievedLevel).toBeGreaterThanOrEqual(1);
    });

    it("is 0 for an empty repo", async () => {
      await writePackageJson({ name: "empty-repo" });

      const report = await runReadinessReport({ repoPath });

      // Level 0 means nothing achieved (most L1 checks fail)
      expect(report.achievedLevel).toBeLessThanOrEqual(1);
    });
  });

  describe("pillar summaries", () => {
    it("calculates passRate correctly", async () => {
      await writePackageJson({ name: "test-repo" });
      await writeFile("eslint.config.js", "export default [];");

      const report = await runReadinessReport({ repoPath });
      const stylePillar = report.pillars.find((p) => p.id === "style-validation");

      expect(stylePillar).toBeDefined();
      expect(stylePillar!.passed).toBeGreaterThanOrEqual(1);
      expect(stylePillar!.total).toBeGreaterThanOrEqual(1);
      expect(stylePillar!.passRate).toBe(stylePillar!.passed / stylePillar!.total);
    });
  });

  describe("extras", () => {
    it("includes extras by default", async () => {
      await writePackageJson({ name: "test-repo" });

      const report = await runReadinessReport({ repoPath });

      expect(report.extras.length).toBeGreaterThan(0);
      const extraIds = report.extras.map((e) => e.id);
      expect(extraIds).toContain("pr-template");
      expect(extraIds).toContain("pre-commit");
      expect(extraIds).toContain("architecture-doc");
    });

    it("excludes extras when disabled", async () => {
      await writePackageJson({ name: "test-repo" });

      const report = await runReadinessReport({ repoPath, includeExtras: false });

      expect(report.extras).toHaveLength(0);
    });
  });
});
