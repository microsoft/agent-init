import fs from "fs/promises";
import os from "os";
import path from "path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import type { Area } from "../analyzer";
import {
  writeAreaInstruction,
  buildAreaFrontmatter,
  buildAreaInstructionContent,
  areaInstructionPath,
  detectExistingInstructions,
  buildExistingInstructionsSection
} from "../instructions";

describe("writeAreaInstruction", () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "agentrc-inst-"));
  });

  afterEach(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  const makeArea = (name: string, applyTo: string | string[] = "src/**/*.ts"): Area => ({
    name,
    applyTo,
    description: `Test area for ${name}`,
    source: "config"
  });

  it("writes new area instruction file", async () => {
    const area = makeArea("frontend");
    const body = "# Frontend Guidelines\n\nUse React conventions.";

    const result = await writeAreaInstruction(tmpDir, area, body, false);

    expect(result.status).toBe("written");
    expect(result.filePath).toBe(areaInstructionPath(tmpDir, area));

    const content = await fs.readFile(result.filePath, "utf8");
    expect(content).toContain("# Frontend Guidelines");
    expect(content).toContain("applyTo:");
  });

  it("returns empty status for empty body", async () => {
    const area = makeArea("empty-area");
    const result = await writeAreaInstruction(tmpDir, area, "   ", false);

    expect(result.status).toBe("empty");
  });

  it("skips existing file without force", async () => {
    const area = makeArea("backend");
    const filePath = areaInstructionPath(tmpDir, area);

    // Create the file first
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, "original content", "utf8");

    const result = await writeAreaInstruction(tmpDir, area, "new content", false);

    expect(result.status).toBe("skipped");
    const content = await fs.readFile(filePath, "utf8");
    expect(content).toBe("original content");
  });

  it("overwrites existing file with force", async () => {
    const area = makeArea("backend");
    const filePath = areaInstructionPath(tmpDir, area);

    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, "original content", "utf8");

    const result = await writeAreaInstruction(tmpDir, area, "new content", true);

    expect(result.status).toBe("written");
    const content = await fs.readFile(filePath, "utf8");
    expect(content).toContain("new content");
  });

  it("rejects symlink even with force", async () => {
    const area = makeArea("malicious");
    const filePath = areaInstructionPath(tmpDir, area);
    const realFile = path.join(tmpDir, "real.md");

    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(realFile, "original secure content", "utf8");
    await fs.symlink(realFile, filePath);

    const result = await writeAreaInstruction(tmpDir, area, "malicious content", true);

    expect(result.status).toBe("symlink");
    // Verify original file was NOT modified
    const content = await fs.readFile(realFile, "utf8");
    expect(content).toBe("original secure content");
  });
});

describe("buildAreaFrontmatter", () => {
  it("builds frontmatter with single applyTo pattern", () => {
    const area: Area = {
      name: "tests",
      applyTo: "**/*.test.ts",
      description: "Testing area",
      source: "config"
    };

    const frontmatter = buildAreaFrontmatter(area);

    expect(frontmatter).toContain('applyTo: "**/*.test.ts"');
    expect(frontmatter).toContain("description:");
    expect(frontmatter).toContain("tests");
  });

  it("builds frontmatter with multiple applyTo patterns", () => {
    const area: Area = {
      name: "frontend",
      applyTo: ["src/**/*.tsx", "src/**/*.css"],
      description: "Frontend components",
      source: "config"
    };

    const frontmatter = buildAreaFrontmatter(area);

    expect(frontmatter).toContain('["src/**/*.tsx", "src/**/*.css"]');
  });

  it("escapes special characters in strings", () => {
    const area: Area = {
      name: "special",
      applyTo: 'src/"test"/*.ts',
      description: 'Area with "quotes"',
      source: "config"
    };

    const frontmatter = buildAreaFrontmatter(area);

    // Should have escaped quotes
    expect(frontmatter).toContain('\\"');
    // Should be valid YAML format
    expect(frontmatter).toMatch(/^---\n/);
    expect(frontmatter).toMatch(/\n---$/);
  });
});

describe("buildAreaInstructionContent", () => {
  it("combines frontmatter and body with proper spacing", () => {
    const area: Area = {
      name: "api",
      applyTo: "src/api/**/*.ts",
      source: "config"
    };
    const body = "# API Guidelines\n\nFollow REST conventions.";

    const content = buildAreaInstructionContent(area, body);

    expect(content).toMatch(/^---\n/);
    expect(content).toMatch(/---\n\n# API Guidelines/);
    expect(content).toContain("Follow REST conventions.");
    expect(content).toMatch(/\n$/);
  });
});

describe("areaInstructionPath", () => {
  it("generates correct path for area", () => {
    const area: Area = {
      name: "Frontend Components",
      applyTo: "src/**/*.tsx",
      source: "config"
    };

    const result = areaInstructionPath("/repo", area);

    expect(result).toBe(
      path.join("/repo", ".github", "instructions", "frontend-components.instructions.md")
    );
  });

  it("sanitizes area name with special characters", () => {
    const area: Area = {
      name: "API/Backend (Core)",
      applyTo: "src/api/**/*.ts",
      source: "config"
    };

    const result = areaInstructionPath("/repo", area);

    expect(result).toMatch(/api-backend-core\.instructions\.md$/);
  });
});

describe("detectExistingInstructions", () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "agentrc-inst-detect-"));
  });

  afterEach(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  it("returns empty arrays when no instruction files exist", async () => {
    const result = await detectExistingInstructions(tmpDir);
    expect(result.agentsMdFiles).toEqual([]);
    expect(result.claudeMdFiles).toEqual([]);
    expect(result.instructionMdFiles).toEqual([]);
  });

  it("detects AGENTS.md at repo root", async () => {
    await fs.writeFile(path.join(tmpDir, "AGENTS.md"), "# Instructions", "utf8");

    const result = await detectExistingInstructions(tmpDir);

    expect(result.agentsMdFiles).toEqual(["AGENTS.md"]);
  });

  it("detects AGENTS.md in nested subdirectories", async () => {
    await fs.writeFile(path.join(tmpDir, "AGENTS.md"), "# Root", "utf8");
    await fs.mkdir(path.join(tmpDir, "backend", "api"), { recursive: true });
    await fs.writeFile(path.join(tmpDir, "backend", "api", "AGENTS.md"), "# Backend API", "utf8");
    await fs.mkdir(path.join(tmpDir, "tests"), { recursive: true });
    await fs.writeFile(path.join(tmpDir, "tests", "AGENTS.md"), "# Tests", "utf8");

    const result = await detectExistingInstructions(tmpDir);

    expect(result.agentsMdFiles).toEqual(["AGENTS.md", "backend/api/AGENTS.md", "tests/AGENTS.md"]);
  });

  it("detects CLAUDE.md at repo root and subdirectories", async () => {
    await fs.writeFile(path.join(tmpDir, "CLAUDE.md"), "# Claude instructions", "utf8");
    await fs.mkdir(path.join(tmpDir, "src"), { recursive: true });
    await fs.writeFile(path.join(tmpDir, "src", "CLAUDE.md"), "# Src claude", "utf8");

    const result = await detectExistingInstructions(tmpDir);

    expect(result.claudeMdFiles).toEqual(["CLAUDE.md", "src/CLAUDE.md"]);
  });

  it("detects .instructions.md files in .github/instructions/", async () => {
    await fs.mkdir(path.join(tmpDir, ".github", "instructions"), { recursive: true });
    await fs.writeFile(
      path.join(tmpDir, ".github", "instructions", "frontend.instructions.md"),
      "---\napplyTo: src/**\n---\n# Frontend",
      "utf8"
    );
    await fs.writeFile(
      path.join(tmpDir, ".github", "instructions", "testing.instructions.md"),
      "---\napplyTo: tests/**\n---\n# Testing",
      "utf8"
    );

    const result = await detectExistingInstructions(tmpDir);

    expect(result.instructionMdFiles).toEqual([
      ".github/instructions/frontend.instructions.md",
      ".github/instructions/testing.instructions.md"
    ]);
  });

  it("detects all three file types simultaneously", async () => {
    await fs.writeFile(path.join(tmpDir, "AGENTS.md"), "# Agents", "utf8");
    await fs.writeFile(path.join(tmpDir, "CLAUDE.md"), "# Claude", "utf8");
    await fs.mkdir(path.join(tmpDir, ".github", "instructions"), { recursive: true });
    await fs.writeFile(
      path.join(tmpDir, ".github", "instructions", "api.instructions.md"),
      "# API",
      "utf8"
    );

    const result = await detectExistingInstructions(tmpDir);

    expect(result.agentsMdFiles).toEqual(["AGENTS.md"]);
    expect(result.claudeMdFiles).toEqual(["CLAUDE.md"]);
    expect(result.instructionMdFiles).toEqual([".github/instructions/api.instructions.md"]);
  });

  it("excludes files from .git, node_modules, apm_modules, and .apm directories", async () => {
    await fs.writeFile(path.join(tmpDir, "AGENTS.md"), "# Root", "utf8");
    await fs.mkdir(path.join(tmpDir, ".git"), { recursive: true });
    await fs.writeFile(path.join(tmpDir, ".git", "AGENTS.md"), "# Git", "utf8");
    await fs.mkdir(path.join(tmpDir, "node_modules", "pkg"), { recursive: true });
    await fs.writeFile(path.join(tmpDir, "node_modules", "pkg", "CLAUDE.md"), "# NM", "utf8");
    await fs.mkdir(path.join(tmpDir, "apm_modules", "owner", "pkg"), { recursive: true });
    await fs.writeFile(
      path.join(tmpDir, "apm_modules", "owner", "pkg", "AGENTS.md"),
      "# APM",
      "utf8"
    );
    await fs.mkdir(path.join(tmpDir, ".apm", "instructions"), { recursive: true });
    await fs.writeFile(path.join(tmpDir, ".apm", "AGENTS.md"), "# DotAPM", "utf8");

    const result = await detectExistingInstructions(tmpDir);

    expect(result.agentsMdFiles).toEqual(["AGENTS.md"]);
    expect(result.claudeMdFiles).toEqual([]);
  });

  it("ignores non-.instructions.md files in .github/instructions/", async () => {
    await fs.mkdir(path.join(tmpDir, ".github", "instructions"), { recursive: true });
    await fs.writeFile(
      path.join(tmpDir, ".github", "instructions", "frontend.instructions.md"),
      "# OK",
      "utf8"
    );
    await fs.writeFile(
      path.join(tmpDir, ".github", "instructions", "notes.md"),
      "# Not an instruction file",
      "utf8"
    );
    await fs.writeFile(
      path.join(tmpDir, ".github", "instructions", "README.md"),
      "# README",
      "utf8"
    );

    const result = await detectExistingInstructions(tmpDir);

    expect(result.instructionMdFiles).toEqual([".github/instructions/frontend.instructions.md"]);
  });

  it("excludes symlinked AGENTS.md and CLAUDE.md files", async () => {
    const realAgentsPath = path.join(tmpDir, "REAL_AGENTS.md");
    const realClaudePath = path.join(tmpDir, "REAL_CLAUDE.md");

    await fs.writeFile(realAgentsPath, "# Real AGENTS content", "utf8");
    await fs.writeFile(realClaudePath, "# Real CLAUDE content", "utf8");

    const symlinkAgentsPath = path.join(tmpDir, "AGENTS.md");
    const symlinkClaudePath = path.join(tmpDir, "CLAUDE.md");

    try {
      await fs.symlink(realAgentsPath, symlinkAgentsPath);
      await fs.symlink(realClaudePath, symlinkClaudePath);
    } catch (error: unknown) {
      const code = (error as NodeJS.ErrnoException).code;
      if (code === "EPERM" || code === "EACCES" || code === "ENOENT") {
        return;
      }
      throw error;
    }

    const result = await detectExistingInstructions(tmpDir);

    expect(result.agentsMdFiles).toEqual([]);
    expect(result.claudeMdFiles).toEqual([]);
  });
});

describe("buildExistingInstructionsSection", () => {
  it("returns empty string when no instruction files exist", () => {
    const result = buildExistingInstructionsSection({
      agentsMdFiles: [],
      claudeMdFiles: [],
      instructionMdFiles: []
    });
    expect(result).toBe("");
  });

  it("lists all file paths when present", () => {
    const result = buildExistingInstructionsSection({
      agentsMdFiles: ["AGENTS.md", "backend/api/AGENTS.md"],
      claudeMdFiles: ["CLAUDE.md"],
      instructionMdFiles: [".github/instructions/frontend.instructions.md"]
    });
    expect(result).toContain("`AGENTS.md`");
    expect(result).toContain("`backend/api/AGENTS.md`");
    expect(result).toContain("`CLAUDE.md`");
    expect(result).toContain("`.github/instructions/frontend.instructions.md`");
    expect(result).toContain("instruction files that AI agents load automatically");
  });

  it("includes output rules section", () => {
    const result = buildExistingInstructionsSection({
      agentsMdFiles: ["AGENTS.md"],
      claudeMdFiles: [],
      instructionMdFiles: []
    });
    expect(result).toContain("### Output rules");
    expect(result).toContain("do not restate it");
    expect(result).toContain("not already covered by the above files");
  });

  it("works with only CLAUDE.md files", () => {
    const result = buildExistingInstructionsSection({
      agentsMdFiles: [],
      claudeMdFiles: ["CLAUDE.md"],
      instructionMdFiles: []
    });
    expect(result).toContain("`CLAUDE.md`");
    expect(result).toContain("### Output rules");
  });

  it("works with only .instructions.md files", () => {
    const result = buildExistingInstructionsSection({
      agentsMdFiles: [],
      claudeMdFiles: [],
      instructionMdFiles: [".github/instructions/api.instructions.md"]
    });
    expect(result).toContain("`.github/instructions/api.instructions.md`");
    expect(result).toContain("### Output rules");
  });
});
