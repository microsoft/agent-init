import os from "os";
import path from "path";

import { describe, expect, it } from "vitest";

import { validateCachePath } from "../../utils/fs";

const cacheRoot = path.join(os.tmpdir(), "primer-cache");

describe("validateCachePath", () => {
  it("returns resolved path for normal segments", () => {
    const result = validateCachePath(cacheRoot, "owner", "repo");
    expect(result).toBe(path.resolve(cacheRoot, "owner", "repo"));
  });

  it("throws on path traversal via ..", () => {
    expect(() => validateCachePath(cacheRoot, "..", "..", "etc")).toThrow(
      "escapes cache directory"
    );
  });

  it("throws on absolute path segment that escapes", () => {
    const escaping = path.resolve(cacheRoot, "..", "..", "etc");
    expect(() => validateCachePath(cacheRoot, escaping)).toThrow("escapes cache directory");
  });

  it("allows the cache root itself", () => {
    const result = validateCachePath(cacheRoot);
    expect(result).toBe(path.resolve(cacheRoot));
  });

  it("allows nested paths within cache root", () => {
    const result = validateCachePath(cacheRoot, "org", "project", "repo");
    expect(result).toBe(path.resolve(cacheRoot, "org", "project", "repo"));
  });

  it("throws when segment contains .. to escape", () => {
    expect(() => validateCachePath(cacheRoot, "owner", "repo", "..", "..", "..", "etc")).toThrow(
      "escapes cache directory"
    );
  });
});
