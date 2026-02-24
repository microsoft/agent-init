import * as vscode from "vscode";
import { runReadinessReport, generateVisualReport, analyzeRepo } from "../services.js";
import { VscodeProgressReporter } from "../progress.js";
import { getWorkspacePath, getCachedAnalysis, setCachedAnalysis } from "./analyze.js";
import { createWebviewPanel } from "../webview.js";
import { readinessTreeProvider } from "../views/providers.js";

export async function readinessCommand(): Promise<void> {
  const workspacePath = getWorkspacePath();
  if (!workspacePath) return;

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: "Primer: Running readiness assessment…",
      cancellable: false
    },
    async (progress) => {
      try {
        const reporter = new VscodeProgressReporter(progress);

        let analysis = getCachedAnalysis();
        if (!analysis) {
          reporter.update("Analyzing repository…");
          analysis = await analyzeRepo(workspacePath);
          setCachedAnalysis(analysis);
        }

        reporter.update("Evaluating readiness pillars…");
        const report = await runReadinessReport({ repoPath: workspacePath });

        reporter.update("Generating report…");
        const repoName = vscode.workspace.workspaceFolders?.[0]?.name ?? "Repository";
        const html = generateVisualReport({
          reports: [{ repo: repoName, report }],
          title: `${repoName} — AI Readiness`
        });

        createWebviewPanel("primer.readinessReport", "AI Readiness Report", html);
        readinessTreeProvider.setReport(report);
        reporter.succeed(`Readiness: Level ${report.achievedLevel} achieved.`);
      } catch (err) {
        vscode.window.showErrorMessage(
          `Primer: Readiness assessment failed — ${err instanceof Error ? err.message : String(err)}`
        );
      }
    }
  );
}
