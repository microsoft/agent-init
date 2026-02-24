import { describe, expect, it } from "vitest";

import type { PolicyConfig, ExtraDefinition } from "../policy";
import { compilePolicyConfig } from "../policy/compiler";
import type { PolicyContext, Signal } from "../policy/types";
import type { ReadinessCriterion } from "../readiness";
import { buildCriteria } from "../readiness";

// ─── Helpers ───

function makeCtx(): PolicyContext {
  return {
    repoPath: "/tmp/test",
    rootFiles: ["package.json"],
    cache: new Map()
  };
}

const baseCriteria = buildCriteria();

// ─── compilePolicyConfig ───

describe("compilePolicyConfig", () => {
  it("compiles a minimal policy with name only", () => {
    const config: PolicyConfig = { name: "minimal" };
    const result = compilePolicyConfig(config, baseCriteria);

    expect(result.plugin.meta.name).toBe("minimal");
    expect(result.plugin.meta.sourceType).toBe("json");
    expect(result.plugin.meta.trust).toBe("safe-declarative");
    expect(result.disabledIds).toEqual([]);
    expect(result.passRateThreshold).toBeUndefined();
  });

  it("collects disabled criterion IDs", () => {
    const config: PolicyConfig = {
      name: "disabler",
      criteria: { disable: ["lint-config", "readme"] }
    };
    const result = compilePolicyConfig(config, baseCriteria);
    expect(result.disabledIds).toEqual(["lint-config", "readme"]);
  });

  it("collects disabled extra IDs", () => {
    const config: PolicyConfig = {
      name: "disabler",
      extras: { disable: ["agents-doc"] }
    };
    const result = compilePolicyConfig(config, baseCriteria);
    expect(result.disabledIds).toContain("agents-doc");
  });

  it("combines criteria and extras disabled IDs", () => {
    const config: PolicyConfig = {
      name: "combined",
      criteria: { disable: ["lint-config"] },
      extras: { disable: ["pr-template"] }
    };
    const result = compilePolicyConfig(config, baseCriteria);
    expect(result.disabledIds).toEqual(["lint-config", "pr-template"]);
  });

  it("extracts passRateThreshold", () => {
    const config: PolicyConfig = {
      name: "thresholder",
      thresholds: { passRate: 0.9 }
    };
    const result = compilePolicyConfig(config, baseCriteria);
    expect(result.passRateThreshold).toBe(0.9);
  });

  it("creates afterDetect hook for metadata overrides", async () => {
    const config: PolicyConfig = {
      name: "overrider",
      criteria: {
        override: {
          "lint-config": { title: "Custom Lint Title" }
        }
      }
    };
    const result = compilePolicyConfig(config, baseCriteria);
    expect(result.plugin.afterDetect).toBeDefined();

    // Simulate signals and apply hook
    const signals: Signal[] = [
      {
        id: "lint-config",
        kind: "file",
        status: "detected",
        label: "Original",
        origin: { addedBy: "test" }
      }
    ];
    const patch = await result.plugin.afterDetect!(signals, makeCtx());
    expect(patch).toBeDefined();
    expect(patch!.modify).toHaveLength(1);
    expect(patch!.modify![0].changes.label).toBe("Custom Lint Title");
  });

  it("afterDetect hook produces metadata overrides for pillar/level/impact", async () => {
    const config: PolicyConfig = {
      name: "meta-overrider",
      criteria: {
        override: {
          "lint-config": { pillar: "testing", level: 3, impact: "high" }
        }
      }
    };
    const result = compilePolicyConfig(config, baseCriteria);
    const signals: Signal[] = [
      {
        id: "lint-config",
        kind: "file",
        status: "detected",
        label: "Lint",
        origin: { addedBy: "test" },
        metadata: { pillar: "style-validation", level: 1, checkStatus: "pass" }
      }
    ];
    const patch = await result.plugin.afterDetect!(signals, makeCtx());
    expect(patch).toBeDefined();
    expect(patch!.modify).toHaveLength(1);
    const meta = patch!.modify![0].changes.metadata as Record<string, unknown>;
    expect(meta.pillar).toBe("testing");
    expect(meta.level).toBe(3);
    expect(meta.impact).toBe("high");
  });

  it("afterDetect hook skips non-existent signal IDs", async () => {
    const config: PolicyConfig = {
      name: "overrider",
      criteria: {
        override: {
          "nonexistent-id": { title: "Nope" }
        }
      }
    };
    const result = compilePolicyConfig(config, baseCriteria);
    const signals: Signal[] = [
      {
        id: "lint-config",
        kind: "file",
        status: "detected",
        label: "Original",
        origin: { addedBy: "test" }
      }
    ];
    const patch = await result.plugin.afterDetect!(signals, makeCtx());
    expect(patch).toBeUndefined();
  });

  it("creates detectors and recommenders from criteria.add", () => {
    const criterion: ReadinessCriterion = {
      id: "custom-check",
      title: "Custom Check",
      pillar: "code-quality",
      level: 1,
      scope: "repo",
      impact: "medium",
      effort: "low",
      check: async () => ({ status: "pass" })
    };
    const config: PolicyConfig = {
      name: "adder",
      criteria: { add: [criterion] }
    };
    const result = compilePolicyConfig(config, baseCriteria);
    expect(result.plugin.detectors).toHaveLength(1);
    expect(result.plugin.detectors![0].id).toBe("custom-check");
    expect(result.plugin.recommenders).toHaveLength(1);
    expect(result.plugin.recommenders![0].id).toBe("custom-check-rec");
  });

  it("compiled detector emits a signal from a passing criterion", async () => {
    const criterion: ReadinessCriterion = {
      id: "my-criterion",
      title: "My Title",
      pillar: "documentation",
      level: 1,
      scope: "repo",
      impact: "high",
      effort: "low",
      check: async () => ({ status: "pass", reason: "All good" })
    };
    const config: PolicyConfig = {
      name: "checker",
      criteria: { add: [criterion] }
    };
    const result = compilePolicyConfig(config, baseCriteria);
    const signal = await result.plugin.detectors![0].detect(makeCtx());
    const s = Array.isArray(signal) ? signal[0] : signal;
    expect(s.id).toBe("my-criterion");
    expect(s.label).toBe("My Title");
    expect(s.origin.addedBy).toBe("compiled:my-criterion");
    expect(s.metadata).toHaveProperty("checkStatus", "pass");
  });

  it("compiled recommender emits recommendation for failing criterion", async () => {
    const signals: Signal[] = [
      {
        id: "my-criterion",
        kind: "file",
        status: "detected",
        label: "My Title",
        reason: "Something failed",
        origin: { addedBy: "compiled:my-criterion" },
        metadata: { checkStatus: "fail" }
      }
    ];
    const criterion: ReadinessCriterion = {
      id: "my-criterion",
      title: "My Title",
      pillar: "documentation",
      level: 1,
      scope: "repo",
      impact: "high",
      effort: "low",
      check: async () => ({ status: "fail", reason: "Something failed" })
    };
    const config: PolicyConfig = {
      name: "checker",
      criteria: { add: [criterion] }
    };
    const result = compilePolicyConfig(config, baseCriteria);
    const rec = await result.plugin.recommenders![0].recommend(signals, makeCtx());
    const r = Array.isArray(rec) ? rec[0] : rec;
    expect(r.id).toBe("my-criterion-fix");
    expect(r.impact).toBe("high");
  });

  it("compiled recommender uses runtime impact from signal.metadata (afterDetect override)", async () => {
    // Simulate an afterDetect hook that overrides impact to "medium" in signal metadata
    const signals: Signal[] = [
      {
        id: "my-criterion",
        kind: "file",
        status: "detected",
        label: "My Title",
        reason: "Something failed",
        origin: { addedBy: "compiled:my-criterion" },
        // afterDetect has patched impact to "medium" (down from original "high")
        metadata: { checkStatus: "fail", impact: "medium" }
      }
    ];
    const criterion: ReadinessCriterion = {
      id: "my-criterion",
      title: "My Title",
      pillar: "documentation",
      level: 1,
      scope: "repo",
      impact: "high", // original compile-time impact
      effort: "low",
      check: async () => ({ status: "fail" })
    };
    const config: PolicyConfig = {
      name: "checker",
      criteria: { add: [criterion] }
    };
    const result = compilePolicyConfig(config, baseCriteria);
    const rec = await result.plugin.recommenders![0].recommend(signals, makeCtx());
    const r = Array.isArray(rec) ? rec[0] : rec;
    // Must use runtime impact "medium", not compile-time "high"
    expect(r.impact).toBe("medium");
  });

  it("compiled recommender returns empty for passing criterion", async () => {
    const signals: Signal[] = [
      {
        id: "my-criterion",
        kind: "file",
        status: "detected",
        label: "My Title",
        origin: { addedBy: "compiled:my-criterion" },
        metadata: { checkStatus: "pass" }
      }
    ];
    const criterion: ReadinessCriterion = {
      id: "my-criterion",
      title: "My Title",
      pillar: "documentation",
      level: 1,
      scope: "repo",
      impact: "high",
      effort: "low",
      check: async () => ({ status: "pass" })
    };
    const config: PolicyConfig = {
      name: "checker",
      criteria: { add: [criterion] }
    };
    const result = compilePolicyConfig(config, baseCriteria);
    const rec = await result.plugin.recommenders![0].recommend(signals, makeCtx());
    const recs = Array.isArray(rec) ? rec : [rec];
    expect(recs).toHaveLength(0);
  });

  it("has no detectors/recommenders/hooks when policy only disables", () => {
    const config: PolicyConfig = {
      name: "disabler-only",
      criteria: { disable: ["lint-config"] }
    };
    const result = compilePolicyConfig(config, baseCriteria);
    expect(result.plugin.detectors).toBeUndefined();
    expect(result.plugin.recommenders).toBeUndefined();
    expect(result.plugin.afterDetect).toBeUndefined();
  });

  it("creates detectors and recommenders from extras.add", () => {
    const extra: ExtraDefinition = {
      id: "custom-extra",
      title: "Custom Extra",
      check: async () => ({ status: "pass", reason: "OK" })
    };
    const config: PolicyConfig = {
      name: "extra-adder",
      extras: { add: [extra] }
    };
    const result = compilePolicyConfig(config, baseCriteria);
    expect(result.plugin.detectors).toHaveLength(1);
    expect(result.plugin.detectors![0].id).toBe("custom-extra");
    expect(result.plugin.detectors![0].kind).toBe("custom");
    expect(result.plugin.recommenders).toHaveLength(1);
    expect(result.plugin.recommenders![0].id).toBe("custom-extra-rec");
  });

  it("compiled extra recommender emits low-impact recommendation on fail", async () => {
    const signals: Signal[] = [
      {
        id: "custom-extra",
        kind: "custom",
        status: "detected",
        label: "Custom Extra",
        reason: "Missing thing",
        origin: { addedBy: "compiled:custom-extra" },
        metadata: { checkStatus: "fail" }
      }
    ];
    const extra: ExtraDefinition = {
      id: "custom-extra",
      title: "Custom Extra",
      check: async () => ({ status: "fail", reason: "Missing thing" })
    };
    const config: PolicyConfig = {
      name: "extra-adder",
      extras: { add: [extra] }
    };
    const result = compilePolicyConfig(config, baseCriteria);
    const rec = await result.plugin.recommenders![0].recommend(signals, makeCtx());
    const r = Array.isArray(rec) ? rec[0] : rec;
    expect(r.id).toBe("custom-extra-fix");
    expect(r.impact).toBe("low");
  });
});
