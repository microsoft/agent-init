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
