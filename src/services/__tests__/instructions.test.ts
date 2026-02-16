import fs from "fs/promises";
import os from "os";
import path from "path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import type { Area } from "../analyzer";
import {
  writeAreaInstruction,
  buildAreaFrontmatter,
  buildAreaInstructionContent,
  areaInstructionPath
} from "../instructions";

describe("writeAreaInstruction", () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "primer-inst-"));
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
