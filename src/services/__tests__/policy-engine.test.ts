import { describe, expect, it, vi } from "vitest";

import { executePlugins } from "../policy/engine";
import type {
  PolicyPlugin,
  PolicyContext,
  Signal,
  Recommendation,
  Detector,
  Recommender
} from "../policy/types";

// ─── Helpers ───

function makeCtx(overrides?: Partial<PolicyContext>): PolicyContext {
  return {
    repoPath: "/tmp/test-repo",
    rootFiles: ["README.md", "package.json"],
    cache: new Map(),
    ...overrides
  };
}

function makeDetector(id: string, result: Signal | Signal[]): Detector {
  return {
    id,
    kind: "file",
    detect: vi.fn().mockResolvedValue(result)
  };
}

function makeRecommender(id: string, result: Recommendation | Recommendation[]): Recommender {
  return {
    id,
    recommend: vi.fn().mockResolvedValue(result)
  };
}

function makePlugin(
  overrides: Partial<PolicyPlugin> & { meta: PolicyPlugin["meta"] }
): PolicyPlugin {
  return { ...overrides };
}

const META = {
  name: "test-plugin",
  sourceType: "builtin" as const,
  trust: "trusted-code" as const
};

// ─── executePlugins ───

describe("executePlugins", () => {
  it("runs detectors and recommenders through the full pipeline", async () => {
    const signal: Signal = {
      id: "readme-missing",
      kind: "file",
      status: "detected",
      label: "README missing",
      origin: { addedBy: "test-plugin" }
    };
    const rec: Recommendation = {
      id: "add-readme",
      signalId: "readme-missing",
      impact: "high",
      message: "Add a README.md",
      origin: { addedBy: "test-plugin" }
    };

    const plugin = makePlugin({
      meta: META,
      detectors: [makeDetector("readme-check", signal)],
      recommenders: [makeRecommender("readme-rec", rec)]
    });

    const report = await executePlugins([plugin], makeCtx());

    expect(report.signals).toHaveLength(1);
    expect(report.signals[0].id).toBe("readme-missing");
    expect(report.recommendations).toHaveLength(1);
    expect(report.recommendations[0].id).toBe("add-readme");
    expect(report.pluginChain).toEqual(["test-plugin"]);
    expect(report.score).toBeLessThan(1);
  });

  it("executes multiple plugins in source order", async () => {
    const order: string[] = [];

    const plugin1 = makePlugin({
      meta: { ...META, name: "plugin-1" },
      detectors: [
        {
          id: "d1",
          kind: "file",
          detect: async () => {
            order.push("detect-1");
            return {
              id: "s1",
              kind: "file",
              status: "detected",
              label: "S1",
              origin: { addedBy: "plugin-1" }
            };
          }
        }
      ]
    });

    const plugin2 = makePlugin({
      meta: { ...META, name: "plugin-2" },
      detectors: [
        {
          id: "d2",
          kind: "file",
          detect: async () => {
            order.push("detect-2");
            return {
              id: "s2",
              kind: "file",
              status: "detected",
              label: "S2",
              origin: { addedBy: "plugin-2" }
            };
          }
        }
      ]
    });

    await executePlugins([plugin1, plugin2], makeCtx());
    expect(order).toEqual(["detect-1", "detect-2"]);
  });

  it("applies afterDetect hook patches", async () => {
    const signal: Signal = {
      id: "s1",
      kind: "file",
      status: "detected",
      label: "Original",
      origin: { addedBy: "base" }
    };

    const plugin = makePlugin({
      meta: META,
      detectors: [makeDetector("d1", signal)],
      afterDetect: async () => ({
        modify: [{ id: "s1", changes: { label: "Patched" } }]
      }),
      recommenders: [
        {
          id: "r1",
          recommend: async (signals) => {
            // Verify recommender sees the patched signal
            expect(signals[0].label).toBe("Patched");
            return [];
          }
        }
      ]
    });

    const report = await executePlugins([plugin], makeCtx());
    expect(report.signals[0].label).toBe("Patched");
    expect(report.signals[0].origin.modifiedBy).toEqual(["test-plugin"]);
  });

  it("applies afterRecommend hook patches", async () => {
    const signal: Signal = {
      id: "s1",
      kind: "file",
      status: "detected",
      label: "S1",
      origin: { addedBy: "base" }
    };
    const rec: Recommendation = {
      id: "r1",
      signalId: "s1",
      impact: "low",
      message: "Original",
      origin: { addedBy: "base" }
    };

    const plugin = makePlugin({
      meta: META,
      detectors: [makeDetector("d1", signal)],
      recommenders: [makeRecommender("rec1", rec)],
      afterRecommend: async () => ({
        modify: [{ id: "r1", changes: { impact: "critical" } }]
      })
    });

    const report = await executePlugins([plugin], makeCtx());
    expect(report.recommendations[0].impact).toBe("critical");
  });

  it("skips disabled rule IDs for detectors and recommenders", async () => {
    const plugin = makePlugin({
      meta: META,
      detectors: [
        makeDetector("enabled-d", {
          id: "s1",
          kind: "file",
          status: "detected",
          label: "S1",
          origin: { addedBy: "test" }
        }),
        makeDetector("disabled-d", {
          id: "s2",
          kind: "file",
          status: "detected",
          label: "S2",
          origin: { addedBy: "test" }
        })
      ],
      recommenders: [
        makeRecommender("enabled-r", {
          id: "r1",
          signalId: "s1",
          impact: "medium",
          message: "R1",
          origin: { addedBy: "test" }
        }),
        makeRecommender("disabled-r", {
          id: "r2",
          signalId: "s2",
          impact: "medium",
          message: "R2",
          origin: { addedBy: "test" }
        })
      ]
    });

    const report = await executePlugins([plugin], makeCtx(), {
      disabledRuleIds: new Set(["disabled-d", "disabled-r"])
    });

    expect(report.signals).toHaveLength(1);
    expect(report.signals[0].id).toBe("s1");
    expect(report.recommendations).toHaveLength(1);
    expect(report.recommendations[0].id).toBe("r1");
  });

  it("resolves supersedes in final output", async () => {
    const signal: Signal = {
      id: "s1",
      kind: "file",
      status: "detected",
      label: "S1",
      origin: { addedBy: "test" }
    };
    const recs: Recommendation[] = [
      { id: "r1", signalId: "s1", impact: "low", message: "Base", origin: { addedBy: "base" } },
      {
        id: "r2",
        signalId: "s1",
        impact: "high",
        message: "Override",
        origin: { addedBy: "override" },
        supersedes: ["r1"]
      }
    ];

    const plugin = makePlugin({
      meta: META,
      detectors: [makeDetector("d1", signal)],
      recommenders: [makeRecommender("rec1", recs)]
    });

    const report = await executePlugins([plugin], makeCtx());
    expect(report.recommendations).toHaveLength(1);
    expect(report.recommendations[0].id).toBe("r2");
  });

  it("records warnings for caught errors and continues", async () => {
    const plugin = makePlugin({
      meta: META,
      detectors: [
        {
          id: "failing",
          kind: "file",
          detect: async () => {
            throw new Error("disk read failed");
          }
        }
      ],
      onError: () => true // continue on error
    });

    const report = await executePlugins([plugin], makeCtx());
    expect(report.policyWarnings).toHaveLength(1);
    expect(report.policyWarnings[0].pluginName).toBe("test-plugin");
    expect(report.policyWarnings[0].stage).toBe("detect");
    expect(report.policyWarnings[0].message).toBe("disk read failed");
  });

  it("returns empty report for no plugins", async () => {
    const report = await executePlugins([], makeCtx());
    expect(report.signals).toEqual([]);
    expect(report.recommendations).toEqual([]);
    expect(report.score).toBe(1);
    expect(report.grade).toBe("A");
    expect(report.pluginChain).toEqual([]);
  });

  it("shares the same context cache across plugins", async () => {
    const plugin1 = makePlugin({
      meta: { ...META, name: "writer" },
      detectors: [
        {
          id: "d1",
          kind: "custom",
          detect: async (ctx) => {
            ctx.cache.set("shared-key", 42);
            return {
              id: "s1",
              kind: "custom",
              status: "detected",
              label: "S1",
              origin: { addedBy: "writer" }
            };
          }
        }
      ]
    });

    const plugin2 = makePlugin({
      meta: { ...META, name: "reader" },
      detectors: [
        {
          id: "d2",
          kind: "custom",
          detect: async (ctx) => {
            const val = ctx.cache.get("shared-key");
            return {
              id: "s2",
              kind: "custom",
              status: val === 42 ? "detected" : "error",
              label: "S2",
              origin: { addedBy: "reader" }
            };
          }
        }
      ]
    });

    const report = await executePlugins([plugin1, plugin2], makeCtx());
    expect(report.signals[1].status).toBe("detected");
  });

  it("produces deterministic output for identical inputs", async () => {
    const signal: Signal = {
      id: "s1",
      kind: "file",
      status: "detected",
      label: "S1",
      origin: { addedBy: "test" }
    };
    const rec: Recommendation = {
      id: "r1",
      signalId: "s1",
      impact: "medium",
      message: "Fix it",
      origin: { addedBy: "test" }
    };

    const makeRun = () => {
      const plugin = makePlugin({
        meta: META,
        detectors: [makeDetector("d1", signal)],
        recommenders: [makeRecommender("rec1", rec)]
      });
      return executePlugins([plugin], makeCtx());
    };

    const [report1, report2] = await Promise.all([makeRun(), makeRun()]);
    expect(report1.signals).toEqual(report2.signals);
    expect(report1.recommendations).toEqual(report2.recommendations);
    expect(report1.score).toBe(report2.score);
    expect(report1.grade).toBe(report2.grade);
  });

  it("applies beforeRecommend hook patches visible to recommenders", async () => {
    const signal: Signal = {
      id: "s1",
      kind: "file",
      status: "detected",
      label: "Original",
      origin: { addedBy: "base" }
    };

    const plugin = makePlugin({
      meta: META,
      detectors: [makeDetector("d1", signal)],
      beforeRecommend: async () => ({
        modify: [{ id: "s1", changes: { label: "Pre-recommend patched" } }]
      }),
      recommenders: [
        {
          id: "r1",
          recommend: async (signals) => {
            expect(signals[0].label).toBe("Pre-recommend patched");
            return [];
          }
        }
      ]
    });

    const report = await executePlugins([plugin], makeCtx());
    expect(report.signals[0].label).toBe("Pre-recommend patched");
    expect(report.signals[0].origin.modifiedBy).toEqual(["test-plugin"]);
  });

  it("aborts plugin stage when onError returns false", async () => {
    const secondDetect = vi.fn().mockResolvedValue({
      id: "s2",
      kind: "file",
      status: "detected",
      label: "S2",
      origin: { addedBy: "test" }
    });

    const plugin = makePlugin({
      meta: META,
      detectors: [
        {
          id: "failing",
          kind: "file",
          detect: async () => {
            throw new Error("abort trigger");
          }
        },
        {
          id: "skipped",
          kind: "file",
          detect: secondDetect
        }
      ],
      onError: () => false // abort
    });

    const report = await executePlugins([plugin], makeCtx());
    expect(secondDetect).not.toHaveBeenCalled();
    expect(report.policyWarnings).toHaveLength(1);
    expect(report.policyWarnings[0].message).toBe("abort trigger");
  });

  it("handles detectors returning arrays", async () => {
    const signals: Signal[] = [
      { id: "s1", kind: "file", status: "detected", label: "S1", origin: { addedBy: "test" } },
      { id: "s2", kind: "git", status: "detected", label: "S2", origin: { addedBy: "test" } }
    ];

    const plugin = makePlugin({
      meta: META,
      detectors: [makeDetector("multi", signals)]
    });

    const report = await executePlugins([plugin], makeCtx());
    expect(report.signals).toHaveLength(2);
    expect(report.signals.map((s) => s.id)).toEqual(["s1", "s2"]);
  });

  it("handles recommenders returning arrays", async () => {
    const signal: Signal = {
      id: "s1",
      kind: "file",
      status: "detected",
      label: "S1",
      origin: { addedBy: "test" }
    };
    const recs: Recommendation[] = [
      { id: "r1", signalId: "s1", impact: "medium", message: "R1", origin: { addedBy: "test" } },
      { id: "r2", signalId: "s1", impact: "low", message: "R2", origin: { addedBy: "test" } }
    ];

    const plugin = makePlugin({
      meta: META,
      detectors: [makeDetector("d1", signal)],
      recommenders: [makeRecommender("multi-rec", recs)]
    });

    const report = await executePlugins([plugin], makeCtx());
    expect(report.recommendations).toHaveLength(2);
  });

  it("records warnings for recommender errors and continues", async () => {
    const signal: Signal = {
      id: "s1",
      kind: "file",
      status: "detected",
      label: "S1",
      origin: { addedBy: "test" }
    };

    const plugin = makePlugin({
      meta: META,
      detectors: [makeDetector("d1", signal)],
      recommenders: [
        {
          id: "failing-rec",
          recommend: async () => {
            throw new Error("recommend failed");
          }
        }
      ],
      onError: () => true
    });

    const report = await executePlugins([plugin], makeCtx());
    expect(report.policyWarnings).toHaveLength(1);
    expect(report.policyWarnings[0].stage).toBe("recommend");
    expect(report.policyWarnings[0].message).toBe("recommend failed");
  });

  it("continues and records warning when no onError handler is provided", async () => {
    const plugin = makePlugin({
      meta: META,
      detectors: [
        {
          id: "failing",
          kind: "file",
          detect: async () => {
            throw new Error("no handler");
          }
        }
      ]
      // no onError
    });

    const report = await executePlugins([plugin], makeCtx());
    expect(report.policyWarnings).toHaveLength(1);
    expect(report.policyWarnings[0].message).toBe("no handler");
  });

  it("handles non-Error throwables in detectors", async () => {
    const plugin = makePlugin({
      meta: META,
      detectors: [
        {
          id: "string-throw",
          kind: "file",
          detect: async () => {
            throw "string error";
          }
        }
      ]
    });

    const report = await executePlugins([plugin], makeCtx());
    expect(report.policyWarnings).toHaveLength(1);
    expect(report.policyWarnings[0].message).toBe("string error");
  });

  it("records warnings for afterDetect hook errors", async () => {
    const signal: Signal = {
      id: "s1",
      kind: "file",
      status: "detected",
      label: "S1",
      origin: { addedBy: "test" }
    };

    const plugin = makePlugin({
      meta: META,
      detectors: [makeDetector("d1", signal)],
      afterDetect: async () => {
        throw new Error("afterDetect failed");
      }
    });

    const report = await executePlugins([plugin], makeCtx());
    expect(report.policyWarnings).toHaveLength(1);
    expect(report.policyWarnings[0].stage).toBe("afterDetect");
  });

  it("continues other plugins' detectors after one plugin aborts", async () => {
    const plugin1 = makePlugin({
      meta: { ...META, name: "aborter" },
      detectors: [
        {
          id: "d1",
          kind: "file",
          detect: async () => {
            throw new Error("abort");
          }
        }
      ],
      onError: () => false
    });

    const plugin2 = makePlugin({
      meta: { ...META, name: "survivor" },
      detectors: [
        makeDetector("d2", {
          id: "s2",
          kind: "file",
          status: "detected",
          label: "S2",
          origin: { addedBy: "survivor" }
        })
      ]
    });

    const report = await executePlugins([plugin1, plugin2], makeCtx());
    expect(report.signals).toHaveLength(1);
    expect(report.signals[0].id).toBe("s2");
    expect(report.policyWarnings).toHaveLength(1);
  });
});
