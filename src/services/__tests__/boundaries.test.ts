import fs from "fs/promises";
import os from "os";
import path from "path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { sanitizeError } from "../batch";
import { safeWriteFile } from "../../utils/fs";
import { deriveFileStatus, shouldLog } from "../../utils/output";
import { GITHUB_REPO_RE, AZURE_REPO_RE } from "../../utils/repo";
import { resolveOutputPath } from "../../commands/instructions";

// ── sanitizeError ──

describe("sanitizeError", () => {
  it("scrubs x-access-token credentials", () => {
    const raw =
      "fatal: could not read from https://x-access-token:ghs_abc123@github.com/owner/repo";
    expect(sanitizeError(raw)).not.toContain("ghs_abc123");
    expect(sanitizeError(raw)).toContain("***@");
  });

  it("scrubs pat credentials", () => {
    const raw = "https://pat:my-secret-pat@dev.azure.com/org/project";
    expect(sanitizeError(raw)).not.toContain("my-secret-pat");
    expect(sanitizeError(raw)).toContain("***@");
  });

  it("scrubs generic https credentials as catch-all", () => {
    const raw = "https://user:token123@example.com/repo";
    expect(sanitizeError(raw)).not.toContain("token123");
    expect(sanitizeError(raw)).toContain("https://***@");
  });

  it("leaves messages without tokens untouched", () => {
    const raw = "Connection timed out after 30s";
    expect(sanitizeError(raw)).toBe(raw);
  });

  it("scrubs multiple tokens in one message", () => {
    const raw = "cloned https://x-access-token:a@gh.com then pushed to https://pat:b@dev.azure.com";
    const result = sanitizeError(raw);
    expect(result).not.toContain(":a@");
    expect(result).not.toContain(":b@");
  });
});

// ── deriveFileStatus ──

describe("deriveFileStatus", () => {
  it("returns success when all files wrote", () => {
    const { ok, status } = deriveFileStatus([{ action: "wrote" }, { action: "wrote" }]);
    expect(ok).toBe(true);
    expect(status).toBe("success");
  });

  it("returns success for empty files array", () => {
    const { ok, status } = deriveFileStatus([]);
    expect(ok).toBe(true);
    expect(status).toBe("success");
  });

  it("returns partial when mixed wrote and skipped", () => {
    const { ok, status } = deriveFileStatus([{ action: "wrote" }, { action: "skipped" }]);
    expect(ok).toBe(true);
    expect(status).toBe("partial");
  });

  it("returns noop when all files skipped", () => {
    const { ok, status } = deriveFileStatus([{ action: "skipped" }, { action: "skipped" }]);
    expect(ok).toBe(true);
    expect(status).toBe("noop");
  });
});

// ── shouldLog ──

describe("shouldLog", () => {
  it("returns true with no flags", () => {
    expect(shouldLog({})).toBe(true);
  });

  it("returns false with json", () => {
    expect(shouldLog({ json: true })).toBe(false);
  });

  it("returns false with quiet", () => {
    expect(shouldLog({ quiet: true })).toBe(false);
  });

  it("returns false with both", () => {
    expect(shouldLog({ json: true, quiet: true })).toBe(false);
  });
});

// ── GITHUB_REPO_RE / AZURE_REPO_RE ──

describe("GITHUB_REPO_RE", () => {
  it("matches valid owner/name", () => {
    expect(GITHUB_REPO_RE.test("owner/repo")).toBe(true);
    expect(GITHUB_REPO_RE.test("my-org/my.repo")).toBe(true);
    expect(GITHUB_REPO_RE.test("a/b")).toBe(true);
  });

  it("rejects path traversal", () => {
    expect(GITHUB_REPO_RE.test("../evil/repo")).toBe(false);
    expect(GITHUB_REPO_RE.test("owner/../etc")).toBe(false);
  });

  it("rejects dot-only segments", () => {
    expect(GITHUB_REPO_RE.test("../repo")).toBe(false);
    expect(GITHUB_REPO_RE.test("owner/..")).toBe(false);
    expect(GITHUB_REPO_RE.test("./repo")).toBe(false);
    expect(GITHUB_REPO_RE.test("owner/.")).toBe(false);
  });

  it("allows dotfile-prefixed segments", () => {
    expect(GITHUB_REPO_RE.test(".github/repo")).toBe(true);
    expect(GITHUB_REPO_RE.test("owner/.github")).toBe(true);
  });

  it("rejects empty segments", () => {
    expect(GITHUB_REPO_RE.test("/repo")).toBe(false);
    expect(GITHUB_REPO_RE.test("owner/")).toBe(false);
  });

  it("rejects triple-segment", () => {
    expect(GITHUB_REPO_RE.test("org/project/repo")).toBe(false);
  });

  it("rejects whitespace and special chars", () => {
    expect(GITHUB_REPO_RE.test("ow ner/repo")).toBe(false);
    expect(GITHUB_REPO_RE.test("owner/re po")).toBe(false);
    expect(GITHUB_REPO_RE.test("owner/repo;echo")).toBe(false);
  });
});

describe("AZURE_REPO_RE", () => {
  it("matches valid org/project/repo", () => {
    expect(AZURE_REPO_RE.test("my-org/my-project/my-repo")).toBe(true);
  });

  it("rejects path traversal", () => {
    expect(AZURE_REPO_RE.test("../evil/project/repo")).toBe(false);
    expect(AZURE_REPO_RE.test("org/../etc/repo")).toBe(false);
  });

  it("rejects dot-only segments", () => {
    expect(AZURE_REPO_RE.test("../project/repo")).toBe(false);
    expect(AZURE_REPO_RE.test("org/../repo")).toBe(false);
    expect(AZURE_REPO_RE.test("org/project/..")).toBe(false);
    expect(AZURE_REPO_RE.test("org/./repo")).toBe(false);
  });

  it("rejects two-segment (GitHub format)", () => {
    expect(AZURE_REPO_RE.test("owner/repo")).toBe(false);
  });

  it("rejects four-segment", () => {
    expect(AZURE_REPO_RE.test("a/b/c/d")).toBe(false);
  });
});

// ── safeWriteFile symlink rejection ──

describe("safeWriteFile symlink", () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "primer-symlink-"));
  });

  afterEach(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  it("refuses to write through a symlink", async () => {
    const realFile = path.join(tmpDir, "real.txt");
    const linkFile = path.join(tmpDir, "link.txt");
    await fs.writeFile(realFile, "original", "utf8");
    await fs.symlink(realFile, linkFile);

    const { wrote, reason } = await safeWriteFile(linkFile, "malicious", false);
    expect(wrote).toBe(false);
    expect(reason).toBe("symlink");
    // Ensure original file was not modified
    expect(await fs.readFile(realFile, "utf8")).toBe("original");
  });

  it("refuses to write through a symlink even with force", async () => {
    const realFile = path.join(tmpDir, "real.txt");
    const linkFile = path.join(tmpDir, "link.txt");
    await fs.writeFile(realFile, "original", "utf8");
    await fs.symlink(realFile, linkFile);

    const { wrote, reason } = await safeWriteFile(linkFile, "malicious", true);
    expect(wrote).toBe(false);
    expect(reason).toBe("symlink");
    expect(await fs.readFile(realFile, "utf8")).toBe("original");
  });
});

// ── resolveOutputPath ──

describe("resolveOutputPath", () => {
  it("returns .github/copilot-instructions.md for copilot-instructions format", () => {
    const result = resolveOutputPath("/repo", "copilot-instructions");
    expect(result).toBe(path.join("/repo", ".github", "copilot-instructions.md"));
  });

  it("returns AGENTS.md for agents-md format", () => {
    const result = resolveOutputPath("/repo", "agents-md");
    expect(result).toBe(path.join("/repo", "AGENTS.md"));
  });

  it("uses customOutput when provided, ignoring format", () => {
    const result = resolveOutputPath("/repo", "agents-md", "/custom/output.md");
    expect(result).toBe(path.resolve("/custom/output.md"));
  });

  it("resolves customOutput relative paths", () => {
    const result = resolveOutputPath("/repo", "copilot-instructions", "relative/path.md");
    expect(result).toBe(path.resolve("relative/path.md"));
  });
});
