/**
 * Scan orchestrator — clones a GitHub repo and runs readiness report.
 */
import { cloneRepo } from "@agentrc/core/services/git";
import { runReadinessReport } from "@agentrc/core/services/readiness";
import { createTempDir, removeTempDir, sweepStaleTempDirs } from "../utils/cleanup.js";

const DEFAULT_CLONE_TIMEOUT_MS = 60_000;
const DEFAULT_MAX_CONCURRENT = 5;
const SWEEP_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

let activeScans = 0;
let sweepTimer = null;

export class ConcurrencyError extends Error {
  constructor() {
    super("Too many concurrent scans. Please try again later.");
    this.name = "ConcurrencyError";
  }
}

export class CloneTimeoutError extends Error {
  constructor() {
    super("Repository clone timed out.");
    this.name = "CloneTimeoutError";
  }
}

export class GitCloneError extends Error {
  constructor(message) {
    super(message);
    this.name = "GitCloneError";
  }
}

/**
 * Clone a GitHub repo to a temp dir and run readiness report.
 */
export async function scanGitHubRepo(
  owner,
  repo,
  {
    token,
    branch,
    timeoutMs = DEFAULT_CLONE_TIMEOUT_MS,
    maxConcurrent = DEFAULT_MAX_CONCURRENT
  } = {}
) {
  if (activeScans >= maxConcurrent) {
    throw new ConcurrencyError();
  }

  activeScans++;
  let tempDir;
  const startMs = Date.now();

  try {
    tempDir = await createTempDir();

    // Build clone URL
    const baseUrl = `https://github.com/${owner}/${repo}.git`;
    const cloneUrl = token
      ? `https://x-access-token:${token}@github.com/${owner}/${repo}.git`
      : baseUrl;

    // Clone
    try {
      await cloneRepo(cloneUrl, tempDir, {
        shallow: true,
        timeoutMs
      });
    } catch (err) {
      if (err.message?.includes("timed out") || err.message?.includes("timeout")) {
        throw new CloneTimeoutError();
      }
      throw new GitCloneError(`Failed to clone repository: ${err.message || "unknown error"}`);
    }

    // Run readiness report
    const report = await runReadinessReport({
      repoPath: tempDir,
      includeExtras: true
    });

    const durationMs = Date.now() - startMs;

    // Strip repoPath from report (privacy) and add repo info
    const { repoPath: _stripped, ...rest } = report;
    return {
      ...rest,
      repo_url: `https://github.com/${owner}/${repo}`,
      repo_name: `${owner}/${repo}`,
      durationMs
    };
  } finally {
    activeScans--;
    if (tempDir) {
      removeTempDir(tempDir).catch(() => {});
    }
  }
}

/** Get current number of active scans. */
export function getActiveScans() {
  return activeScans;
}

/** Start background sweep of stale temp dirs. */
export function startStaleDirSweeper() {
  if (sweepTimer) return;
  sweepTimer = setInterval(() => {
    sweepStaleTempDirs().catch(() => {});
  }, SWEEP_INTERVAL_MS);
  sweepTimer.unref();
}

/** Stop the background sweeper. */
export function stopStaleDirSweeper() {
  if (sweepTimer) {
    clearInterval(sweepTimer);
    sweepTimer = null;
  }
}
