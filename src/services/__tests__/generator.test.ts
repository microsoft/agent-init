import fs from "fs/promises";
import os from "os";
import path from "path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import type { RepoAnalysis } from "../analyzer";
import { generateConfigs } from "../generator";

describe("generateConfigs", () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "primer-gen-"));
  });

  afterEach(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  function makeAnalysis(overrides?: Partial<RepoAnalysis>): RepoAnalysis {
    return {
      path: tmpDir,
      isGitRepo: false,
      languages: ["TypeScript"],
      frameworks: [],
      ...overrides
    };
  }

  it("generates valid mcp.json", async () => {
    const analysis = makeAnalysis();
    const { files } = await generateConfigs({
      repoPath: tmpDir,
      analysis,
      selections: ["mcp"],
      force: false
    });

    const content = await fs.readFile(path.join(tmpDir, ".vscode", "mcp.json"), "utf8");
    const parsed = JSON.parse(content);

    expect(parsed.servers).toBeDefined();
    expect(parsed.servers.github).toBeDefined();
    expect(parsed.servers.filesystem).toBeDefined();
    expect(files.some((f) => f.action === "wrote")).toBe(true);
  });

  it("generates valid vscode settings with frameworks", async () => {
    const analysis = makeAnalysis({ frameworks: ["React", "Next.js"] });
    await generateConfigs({
      repoPath: tmpDir,
      analysis,
      selections: ["vscode"],
      force: false
    });

    const content = await fs.readFile(path.join(tmpDir, ".vscode", "settings.json"), "utf8");
    const parsed = JSON.parse(content);

    expect(parsed["github.copilot.chat.codeGeneration.instructions"]).toBeDefined();
    expect(parsed["chat.mcp.enabled"]).toBe(true);
    // Should mention frameworks in review instructions
    const reviewText = parsed["github.copilot.chat.reviewSelection.instructions"][0].text;
    expect(reviewText).toContain("React");
    expect(reviewText).toContain("Next.js");
  });

  it("generates fallback review text when no frameworks", async () => {
    const analysis = makeAnalysis({ frameworks: [] });
    await generateConfigs({
      repoPath: tmpDir,
      analysis,
      selections: ["vscode"],
      force: false
    });

    const content = await fs.readFile(path.join(tmpDir, ".vscode", "settings.json"), "utf8");
    const parsed = JSON.parse(content);
    const reviewText = parsed["github.copilot.chat.reviewSelection.instructions"][0].text;
    expect(reviewText).toContain("repo conventions");
  });

  it("skips existing files without force", async () => {
    await fs.mkdir(path.join(tmpDir, ".vscode"), { recursive: true });
    await fs.writeFile(path.join(tmpDir, ".vscode", "mcp.json"), "original", "utf8");

    const analysis = makeAnalysis();
    const { files } = await generateConfigs({
      repoPath: tmpDir,
      analysis,
      selections: ["mcp"],
      force: false
    });

    const content = await fs.readFile(path.join(tmpDir, ".vscode", "mcp.json"), "utf8");
    expect(content).toBe("original");
    expect(files.some((f) => f.action === "skipped")).toBe(true);
  });

  it("overwrites existing files with force", async () => {
    await fs.mkdir(path.join(tmpDir, ".vscode"), { recursive: true });
    await fs.writeFile(path.join(tmpDir, ".vscode", "mcp.json"), "original", "utf8");

    const analysis = makeAnalysis();
    const { files } = await generateConfigs({
      repoPath: tmpDir,
      analysis,
      selections: ["mcp"],
      force: true
    });

    const content = await fs.readFile(path.join(tmpDir, ".vscode", "mcp.json"), "utf8");
    expect(content).not.toBe("original");
    expect(files.some((f) => f.action === "wrote")).toBe(true);
  });

  it("does nothing with empty selections", async () => {
    const analysis = makeAnalysis();
    const { files } = await generateConfigs({
      repoPath: tmpDir,
      analysis,
      selections: [],
      force: false
    });

    expect(files).toHaveLength(0);
  });
});
