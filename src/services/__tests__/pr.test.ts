import { describe, expect, it } from "vitest";

import { buildInstructionsPrBody, buildFullPrBody } from "../../utils/pr";

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
