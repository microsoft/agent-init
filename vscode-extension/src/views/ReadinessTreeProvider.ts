import * as vscode from "vscode";
import type {
  ReadinessReport,
  ReadinessPillarSummary,
  ReadinessCriterionResult
} from "../types.js";

export class ReadinessTreeProvider implements vscode.TreeDataProvider<ReadinessItem> {
  private _onDidChangeTreeData = new vscode.EventEmitter<ReadinessItem | undefined>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  private report: ReadinessReport | undefined;

  setReport(report: ReadinessReport): void {
    this.report = report;
    this._onDidChangeTreeData.fire(undefined);
  }

  getReport(): ReadinessReport | undefined {
    return this.report;
  }

  refresh(): void {
    this._onDidChangeTreeData.fire(undefined);
  }

  getTreeItem(element: ReadinessItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: ReadinessItem): ReadinessItem[] {
    if (element) return element.children ?? [];
    if (!this.report) return [];
    return this.getRootItems(this.report);
  }

  private getRootItems(report: ReadinessReport): ReadinessItem[] {
    const items: ReadinessItem[] = [];

    const levelInfo = report.levels.find((l) => l.level === report.achievedLevel);
    const level = new ReadinessItem(
      levelInfo?.name ?? `Level ${report.achievedLevel}`,
      vscode.TreeItemCollapsibleState.None
    );
    level.description = `Level ${report.achievedLevel}`;
    level.iconPath = new vscode.ThemeIcon(
      report.achievedLevel >= 3 ? "pass" : "warning",
      new vscode.ThemeColor(
        report.achievedLevel >= 3 ? "testing.iconPassed" : "problemsWarningIcon.foreground"
      )
    );
    level.contextValue = "level";
    items.push(level);

    for (const pillar of report.pillars) {
      const criteria = report.criteria.filter((c) => c.pillar === pillar.id);
      items.push(this.createPillarItem(pillar, criteria));
    }

    return items;
  }

  private createPillarItem(
    pillar: ReadinessPillarSummary,
    criteria: ReadinessCriterionResult[]
  ): ReadinessItem {
    const pct = Math.round(pillar.passRate * 100);
    const item = new ReadinessItem(
      pillar.name,
      criteria.length > 0
        ? vscode.TreeItemCollapsibleState.Collapsed
        : vscode.TreeItemCollapsibleState.None,
      criteria.map((c) => {
        const ci = new ReadinessItem(c.title, vscode.TreeItemCollapsibleState.None);
        ci.iconPath = new vscode.ThemeIcon(
          c.status === "pass" ? "pass" : c.status === "fail" ? "error" : "circle-outline",
          c.status === "pass"
            ? new vscode.ThemeColor("testing.iconPassed")
            : c.status === "fail"
              ? new vscode.ThemeColor("testing.iconFailed")
              : undefined
        );
        ci.description = c.reason;
        ci.contextValue = `criterion.${c.status}`;
        const md = new vscode.MarkdownString();
        md.appendMarkdown(`**${c.title}**\n\n`);
        if (c.reason) md.appendMarkdown(`${c.reason}\n\n`);
        if (c.evidence && c.evidence.length > 0) {
          md.appendMarkdown("**Evidence:**\n");
          for (const e of c.evidence) {
            md.appendMarkdown(`- ${e}\n`);
          }
        }
        ci.tooltip = md;
        return ci;
      })
    );
    item.iconPath = new vscode.ThemeIcon(
      pct === 100 ? "pass" : pct >= 50 ? "warning" : "error",
      pct === 100
        ? new vscode.ThemeColor("testing.iconPassed")
        : pct >= 50
          ? new vscode.ThemeColor("problemsWarningIcon.foreground")
          : new vscode.ThemeColor("testing.iconFailed")
    );
    item.description = `${pillar.passed}/${pillar.total} (${pct}%)`;
    item.contextValue = "pillar";
    return item;
  }
}

class ReadinessItem extends vscode.TreeItem {
  constructor(
    label: string,
    collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly children?: ReadinessItem[]
  ) {
    super(label, collapsibleState);
  }
}
