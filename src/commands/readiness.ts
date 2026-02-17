import fs from "fs/promises";
import path from "path";

import chalk from "chalk";

import type {
  ReadinessReport,
  ReadinessCriterionResult,
  AreaReadinessReport
} from "../services/readiness";
import { runReadinessReport, groupPillars } from "../services/readiness";
import { parsePolicySources } from "../services/policy";
import { generateVisualReport } from "../services/visualReport";
import type { CommandResult } from "../utils/output";
import { outputResult, outputError, shouldLog } from "../utils/output";

type ReadinessOptions = {
  json?: boolean;
  quiet?: boolean;
  output?: string;
  visual?: boolean;
  perArea?: boolean;
  policy?: string;
};

export async function readinessCommand(
  repoPathArg: string | undefined,
  options: ReadinessOptions
): Promise<void> {
  const repoPath = path.resolve(repoPathArg ?? process.cwd());
  const repoName = path.basename(repoPath);

  let report: ReadinessReport;
  try {
    const policies = parsePolicySources(options.policy);
    report = await runReadinessReport({ repoPath, perArea: options.perArea, policies });
  } catch (error) {
    outputError(
      `Failed to generate readiness report: ${error instanceof Error ? error.message : String(error)}`,
      Boolean(options.json)
    );
    return;
  }

  // Generate visual HTML report
  if (options.visual || (options.output && options.output.endsWith(".html"))) {
    const html = generateVisualReport({
      reports: [{ repo: repoName, report }],
      title: `AI Readiness Report: ${repoName}`,
      generatedAt: new Date().toISOString()
    });

    const outputPath = options.output
      ? path.resolve(options.output)
      : path.join(repoPath, "readiness-report.html");

    await fs.writeFile(outputPath, html, "utf8");
    if (shouldLog(options)) {
      process.stderr.write(chalk.green(`✓ Visual report generated: ${outputPath}`) + "\n");
    }
    return;
  }

  // Output to JSON file
  if (options.output && options.output.endsWith(".json")) {
    const outputPath = path.resolve(options.output);
    await fs.writeFile(outputPath, JSON.stringify(report, null, 2), "utf8");
    if (shouldLog(options)) {
      process.stderr.write(chalk.green(`✓ JSON report saved: ${outputPath}`) + "\n");
    }
    return;
  }

  if (options.json) {
    const result: CommandResult<ReadinessReport> = {
      ok: true,
      status: "success",
      data: report
    };
    outputResult(result, true);
    return;
  }

  if (shouldLog(options)) {
    printReadinessChecklist(report);
  }
}

function printReadinessChecklist(report: ReadinessReport): void {
  const log = (msg: string) => process.stderr.write(msg + "\n");
  log(chalk.bold("Readiness report"));
  log(`- Repo: ${report.repoPath}`);
  log(
    `- Monorepo: ${report.isMonorepo ? "yes" : "no"}${report.apps.length ? ` (${report.apps.length} apps)` : ""}`
  );
  log(`- Level: ${report.achievedLevel || 1} (${levelName(report.achievedLevel || 1)})`);

  const groups = groupPillars(report.pillars);
  for (const { label, pillars } of groups) {
    if (pillars.length === 0) continue;
    log(chalk.bold(`\n${label}`));
    for (const pillar of pillars) {
      const rate = formatPercent(pillar.passRate);
      const icon = pillar.passRate >= 0.8 ? chalk.green("●") : chalk.yellow("●");
      log(`${icon} ${pillar.name}: ${pillar.passed}/${pillar.total} (${rate})`);
    }
  }

  log(chalk.bold("\nFix first"));
  const fixes = rankFixes(report.criteria);
  if (!fixes.length) {
    log(chalk.green("✔ No failing criteria detected."));
  } else {
    for (const fix of fixes) {
      const impact = colorImpact(fix.impact);
      const effort = colorEffort(fix.effort);
      const scope = fix.scope === "app" ? "app" : "repo";
      const detail = fix.appSummary
        ? ` (${fix.appSummary.passed}/${fix.appSummary.total} apps)`
        : "";
      log(`- ${impact} impact / ${effort} effort • ${fix.title}${detail} [${scope}]`);
      if (fix.reason) {
        log(`  ${chalk.dim(fix.reason)}`);
      }
      if (fix.appFailures?.length) {
        log(`  ${chalk.dim(`Apps: ${fix.appFailures.join(", ")}`)}`);
      }
    }
  }

  if (report.extras.length) {
    log(chalk.bold("\nAI readiness extras"));
    for (const extra of report.extras) {
      const icon = extra.status === "pass" ? chalk.green("✔") : chalk.red("✖");
      log(`${icon} ${extra.title}`);
    }
  }

  if (report.areaReports?.length) {
    printAreaBreakdown(report.areaReports);
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

function printAreaBreakdown(areaReports: AreaReadinessReport[]): void {
  const log = (msg: string) => process.stderr.write(msg + "\n");
  log(chalk.bold("\nPer-area breakdown"));
  for (const ar of areaReports) {
    // Sum across all pillar summaries for this area
    const passed = ar.pillars.reduce((sum, p) => sum + p.passed, 0);
    const total = ar.pillars.reduce((sum, p) => sum + p.total, 0);
    const pct = total ? Math.round((passed / total) * 100) : 0;
    const icon = total > 0 && passed / total >= 0.8 ? chalk.green("●") : chalk.yellow("●");
    const source = ar.area.source === "config" ? chalk.dim(" (config)") : "";
    log(`${icon} ${ar.area.name}${source}: ${passed}/${total} (${pct}%)`);

    const failures = ar.criteria.filter((c) => c.status === "fail");
    for (const f of failures) {
      log(`  ${chalk.red("✖")} ${f.title}${f.reason ? ` — ${chalk.dim(f.reason)}` : ""}`);
    }
  }
}
