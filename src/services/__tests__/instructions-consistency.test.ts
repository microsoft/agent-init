import fs from "fs/promises";
import os from "os";
import path from "path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { checkInstructionConsistency, contentSimilarity } from "../readiness";

describe("contentSimilarity", () => {
  it("returns 1.0 for identical content", () => {
    const text = "# Instructions\n\nUse TypeScript strict mode.\n";
    expect(contentSimilarity(text, text)).toBe(1);
  });

  it("returns 1.0 for whitespace/casing-only differences", () => {
    const a = "# Instructions\n\nuse typescript STRICT mode.\n";
    const b = "  # instructions  \n\n  USE TypeScript strict MODE.  \n";
    expect(contentSimilarity(a, b)).toBe(1);
  });

  it("returns 1.0 for two empty strings", () => {
    expect(contentSimilarity("", "")).toBe(1);
  });

  it("returns 0 for completely different content", () => {
    const a = "use functional components\nprefer hooks\nreact only";
    const b = "use class-based design\nprefer inheritance\nvue only";
    expect(contentSimilarity(a, b)).toBe(0);
  });

  it("returns value between 0 and 1 for partial overlap", () => {
    const a = "# Instructions\nUse TypeScript\nUse React\nWrite tests";
    const b = "# Instructions\nUse TypeScript\nUse Vue\nWrite docs";
    const sim = contentSimilarity(a, b);
    expect(sim).toBeGreaterThan(0);
    expect(sim).toBeLessThan(1);
  });

  it("ignores blank lines", () => {
    const a = "line one\n\n\nline two\n";
    const b = "line one\nline two\n";
    expect(contentSimilarity(a, b)).toBe(1);
  });
});

describe("checkInstructionConsistency", () => {
  let repoPath: string;

  beforeEach(async () => {
    repoPath = await fs.mkdtemp(path.join(os.tmpdir(), "agentrc-consist-"));
  });

  afterEach(async () => {
    await fs.rm(repoPath, { recursive: true, force: true });
  });

  async function writeFile(relativePath: string, content: string): Promise<void> {
    const fullPath = path.join(repoPath, relativePath);
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, content, "utf8");
  }

  it("returns unified for a single file", async () => {
    await writeFile("CLAUDE.md", "# Instructions");
    const result = await checkInstructionConsistency(repoPath, ["CLAUDE.md"]);
    expect(result.unified).toBe(true);
    expect(result.similarity).toBeUndefined();
  });

  it("returns unified for two identical files", async () => {
    const content = "# Instructions\n\nUse TypeScript.\n";
    await writeFile(".github/copilot-instructions.md", content);
    await writeFile("CLAUDE.md", content);
    const result = await checkInstructionConsistency(repoPath, [
      ".github/copilot-instructions.md",
      "CLAUDE.md"
    ]);
    expect(result.unified).toBe(true);
    expect(result.similarity).toBe(1);
  });

  it("returns unified for symlinked files", async () => {
    await writeFile(".github/copilot-instructions.md", "# Instructions\nShared.\n");
    const target = path.join(repoPath, ".github", "copilot-instructions.md");
    const link = path.join(repoPath, "CLAUDE.md");
    await fs.symlink(target, link);
    const result = await checkInstructionConsistency(repoPath, [
      ".github/copilot-instructions.md",
      "CLAUDE.md"
    ]);
    expect(result.unified).toBe(true);
    expect(result.similarity).toBeUndefined();
  });

  it("returns not unified for diverging files", async () => {
    await writeFile(
      ".github/copilot-instructions.md",
      "# Copilot\nUse React.\nFunctional components.\nPrefer hooks."
    );
    await writeFile("CLAUDE.md", "# Claude\nUse Vue.\nClass-based.\nPrefer mixins.");
    const result = await checkInstructionConsistency(repoPath, [
      ".github/copilot-instructions.md",
      "CLAUDE.md"
    ]);
    expect(result.unified).toBe(false);
    expect(result.similarity).toBeDefined();
    expect(result.similarity!).toBeLessThan(0.9);
  });

  it("reports similarity score for partially overlapping files", async () => {
    await writeFile(
      ".github/copilot-instructions.md",
      "# Instructions\nUse TypeScript.\nWrite tests.\nUse React."
    );
    await writeFile("CLAUDE.md", "# Instructions\nUse TypeScript.\nWrite docs.\nUse Vue.");
    const result = await checkInstructionConsistency(repoPath, [
      ".github/copilot-instructions.md",
      "CLAUDE.md"
    ]);
    expect(result.similarity).toBeDefined();
    expect(result.similarity!).toBeGreaterThan(0);
    expect(result.similarity!).toBeLessThan(1);
  });
});
