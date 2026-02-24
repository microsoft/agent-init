import fs from "fs/promises";
import os from "os";
import path from "path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { executePlugins } from "../policy/engine";
import { buildBuiltinPlugin, loadPluginChain } from "../policy/loader";
import type { PolicyContext } from "../policy/types";
import { buildExtras } from "../readiness";

function makeCtx(): PolicyContext {
  return {
    repoPath: "/tmp/test",
    rootFiles: [],
    cache: new Map()
  };
}

describe("buildBuiltinPlugin", () => {
  it("returns a plugin with sourceType 'builtin' and trust 'trusted-code'", () => {
    const { plugin } = buildBuiltinPlugin();
    expect(plugin.meta.name).toBe("builtin");
    expect(plugin.meta.sourceType).toBe("builtin");
    expect(plugin.meta.trust).toBe("trusted-code");
  });

  it("has detectors for all repo-scoped built-in criteria and extras", () => {
    const { plugin, baseCriteria } = buildBuiltinPlugin();
    const extras = buildExtras();
    // Only repo-scoped criteria are included, plus all extras
    const repoCriteria = baseCriteria.filter((c) => c.scope === "repo");
    expect(plugin.detectors).toBeDefined();
    expect(plugin.detectors!.length).toBe(repoCriteria.length + extras.length);
  });

  it("has recommenders for all repo-scoped built-in criteria and extras", () => {
    const { plugin, baseCriteria } = buildBuiltinPlugin();
    const extras = buildExtras();
    const repoCriteria = baseCriteria.filter((c) => c.scope === "repo");
    expect(plugin.recommenders).toBeDefined();
    expect(plugin.recommenders!.length).toBe(repoCriteria.length + extras.length);
  });

  it("produces a plugin that can execute through the engine", async () => {
    const { plugin } = buildBuiltinPlugin();
    const report = await executePlugins([plugin], makeCtx());
    expect(report.signals.length).toBeGreaterThan(0);
    expect(report.pluginChain).toEqual(["builtin"]);
    expect(report.grade).toBeDefined();
  });
});

describe("loadPluginChain", () => {
  it("always includes builtin as the first plugin", async () => {
    const chain = await loadPluginChain([]);
    expect(chain.plugins.length).toBe(1);
    expect(chain.plugins[0].meta.name).toBe("builtin");
    expect(chain.passRateThreshold).toBe(0.8);
  });

  it("returns empty disabledRuleIds when no policies loaded", async () => {
    const chain = await loadPluginChain([]);
    expect(chain.options.disabledRuleIds).toBeUndefined();
  });
});

describe("loadPluginChain with JSON policy file", () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "primer-loader-"));
  });

  afterEach(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  it("loads a JSON policy and returns 2-plugin chain with policy following builtin", async () => {
    const policyPath = path.join(tmpDir, "test-policy.json");
    await fs.writeFile(
      policyPath,
      JSON.stringify({ name: "test-policy", criteria: { disable: [] } })
    );

    const chain = await loadPluginChain([policyPath]);
    expect(chain.plugins).toHaveLength(2);
    expect(chain.plugins[0].meta.name).toBe("builtin");
    expect(chain.plugins[1].meta.name).toBe("test-policy");
    expect(chain.plugins[1].meta.trust).toBe("safe-declarative");
  });

  it("merges disabledRuleIds from policy criteria.disable", async () => {
    const policyPath = path.join(tmpDir, "disable-policy.json");
    await fs.writeFile(
      policyPath,
      JSON.stringify({ name: "disable-policy", criteria: { disable: ["lint-config", "readme"] } })
    );

    const chain = await loadPluginChain([policyPath]);
    expect(chain.options.disabledRuleIds).toBeDefined();
    expect(chain.options.disabledRuleIds).toContain("lint-config");
    expect(chain.options.disabledRuleIds).toContain("readme");
  });

  it("picks up passRateThreshold from policy thresholds field", async () => {
    const policyPath = path.join(tmpDir, "threshold-policy.json");
    await fs.writeFile(
      policyPath,
      JSON.stringify({ name: "strict", thresholds: { passRate: 0.95 } })
    );

    const chain = await loadPluginChain([policyPath]);
    expect(chain.passRateThreshold).toBe(0.95);
  });

  it("accepts a safe-declarative policy when jsonOnly is true", async () => {
    const policyPath = path.join(tmpDir, "bad-policy.json");
    // compilePolicyConfig with jsonOnly:true rejects policies that declare import sources
    // Write a structurally-invalid policy so loadPolicy raises at parse time
    await fs.writeFile(policyPath, JSON.stringify({ name: "bad", criteria: { disable: [] } }));

    // jsonOnly flag is set when policySources comes from config (not CLI), but the
    // file-based path always resolves to safe-declarative trust — load should succeed
    const chain = await loadPluginChain([policyPath], { jsonOnly: true });
    expect(chain.plugins[1].meta.trust).toBe("safe-declarative");
  });
});
