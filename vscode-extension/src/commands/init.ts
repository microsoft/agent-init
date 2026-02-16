import * as vscode from "vscode";
import path from "node:path";
import { analyzeRepo, generateConfigs, generateCopilotInstructions } from "../services.js";
import { VscodeProgressReporter } from "../progress.js";
import { getWorkspacePath, setCachedAnalysis } from "./analyze.js";

export async function initCommand(): Promise<void> {
  const workspacePath = getWorkspacePath();
  if (!workspacePath) return;

  const config = vscode.workspace.getConfiguration("primer");
  const model = config.get<string>("model");

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: "Primer: Initializing repository…",
      cancellable: false
    },
    async (progress) => {
      try {
        const reporter = new VscodeProgressReporter(progress);

        reporter.update("Analyzing repository…");
        const analysis = await analyzeRepo(workspacePath);
        setCachedAnalysis(analysis);

        reporter.update("Generating Copilot instructions…");
        await generateCopilotInstructions({
          repoPath: workspacePath,
          model,
          onProgress: (msg) => reporter.update(msg)
        });

        reporter.update("Generating configs…");
        const result = await generateConfigs({
          repoPath: workspacePath,
          analysis,
          selections: ["mcp", "vscode"],
          force: false
        });

        const wrote = result.files.filter((f) => f.action === "wrote");
        const skipped = result.files.filter((f) => f.action === "skipped");
        const parts: string[] = [];
        if (wrote.length) parts.push(`${wrote.length} files generated`);
        if (skipped.length) parts.push(`${skipped.length} skipped (already exist)`);

        reporter.succeed("Repository initialized.");

        const instructionsPath = path.join(workspacePath, ".github", "copilot-instructions.md");
        try {
          const doc = await vscode.workspace.openTextDocument(instructionsPath);
          await vscode.window.showTextDocument(doc);
        } catch {
          // File may not exist if generation was skipped
        }

        vscode.window.showInformationMessage(`Primer: ${parts.join(", ") || "Done."}`);
      } catch (err) {
        vscode.window.showErrorMessage(
          `Primer: Initialization failed — ${err instanceof Error ? err.message : String(err)}`
        );
      }
    }
  );
}
