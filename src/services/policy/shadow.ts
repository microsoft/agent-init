/**
 * Phase H: Shadow mode and parity gating.
 *
 * Runs the new plugin engine alongside the legacy readiness system,
 * compares outputs, and logs discrepancies. This lets us validate that
 * the new engine produces equivalent results before switching the default.
 *
 * Key design decisions:
 * - Legacy and new engine share the same `ReadinessContext` (no duplicate I/O).
 * - Discrepancies are logged to `.primer-cache/shadow-mode.log`, not stderr.
 * - The function returns the legacy result by default; callers opt into
 *   the new engine via `useNewEngine: true`.
 */
import fs from "fs/promises";
import path from "path";

import { validateCachePath } from "../../utils/fs";
import type { ReadinessReport, ReadinessCriterionResult } from "../readiness";

import { engineReportToReadiness } from "./adapter";
import type { EngineReport } from "./types";

export type ShadowResult = {
  /** The report that should be used by the caller. */
  report: ReadinessReport;
  /** Whether the new engine was used as the primary result source. */
  usedNewEngine: boolean;
  /** Discrepancies found between legacy and new engine outputs. */
  discrepancies: ShadowDiscrepancy[];
};

export type ShadowDiscrepancy = {
  criterionId: string;
  field: string;
  legacyValue: unknown;
  newValue: unknown;
};

/**
 * Compare a legacy ReadinessReport with a new-engine EngineReport and
 * record discrepancies.
 *
 * @returns The chosen report and any discrepancies found.
 */
export function compareShadow(
  legacyReport: ReadinessReport,
  engineReport: EngineReport,
  options: {
    repoPath: string;
    passRateThreshold?: number;
    useNewEngine?: boolean;
  }
): ShadowResult {
  const newReport = engineReportToReadiness(engineReport, {
    repoPath: options.repoPath,
    isMonorepo: legacyReport.isMonorepo,
    apps: legacyReport.apps,
    passRateThreshold: options.passRateThreshold
  });

  // Pre-filter legacy criteria to repo-scope only: the engine's built-in plugin only
  // runs repo-scoped criteria, so area/app-scoped entries would produce false-positive
  // "presence: missing" discrepancies on every comparison.
  const legacyRepoCriteria = legacyReport.criteria.filter((c) => c.scope === "repo");
  const discrepancies = diffCriteria(legacyRepoCriteria, newReport.criteria);

  return {
    report: options.useNewEngine ? newReport : legacyReport,
    usedNewEngine: options.useNewEngine ?? false,
    discrepancies
  };
}

/**
 * Append shadow-mode discrepancies to `.primer-cache/shadow-mode.log`.
 */
export async function writeShadowLog(
  repoPath: string,
  discrepancies: ShadowDiscrepancy[]
): Promise<void> {
  if (discrepancies.length === 0) return;

  const lines = [
    `Shadow mode comparison — ${new Date().toISOString()}`,
    `Discrepancies: ${discrepancies.length}`,
    "",
    ...discrepancies.map(
      (d) =>
        `[${JSON.stringify(d.criterionId)}] ${d.field}: legacy=${JSON.stringify(d.legacyValue)} new=${JSON.stringify(d.newValue)}`
    ),
    ""
  ];

  const cacheDir = path.join(repoPath, ".primer-cache");
  const logPath = validateCachePath(cacheDir, "shadow-mode.log");
  await fs.mkdir(path.dirname(logPath), { recursive: true });
  await fs.appendFile(logPath, lines.join("\n") + "\n");
}

/**
 * Diff criteria between legacy and new engine outputs.
 * Compares id, status, pillar, level, impact, effort, and scope fields.
 */
function diffCriteria(
  legacy: ReadinessCriterionResult[],
  newCriteria: ReadinessCriterionResult[]
): ShadowDiscrepancy[] {
  const discrepancies: ShadowDiscrepancy[] = [];
  const newById = new Map(newCriteria.map((c) => [c.id, c]));

  for (const legacyCriterion of legacy) {
    const newCriterion = newById.get(legacyCriterion.id);
    if (!newCriterion) {
      discrepancies.push({
        criterionId: legacyCriterion.id,
        field: "presence",
        legacyValue: "exists",
        newValue: "missing"
      });
      continue;
    }

    if (legacyCriterion.status !== newCriterion.status) {
      discrepancies.push({
        criterionId: legacyCriterion.id,
        field: "status",
        legacyValue: legacyCriterion.status,
        newValue: newCriterion.status
      });
    }

    if (legacyCriterion.pillar !== newCriterion.pillar) {
      discrepancies.push({
        criterionId: legacyCriterion.id,
        field: "pillar",
        legacyValue: legacyCriterion.pillar,
        newValue: newCriterion.pillar
      });
    }

    if (legacyCriterion.level !== newCriterion.level) {
      discrepancies.push({
        criterionId: legacyCriterion.id,
        field: "level",
        legacyValue: legacyCriterion.level,
        newValue: newCriterion.level
      });
    }

    if (legacyCriterion.impact !== newCriterion.impact) {
      discrepancies.push({
        criterionId: legacyCriterion.id,
        field: "impact",
        legacyValue: legacyCriterion.impact,
        newValue: newCriterion.impact
      });
    }

    if (legacyCriterion.effort !== newCriterion.effort) {
      discrepancies.push({
        criterionId: legacyCriterion.id,
        field: "effort",
        legacyValue: legacyCriterion.effort,
        newValue: newCriterion.effort
      });
    }

    if (legacyCriterion.scope !== newCriterion.scope) {
      discrepancies.push({
        criterionId: legacyCriterion.id,
        field: "scope",
        legacyValue: legacyCriterion.scope,
        newValue: newCriterion.scope
      });
    }
  }

  // Check for criteria in new engine not present in legacy
  const legacyIds = new Set(legacy.map((c) => c.id));
  for (const newCriterion of newCriteria) {
    if (!legacyIds.has(newCriterion.id)) {
      discrepancies.push({
        criterionId: newCriterion.id,
        field: "presence",
        legacyValue: "missing",
        newValue: "exists"
      });
    }
  }

  return discrepancies;
}
