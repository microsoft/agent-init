import { describe, expect, it } from "vitest";

import {
  buildInstructionsPrBody,
  buildFullPrBody,
  isPrimerFile,
  PRIMER_FILE_PATTERNS
} from "../../utils/pr";

describe("buildInstructionsPrBody", () => {
  it("includes instructions file", () => {
    const body = buildInstructionsPrBody();

    expect(body).toContain("copilot-instructions.md");
  });

  it("does not include VS Code config files", () => {
    const body = buildInstructionsPrBody();

    expect(body).not.toContain(".vscode/settings.json");
    expect(body).not.toContain(".vscode/mcp.json");
  });

  it("includes project link", () => {
    const body = buildInstructionsPrBody();

    expect(body).toContain("Primer");
    expect(body).toContain("github.com");
  });
});

describe("buildFullPrBody", () => {
  it("includes all three config files", () => {
    const body = buildFullPrBody();

    expect(body).toContain("copilot-instructions.md");
    expect(body).toContain(".vscode/settings.json");
    expect(body).toContain(".vscode/mcp.json");
  });

  it("includes benefits section", () => {
    const body = buildFullPrBody();

    expect(body).toContain("Benefits");
    expect(body).toContain("MCP");
  });

  it("includes how to use section", () => {
    const body = buildFullPrBody();

    expect(body).toContain("How to Use");
    expect(body).toContain("VS Code");
  });

  it("includes markdown table", () => {
    const body = buildFullPrBody();

    expect(body).toContain("| File | Purpose |");
    expect(body).toContain("|------|---------|");
  });
});

describe("isPrimerFile", () => {
  it.each([...PRIMER_FILE_PATTERNS])("matches exact pattern: %s", (pattern) => {
    expect(isPrimerFile(pattern)).toBe(true);
  });

  it("matches .instructions.md suffix", () => {
    expect(isPrimerFile("src/api/.instructions.md")).toBe(true);
    expect(isPrimerFile(".instructions.md")).toBe(true);
    expect(isPrimerFile("deep/nested/path/.instructions.md")).toBe(true);
  });

  it("rejects unrelated files", () => {
    expect(isPrimerFile("package.json")).toBe(false);
    expect(isPrimerFile("src/index.ts")).toBe(false);
    expect(isPrimerFile("README.md")).toBe(false);
    expect(isPrimerFile(".gitignore")).toBe(false);
  });

  it("rejects partial matches", () => {
    expect(isPrimerFile("copilot-instructions.md")).toBe(false);
    expect(isPrimerFile("mcp.json")).toBe(false);
    expect(isPrimerFile("settings.json")).toBe(false);
    expect(isPrimerFile(".vscode/extensions.json")).toBe(false);
  });

  it("rejects files that contain pattern as substring", () => {
    expect(isPrimerFile("old/.github/copilot-instructions.md.bak")).toBe(false);
    expect(isPrimerFile("backup/AGENTS.md")).toBe(false);
    expect(isPrimerFile("other/.vscode/mcp.json")).toBe(false);
  });

  it("rejects instructions.md without dot prefix", () => {
    expect(isPrimerFile("instructions.md")).toBe(false);
    expect(isPrimerFile("src/instructions.md")).toBe(false);
  });

  it("matches Windows-style backslash paths", () => {
    expect(isPrimerFile(".github\\copilot-instructions.md")).toBe(true);
    expect(isPrimerFile(".vscode\\mcp.json")).toBe(true);
    expect(isPrimerFile(".vscode\\settings.json")).toBe(true);
    expect(isPrimerFile("src\\api\\.instructions.md")).toBe(true);
  });
});
