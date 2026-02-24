import fs from "fs/promises";
import os from "os";
import path from "path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { compareShadow, writeShadowLog } from "../policy/shadow";
import type { EngineReport } from "../policy/types";
import type { ReadinessReport, ReadinessCriterionResult } from "../readiness";

function makeLegacyReport(criteria: ReadinessCriterionResult[] = []): ReadinessReport {
  return {
    repoPath: "/tmp/test",
    generatedAt: "2025-01-01T00:00:00.000Z",
    isMonorepo: false,
    apps: [],
    pillars: [],
    levels: [],
    achievedLevel: 0,
    criteria,
    extras: []
  };
}

function makeEngineReport(overrides: Partial<EngineReport> = {}): EngineReport {
  return {
    signals: [],
    recommendations: [],
    policyWarnings: [],
    score: 1,
    grade: "A",
    pluginChain: ["builtin"],
    ...overrides
  };
}

function makeCriterion(id: string, status: "pass" | "fail" | "skip"): ReadinessCriterionResult {
  return {
    id,
    title: `Criterion ${id}`,
    pillar: "documentation",
    level: 1,
    scope: "repo",
    impact: "high",
    effort: "low",
    status
  };
}

describe("compareShadow", () => {
  it("returns legacy report by default", () => {
    const legacy = makeLegacyReport();
    const engine = makeEngineReport();
    const result = compareShadow(legacy, engine, { repoPath: "/tmp/test" });
    expect(result.usedNewEngine).toBe(false);
    expect(result.report).toBe(legacy);
  });

  it("returns new engine report when useNewEngine is true", () => {
    const legacy = makeLegacyReport();
    const engine = makeEngineReport();
    const result = compareShadow(legacy, engine, { repoPath: "/tmp/test", useNewEngine: true });
    expect(result.usedNewEngine).toBe(true);
    expect(result.report).not.toBe(legacy);
    expect(result.report.repoPath).toBe("/tmp/test");
  });

  it("reports no discrepancies when both engines agree", () => {
    const legacy = makeLegacyReport([makeCriterion("readme", "pass")]);
    const engine = makeEngineReport({
      signals: [
        {
          id: "readme",
          kind: "file",
          status: "detected",
          label: "README present",
          origin: { addedBy: "builtin" },
          metadata: {
            pillar: "documentation",
            level: 1,
            scope: "repo",
            impact: "high",
            effort: "low",
            checkStatus: "pass"
          }
        }
      ]
    });
    const result = compareShadow(legacy, engine, { repoPath: "/tmp/test" });
    expect(result.discrepancies).toHaveLength(0);
  });

  it("detects status discrepancy", () => {
    const legacy = makeLegacyReport([makeCriterion("readme", "pass")]);
    const engine = makeEngineReport({
      signals: [
        {
          id: "readme",
          kind: "file",
          status: "detected",
          label: "README present",
          origin: { addedBy: "builtin" },
          metadata: {
            pillar: "documentation",
            level: 1,
            scope: "repo",
            impact: "high",
            effort: "low",
            checkStatus: "fail"
          }
        }
      ]
    });
    const result = compareShadow(legacy, engine, { repoPath: "/tmp/test" });
    expect(result.discrepancies).toHaveLength(1);
    expect(result.discrepancies[0].criterionId).toBe("readme");
    expect(result.discrepancies[0].field).toBe("status");
    expect(result.discrepancies[0].legacyValue).toBe("pass");
    expect(result.discrepancies[0].newValue).toBe("fail");
  });

  it("detects missing criterion in new engine", () => {
    const legacy = makeLegacyReport([makeCriterion("custom-thing", "pass")]);
    const engine = makeEngineReport();
    const result = compareShadow(legacy, engine, { repoPath: "/tmp/test" });
    expect(result.discrepancies).toHaveLength(1);
    expect(result.discrepancies[0].field).toBe("presence");
    expect(result.discrepancies[0].newValue).toBe("missing");
  });

  it("detects extra criterion in new engine", () => {
    const legacy = makeLegacyReport();
    const engine = makeEngineReport({
      signals: [
        {
          id: "new-criterion",
          kind: "file",
          status: "detected",
          label: "New",
          origin: { addedBy: "builtin" },
          metadata: {
            pillar: "testing",
            level: 1,
            scope: "repo",
            impact: "high",
            effort: "low",
            checkStatus: "pass"
          }
        }
      ]
    });
    const result = compareShadow(legacy, engine, { repoPath: "/tmp/test" });
    expect(result.discrepancies).toHaveLength(1);
    expect(result.discrepancies[0].field).toBe("presence");
    expect(result.discrepancies[0].legacyValue).toBe("missing");
  });

  it("detects pillar discrepancy", () => {
    const legacy = makeLegacyReport([
      {
        ...makeCriterion("readme", "pass"),
        pillar: "documentation"
      }
    ]);
    const engine = makeEngineReport({
      signals: [
        {
          id: "readme",
          kind: "file",
          status: "detected",
          label: "README present",
          origin: { addedBy: "builtin" },
          metadata: {
            pillar: "ai-tooling",
            level: 1,
            scope: "repo",
            impact: "high",
            effort: "low",
            checkStatus: "pass"
          }
        }
      ]
    });
    const result = compareShadow(legacy, engine, { repoPath: "/tmp/test" });
    const pillarDisc = result.discrepancies.find((d) => d.field === "pillar");
    expect(pillarDisc).toBeDefined();
    expect(pillarDisc!.legacyValue).toBe("documentation");
    expect(pillarDisc!.newValue).toBe("ai-tooling");
  });

  it("detects level discrepancy", () => {
    const legacy = makeLegacyReport([
      {
        ...makeCriterion("readme", "pass"),
        level: 1
      }
    ]);
    const engine = makeEngineReport({
      signals: [
        {
          id: "readme",
          kind: "file",
          status: "detected",
          label: "README present",
          origin: { addedBy: "builtin" },
          metadata: {
            pillar: "documentation",
            level: 3,
            scope: "repo",
            impact: "high",
            effort: "low",
            checkStatus: "pass"
          }
        }
      ]
    });
    const result = compareShadow(legacy, engine, { repoPath: "/tmp/test" });
    const levelDisc = result.discrepancies.find((d) => d.field === "level");
    expect(levelDisc).toBeDefined();
    expect(levelDisc!.legacyValue).toBe(1);
    expect(levelDisc!.newValue).toBe(3);
  });

  it("detects impact discrepancy", () => {
    const legacy = makeLegacyReport([{ ...makeCriterion("readme", "pass"), impact: "high" }]);
    const engine = makeEngineReport({
      signals: [
        {
          id: "readme",
          kind: "file",
          status: "detected",
          label: "README present",
          origin: { addedBy: "builtin" },
          metadata: {
            pillar: "documentation",
            level: 1,
            scope: "repo",
            impact: "medium",
            effort: "low",
            checkStatus: "pass"
          }
        }
      ]
    });
    const result = compareShadow(legacy, engine, { repoPath: "/tmp/test" });
    const disc = result.discrepancies.find((d) => d.field === "impact");
    expect(disc).toBeDefined();
    expect(disc!.legacyValue).toBe("high");
    expect(disc!.newValue).toBe("medium");
  });

  it("detects effort discrepancy", () => {
    const legacy = makeLegacyReport([{ ...makeCriterion("readme", "pass"), effort: "low" }]);
    const engine = makeEngineReport({
      signals: [
        {
          id: "readme",
          kind: "file",
          status: "detected",
          label: "README present",
          origin: { addedBy: "builtin" },
          metadata: {
            pillar: "documentation",
            level: 1,
            scope: "repo",
            impact: "high",
            effort: "high",
            checkStatus: "pass"
          }
        }
      ]
    });
    const result = compareShadow(legacy, engine, { repoPath: "/tmp/test" });
    const disc = result.discrepancies.find((d) => d.field === "effort");
    expect(disc).toBeDefined();
    expect(disc!.legacyValue).toBe("low");
    expect(disc!.newValue).toBe("high");
  });

  it("filters area-scoped legacy criteria before comparison to avoid false-positive presence discrepancies", () => {
    const areaCriterion: ReadinessCriterionResult = {
      ...makeCriterion("area-readme", "skip"),
      scope: "area"
    };
    // Legacy report has an area-scoped criterion; engine has none (engine only runs repo-scoped)
    const legacy = makeLegacyReport([makeCriterion("readme", "pass"), areaCriterion]);
    const engine = makeEngineReport({
      signals: [
        {
          id: "readme",
          kind: "file",
          status: "detected",
          label: "README present",
          origin: { addedBy: "builtin" },
          metadata: {
            pillar: "documentation",
            level: 1,
            scope: "repo",
            impact: "high",
            effort: "low",
            checkStatus: "pass"
          }
        }
      ]
    });
    const result = compareShadow(legacy, engine, { repoPath: "/tmp/test" });
    // area-readme must not produce a "presence: missing" discrepancy
    const presenceDiscs = result.discrepancies.filter((d) => d.field === "presence");
    expect(presenceDiscs).toHaveLength(0);
    expect(result.discrepancies).toHaveLength(0);
  });

  it("asserts both values for extra criterion in new engine", () => {
    const legacy = makeLegacyReport();
    const engine = makeEngineReport({
      signals: [
        {
          id: "new-criterion",
          kind: "file",
          status: "detected",
          label: "New",
          origin: { addedBy: "builtin" },
          metadata: {
            pillar: "testing",
            level: 1,
            scope: "repo",
            impact: "high",
            effort: "low",
            checkStatus: "pass"
          }
        }
      ]
    });
    const result = compareShadow(legacy, engine, { repoPath: "/tmp/test" });
    expect(result.discrepancies).toHaveLength(1);
    expect(result.discrepancies[0].legacyValue).toBe("missing");
    expect(result.discrepancies[0].newValue).toBe("exists");
  });
});

describe("writeShadowLog", () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "primer-shadow-"));
  });

  afterEach(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  it("is a no-op when discrepancies array is empty", async () => {
    await writeShadowLog(tmpDir, []);
    const logPath = path.join(tmpDir, ".primer-cache", "shadow-mode.log");
    let exists = false;
    try {
      await fs.access(logPath);
      exists = true;
    } catch {
      // expected — file should not be created
    }
    expect(exists).toBe(false);
  });

  it("creates the log file and appends discrepancy details", async () => {
    const discrepancies = [
      { criterionId: "readme", field: "status", legacyValue: "pass", newValue: "fail" }
    ];
    await writeShadowLog(tmpDir, discrepancies);
    const logPath = path.join(tmpDir, ".primer-cache", "shadow-mode.log");
    const content = await fs.readFile(logPath, "utf-8");
    expect(content).toContain('["readme"] status');
    expect(content).toContain('"pass"');
    expect(content).toContain('"fail"');
  });

  it("appends on successive calls (does not overwrite)", async () => {
    const d = [{ criterionId: "readme", field: "status", legacyValue: "pass", newValue: "fail" }];
    await writeShadowLog(tmpDir, d);
    await writeShadowLog(tmpDir, d);
    const logPath = path.join(tmpDir, ".primer-cache", "shadow-mode.log");
    const content = await fs.readFile(logPath, "utf-8");
    const matches = content.match(/\["readme"\] status/g) ?? [];
    expect(matches).toHaveLength(2);
  });

  it("creates the .primer-cache directory if it does not exist", async () => {
    // No .primer-cache dir created — writeShadowLog must mkdir it
    const discrepancies = [
      {
        criterionId: "codeowners",
        field: "pillar",
        legacyValue: "security-governance",
        newValue: "documentation"
      }
    ];
    await writeShadowLog(tmpDir, discrepancies);
    const logPath = path.join(tmpDir, ".primer-cache", "shadow-mode.log");
    const stat = await fs.stat(logPath);
    expect(stat.isFile()).toBe(true);
  });
});
