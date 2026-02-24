import * as vscode from "vscode";
import path from "node:path";
import {
  generateCopilotInstructions,
  generateAreaInstructions,
  writeAreaInstruction,
  safeWriteFile,
  analyzeRepo
} from "../services.js";
import { VscodeProgressReporter } from "../progress.js";
import { getWorkspacePath, getCachedAnalysis, setCachedAnalysis } from "./analyze.js";

const FORMAT_OPTIONS = [
  {
    label: "$(file) copilot-instructions.md",
    description: ".github/copilot-instructions.md",
    value: "copilot-instructions" as const,
    relativePath: path.join(".github", "copilot-instructions.md")
  },
  {
    label: "$(robot) AGENTS.md",
    description: "AGENTS.md at repo root",
    value: "agents-md" as const,
    relativePath: "AGENTS.md"
  }
];

export async function instructionsCommand(): Promise<void> {
  const workspacePath = getWorkspacePath();
  if (!workspacePath) return;

  const model = vscode.workspace.getConfiguration("primer").get<string>("model");

  // Pick format
  const formatPick = await vscode.window.showQuickPick(FORMAT_OPTIONS, {
    placeHolder: "Choose instruction format"
  });
  if (!formatPick) return;

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

  const instructionFile = path.join(workspacePath, formatPick.relativePath);

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: `Primer: Generating ${formatPick.relativePath}…`,
      cancellable: false
    },
    async (progress) => {
      try {
        const reporter = new VscodeProgressReporter(progress);

        reporter.update("Generating root instructions…");
        const content = await generateCopilotInstructions({
          repoPath: workspacePath,
          model,
          onProgress: (msg) => reporter.update(msg)
        });

        let rootSkipped = false;
        if (content.trim()) {
          const dir = path.dirname(instructionFile);
          await vscode.workspace.fs.createDirectory(vscode.Uri.file(dir));
          const { wrote } = await safeWriteFile(instructionFile, content, false);
          if (!wrote) rootSkipped = true;
        }

        let areasSkipped = 0;
        const areaBodies = new Map<string, string>();
        if (selectedAreas) {
          for (const area of selectedAreas) {
            reporter.update(`Generating instructions for ${area.name}…`);
            const body = await generateAreaInstructions({
              repoPath: workspacePath,
              area,
              model,
              onProgress: (msg) => reporter.update(msg)
            });
            areaBodies.set(area.name, body);
            if (body.trim()) {
              const result = await writeAreaInstruction(workspacePath, area, body, false);
              if (result.status === "skipped") areasSkipped++;
            }
          }
        }

        const totalSkipped = (rootSkipped ? 1 : 0) + areasSkipped;
        const areasWithContent = selectedAreas
          ? selectedAreas.filter((a) => (areaBodies.get(a.name) ?? "").trim()).length
          : 0;
        const totalFiles = (content.trim() ? 1 : 0) + areasWithContent;

        if (totalSkipped > 0 && totalSkipped === totalFiles) {
          reporter.succeed("All instruction files already exist.");
          const overwrite = "Overwrite";
          const action = await vscode.window.showWarningMessage(
            `Primer: All ${totalSkipped} instruction files already exist.`,
            overwrite
          );
          if (action === overwrite) {
            try {
              reporter.update("Overwriting instructions…");
              if (content.trim()) {
                await safeWriteFile(instructionFile, content, true);
              }
              if (selectedAreas) {
                for (const area of selectedAreas) {
                  const body = areaBodies.get(area.name) ?? "";
                  if (body.trim()) {
                    await writeAreaInstruction(workspacePath, area, body, true);
                  }
                }
              }
              reporter.succeed("Instructions overwritten.");
            } catch (err) {
              vscode.window.showErrorMessage(
                `Primer: Instruction overwrite failed — ${err instanceof Error ? err.message : String(err)}`
              );
            }
          }
        } else {
          reporter.succeed("Instructions generated.");
        }

        // Open the generated file
        try {
          const doc = await vscode.workspace.openTextDocument(instructionFile);
          await vscode.window.showTextDocument(doc);
        } catch {
          // File may not exist if generation produced no content
        }
      } catch (err) {
        vscode.window.showErrorMessage(
          `Primer: Instruction generation failed — ${err instanceof Error ? err.message : String(err)}`
        );
      }
    }
  );
}
