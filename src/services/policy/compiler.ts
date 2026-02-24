/**
 * Phase E: Declarative-to-Plugin Compiler.
 *
 * Compiles a declarative PolicyConfig (JSON policy) into a PolicyPlugin adapter
 * so that both imperative and declarative policies share the same runtime.
 *
 * Declarative policies can:
 *   - disable criteria/extras → mapped to EngineOptions.disabledRuleIds
 *   - override criterion metadata → mapped to afterDetect hook (SignalPatch.modify)
 *   - add new criteria → mapped to detectors + recommenders
 *   - set thresholds → returned alongside the plugin for engine-level use
 */
import type { PolicyConfig, ExtraDefinition } from "../policy";
import type { ReadinessCriterion, ReadinessContext } from "../readiness";

import type {
  PolicyPlugin,
  Detector,
  RecommendationImpact,
  Recommender,
  Signal,
  SignalPatch,
  PolicyContext
} from "./types";

export type CompilationResult = {
  plugin: PolicyPlugin;
  /** Criterion/extra IDs to disable at engine level. */
  disabledIds: string[];
  /** Pass-rate threshold from the policy (undefined if not set). */
  passRateThreshold?: number;
};

/**
 * Compile a declarative PolicyConfig into a PolicyPlugin.
 *
 * The compiled plugin has trust "safe-declarative" and sourceType "json".
 * It cannot contain arbitrary code — only metadata overrides and static checks.
 */
export function compilePolicyConfig(
  config: PolicyConfig,
  /** Base criteria used for metadata override resolution. */
  _baseCriteria: ReadonlyArray<ReadinessCriterion>
): CompilationResult {
  const disabledIds: string[] = [];
  const detectors: Detector[] = [];
  const recommenders: Recommender[] = [];
  let afterDetect:
    | ((signals: ReadonlyArray<Signal>, ctx: PolicyContext) => Promise<SignalPatch | undefined>)
    | undefined;

  // ── Collect disabled IDs ──
  if (config.criteria?.disable?.length) {
    disabledIds.push(...config.criteria.disable);
  }
  if (config.extras?.disable?.length) {
    disabledIds.push(...config.extras.disable);
  }

  // ── Build afterDetect hook for metadata overrides ──
  if (config.criteria?.override && Object.keys(config.criteria.override).length > 0) {
    const overrides = config.criteria.override;
    afterDetect = async (signals) => {
      const modifications: SignalPatch["modify"] = [];
      for (const [id, changes] of Object.entries(overrides)) {
        // Only modify signals that exist
        const exists = signals.some((s) => s.id === id);
        if (exists) {
          // Map criterion metadata overrides to signal label/metadata changes
          const signalChanges: Record<string, unknown> = {};
          if (changes.title) {
            signalChanges.label = changes.title;
          }
          // Store remaining overrides in metadata
          const meta: Record<string, unknown> = {};
          if (changes.pillar) meta.pillar = changes.pillar;
          if (changes.level !== undefined) meta.level = changes.level;
          if (changes.scope) meta.scope = changes.scope;
          if (changes.impact) meta.impact = changes.impact;
          if (changes.effort) meta.effort = changes.effort;
          if (Object.keys(meta).length > 0) {
            signalChanges.metadata = meta;
          }
          if (Object.keys(signalChanges).length > 0) {
            modifications.push({
              id,
              changes: signalChanges as Partial<Omit<Signal, "id" | "origin">>
            });
          }
        }
      }
      return modifications.length > 0 ? { modify: modifications } : undefined;
    };
  }

  // ── Build detectors + recommenders from criteria.add ──
  if (config.criteria?.add?.length) {
    for (const criterion of config.criteria.add) {
      detectors.push(criterionToDetector(criterion));
      recommenders.push(criterionToRecommender(criterion));
    }
  }

  // ── Build detectors + recommenders from extras.add ──
  if (config.extras?.add?.length) {
    for (const extra of config.extras.add) {
      detectors.push(extraToDetector(extra));
      recommenders.push(extraToRecommender(extra));
    }
  }

  const plugin: PolicyPlugin = {
    meta: {
      name: config.name,
      version: config.version,
      sourceType: "json",
      trust: "safe-declarative"
    },
    ...(detectors.length > 0 ? { detectors } : {}),
    ...(afterDetect ? { afterDetect } : {}),
    ...(recommenders.length > 0 ? { recommenders } : {})
  };

  return {
    plugin,
    disabledIds,
    passRateThreshold: config.thresholds?.passRate
  };
}

function criterionToDetector(criterion: ReadinessCriterion): Detector {
  return {
    id: criterion.id,
    kind: mapScope(criterion.scope),
    detect: async (ctx) => {
      const readinessCtx = policyCtxToReadinessCtx(ctx);
      const result = await criterion.check(readinessCtx);
      return {
        id: criterion.id,
        kind: mapScope(criterion.scope),
        status: result.status === "skip" ? "not-detected" : "detected",
        label: criterion.title,
        evidence: result.evidence,
        reason: result.reason,
        origin: { addedBy: `compiled:${criterion.id}` },
        metadata: {
          pillar: criterion.pillar,
          level: criterion.level,
          scope: criterion.scope,
          impact: criterion.impact,
          effort: criterion.effort,
          checkStatus: result.status
        }
      };
    }
  };
}

function criterionToRecommender(criterion: ReadinessCriterion): Recommender {
  return {
    id: `${criterion.id}-rec`,
    recommend: async (signals) => {
      const signal = signals.find((s) => s.id === criterion.id);
      if (!signal) return [];
      const checkStatus = (signal.metadata as Record<string, unknown>)?.checkStatus;
      if (checkStatus !== "fail") return [];
      // Read impact from signal metadata at call time so afterDetect overrides
      // (e.g. from a declarative policy's override block) are reflected in scoring.
      const runtimeImpact = (signal.metadata as Record<string, unknown>)?.impact as
        | RecommendationImpact
        | undefined;
      const impact =
        runtimeImpact ??
        (criterion.impact === "high" ? "high" : criterion.impact === "medium" ? "medium" : "low");
      return {
        id: `${criterion.id}-fix`,
        signalId: criterion.id,
        impact,
        message: signal.reason ?? `Fix: ${criterion.title}`,
        origin: { addedBy: `compiled:${criterion.id}` }
      };
    }
  };
}

function extraToDetector(extra: ExtraDefinition): Detector {
  return {
    id: extra.id,
    kind: "custom",
    detect: async (ctx) => {
      const readinessCtx = policyCtxToReadinessCtx(ctx);
      const result = await extra.check(readinessCtx);
      return {
        id: extra.id,
        kind: "custom" as const,
        status: "detected" as const,
        label: extra.title,
        reason: result.reason,
        origin: { addedBy: `compiled:${extra.id}` },
        metadata: { checkStatus: result.status }
      };
    }
  };
}

function extraToRecommender(extra: ExtraDefinition): Recommender {
  return {
    id: `${extra.id}-rec`,
    recommend: async (signals) => {
      const signal = signals.find((s) => s.id === extra.id);
      if (!signal) return [];
      const checkStatus = (signal.metadata as Record<string, unknown>)?.checkStatus;
      if (checkStatus !== "fail") return [];
      return {
        id: `${extra.id}-fix`,
        signalId: extra.id,
        impact: "low" as const,
        message: signal.reason ?? `Fix: ${extra.title}`,
        origin: { addedBy: `compiled:${extra.id}` }
      };
    }
  };
}

function mapScope(scope: string): "file" | "git" | "custom" {
  switch (scope) {
    case "repo":
      return "file";
    case "app":
      return "file";
    case "area":
      return "file";
    default:
      return "custom";
  }
}

/**
 * Bridge from PolicyContext to ReadinessContext.
 * Used by compiled detectors to run legacy check functions.
 */
function policyCtxToReadinessCtx(ctx: PolicyContext): ReadinessContext {
  return {
    repoPath: ctx.repoPath,
    analysis: {
      path: ctx.repoPath,
      isGitRepo: true,
      languages: [],
      frameworks: [],
      isMonorepo: false
    },
    apps: [],
    rootFiles: ctx.rootFiles,
    rootPackageJson: ctx.rootPackageJson
  };
}
