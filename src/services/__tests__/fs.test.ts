import fs from "fs/promises";
import os from "os";
import path from "path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { ensureDir, safeWriteFile } from "../../utils/fs";

describe("ensureDir", () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "primer-fs-"));
  });

  afterEach(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  it("creates a directory that does not exist", async () => {
    const target = path.join(tmpDir, "a", "b", "c");
    await ensureDir(target);

    const stat = await fs.stat(target);
    expect(stat.isDirectory()).toBe(true);
  });

  it("does not throw if directory already exists", async () => {
    const target = path.join(tmpDir, "existing");
    await fs.mkdir(target);
    await expect(ensureDir(target)).resolves.toBeUndefined();
  });
});

describe("safeWriteFile", () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "primer-fs-"));
  });

  afterEach(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  it("writes a new file", async () => {
    const filePath = path.join(tmpDir, "test.txt");
    const result = await safeWriteFile(filePath, "hello", false);

    const content = await fs.readFile(filePath, "utf8");
    expect(content).toBe("hello");
    expect(result.wrote).toBe(true);
    expect(result.reason).toBeUndefined();
  });

  it("skips existing file without force and reports reason", async () => {
    const filePath = path.join(tmpDir, "test.txt");
    await fs.writeFile(filePath, "original");
    const result = await safeWriteFile(filePath, "new content", false);

    const content = await fs.readFile(filePath, "utf8");
    expect(content).toBe("original");
    expect(result.wrote).toBe(false);
    expect(result.reason).toBe("exists");
  });

  it("overwrites existing file with force", async () => {
    const filePath = path.join(tmpDir, "test.txt");
    await fs.writeFile(filePath, "original");
    const result = await safeWriteFile(filePath, "new content", true);

    const content = await fs.readFile(filePath, "utf8");
    expect(content).toBe("new content");
    expect(result.wrote).toBe(true);
    expect(result.reason).toBeUndefined();
  });

  it("rejects symlink even with force", async () => {
    const realFile = path.join(tmpDir, "real.txt");
    const symlink = path.join(tmpDir, "symlink.txt");
    await fs.writeFile(realFile, "original");
    await fs.symlink(realFile, symlink);

    const result = await safeWriteFile(symlink, "malicious content", true);

    expect(result.wrote).toBe(false);
    expect(result.reason).toBe("symlink");
    // Verify the original file was NOT modified
    const content = await fs.readFile(realFile, "utf8");
    expect(content).toBe("original");
  });

  it("rejects symlink without force", async () => {
    const realFile = path.join(tmpDir, "real.txt");
    const symlink = path.join(tmpDir, "symlink.txt");
    await fs.writeFile(realFile, "original");
    await fs.symlink(realFile, symlink);

    const result = await safeWriteFile(symlink, "malicious content", false);

    expect(result.wrote).toBe(false);
    expect(result.reason).toBe("symlink");
  });
});
