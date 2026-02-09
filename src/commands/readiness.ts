import path from "path";
import fs from "fs/promises";
import chalk from "chalk";
import {
  ReadinessReport,
  ReadinessCriterionResult,
  runReadinessReport
} from "../services/readiness";
import { generateVisualReport } from "../services/visualReport";

type ReadinessOptions = {
  json?: boolean;
  output?: string;
  visual?: boolean;
};

export async function readinessCommand(repoPathArg: string | undefined, options: ReadinessOptions): Promise<void> {
  const repoPath = path.resolve(repoPathArg ?? process.cwd());
  const report = await runReadinessReport({ repoPath });
  const repoName = path.basename(repoPath);

  // Generate visual HTML report
  if (options.visual || (options.output && options.output.endsWith('.html'))) {
    const html = generateVisualReport({
      reports: [{ repo: repoName, report }],
      title: `AI Readiness Report: ${repoName}`,
      generatedAt: new Date().toISOString()
    });

    const outputPath = options.output
      ? path.resolve(options.output)
      : path.join(repoPath, 'readiness-report.html');

    await fs.writeFile(outputPath, html, "utf8");
    console.log(chalk.green(`✓ Visual report generated: ${outputPath}`));
    return;
  }

  // Output JSON
  if (options.output && options.output.endsWith('.json')) {
    const outputPath = path.resolve(options.output);
    await fs.writeFile(outputPath, JSON.stringify(report, null, 2), "utf8");
    console.log(chalk.green(`✓ JSON report saved: ${outputPath}`));
  }

  if (options.json) {
    console.log(JSON.stringify(report, null, 2));
    return;
  }

  printReadinessChecklist(report);
}

function printReadinessChecklist(report: ReadinessReport): void {
  console.log(chalk.bold("Readiness report"));
  console.log(`- Repo: ${report.repoPath}`);
  console.log(`- Monorepo: ${report.isMonorepo ? "yes" : "no"}${report.apps.length ? ` (${report.apps.length} apps)` : ""}`);
  console.log(`- Level: ${report.achievedLevel || 1} (${levelName(report.achievedLevel || 1)})`);

  console.log(chalk.bold("\nPillars"));
  for (const pillar of report.pillars) {
    const rate = formatPercent(pillar.passRate);
    const icon = pillar.passRate >= 0.8 ? chalk.green("●") : chalk.yellow("●");
    console.log(`${icon} ${pillar.name}: ${pillar.passed}/${pillar.total} (${rate})`);
  }

  console.log(chalk.bold("\nFix first"));
  const fixes = rankFixes(report.criteria);
  if (!fixes.length) {
    console.log(chalk.green("✔ No failing criteria detected."));
  } else {
    for (const fix of fixes) {
      const impact = colorImpact(fix.impact);
      const effort = colorEffort(fix.effort);
      const scope = fix.scope === "app" ? "app" : "repo";
      const detail = fix.appSummary
        ? ` (${fix.appSummary.passed}/${fix.appSummary.total} apps)`
        : "";
      console.log(`- ${impact} impact / ${effort} effort • ${fix.title}${detail} [${scope}]`);
      if (fix.reason) {
        console.log(`  ${chalk.dim(fix.reason)}`);
      }
      if (fix.appFailures?.length) {
        console.log(`  ${chalk.dim(`Apps: ${fix.appFailures.join(", ")}`)}`);
      }
    }
  }

  if (report.extras.length) {
    console.log(chalk.bold("\nAI readiness extras"));
    for (const extra of report.extras) {
      const icon = extra.status === "pass" ? chalk.green("✔") : chalk.red("✖");
      console.log(`${icon} ${extra.title}`);
    }
  }
}

function rankFixes(criteria: ReadinessCriterionResult[]): ReadinessCriterionResult[] {
  return criteria
    .filter((criterion) => criterion.status === "fail")
    .sort((a, b) => {
      const impactDelta = impactWeight(b.impact) - impactWeight(a.impact);
      if (impactDelta !== 0) return impactDelta;
      return effortWeight(a.effort) - effortWeight(b.effort);
    });
}

function impactWeight(value: "high" | "medium" | "low"): number {
  if (value === "high") return 3;
  if (value === "medium") return 2;
  return 1;
}

function effortWeight(value: "low" | "medium" | "high"): number {
  if (value === "low") return 1;
  if (value === "medium") return 2;
  return 3;
}

function colorImpact(value: "high" | "medium" | "low"): string {
  if (value === "high") return chalk.red("High");
  if (value === "medium") return chalk.yellow("Medium");
  return chalk.green("Low");
}

function colorEffort(value: "low" | "medium" | "high"): string {
  if (value === "high") return chalk.red("High");
  if (value === "medium") return chalk.yellow("Medium");
  return chalk.green("Low");
}

function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

function levelName(level: number): string {
  if (level === 2) return "Documented";
  if (level === 3) return "Standardized";
  if (level === 4) return "Optimized";
  if (level === 5) return "Autonomous";
  return "Functional";
}