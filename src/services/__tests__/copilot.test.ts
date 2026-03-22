import { extractModelChoices } from "@agentrc/core/services/copilot";
import { describe, expect, it } from "vitest";

describe("extractModelChoices", () => {
  it("extracts model names from a single-line --help output", () => {
    const help =
      '  --model <model>  Model to use (choices: "claude-sonnet-4.5", "claude-sonnet-4", "gpt-4.1")';
    expect(extractModelChoices(help)).toEqual(["claude-sonnet-4.5", "claude-sonnet-4", "gpt-4.1"]);
  });

  it("extracts model names when choices span multiple lines", () => {
    const help = [
      '  --model <model>  Model to use (choices: "claude-sonnet-4.5",',
      '                   "claude-sonnet-4", "gpt-4.1")'
    ].join("\n");
    expect(extractModelChoices(help)).toEqual(["claude-sonnet-4.5", "claude-sonnet-4", "gpt-4.1"]);
  });

  it("returns empty array when --model line is absent", () => {
    const help = "  --output <file>  Output file\n  --quiet           Suppress output";
    expect(extractModelChoices(help)).toEqual([]);
  });

  it("returns empty array for empty string", () => {
    expect(extractModelChoices("")).toEqual([]);
  });

  it("returns empty array when choices keyword is missing", () => {
    const help = "  --model <model>  Model to use (default: claude-sonnet-4.5)";
    expect(extractModelChoices(help)).toEqual([]);
  });

  it("handles help text written to stderr (same format)", () => {
    const stderr = '  --model <model>  Model (choices: "gpt-5", "gpt-4.1", "claude-sonnet-4.5")';
    expect(extractModelChoices(stderr)).toEqual(["gpt-5", "gpt-4.1", "claude-sonnet-4.5"]);
  });
});
