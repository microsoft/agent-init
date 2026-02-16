import * as vscode from "vscode";
import { analyzeRepo } from "../services.js";
import type { RepoAnalysis } from "../types.js";

let cachedAnalysis: RepoAnalysis | undefined;

export function getCachedAnalysis(): RepoAnalysis | undefined {
  return cachedAnalysis;
}

export function setCachedAnalysis(analysis: RepoAnalysis | undefined): void {
  cachedAnalysis = analysis;
  vscode.commands.executeCommand("setContext", "primer.hasAnalysis", !!analysis);
}

export async function analyzeCommand(): Promise<void> {
  const workspacePath = getWorkspacePath();
  if (!workspacePath) return;

  await vscode.window.withProgress(
    { location: vscode.ProgressLocation.Notification, title: "Primer: Analyzing repository…" },
    async () => {
      try {
        const analysis = await analyzeRepo(workspacePath);
        setCachedAnalysis(analysis);
      } catch (err) {
        vscode.window.showErrorMessage(
          `Primer: Analysis failed — ${err instanceof Error ? err.message : String(err)}`
        );
      }
    }
  );
}

export function getWorkspacePath(): string | undefined {
  const folder = vscode.workspace.workspaceFolders?.[0];
  if (!folder) {
    vscode.window.showWarningMessage("Primer: No workspace folder open.");
    return undefined;
  }
  return folder.uri.fsPath;
}
