import * as vscode from "vscode";

const panels = new Map<string, vscode.WebviewPanel>();

/**
 * Create or reuse a webview panel to display HTML content.
 */
export function createWebviewPanel(id: string, title: string, html: string): vscode.WebviewPanel {
  const existing = panels.get(id);
  if (existing) {
    existing.webview.html = html;
    existing.reveal();
    return existing;
  }

  const panel = vscode.window.createWebviewPanel(id, title, vscode.ViewColumn.One, {
    enableScripts: true,
    localResourceRoots: []
  });

  panel.webview.html = html;
  panel.onDidDispose(() => panels.delete(id));
  panels.set(id, panel);
  return panel;
}
