import * as path from "node:path";
import * as vscode from "vscode";
import type { API, GitExtension, Repository } from "./git.js";

export function getGitRepository(workspacePath: string): Repository | undefined {
  const gitExtension = vscode.extensions.getExtension<GitExtension>("vscode.git");
  if (!gitExtension?.isActive) {
    vscode.window.showErrorMessage("Primer: Git extension is not available.");
    return undefined;
  }

  const api: API = gitExtension.exports.getAPI(1);
  const workspaceUri = vscode.Uri.file(workspacePath);
  // Find the deepest repo whose root is a prefix of (or equal to) the workspace path
  const repository = api.repositories
    .filter((r) => {
      const root = r.rootUri.fsPath;
      return workspaceUri.fsPath === root || workspaceUri.fsPath.startsWith(root + path.sep);
    })
    .sort((a, b) => b.rootUri.fsPath.length - a.rootUri.fsPath.length)[0];

  if (!repository) {
    vscode.window.showErrorMessage("Primer: No git repository found in the workspace.");
    return undefined;
  }

  return repository;
}
