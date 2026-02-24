import { execFile } from "node:child_process";
import { promisify } from "node:util";

import { Octokit } from "@octokit/rest";

const execFileAsync = promisify(execFile);

/**
 * Get a GitHub token from environment variables or the GitHub CLI.
 * Tries GITHUB_TOKEN, GH_TOKEN, then `gh auth token` in that order.
 */
export async function getGitHubToken(): Promise<string | null> {
  // Check environment variables first
  const envToken = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN;
  if (envToken) {
    return envToken;
  }

  // Fall back to GitHub CLI
  try {
    const { stdout } = await execFileAsync("gh", ["auth", "token"], { timeout: 5000 });
    const token = stdout.trim();
    if (token) {
      return token;
    }
  } catch {
    // gh CLI not installed or not authenticated
  }

  return null;
}

export type GitHubRepo = {
  name: string;
  owner: string;
  fullName: string;
  cloneUrl: string;
  isPrivate: boolean;
  defaultBranch: string;
  hasInstructions?: boolean;
};

export function createGitHubClient(token: string): Octokit {
  return new Octokit({ auth: token });
}

export async function listAccessibleRepos(token: string, limit = 100): Promise<GitHubRepo[]> {
  const client = createGitHubClient(token);

  // Fetch only first page - avoids timeout for users with many repos
  const repos = await client.rest.repos.listForAuthenticatedUser({
    visibility: "all",
    affiliation: "owner",
    sort: "pushed",
    per_page: Math.min(limit, 100)
  });

  return repos.data.slice(0, limit).map((repo) => ({
    name: repo.name,
    owner: repo.owner?.login ?? "unknown",
    fullName: repo.full_name,
    cloneUrl: repo.clone_url ?? "",
    isPrivate: repo.private,
    defaultBranch: repo.default_branch ?? "main"
  }));
}

export async function getRepo(token: string, owner: string, repo: string): Promise<GitHubRepo> {
  const client = createGitHubClient(token);
  const response = await client.rest.repos.get({ owner, repo });

  return {
    name: response.data.name,
    owner: response.data.owner?.login ?? owner,
    fullName: response.data.full_name,
    cloneUrl: response.data.clone_url,
    isPrivate: response.data.private,
    defaultBranch: response.data.default_branch
  };
}

export async function createPullRequest(params: {
  token: string;
  owner: string;
  repo: string;
  title: string;
  body: string;
  head: string;
  base: string;
}): Promise<string> {
  const client = createGitHubClient(params.token);
  const response = await client.rest.pulls.create({
    owner: params.owner,
    repo: params.repo,
    title: params.title,
    body: params.body,
    head: params.head,
    base: params.base
  });

  return response.data.html_url;
}

export type GitHubOrg = {
  login: string;
  name: string | null;
};

export async function listUserOrgs(token: string): Promise<GitHubOrg[]> {
  const client = createGitHubClient(token);
  const orgs = await client.paginate(client.rest.orgs.listForAuthenticatedUser, {
    per_page: 100
  });

  return orgs.map((org) => ({
    login: org.login,
    name: org.description ?? null
  }));
}

export async function listOrgRepos(token: string, org: string, limit = 100): Promise<GitHubRepo[]> {
  const client = createGitHubClient(token);

  // Fetch only the first page(s) up to limit - avoids timeout on huge orgs
  const repos = await client.rest.repos.listForOrg({
    org,
    type: "all",
    sort: "pushed",
    per_page: Math.min(limit, 100)
  });

  return repos.data.slice(0, limit).map((repo) => ({
    name: repo.name,
    owner: repo.owner?.login ?? org,
    fullName: repo.full_name,
    cloneUrl: repo.clone_url ?? "",
    isPrivate: repo.private,
    defaultBranch: repo.default_branch ?? "main"
  }));
}

/**
 * Check if a repo has .github/copilot-instructions.md
 */
export async function checkRepoHasInstructions(
  token: string,
  owner: string,
  repo: string
): Promise<boolean> {
  const client = createGitHubClient(token);
  try {
    await client.rest.repos.getContent({
      owner,
      repo,
      path: ".github/copilot-instructions.md"
    });
    return true;
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "status" in error &&
      (error as { status: number }).status === 404
    ) {
      return false;
    }
    throw error;
  }
}

/**
 * Check multiple repos for instructions in parallel (with concurrency limit)
 */
export async function checkReposForInstructions(
  token: string,
  repos: GitHubRepo[],
  onProgress?: (checked: number, total: number) => void
): Promise<GitHubRepo[]> {
  const concurrency = 10;
  const results: GitHubRepo[] = [];
  let checked = 0;

  for (let i = 0; i < repos.length; i += concurrency) {
    const batch = repos.slice(i, i + concurrency);
    const checks = await Promise.all(
      batch.map(async (repo) => {
        const hasInstructions = await checkRepoHasInstructions(token, repo.owner, repo.name);
        return { ...repo, hasInstructions };
      })
    );
    results.push(...checks);
    checked += batch.length;
    onProgress?.(checked, repos.length);
  }

  return results;
}
