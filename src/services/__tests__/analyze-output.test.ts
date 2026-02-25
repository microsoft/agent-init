import fs from "fs/promises";
import os from "os";
import path from "path";

import { afterEach, describe, expect, it, vi } from "vitest";

import { analyzeCommand, formatAnalysisMarkdown } from "../../commands/analyze";
import type { RepoAnalysis } from "../analyzer";

describe("formatAnalysisMarkdown", () => {
  function makeAnalysis(overrides: Partial<RepoAnalysis> = {}): RepoAnalysis {
    return {
      path: "/tmp/test-repo",
      isGitRepo: true,
      languages: ["TypeScript", "JavaScript"],
      frameworks: ["React", "Next.js"],
      packageManager: "npm",
      ...overrides
    };
  }

  it("renders a heading with repo name", () => {
    const md = formatAnalysisMarkdown(makeAnalysis());
    expect(md).toContain("# Repository Analysis: test-repo");
  });

  it("includes overview table", () => {
    const md = formatAnalysisMarkdown(makeAnalysis());
    expect(md).toContain("| Languages | TypeScript, JavaScript |");
    expect(md).toContain("| Frameworks | React, Next.js |");
    expect(md).toContain("| Package manager | npm |");
  });

  it("shows monorepo info when present", () => {
    const md = formatAnalysisMarkdown(
      makeAnalysis({
        isMonorepo: true,
        workspaceType: "pnpm",
        apps: [
          {
            name: "app-a",
            path: "/tmp/test-repo/apps/a",
            ecosystem: "node",
            packageJsonPath: "",
            scripts: {},
            hasTsConfig: true
          }
        ]
      })
    );
    expect(md).toContain("| Monorepo | pnpm (1 apps) |");
    expect(md).toContain("## Applications");
    expect(md).toContain("| app-a |");
  });

  it("shows areas when present", () => {
    const md = formatAnalysisMarkdown(
      makeAnalysis({
        areas: [
          { name: "frontend", applyTo: "frontend/**", source: "auto" },
          { name: "backend", applyTo: "backend/**", source: "config" }
        ]
      })
    );
    expect(md).toContain("## Areas");
    expect(md).toContain("| frontend | auto |");
    expect(md).toContain("| backend | config |");
  });

  it("handles empty languages gracefully", () => {
    const md = formatAnalysisMarkdown(makeAnalysis({ languages: [], frameworks: [] }));
    expect(md).toContain("| Languages | Unknown |");
    expect(md).toContain("| Frameworks | None detected |");
  });

  it("includes agentrc footer", () => {
    const md = formatAnalysisMarkdown(makeAnalysis());
    expect(md).toContain("AgentRC");
  });
});

describe("analyzeCommand --output", () => {
  let tmpDir: string;

  async function setup() {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "analyze-output-"));
    // Create a minimal directory so analyzeRepo can run against it
    await fs.mkdir(path.join(tmpDir, "repo"));
    return path.join(tmpDir, "repo");
  }

  afterEach(async () => {
    vi.restoreAllMocks();
    process.exitCode = undefined;
    if (tmpDir) {
      await fs.rm(tmpDir, { recursive: true, force: true });
    }
  });

  it("writes JSON file when output ends in .json", async () => {
    const repoPath = await setup();
    const out = path.join(tmpDir, "report.json");
    await analyzeCommand(repoPath, { output: out });
    const content = await fs.readFile(out, "utf-8");
    const parsed = JSON.parse(content);
    expect(parsed).toHaveProperty("path");
    expect(parsed).toHaveProperty("languages");
  });

  it("writes Markdown file when output ends in .md", async () => {
    const repoPath = await setup();
    const out = path.join(tmpDir, "report.md");
    await analyzeCommand(repoPath, { output: out });
    const content = await fs.readFile(out, "utf-8");
    expect(content).toContain("# Repository Analysis:");
  });

  it("refuses to overwrite without --force", async () => {
    const repoPath = await setup();
    const out = path.join(tmpDir, "report.json");
    await fs.writeFile(out, "existing");
    const spy = vi.spyOn(process.stderr, "write").mockImplementation(() => true);
    await analyzeCommand(repoPath, { output: out });
    spy.mockRestore();
    // File should still have original content
    const content = await fs.readFile(out, "utf-8");
    expect(content).toBe("existing");
  });

  it("overwrites with --force", async () => {
    const repoPath = await setup();
    const out = path.join(tmpDir, "report.json");
    await fs.writeFile(out, "existing");
    await analyzeCommand(repoPath, { output: out, force: true });
    const content = await fs.readFile(out, "utf-8");
    expect(content).not.toBe("existing");
    expect(JSON.parse(content)).toHaveProperty("path");
  });

  it("rejects unsupported extensions", async () => {
    const repoPath = await setup();
    const out = path.join(tmpDir, "report.txt");
    const spy = vi.spyOn(process.stderr, "write").mockImplementation(() => true);
    await analyzeCommand(repoPath, { output: out });
    spy.mockRestore();
    expect(process.exitCode).toBe(1);
    await expect(fs.access(out)).rejects.toThrow();
  });

  it("rejects symlinks", async () => {
    const repoPath = await setup();
    const real = path.join(tmpDir, "real.json");
    await fs.writeFile(real, "x");
    const link = path.join(tmpDir, "link.json");
    await fs.symlink(real, link);
    const spy = vi.spyOn(process.stderr, "write").mockImplementation(() => true);
    await analyzeCommand(repoPath, { output: link });
    spy.mockRestore();
    // Real file content unchanged
    const content = await fs.readFile(real, "utf-8");
    expect(content).toBe("x");
  });

  it("emits JSON to stdout when --json is used with --output", async () => {
    const repoPath = await setup();
    const out = path.join(tmpDir, "report.json");
    const stdoutSpy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);

    await analyzeCommand(repoPath, { output: out, json: true, quiet: true });

    const stdout = stdoutSpy.mock.calls
      .map(([chunk]) => String(chunk))
      .join("")
      .trim();
    const parsed = JSON.parse(stdout) as { ok: boolean; status: string; data: unknown };
    expect(parsed.ok).toBe(true);
    expect(parsed.status).toBe("success");
    expect(parsed.data).toBeDefined();

    const fileContent = await fs.readFile(out, "utf-8");
    expect(JSON.parse(fileContent)).toHaveProperty("path");
  });
});
