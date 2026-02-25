import { describe, expect, it } from "vitest";

import {
  buildInstructionsPrBody,
  buildFullPrBody,
  isAgentrcFile,
  AGENTRC_FILE_PATTERNS
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

    expect(body).toContain("AgentRC");
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

describe("isAgentrcFile", () => {
  it.each([...AGENTRC_FILE_PATTERNS])("matches exact pattern: %s", (pattern) => {
    expect(isAgentrcFile(pattern)).toBe(true);
  });

  it("matches .instructions.md suffix", () => {
    expect(isAgentrcFile("src/api/.instructions.md")).toBe(true);
    expect(isAgentrcFile(".instructions.md")).toBe(true);
    expect(isAgentrcFile("deep/nested/path/.instructions.md")).toBe(true);
  });

  it("rejects unrelated files", () => {
    expect(isAgentrcFile("package.json")).toBe(false);
    expect(isAgentrcFile("src/index.ts")).toBe(false);
    expect(isAgentrcFile("README.md")).toBe(false);
    expect(isAgentrcFile(".gitignore")).toBe(false);
  });

  it("rejects partial matches", () => {
    expect(isAgentrcFile("copilot-instructions.md")).toBe(false);
    expect(isAgentrcFile("mcp.json")).toBe(false);
    expect(isAgentrcFile("settings.json")).toBe(false);
    expect(isAgentrcFile(".vscode/extensions.json")).toBe(false);
  });

  it("rejects files that contain pattern as substring", () => {
    expect(isAgentrcFile("old/.github/copilot-instructions.md.bak")).toBe(false);
    expect(isAgentrcFile("backup/AGENTS.md")).toBe(false);
    expect(isAgentrcFile("other/.vscode/mcp.json")).toBe(false);
  });

  it("rejects instructions.md without dot prefix", () => {
    expect(isAgentrcFile("instructions.md")).toBe(false);
    expect(isAgentrcFile("src/instructions.md")).toBe(false);
  });

  it("matches Windows-style backslash paths", () => {
    expect(isAgentrcFile(".github\\copilot-instructions.md")).toBe(true);
    expect(isAgentrcFile(".vscode\\mcp.json")).toBe(true);
    expect(isAgentrcFile(".vscode\\settings.json")).toBe(true);
    expect(isAgentrcFile("src\\api\\.instructions.md")).toBe(true);
  });
});
