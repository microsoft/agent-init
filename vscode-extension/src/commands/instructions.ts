import * as vscode from "vscode";
import { generateCopilotInstructions, generateAreaInstructions, analyzeRepo } from "../services.js";
import { VscodeProgressReporter } from "../progress.js";
import { getWorkspacePath, getCachedAnalysis, setCachedAnalysis } from "./analyze.js";

export async function instructionsCommand(): Promise<void> {
  const workspacePath = getWorkspacePath();
  if (!workspacePath) return;

  const model = vscode.workspace.getConfiguration("primer").get<string>("model");

  // Ensure analysis is available before starting progress
  let analysis = getCachedAnalysis();
  if (!analysis) {
    await vscode.window.withProgress(
      { location: vscode.ProgressLocation.Notification, title: "Primer: Analyzing repository…" },
      async () => {
        analysis = await analyzeRepo(workspacePath);
        setCachedAnalysis(analysis!);
      }
    );
  }
  if (!analysis) return;

  // Collect area selections before starting generation progress
  let selectedAreas: typeof analysis.areas = undefined;
  if (analysis.areas && analysis.areas.length > 0) {
    const picked = await vscode.window.showQuickPick(
      analysis.areas.map((a) => ({ label: a.name, description: a.description, area: a })),
      { placeHolder: "Select areas for instructions (or Escape for root only)", canPickMany: true }
    );
    if (picked && picked.length > 0) {
      selectedAreas = picked.map((p) => p.area);
    }
  }

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: "Primer: Generating Copilot instructions…",
      cancellable: false
    },
    async (progress) => {
      try {
        const reporter = new VscodeProgressReporter(progress);

        reporter.update("Generating root instructions…");
        await generateCopilotInstructions({
          repoPath: workspacePath,
          model,
          onProgress: (msg) => reporter.update(msg)
        });

        if (selectedAreas) {
          for (const area of selectedAreas) {
            reporter.update(`Generating instructions for ${area.name}…`);
            await generateAreaInstructions({
              repoPath: workspacePath,
              area,
              model,
              onProgress: (msg) => reporter.update(msg)
            });
          }
        }

        reporter.succeed("Instructions generated.");
      } catch (err) {
        vscode.window.showErrorMessage(
          `Primer: Instruction generation failed — ${err instanceof Error ? err.message : String(err)}`
        );
      }
    }
  );
}
