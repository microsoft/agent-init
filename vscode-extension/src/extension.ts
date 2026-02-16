import * as vscode from "vscode";
import { analyzeCommand, getCachedAnalysis } from "./commands/analyze.js";
import { generateCommand } from "./commands/generate.js";
import { instructionsCommand } from "./commands/instructions.js";
import { readinessCommand } from "./commands/readiness.js";
import { evalCommand, evalInitCommand } from "./commands/eval.js";
import { initCommand } from "./commands/init.js";
import { prCommand } from "./commands/pr.js";
import { analysisTreeProvider, readinessTreeProvider } from "./views/providers.js";

export function activate(context: vscode.ExtensionContext): void {
  // Status bar
  const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);
  statusBar.text = "$(beaker) Primer";
  statusBar.tooltip = "Primer — click to analyze repository";
  statusBar.command = "primer.analyze";
  statusBar.show();
  context.subscriptions.push(statusBar);

  // Tree views (createTreeView for description/badge support)
  const analysisView = vscode.window.createTreeView("primer.analysis", {
    treeDataProvider: analysisTreeProvider
  });
  const readinessView = vscode.window.createTreeView("primer.readiness", {
    treeDataProvider: readinessTreeProvider
  });
  context.subscriptions.push(analysisView, readinessView);

  function updateAnalysisView(): void {
    const analysis = getCachedAnalysis();
    if (analysis) {
      const parts = [...analysis.languages.slice(0, 3), ...analysis.frameworks.slice(0, 2)];
      analysisView.description = parts.join(", ") || undefined;
    } else {
      analysisView.description = undefined;
    }
  }

  function updateReadinessView(): void {
    const report = readinessTreeProvider.getReport();
    if (report) {
      readinessView.description = `Level ${report.achievedLevel}`;
    } else {
      readinessView.description = undefined;
    }
  }

  function updateStatusBar(): void {
    const analysis = getCachedAnalysis();
    if (analysis) {
      const parts = analysis.languages.slice(0, 2);
      statusBar.text = `$(beaker) ${parts.join(", ") || "Primer"}`;
      statusBar.tooltip = `Primer — ${analysis.languages.join(", ")}${analysis.isMonorepo ? " | monorepo" : ""}`;
    } else {
      statusBar.text = "$(beaker) Primer";
      statusBar.tooltip = "Primer — click to analyze repository";
    }
  }

  // Commands
  context.subscriptions.push(
    vscode.commands.registerCommand("primer.analyze", async () => {
      await analyzeCommand();
      analysisTreeProvider.refresh();
      updateAnalysisView();
      updateStatusBar();
      vscode.commands.executeCommand("primer.analysis.focus");
    }),
    vscode.commands.registerCommand("primer.generate", generateCommand),
    vscode.commands.registerCommand("primer.instructions", instructionsCommand),
    vscode.commands.registerCommand("primer.readiness", async () => {
      await readinessCommand();
      updateReadinessView();
      updateStatusBar();
    }),
    vscode.commands.registerCommand("primer.eval", evalCommand),
    vscode.commands.registerCommand("primer.evalInit", evalInitCommand),
    vscode.commands.registerCommand("primer.init", async () => {
      await initCommand();
      analysisTreeProvider.refresh();
      updateAnalysisView();
      updateStatusBar();
      vscode.commands.executeCommand("primer.analysis.focus");
    }),
    vscode.commands.registerCommand("primer.pr", prCommand)
  );

  // Auto-analyze on activation if configured
  const config = vscode.workspace.getConfiguration("primer");
  if (config.get<boolean>("autoAnalyze") && vscode.workspace.workspaceFolders?.length) {
    analyzeCommand()
      .then(() => {
        analysisTreeProvider.refresh();
        updateAnalysisView();
        updateStatusBar();
      })
      .catch(() => {});
  }
}

export function deactivate(): void {}
