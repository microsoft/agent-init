import path from "path";
import { describe, expect, it } from "vitest";

import { validateCachePath } from "../../utils/fs";

describe("validateCachePath", () => {
  it("returns resolved path for normal segments", () => {
    const cacheRoot = "/tmp/primer-cache";
    const result = validateCachePath(cacheRoot, "owner", "repo");
    expect(result).toBe(path.resolve(cacheRoot, "owner", "repo"));
  });

  it("throws on path traversal via ..", () => {
    const cacheRoot = "/tmp/primer-cache";
    expect(() => validateCachePath(cacheRoot, "..", "..", "etc")).toThrow("escapes cache directory");
  });

  it("throws on absolute path segment that escapes", () => {
    const cacheRoot = "/tmp/primer-cache";
    expect(() => validateCachePath(cacheRoot, "/etc/passwd")).toThrow("escapes cache directory");
  });

  it("allows the cache root itself", () => {
    const cacheRoot = "/tmp/primer-cache";
    const result = validateCachePath(cacheRoot);
    expect(result).toBe(path.resolve(cacheRoot));
  });

  it("allows nested paths within cache root", () => {
    const cacheRoot = "/tmp/primer-cache";
    const result = validateCachePath(cacheRoot, "org", "project", "repo");
    expect(result).toBe(path.resolve(cacheRoot, "org", "project", "repo"));
  });

  it("throws when segment contains .. to escape", () => {
    const cacheRoot = "/tmp/primer-cache";
    expect(() => validateCachePath(cacheRoot, "owner", "repo", "..", "..", "..", "etc")).toThrow(
      "escapes cache directory"
    );
  });
});
