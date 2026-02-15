import path from "path";

import { DEFAULT_MODEL } from "../config";
import type { AzureDevOpsRepo } from "./azureDevops";
import { createPullRequest as createAzurePullRequest } from "./azureDevops";
import type { GitHubRepo } from "./github";
import { createPullRequest as createGitHubPullRequest } from "./github";
import {
  buildAuthedUrl,
  checkoutBranch,
  cloneRepo,
  commitAll,
  isGitRepo,
  pushBranch,
  setRemoteUrl
} from "./git";
import { generateCopilotInstructions } from "./instructions";
import { ensureDir, safeWriteFile, validateCachePath } from "../utils/fs";
import type { ProgressReporter } from "../utils/output";
import { buildInstructionsPrBody } from "../utils/pr";

// ── Types ──

export type ProcessResult = {
  repo: string;
  success: boolean;
  prUrl?: string;
  error?: string;
};

export type ProcessGitHubRepoOptions = {
  repo: GitHubRepo;
  token: string;
  branch?: string;
  model?: string;
  timeoutMs?: number;
  progress?: ProgressReporter;
};

export type ProcessAzureRepoOptions = {
  repo: AzureDevOpsRepo;
  token: string;
  branch?: string;
  model?: string;
  timeoutMs?: number;
  progress?: ProgressReporter;
};

// ── Token sanitization ──

export function sanitizeError(raw: string): string {
  return raw
    .replace(/x-access-token:[^@]+@/g, "x-access-token:***@")
    .replace(/pat:[^@]+@/g, "pat:***@")
    .replace(/https:\/\/[^@]+@/g, "https://***@");
}

// ── Shared repo processing core ──

type ProcessRepoParams = {
  label: string;
  cacheParts: string[];
  cloneUrl: string;
  token: string;
  provider: "github" | "azure";
  branch: string;
  model: string;
  timeoutMs: number;
  progress?: ProgressReporter;
  createPr: (repoPath: string, branch: string) => Promise<string>;
};

async function processRepo(params: ProcessRepoParams): Promise<ProcessResult> {
  const {
    label,
    cacheParts,
    cloneUrl,
    token,
    provider,
    branch,
    model,
    timeoutMs,
    progress,
    createPr
  } = params;

  try {
    progress?.update(`${label}: Cloning...`);
    const cacheRoot = path.join(process.cwd(), ".primer-cache");
    const repoPath = validateCachePath(cacheRoot, ...cacheParts);
    await ensureDir(repoPath);

    if (!(await isGitRepo(repoPath))) {
      const authedUrl = buildAuthedUrl(cloneUrl, token, provider);
      try {
        await cloneRepo(authedUrl, repoPath, { shallow: true, timeoutMs });
      } finally {
        await setRemoteUrl(repoPath, cloneUrl).catch(() => {});
      }
    }

    progress?.update(`${label}: Creating branch...`);
    await checkoutBranch(repoPath, branch);

    progress?.update(`${label}: Generating instructions...`);
    const instructions = await withTimeout(
      generateCopilotInstructions({
        repoPath,
        model,
        onProgress: (msg) => progress?.update(`${label}: ${msg}`)
      }),
      timeoutMs
    );

    if (!instructions.trim()) {
      throw new Error("Generated instructions were empty");
    }

    const instructionsPath = path.join(repoPath, ".github", "copilot-instructions.md");
    await ensureDir(path.dirname(instructionsPath));
    const { wrote, reason } = await safeWriteFile(instructionsPath, instructions, true);
    if (!wrote) {
      throw new Error(
        `Refused to write instructions (${reason === "symlink" ? "path is a symlink" : "file exists"})`
      );
    }

    progress?.update(`${label}: Committing...`);
    await commitAll(repoPath, "chore: add copilot instructions via Primer");

    progress?.update(`${label}: Pushing...`);
    await pushBranch(repoPath, branch, token, provider);

    progress?.update(`${label}: Creating PR...`);
    const prUrl = await createPr(repoPath, branch);

    progress?.succeed(`${label}: PR created`);
    return { repo: label, success: true, prUrl };
  } catch (error) {
    const msg = sanitizeError(error instanceof Error ? error.message : String(error));
    progress?.fail(`${label}: ${msg}`);
    return { repo: label, success: false, error: msg };
  }
}

// ── GitHub batch processing ──

export async function processGitHubRepo(options: ProcessGitHubRepoOptions): Promise<ProcessResult> {
  const {
    repo,
    token,
    branch = "primer/add-instructions",
    model = DEFAULT_MODEL,
    timeoutMs = 120_000,
    progress
  } = options;

  return processRepo({
    label: repo.fullName,
    cacheParts: [repo.owner, repo.name],
    cloneUrl: repo.cloneUrl,
    token,
    provider: "github",
    branch,
    model,
    timeoutMs,
    progress,
    createPr: (_repoPath, branchName) =>
      createGitHubPullRequest({
        token,
        owner: repo.owner,
        repo: repo.name,
        title: "🤖 Add Copilot instructions via Primer",
        body: buildInstructionsPrBody(),
        head: branchName,
        base: repo.defaultBranch
      })
  });
}

// ── Azure DevOps batch processing ──

export async function processAzureRepo(options: ProcessAzureRepoOptions): Promise<ProcessResult> {
  const {
    repo,
    token,
    branch = "primer/add-instructions",
    model = DEFAULT_MODEL,
    timeoutMs = 120_000,
    progress
  } = options;

  return processRepo({
    label: `${repo.organization}/${repo.project}/${repo.name}`,
    cacheParts: [repo.organization, repo.project, repo.name],
    cloneUrl: repo.cloneUrl,
    token,
    provider: "azure",
    branch,
    model,
    timeoutMs,
    progress,
    createPr: (_repoPath, branchName) =>
      createAzurePullRequest({
        token,
        organization: repo.organization,
        project: repo.project,
        repoId: repo.id,
        repoName: repo.name,
        title: "🤖 Add Copilot instructions via Primer",
        body: buildInstructionsPrBody(),
        sourceBranch: branchName,
        targetBranch: repo.defaultBranch
      })
  });
}

// ── Headless batch runners ──

export async function runBatchHeadlessGitHub(
  repos: GitHubRepo[],
  token: string,
  progress?: ProgressReporter,
  options?: { model?: string; branch?: string }
): Promise<ProcessResult[]> {
  const results: ProcessResult[] = [];
  for (let i = 0; i < repos.length; i++) {
    progress?.update(`[${i + 1}/${repos.length}] Processing ${repos[i].fullName}...`);
    const result = await processGitHubRepo({
      repo: repos[i],
      token,
      progress,
      model: options?.model,
      branch: options?.branch
    });
    results.push(result);
  }
  progress?.done();
  return results;
}

export async function runBatchHeadlessAzure(
  repos: AzureDevOpsRepo[],
  token: string,
  progress?: ProgressReporter,
  options?: { model?: string; branch?: string }
): Promise<ProcessResult[]> {
  const results: ProcessResult[] = [];
  for (let i = 0; i < repos.length; i++) {
    const label = `${repos[i].organization}/${repos[i].project}/${repos[i].name}`;
    progress?.update(`[${i + 1}/${repos.length}] Processing ${label}...`);
    const result = await processAzureRepo({
      repo: repos[i],
      token,
      progress,
      model: options?.model,
      branch: options?.branch
    });
    results.push(result);
  }
  progress?.done();
  return results;
}

// ── Helpers ──

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;
  const timeout = new Promise<T>((_, reject) => {
    timer = setTimeout(
      () => reject(new Error(`Operation timed out after ${timeoutMs / 1000}s`)),
      timeoutMs
    );
  });
  try {
    return await Promise.race([promise, timeout]);
  } finally {
    clearTimeout(timer!);
  }
}
