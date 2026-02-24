import type {
  PolicyPlugin,
  PolicyContext,
  Signal,
  Recommendation,
  PolicyWarning,
  EngineReport,
  PluginStage
} from "./types";
import {
  applySignalPatch,
  applyRecommendationPatch,
  resolveSupersedes,
  calculateScore
} from "./types";

export type EngineOptions = {
  /** IDs of rules to skip entirely (detectors + recommenders). */
  disabledRuleIds?: Set<string>;
};

/**
 * Execute a chain of plugins through the deterministic pipeline:
 *   1. All detectors (all plugins, source order)
 *   2. afterDetect hooks (all plugins, source order)
 *   3. beforeRecommend hooks (all plugins, source order)
 *   4. All recommenders (all plugins, source order)
 *   5. afterRecommend hooks (all plugins, source order)
 *   6. Resolve supersedes
 *   7. Engine-level scoring
 */
export async function executePlugins(
  plugins: PolicyPlugin[],
  ctx: PolicyContext,
  options?: EngineOptions
): Promise<EngineReport> {
  const warnings: PolicyWarning[] = [];
  const disabledIds = options?.disabledRuleIds ?? new Set<string>();

  // ── Stage 1: Detect ──
  let signals: Signal[] = [];
  for (const plugin of plugins) {
    if (!plugin.detectors?.length) continue;
    for (const detector of plugin.detectors) {
      if (disabledIds.has(detector.id)) continue;
      try {
        const result = await detector.detect(ctx);
        const emitted = Array.isArray(result) ? result : [result];
        signals.push(...emitted);
      } catch (err) {
        const cont = handleError(plugin, err, "detect", ctx, warnings);
        if (!cont) break;
      }
    }
  }

  // ── Stage 2: afterDetect hooks ──
  // Hook stages (2, 3, 5) do not honor onError abort on the outer plugin loop.
  // Each hook is a single call per plugin, so "abort" only applies to inner
  // detector/recommender loops in stages 1 and 4.
  for (const plugin of plugins) {
    if (!plugin.afterDetect) continue;
    try {
      const patch = await plugin.afterDetect(signals, ctx);
      if (patch) {
        signals = applySignalPatch(signals, patch, plugin.meta.name);
      }
    } catch (err) {
      handleError(plugin, err, "afterDetect", ctx, warnings);
    }
  }

  // ── Stage 3: beforeRecommend hooks ──
  for (const plugin of plugins) {
    if (!plugin.beforeRecommend) continue;
    try {
      const patch = await plugin.beforeRecommend(signals, ctx);
      if (patch) {
        signals = applySignalPatch(signals, patch, plugin.meta.name);
      }
    } catch (err) {
      handleError(plugin, err, "beforeRecommend", ctx, warnings);
    }
  }

  // ── Stage 4: Recommend ──
  let recommendations: Recommendation[] = [];
  for (const plugin of plugins) {
    if (!plugin.recommenders?.length) continue;
    for (const recommender of plugin.recommenders) {
      if (disabledIds.has(recommender.id)) continue;
      try {
        const result = await recommender.recommend(signals, ctx);
        const emitted = Array.isArray(result) ? result : [result];
        recommendations.push(...emitted);
      } catch (err) {
        const cont = handleError(plugin, err, "recommend", ctx, warnings);
        if (!cont) break;
      }
    }
  }

  // ── Stage 5: afterRecommend hooks ──
  for (const plugin of plugins) {
    if (!plugin.afterRecommend) continue;
    try {
      const patch = await plugin.afterRecommend(recommendations, signals, ctx);
      if (patch) {
        recommendations = applyRecommendationPatch(recommendations, patch, plugin.meta.name);
      }
    } catch (err) {
      handleError(plugin, err, "afterRecommend", ctx, warnings);
    }
  }

  // ── Stage 6: Resolve supersedes ──
  recommendations = resolveSupersedes(recommendations);

  // ── Stage 7: Score ──
  const { score, grade } = calculateScore(signals, recommendations);

  return {
    signals,
    recommendations,
    policyWarnings: warnings,
    score,
    grade,
    pluginChain: plugins.map((p) => p.meta.name)
  };
}

function handleError(
  plugin: PolicyPlugin,
  err: unknown,
  stage: PluginStage,
  ctx: PolicyContext,
  warnings: PolicyWarning[]
): boolean {
  const error = err instanceof Error ? err : new Error(String(err));
  // Always record the warning for audit trail, even on abort
  warnings.push({
    pluginName: plugin.meta.name,
    stage,
    message: error.message
  });
  if (plugin.onError) {
    return plugin.onError(error, stage, ctx);
  }
  return true;
}
