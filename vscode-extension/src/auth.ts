import * as vscode from "vscode";

/**
 * Acquires a GitHub token via VS Code's built-in authentication provider.
 * Used by SDK-dependent services (instructions, eval) and Octokit (PR creation).
 */
export async function getGitHubToken(): Promise<string> {
  const session = await vscode.authentication.getSession("github", ["repo"], {
    createIfNone: true
  });
  return session.accessToken;
}

/** Azure DevOps well-known resource ID */
const AZURE_DEVOPS_RESOURCE = "499b84ac-1321-427f-aa17-267ca6975798";

/**
 * Acquires an Azure DevOps token via VS Code's built-in Microsoft authentication provider.
 * Returns a Bearer token (not a PAT).
 */
export async function getAzureDevOpsToken(): Promise<string> {
  const session = await vscode.authentication.getSession(
    "microsoft",
    [`${AZURE_DEVOPS_RESOURCE}/.default`],
    { createIfNone: true }
  );
  return session.accessToken;
}

// ── Platform detection ──

export type GitHubRemote = { owner: string; repo: string };
export type AzureRemote = { organization: string; project: string; repo: string };

// Note: matches github.com only — GitHub Enterprise Server remotes are not supported.
const GITHUB_REMOTE_RE = /github\.com[:/]([^/]+)\/(.+?)(?:\.git)?\/?$/;
const AZURE_HTTPS_RE = /dev\.azure\.com(?::\d+)?\/([^/]+)\/([^/]+)\/_git\/(.+?)(?:\.git)?\/?$/;
const AZURE_SSH_RE = /ssh\.dev\.azure\.com:v3\/([^/]+)\/([^/]+)\/(.+?)(?:\.git)?\/?$/;
const AZURE_LEGACY_RE = /([^./]+)\.visualstudio\.com(?::\d+)?\/([^/]+)\/_git\/(.+?)(?:\.git)?\/?$/;

export function parseGitHubRemote(url: string): GitHubRemote | null {
  const match = url.match(GITHUB_REMOTE_RE);
  if (!match) return null;
  return { owner: match[1], repo: match[2] };
}

export function parseAzureRemote(url: string): AzureRemote | null {
  for (const re of [AZURE_HTTPS_RE, AZURE_SSH_RE, AZURE_LEGACY_RE]) {
    const match = url.match(re);
    if (match) {
      return { organization: match[1], project: match[2], repo: match[3] };
    }
  }
  return null;
}

export type PlatformInfo =
  | { platform: "github"; remote: GitHubRemote }
  | { platform: "azure"; remote: AzureRemote };

export function detectPlatform(url: string): PlatformInfo | null {
  const gh = parseGitHubRemote(url);
  if (gh) return { platform: "github", remote: gh };
  const az = parseAzureRemote(url);
  if (az) return { platform: "azure", remote: az };
  return null;
}
