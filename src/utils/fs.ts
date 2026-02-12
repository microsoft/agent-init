import fs from "fs/promises";
import path from "path";

export async function ensureDir(dirPath: string): Promise<void> {
  await fs.mkdir(dirPath, { recursive: true });
}

export async function safeWriteFile(filePath: string, content: string, force: boolean): Promise<string> {
  const resolved = path.resolve(filePath);

  // Reject symlinks to prevent writing through them to unintended locations
  try {
    const stat = await fs.lstat(resolved);
    if (stat.isSymbolicLink()) {
      return `Skipped ${path.relative(process.cwd(), filePath)} (symlink)`;
    }
    if (!force) {
      return `Skipped ${path.relative(process.cwd(), filePath)} (exists)`;
    }
  } catch {
    // File does not exist — safe to create
  }

  await fs.writeFile(resolved, content, "utf8");
  return `Wrote ${path.relative(process.cwd(), filePath)}`;
}

/**
 * Validate that a constructed path stays within the expected root directory.
 * Prevents path traversal via malicious repo names or owner slugs.
 */
export function validateCachePath(cacheRoot: string, ...segments: string[]): string {
  const resolvedRoot = path.resolve(cacheRoot);
  const resolved = path.resolve(cacheRoot, ...segments);
  if (!resolved.startsWith(resolvedRoot + path.sep) && resolved !== resolvedRoot) {
    throw new Error(`Invalid path: escapes cache directory (${resolved})`);
  }
  return resolved;
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export function buildTimestampedName(baseName: string): string {
  const stamp = new Date().toISOString().replace(/[:.]/gu, "-");
  return `${baseName}-${stamp}.json`;
}
