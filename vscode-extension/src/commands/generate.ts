import * as vscode from "vscode";
import { generateConfigs, analyzeRepo } from "../services.js";
import { getWorkspacePath, getCachedAnalysis, setCachedAnalysis } from "./analyze.js";

const GENERATE_OPTIONS = [
  { label: "MCP Config", value: "mcp", description: ".vscode/mcp.json" },
  { label: "VS Code Settings", value: "vscode", description: ".vscode/settings.json" }
] as const;

export async function generateCommand(): Promise<void> {
  const workspacePath = getWorkspacePath();
  if (!workspacePath) return;

  const picked = await vscode.window.showQuickPick(
    GENERATE_OPTIONS.map((o) => ({ label: o.label, description: o.description, value: o.value })),
    { placeHolder: "Select config type to generate" }
  );
  if (!picked) return;

  let analysis = getCachedAnalysis();

  const result = await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: `Primer: Generating ${picked.label}…`
    },
    async () => {
      try {
        if (!analysis) {
          analysis = await analyzeRepo(workspacePath);
          setCachedAnalysis(analysis);
        }

        return await generateConfigs({
          repoPath: workspacePath,
          analysis,
          selections: [picked.value],
          force: false
        });
      } catch (err) {
        vscode.window.showErrorMessage(
          `Primer: Config generation failed — ${err instanceof Error ? err.message : String(err)}`
        );
        return undefined;
      }
    }
  );

  if (!result) return;

  const wrote = result.files.filter((f) => f.action === "wrote");
  const skipped = result.files.filter((f) => f.action === "skipped");

  if (wrote.length > 0) {
    const openAction = "Open File";
    const msg = `Generated ${wrote.map((f) => f.path).join(", ")}${skipped.length ? ` (${skipped.length} skipped)` : ""}`;
    const action = await vscode.window.showInformationMessage(`Primer: ${msg}`, openAction);
    if (action === openAction && wrote[0]) {
      const doc = await vscode.workspace.openTextDocument(wrote[0].path);
      await vscode.window.showTextDocument(doc);
    }
  } else if (skipped.length > 0) {
    const overwrite = "Overwrite";
    const action = await vscode.window.showWarningMessage(
      "Primer: All config files already exist.",
      overwrite
    );
    if (action === overwrite) {
      await vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: `Primer: Overwriting ${picked.label}…`
        },
        async () => {
          const forceResult = await generateConfigs({
            repoPath: workspacePath,
            analysis: analysis!,
            selections: [picked.value],
            force: true
          });
          const forceWrote = forceResult.files.filter((f) => f.action === "wrote");
          if (forceWrote.length > 0) {
            const doc = await vscode.workspace.openTextDocument(forceWrote[0]!.path);
            await vscode.window.showTextDocument(doc);
          }
        }
      );
    }
  }
}
