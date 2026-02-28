import readline from "readline";

import { render } from "ink";
import React from "react";

import type { AzureDevOpsRepo } from "../services/azureDevops";
import { getAzureDevOpsToken, getRepo as getAzureRepo } from "../services/azureDevops";
import { runBatchHeadlessGitHub, runBatchHeadlessAzure, sanitizeError } from "../services/batch";
import type { ProcessResult } from "../services/batch";
import type { GitHubRepo } from "../services/github";
import { getGitHubToken, getRepo as getGitHubRepo } from "../services/github";
import { BatchTui } from "../ui/BatchTui";
import { BatchTuiAzure } from "../ui/BatchTuiAzure";
import { safeWriteFile } from "../utils/fs";
import type { CommandResult } from "../utils/output";
import { outputResult, outputError, createProgressReporter, shouldLog } from "../utils/output";
import { GITHUB_REPO_RE, AZURE_REPO_RE } from "../utils/repo";

type BatchOptions = {
  output?: string;
  provider?: string;
  model?: string;
  branch?: string;
  json?: boolean;
  quiet?: boolean;
  accessible?: boolean;
};

export async function batchCommand(repos: string[], options: BatchOptions): Promise<void> {
  const provider = options.provider ?? "github";
  if (provider !== "github" && provider !== "azure") {
    outputError("Invalid provider. Use github or azure.", Boolean(options.json));
    return;
  }

  // Read repos from stdin if piped
  const stdinRepos = await readStdinRepos();
  if (stdinRepos.length > 0 && repos.length > 0) {
    outputError(
      "Provide repos via positional arguments OR stdin, not both.",
      Boolean(options.json)
    );
    return;
  }

  const allRepoArgs = repos.length > 0 ? repos : stdinRepos;
  const isHeadless = allRepoArgs.length > 0 || Boolean(options.json);

  if (isHeadless) {
    if (allRepoArgs.length === 0) {
      outputError(
        "No repos provided. Pass repos as arguments or pipe via stdin.",
        Boolean(options.json)
      );
      return;
    }
    await runHeadless(allRepoArgs, provider, options);
    return;
  }

  // Interactive TUI mode
  if (provider === "azure") {
    const token = getAzureDevOpsToken();
    if (!token) {
      outputError(
        "Azure DevOps authentication required. Set AZURE_DEVOPS_PAT (or AZDO_PAT).",
        Boolean(options.json)
      );
      return;
    }

    try {
      const { waitUntilExit } = render(
        <BatchTuiAzure token={token} outputPath={options.output} />,
        { isScreenReaderEnabled: Boolean(options.accessible) }
      );
      await waitUntilExit();
    } catch (error) {
      outputError(
        `TUI failed: ${error instanceof Error ? error.message : String(error)}`,
        Boolean(options.json)
      );
    }
    return;
  }

  const token = await getGitHubToken();
  if (!token) {
    outputError(
      "GitHub authentication required. Install and authenticate GitHub CLI (gh auth login) or set GITHUB_TOKEN.",
      Boolean(options.json)
    );
    return;
  }

  try {
    const { waitUntilExit } = render(<BatchTui token={token} outputPath={options.output} />, {
      isScreenReaderEnabled: Boolean(options.accessible)
    });
    await waitUntilExit();
  } catch (error) {
    outputError(
      `TUI failed: ${error instanceof Error ? error.message : String(error)}`,
      Boolean(options.json)
    );
  }
}

// ── Headless implementation ──

async function runHeadless(
  repoArgs: string[],
  provider: string,
  options: BatchOptions
): Promise<void> {
  const progress = createProgressReporter(!shouldLog(options));

  if (provider === "azure") {
    const token = getAzureDevOpsToken();
    if (!token) {
      outputError(
        "Set AZURE_DEVOPS_PAT (or AZDO_PAT) to use Azure DevOps batch automation.",
        Boolean(options.json)
      );
      return;
    }

    const repos: AzureDevOpsRepo[] = [];
    for (const arg of repoArgs) {
      const match = arg.match(AZURE_REPO_RE);
      if (!match) {
        outputError(
          `Invalid Azure DevOps repo format: "${arg}". Use org/project/repo.`,
          Boolean(options.json)
        );
        return;
      }
      const [, org, project, name] = match;
      progress.update(`Fetching ${arg}...`);
      try {
        const repo = await getAzureRepo(token, org, project, name);
        repos.push(repo);
      } catch (error) {
        outputError(
          `Failed to fetch repo ${arg}: ${sanitizeError(error instanceof Error ? error.message : String(error))}`,
          Boolean(options.json)
        );
        return;
      }
    }

    const results = await runBatchHeadlessAzure(repos, token, progress, {
      model: options.model,
      branch: options.branch
    });
    await emitResults(results, options);
    return;
  }

  // GitHub provider
  const token = await getGitHubToken();
  if (!token) {
    outputError(
      "Set GITHUB_TOKEN or GH_TOKEN, or authenticate with GitHub CLI.",
      Boolean(options.json)
    );
    return;
  }

  const repos: GitHubRepo[] = [];
  for (const arg of repoArgs) {
    const match = arg.match(GITHUB_REPO_RE);
    if (!match) {
      outputError(`Invalid GitHub repo format: "${arg}". Use owner/name.`, Boolean(options.json));
      return;
    }
    const [, owner, name] = match;
    progress.update(`Fetching ${arg}...`);
    try {
      const repo = await getGitHubRepo(token, owner, name);
      repos.push(repo);
    } catch (error) {
      outputError(
        `Failed to fetch repo ${arg}: ${sanitizeError(error instanceof Error ? error.message : String(error))}`,
        Boolean(options.json)
      );
      return;
    }
  }

  const results = await runBatchHeadlessGitHub(repos, token, progress, {
    model: options.model,
    branch: options.branch
  });
  await emitResults(results, options);
}

async function emitResults(results: ProcessResult[], options: BatchOptions): Promise<void> {
  const succeeded = results.filter((r) => r.success).length;
  const failed = results.length - succeeded;

  if (options.output) {
    await safeWriteFile(options.output, JSON.stringify(results, null, 2), true);
  }

  if (options.json) {
    const result: CommandResult<{ results: ProcessResult[]; succeeded: number; failed: number }> = {
      ok: failed === 0,
      status: failed === 0 ? "success" : succeeded > 0 ? "partial" : "error",
      data: { results, succeeded, failed }
    };
    outputResult(result, true);
  } else if (shouldLog(options)) {
    process.stderr.write(`\nBatch complete: ${succeeded} succeeded, ${failed} failed\n`);
    for (const r of results) {
      if (r.success) {
        process.stderr.write(`  ✓ ${r.repo}${r.prUrl ? ` → ${r.prUrl}` : ""}\n`);
      } else {
        process.stderr.write(`  ✗ ${r.repo} (${r.error})\n`);
      }
    }
  }

  if (failed > 0) {
    process.exitCode = 1;
  }
}

// ── Stdin reader ──

async function readStdinRepos(): Promise<string[]> {
  if (process.stdin.isTTY) return [];

  return new Promise((resolve) => {
    const repos: string[] = [];
    const rl = readline.createInterface({ input: process.stdin });
    rl.on("line", (line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#")) {
        repos.push(trimmed);
      }
    });
    rl.on("close", () => resolve(repos));
    rl.on("error", () => resolve(repos));
  });
}
