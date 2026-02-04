import fs from "fs/promises";
import path from "path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

type EvalCase = {
  prompt: string;
  expectation: string;
  id?: string;
};

type EvalConfig = {
  instructionFile?: string;
  cases: EvalCase[];
  systemMessage?: string;
  outputPath?: string;
};

const DEFAULT_SYSTEM_MESSAGE =
  "You are answering questions about this repository. Use tools to inspect the repo and cite its files. Avoid generic Copilot CLI details unless the prompt explicitly asks for them.";

type EvalRunOptions = {
  configPath: string;
  repoPath: string;
  model: string;
  judgeModel: string;
  outputPath?: string;
  onProgress?: (message: string) => void;
};

type TokenUsage = {
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
};

type ToolCallSummary = {
  count: number;
  byName: Record<string, number>;
  totalDurationMs: number;
};

type AskMetrics = {
  durationMs: number;
  tokenUsage?: TokenUsage;
  toolCalls: ToolCallSummary;
};

type EvalMetrics = {
  withoutInstructions: AskMetrics;
  withInstructions: AskMetrics;
  judge: AskMetrics;
  totalDurationMs: number;
};

type EvalPhase = "withoutInstructions" | "withInstructions" | "judge";

type TrajectoryEvent = {
  timestampMs: number;
  phase: EvalPhase;
  type: string;
  data?: Record<string, unknown>;
};

export type EvalResult = {
  id: string;
  prompt: string;
  expectation: string;
  withInstructions?: string;
  withoutInstructions?: string;
  verdict?: "pass" | "fail" | "unknown";
  score?: number;
  rationale?: string;
  metrics?: EvalMetrics;
  trajectory?: TrajectoryEvent[];
};

export async function runEval(options: EvalRunOptions): Promise<{ summary: string; results: EvalResult[]; viewerPath?: string }> {
  const config = await loadConfig(options.configPath);
  const instructionFile = config.instructionFile ?? ".github/copilot-instructions.md";
  const instructionPath = path.resolve(options.repoPath, instructionFile);
  const instructionText = await readOptionalFile(instructionPath);
  const baseSystemMessage = config.systemMessage ?? DEFAULT_SYSTEM_MESSAGE;
  const progress = options.onProgress ?? (() => {});
  const defaultOutputPath = path.resolve(
    options.repoPath,
    ".primer",
    "evals",
    buildTimestampedName("eval-results")
  );
  const outputPath = resolveOutputPath(options.repoPath, options.outputPath, config.outputPath) ?? defaultOutputPath;
  const runStartedAt = Date.now();

  progress("Starting Copilot SDK...");
  const cliPath = await findCopilotCliPath();
  const sdk = await import("@github/copilot-sdk");
  const client = new sdk.CopilotClient({ cliPath });

  try {
    const results: EvalResult[] = [];
    const total = config.cases.length;

    for (const [index, testCase] of config.cases.entries()) {
      const id = testCase.id ?? `case-${index + 1}`;
      const prompt = buildPrompt(options.repoPath, testCase.prompt);
      const caseStartedAt = Date.now();

      progress(`Running eval ${index + 1}/${total}: ${id} (without instructions)...`);
      const withoutResult = await askOnce(client, {
        prompt,
        model: options.model,
        systemMessage: baseSystemMessage,
        phase: "withoutInstructions"
      });

      progress(`Running eval ${index + 1}/${total}: ${id} (with instructions)...`);
      const withResult = await askOnce(client, {
        prompt,
        model: options.model,
        systemMessage: [baseSystemMessage, instructionText].filter(Boolean).join("\n\n"),
        phase: "withInstructions"
      });

      progress(`Running eval ${index + 1}/${total}: ${id} (judging)...`);
      const judgment = await judge(client, {
        model: options.judgeModel,
        prompt: testCase.prompt,
        expectation: testCase.expectation,
        withoutInstructions: withoutResult.content,
        withInstructions: withResult.content
      });

      const metrics: EvalMetrics = {
        withoutInstructions: withoutResult.metrics,
        withInstructions: withResult.metrics,
        judge: judgment.metrics,
        totalDurationMs: Date.now() - caseStartedAt
      };

      const trajectory = [
        ...withoutResult.trajectory,
        ...withResult.trajectory,
        ...judgment.trajectory
      ];

      results.push({
        id,
        prompt: testCase.prompt,
        expectation: testCase.expectation,
        withInstructions: withResult.content,
        withoutInstructions: withoutResult.content,
        verdict: judgment.result.verdict,
        score: judgment.result.score,
        rationale: judgment.result.rationale,
        metrics,
        trajectory
      });

      progress(`Eval ${index + 1}/${total}: ${id} → ${judgment.result.verdict} (score: ${judgment.result.score})`);
    }

    const runFinishedAt = Date.now();
    const output = {
      repoPath: options.repoPath,
      model: options.model,
      judgeModel: options.judgeModel,
      runMetrics: {
        startedAt: new Date(runStartedAt).toISOString(),
        finishedAt: new Date(runFinishedAt).toISOString(),
        durationMs: runFinishedAt - runStartedAt
      },
      results
    };
    let viewerPath: string | undefined;
    if (outputPath) {
      await fs.mkdir(path.dirname(outputPath), { recursive: true });
      await fs.writeFile(outputPath, JSON.stringify(output, null, 2), "utf8");
      viewerPath = buildViewerPath(outputPath);
      await fs.writeFile(viewerPath, buildTrajectoryViewerHtml(output), "utf8");
    }

    const summary = formatSummary(results, runFinishedAt - runStartedAt);
    return { summary, results, viewerPath };
  } finally {
    await client.stop();
  }
}

type AskOptions = {
  prompt: string;
  model: string;
  systemMessage?: string;
  phase: EvalPhase;
};

type AskResult = {
  content: string;
  metrics: AskMetrics;
  trajectory: TrajectoryEvent[];
};

async function askOnce(
  client: { createSession: (config?: Record<string, unknown>) => Promise<any> },
  options: AskOptions
): Promise<AskResult> {
  const session = await client.createSession({
    model: options.model,
    streaming: true,
    infiniteSessions: { enabled: false },
    systemMessage: options.systemMessage
      ? { content: options.systemMessage }
      : undefined
  });

  let content = "";
  const telemetry = createTelemetry(options.phase);
  const startedAt = Date.now();
  session.on((event: { type: string; data?: Record<string, unknown> }) => {
    captureTelemetryEvent(event, telemetry);
    if (event.type === "assistant.message_delta") {
      const delta = event.data?.deltaContent as string | undefined;
      if (delta) content += delta;
    }
  });

  await session.sendAndWait({ prompt: options.prompt }, 120000);
  await session.destroy();
  const finishedAt = Date.now();
  return {
    content: content.trim(),
    metrics: {
      durationMs: finishedAt - startedAt,
      tokenUsage: normalizeTokenUsage(telemetry.tokenUsage),
      toolCalls: telemetry.toolCalls
    },
    trajectory: telemetry.trajectory
  };
}

type JudgeOptions = {
  model: string;
  prompt: string;
  expectation: string;
  withoutInstructions: string;
  withInstructions: string;
};

type JudgeResult = {
  verdict: "pass" | "fail" | "unknown";
  score: number;
  rationale: string;
};

async function judge(
  client: { createSession: (config?: Record<string, unknown>) => Promise<any> },
  options: JudgeOptions
): Promise<{ result: JudgeResult; metrics: AskMetrics; trajectory: TrajectoryEvent[] }> {
  const session = await client.createSession({
    model: options.model,
    streaming: true,
    infiniteSessions: { enabled: false },
    systemMessage: {
      content: "You are a strict evaluator. Return JSON with keys: verdict (pass|fail|unknown), score (0-100), rationale. Do not include any other text."
    }
  });

  let content = "";
  const telemetry = createTelemetry("judge");
  const startedAt = Date.now();
  session.on((event: { type: string; data?: Record<string, unknown> }) => {
    captureTelemetryEvent(event, telemetry);
    if (event.type === "assistant.message_delta") {
      const delta = event.data?.deltaContent as string | undefined;
      if (delta) content += delta;
    }
  });

  const prompt = [
    "Evaluate which response best matches the expectation.",
    "",
    `Expectation: ${options.expectation}`,
    "",
    "Response A (without custom instructions):",
    options.withoutInstructions,
    "",
    "Response B (with custom instructions):",
    options.withInstructions,
    "",
    "Return JSON only."
  ].join("\n");

  await session.sendAndWait({ prompt }, 120000);
  await session.destroy();

  const finishedAt = Date.now();
  return {
    result: parseJudge(content),
    metrics: {
      durationMs: finishedAt - startedAt,
      tokenUsage: normalizeTokenUsage(telemetry.tokenUsage),
      toolCalls: telemetry.toolCalls
    },
    trajectory: telemetry.trajectory
  };
}

function parseJudge(content: string): JudgeResult {
  try {
    const match = content.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No JSON detected");
    const parsed = JSON.parse(match[0]) as JudgeResult;
    if (!parsed.verdict) throw new Error("Missing verdict");
    return {
      verdict: parsed.verdict,
      score: Number(parsed.score ?? 0),
      rationale: String(parsed.rationale ?? "")
    };
  } catch {
    return {
      verdict: "unknown",
      score: 0,
      rationale: content.trim()
    };
  }
}

async function loadConfig(configPath: string): Promise<EvalConfig> {
  const raw = await fs.readFile(configPath, "utf8");
  return JSON.parse(raw) as EvalConfig;
}

async function findCopilotCliPath(): Promise<string> {
  // Try standard PATH first
  try {
    const { stdout } = await execFileAsync("which", ["copilot"], { timeout: 5000 });
    return stdout.trim();
  } catch {
    // Ignore - will try VS Code location
  }

  // VS Code Copilot Chat extension location
  const home = process.env.HOME ?? "";
  const vscodeLocations = [
    `${home}/Library/Application Support/Code - Insiders/User/globalStorage/github.copilot-chat/copilotCli/copilot`,
    `${home}/Library/Application Support/Code/User/globalStorage/github.copilot-chat/copilotCli/copilot`,
    `${home}/.vscode-insiders/extensions/github.copilot-chat-*/copilotCli/copilot`,
    `${home}/.vscode/extensions/github.copilot-chat-*/copilotCli/copilot`,
  ];

  for (const location of vscodeLocations) {
    try {
      await fs.access(location);
      return location;
    } catch {
      // Try next location
    }
  }

  throw new Error("Copilot CLI not found. Install GitHub Copilot Chat extension in VS Code.");
}

async function readOptionalFile(filePath: string): Promise<string> {
  try {
    return await fs.readFile(filePath, "utf8");
  } catch {
    return "";
  }
}

function buildPrompt(repoPath: string, userPrompt: string): string {
  return [
    "You are working in this repository:",
    repoPath,
    "Use the file system tools when needed to inspect the codebase.",
    "",
    userPrompt
  ].join("\n");
}

function formatSummary(results: EvalResult[], runDurationMs: number): string {
  const total = results.length;
  const passed = results.filter((r) => r.verdict === "pass").length;
  const failed = results.filter((r) => r.verdict === "fail").length;
  const unknown = results.filter((r) => r.verdict === "unknown").length;
  const totalUsage = aggregateTokenUsage(results);
  const hasUsage = Boolean(totalUsage.promptTokens || totalUsage.completionTokens || totalUsage.totalTokens);

  const lines = [
    `Eval results: ${passed}/${total} pass, ${failed} fail, ${unknown} unknown.`,
    `Runtime: ${formatDuration(runDurationMs)}.`,
    hasUsage ? `Token usage: ${formatTokenUsage(totalUsage)}.` : "Token usage: unavailable."
  ];

  for (const result of results) {
    lines.push(
      `- ${result.id}: ${result.verdict ?? "unknown"} (score: ${result.score ?? 0})`
    );
  }

  return `\n${lines.join("\n")}`;
}

type TelemetryCollector = {
  trajectory: TrajectoryEvent[];
  tokenUsage: TokenUsage;
  toolCalls: ToolCallSummary;
  toolCallMap: Map<string, { name?: string; startMs: number }>;
  phase: EvalPhase;
};

function createTelemetry(phase: EvalPhase): TelemetryCollector {
  return {
    trajectory: [],
    tokenUsage: {},
    toolCalls: { count: 0, byName: {}, totalDurationMs: 0 },
    toolCallMap: new Map(),
    phase
  };
}

function captureTelemetryEvent(
  event: { type: string; data?: Record<string, unknown> },
  telemetry: TelemetryCollector
): void {
  const timestampMs = Date.now();
  telemetry.trajectory.push({
    timestampMs,
    phase: telemetry.phase,
    type: event.type,
    data: sanitizeEventData(event.data)
  });

  if (event.type === "tool.execution_start") {
    const toolName = (event.data?.toolName as string | undefined) ?? "unknown";
    const toolId = resolveToolId(event.data, toolName, telemetry.toolCallMap.size);
    telemetry.toolCallMap.set(toolId, { name: toolName, startMs: timestampMs });
    telemetry.toolCalls.count += 1;
    telemetry.toolCalls.byName[toolName] = (telemetry.toolCalls.byName[toolName] ?? 0) + 1;
  } else if (event.type === "tool.execution_finish" || event.type === "tool.execution_error") {
    const toolName = (event.data?.toolName as string | undefined) ?? "unknown";
    const toolId = resolveToolId(event.data, toolName, telemetry.toolCallMap.size);
    const entry = telemetry.toolCallMap.get(toolId) ?? findLatestToolByName(telemetry.toolCallMap, toolName);
    if (entry) {
      const durationMs = timestampMs - entry.startMs;
      telemetry.toolCalls.totalDurationMs += durationMs;
      telemetry.toolCallMap.delete(toolId);
    }
  }

  const usage = extractTokenUsage(event.data);
  if (usage) {
    telemetry.tokenUsage = mergeTokenUsage(telemetry.tokenUsage, usage);
  }
}

function resolveToolId(
  data: Record<string, unknown> | undefined,
  toolName: string,
  index: number
): string {
  const rawId = data?.executionId ?? data?.toolCallId ?? data?.callId ?? data?.id;
  if (typeof rawId === "string" || typeof rawId === "number") {
    return String(rawId);
  }
  return `${toolName}-${index + 1}`;
}

function findLatestToolByName(
  map: Map<string, { name?: string; startMs: number }>,
  toolName: string
): { name?: string; startMs: number } | undefined {
  const entries = Array.from(map.values()).filter((entry) => entry.name === toolName);
  return entries.at(-1);
}

function extractTokenUsage(data: Record<string, unknown> | undefined): TokenUsage | null {
  if (!data) return null;
  const usage = findUsageObject(data);
  const promptTokens = getNumber(
    usage?.prompt_tokens ?? usage?.promptTokens ?? data.promptTokens ?? data.inputTokens
  );
  const completionTokens = getNumber(
    usage?.completion_tokens ?? usage?.completionTokens ?? data.completionTokens ?? data.outputTokens
  );
  const totalTokens = getNumber(usage?.total_tokens ?? usage?.totalTokens ?? data.totalTokens);

  if (promptTokens == null && completionTokens == null && totalTokens == null) {
    return null;
  }

  return {
    promptTokens: promptTokens ?? undefined,
    completionTokens: completionTokens ?? undefined,
    totalTokens: totalTokens ?? undefined
  };
}

function findUsageObject(data: Record<string, unknown>): Record<string, unknown> | undefined {
  const direct = (data.usage ?? data.tokenUsage ?? data.tokens) as Record<string, unknown> | undefined;
  if (direct) return direct;

  const candidates = [
    data.response,
    data.result,
    data.message,
    data.metrics,
    data.output
  ];

  for (const candidate of candidates) {
    if (candidate && typeof candidate === "object") {
      const nested = (candidate as Record<string, unknown>).usage ?? (candidate as Record<string, unknown>).tokenUsage;
      if (nested && typeof nested === "object") return nested as Record<string, unknown>;
    }
  }

  return scanForUsage(data, 0);
}

function scanForUsage(value: unknown, depth: number): Record<string, unknown> | undefined {
  if (!value || typeof value !== "object" || depth > 4) return undefined;
  if (Array.isArray(value)) {
    for (const entry of value) {
      const found = scanForUsage(entry, depth + 1);
      if (found) return found;
    }
    return undefined;
  }

  const record = value as Record<string, unknown>;
  if (hasTokenFields(record)) return record;

  for (const entry of Object.values(record)) {
    const found = scanForUsage(entry, depth + 1);
    if (found) return found;
  }

  return undefined;
}

function hasTokenFields(record: Record<string, unknown>): boolean {
  const keys = Object.keys(record);
  return (
    keys.includes("prompt_tokens") ||
    keys.includes("completion_tokens") ||
    keys.includes("total_tokens") ||
    keys.includes("promptTokens") ||
    keys.includes("completionTokens") ||
    keys.includes("totalTokens") ||
    keys.includes("inputTokens") ||
    keys.includes("outputTokens")
  );
}

function getNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function mergeTokenUsage(existing: TokenUsage, next: TokenUsage): TokenUsage {
  return {
    promptTokens: Math.max(existing.promptTokens ?? 0, next.promptTokens ?? 0) || undefined,
    completionTokens: Math.max(existing.completionTokens ?? 0, next.completionTokens ?? 0) || undefined,
    totalTokens: Math.max(existing.totalTokens ?? 0, next.totalTokens ?? 0) || undefined
  };
}

function normalizeTokenUsage(usage: TokenUsage): TokenUsage | undefined {
  if (!usage.promptTokens && !usage.completionTokens && !usage.totalTokens) return undefined;
  if (!usage.totalTokens) {
    const prompt = usage.promptTokens ?? 0;
    const completion = usage.completionTokens ?? 0;
    const total = prompt + completion;
    return {
      ...usage,
      totalTokens: total || undefined
    };
  }
  return usage;
}

function aggregateTokenUsage(results: EvalResult[]): TokenUsage {
  const total: TokenUsage = { promptTokens: 0, completionTokens: 0, totalTokens: 0 };
  for (const result of results) {
    const metrics = result.metrics;
    if (!metrics) continue;
    const usages = [metrics.withoutInstructions.tokenUsage, metrics.withInstructions.tokenUsage, metrics.judge.tokenUsage];
    for (const usage of usages) {
      if (!usage) continue;
      total.promptTokens = (total.promptTokens ?? 0) + (usage.promptTokens ?? 0);
      total.completionTokens = (total.completionTokens ?? 0) + (usage.completionTokens ?? 0);
      total.totalTokens = (total.totalTokens ?? 0) + (usage.totalTokens ?? 0);
    }
  }
  return total;
}

function formatDuration(durationMs: number): string {
  const seconds = Math.round(durationMs / 100) / 10;
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remaining = Math.round((seconds % 60) * 10) / 10;
  return `${minutes}m ${remaining}s`;
}

function formatTokenUsage(usage: TokenUsage): string {
  const prompt = usage.promptTokens ?? 0;
  const completion = usage.completionTokens ?? 0;
  const total = usage.totalTokens ?? prompt + completion;
  return `prompt ${prompt}, completion ${completion}, total ${total}`;
}

function resolveOutputPath(repoPath: string, override?: string, configValue?: string): string | undefined {
  const chosen = override ?? configValue;
  if (!chosen) return undefined;
  return path.isAbsolute(chosen) ? chosen : path.resolve(repoPath, chosen);
}

function buildTimestampedName(baseName: string): string {
  const stamp = new Date().toISOString().replace(/[:.]/gu, "-");
  return `${baseName}-${stamp}.json`;
}

function buildViewerPath(outputPath: string): string {
  if (outputPath.endsWith(".json")) {
    return outputPath.replace(/\.json$/u, ".html");
  }
  return `${outputPath}.html`;
}

function buildTrajectoryViewerHtml(data: Record<string, unknown>): string {
  const serialized = JSON.stringify(data).replace(/</g, "\\u003c");
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Primer Eval Trajectory</title>
    <style>
      body { font-family: system-ui, -apple-system, sans-serif; margin: 0; padding: 24px; background: #0f1115; color: #e6e9ef; }
      h1 { font-size: 20px; margin-bottom: 8px; }
      .summary { margin-bottom: 24px; color: #b7bdc8; }
      .layout { display: grid; grid-template-columns: 280px 1fr; gap: 16px; }
      .panel { background: #151924; border: 1px solid #23283b; border-radius: 10px; padding: 12px; }
      .section { margin-top: 16px; }
      .section h3 { margin: 8px 0; font-size: 14px; color: #c7ccd6; }
      .chips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
      .chip { background: #1e2232; border: 1px solid #2c3250; border-radius: 999px; padding: 2px 8px; font-size: 12px; color: #c9d1e3; }
      .chip.phase { background: #23283b; border-color: #3a4163; color: #aeb7c6; }
      .muted { color: #8a93a5; font-size: 12px; }
      .filters { display: flex; gap: 12px; align-items: center; margin-top: 8px; }
      .filters label { font-size: 12px; color: #b7bdc8; }
      .case { padding: 8px; border-radius: 8px; cursor: pointer; margin-bottom: 6px; }
      .case.active { background: #23283b; }
      .case span { display: block; font-size: 12px; color: #9aa3b2; }
      pre { white-space: pre-wrap; word-break: break-word; background: #0b0d12; padding: 12px; border-radius: 8px; border: 1px solid #1e2232; }
      .pill { display: inline-block; padding: 2px 6px; border-radius: 999px; background: #23283b; margin-right: 6px; font-size: 12px; }
      .trajectory { max-height: 520px; overflow-y: auto; }
      .event { border-bottom: 1px solid #1e2232; padding: 8px 0; }
      .event:last-child { border-bottom: none; }
    </style>
  </head>
  <body>
    <h1>Primer Eval Trajectory</h1>
    <div class="summary" id="summary"></div>
    <div class="panel" id="toolSummary"></div>
    <div class="layout">
      <div class="panel" id="caseList"></div>
      <div class="panel" id="caseDetails"></div>
    </div>
    <script>
      const data = ${serialized};
      const summaryEl = document.getElementById('summary');
      const toolSummaryEl = document.getElementById('toolSummary');
      const caseListEl = document.getElementById('caseList');
      const caseDetailsEl = document.getElementById('caseDetails');

      const escapeHtml = (value) => String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

      const results = data.results || [];
      let activeCaseId = null;
      let toolsOnly = false;
      let phaseFilter = 'all';
      summaryEl.textContent =
        'Repo: ' +
        (data.repoPath || 'unknown') +
        ' • Model: ' +
        (data.model || 'unknown') +
        ' • Judge: ' +
        (data.judgeModel || 'unknown');

      function collectToolCounts(events, phase) {
        const counts = { total: 0, byName: {} };
        if (!events) return counts;
        events.forEach((event) => {
          if (phase && event.phase !== phase) return;
          if (event.type !== 'tool.execution_start') return;
          const name = (event.data && event.data.toolName) || 'unknown';
          counts.total += 1;
          counts.byName[name] = (counts.byName[name] || 0) + 1;
        });
        return counts;
      }

      function mergeToolCounts(target, source) {
        target.total += source.total;
        Object.entries(source.byName).forEach(([name, count]) => {
          target.byName[name] = (target.byName[name] || 0) + count;
        });
      }

      function renderToolChips(counts, limit) {
        const entries = Object.entries(counts.byName)
          .sort((a, b) => b[1] - a[1])
          .slice(0, limit);
        if (!entries.length) return '<span class="muted">No tool calls recorded.</span>';
        return '<div class="chips">' +
          entries.map(([name, count]) => '<span class="chip">' + name + ': ' + count + '</span>').join('') +
          '</div>';
      }

      function renderOverallToolSummary() {
        const overall = { total: 0, byName: {} };
        results.forEach((result) => mergeToolCounts(overall, collectToolCounts(result.trajectory || [])));
        toolSummaryEl.innerHTML =
          '<div>' +
          '<strong>Tool call summary (all cases)</strong>' +
          '<div class="muted">Total tool calls: ' + overall.total + '</div>' +
          renderToolChips(overall, 10) +
          '</div>';
      }

      function renderCaseList(activeId) {
        caseListEl.innerHTML = '';
        results.forEach((result) => {
          const row = document.createElement('div');
          row.className = 'case ' + (result.id === activeId ? 'active' : '');
          row.textContent = result.id + ' (' + (result.verdict ?? 'unknown') + ')';
          const sub = document.createElement('span');
          sub.textContent = 'Score: ' + (result.score ?? 0);
          row.appendChild(sub);
          row.addEventListener('click', () => renderCaseDetails(result.id));
          caseListEl.appendChild(row);
        });
      }

      function renderMetrics(metrics) {
        if (!metrics) return '<p>No metrics available.</p>';
        const fmt = (m) => {
          const usage = m.tokenUsage;
          const prompt = usage?.promptTokens ?? 'n/a';
          const completion = usage?.completionTokens ?? 'n/a';
          const total = usage?.totalTokens ?? (usage ? (Number(usage.promptTokens ?? 0) + Number(usage.completionTokens ?? 0)) : 'n/a');
          return (
            'Duration: ' +
            m.durationMs +
            'ms • Tokens (prompt/completion/total): ' +
            prompt +
            ' / ' +
            completion +
            ' / ' +
            total +
            ' • Tool calls: ' +
            (m.toolCalls?.count ?? 0)
          );
        };
        return (
          '<div>' +
          '<div class="pill">Without Instructions</div><span>' +
          fmt(metrics.withoutInstructions) +
          '</span><br />' +
          '<div class="pill">With Instructions</div><span>' +
          fmt(metrics.withInstructions) +
          '</span><br />' +
          '<div class="pill">Judge</div><span>' +
          fmt(metrics.judge) +
          '</span><br />' +
          '<div class="pill">Total</div><span>' +
          metrics.totalDurationMs +
          'ms</span>' +
          '</div>'
        );
      }

      function renderTrajectory(events) {
        if (!events || !events.length) return '<p>No trajectory events captured.</p>';
        const filtered = events.filter((event) => {
          if (phaseFilter !== 'all' && event.phase !== phaseFilter) return false;
          if (toolsOnly && !event.type.startsWith('tool.')) return false;
          return true;
        });
        return (
          '<div class="trajectory">' +
          filtered
            .map(
              (event) =>
                '<div class="event">' +
                '<div><strong>' +
                event.type +
                '</strong> <span class="pill">' +
                event.phase +
                '</span> <span>' +
                new Date(event.timestampMs).toISOString() +
                '</span></div>' +
                '<pre>' +
                JSON.stringify(event.data ?? {}, null, 2) +
                '</pre>' +
                '</div>'
            )
            .join('') +
          '</div>'
        );
      }

      function renderCaseDetails(caseId) {
        const result = results.find((r) => r.id === caseId) ?? results[0];
        if (!result) {
          caseDetailsEl.innerHTML = '<p>No results available.</p>';
          return;
        }
        activeCaseId = result.id;
        renderCaseList(result.id);
        const toolCounts = collectToolCounts(result.trajectory || []);
        const toolCountsWithout = collectToolCounts(result.trajectory || [], 'withoutInstructions');
        const toolCountsWith = collectToolCounts(result.trajectory || [], 'withInstructions');
        const toolCountsJudge = collectToolCounts(result.trajectory || [], 'judge');
        caseDetailsEl.innerHTML =
          '<h2>' +
          escapeHtml(result.id) +
          '</h2>' +
          '<div class="filters">' +
          '<label><input type="checkbox" id="toolsOnly" ' + (toolsOnly ? 'checked' : '') + ' /> Tools only</label>' +
          '<label>Phase ' +
          '<select id="phaseFilter">' +
          '<option value="all" ' + (phaseFilter === 'all' ? 'selected' : '') + '>All</option>' +
          '<option value="withoutInstructions" ' + (phaseFilter === 'withoutInstructions' ? 'selected' : '') + '>Without instructions</option>' +
          '<option value="withInstructions" ' + (phaseFilter === 'withInstructions' ? 'selected' : '') + '>With instructions</option>' +
          '<option value="judge" ' + (phaseFilter === 'judge' ? 'selected' : '') + '>Judge</option>' +
          '</select>' +
          '</label>' +
          '</div>' +
          '<div class="section">' +
          '<h3>Tool calls</h3>' +
          '<div class="muted">Total tool calls: ' + toolCounts.total + '</div>' +
          renderToolChips(toolCounts, 8) +
          '</div>' +
          '<div class="section">' +
          '<h3>Tool calls by phase</h3>' +
          '<div class="muted">Without: ' + toolCountsWithout.total + ' • With: ' + toolCountsWith.total + ' • Judge: ' + toolCountsJudge.total + '</div>' +
          '<div class="chips">' +
          '<span class="chip phase">withoutInstructions</span>' + renderToolChips(toolCountsWithout, 6) +
          '</div>' +
          '<div class="chips">' +
          '<span class="chip phase">withInstructions</span>' + renderToolChips(toolCountsWith, 6) +
          '</div>' +
          '<div class="chips">' +
          '<span class="chip phase">judge</span>' + renderToolChips(toolCountsJudge, 6) +
          '</div>' +
          '</div>' +
          '<div class="section">' +
          '<h3>Summary</h3>' +
          '<p><strong>Verdict:</strong> ' +
          escapeHtml(result.verdict ?? 'unknown') +
          ' (score: ' +
          escapeHtml(result.score ?? 0) +
          ')</p>' +
          '<p><strong>Prompt:</strong> ' +
          escapeHtml(result.prompt ?? '') +
          '</p>' +
          '<p><strong>Expectation:</strong> ' +
          escapeHtml(result.expectation ?? '') +
          '</p>' +
          '</div>' +
          '<div class="section">' +
          '<h3>Metrics</h3>' +
          renderMetrics(result.metrics) +
          '</div>' +
          '<div class="section">' +
          '<h3>Trajectory</h3>' +
          renderTrajectory(result.trajectory) +
          '</div>';

        const toolsCheckbox = document.getElementById('toolsOnly');
        if (toolsCheckbox) {
          toolsCheckbox.addEventListener('change', (event) => {
            toolsOnly = event.target.checked;
            renderCaseDetails(activeCaseId);
          });
        }

        const phaseSelect = document.getElementById('phaseFilter');
        if (phaseSelect) {
          phaseSelect.addEventListener('change', (event) => {
            phaseFilter = event.target.value || 'all';
            renderCaseDetails(activeCaseId);
          });
        }
      }

      renderOverallToolSummary();
      renderCaseDetails(results[0]?.id);
    </script>
  </body>
</html>`;
}

function sanitizeEventData(data: Record<string, unknown> | undefined): Record<string, unknown> | undefined {
  if (!data) return undefined;
  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    if (key === "deltaContent" && typeof value === "string") {
      sanitized.deltaChars = value.length;
      sanitized.deltaPreview = value.slice(0, 120);
      continue;
    }
    sanitized[key] = sanitizeValue(value, 0);
  }
  return sanitized;
}

function sanitizeValue(value: unknown, depth: number): unknown {
  if (depth > 4) return "[depth-limit]";
  if (typeof value === "string") {
    return value.length > 2000 ? `${value.slice(0, 2000)}…` : value;
  }
  if (Array.isArray(value)) {
    return value.slice(0, 50).map((entry) => sanitizeValue(entry, depth + 1));
  }
  if (value && typeof value === "object") {
    const obj: Record<string, unknown> = {};
    for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
      obj[key] = sanitizeValue(entry, depth + 1);
    }
    return obj;
  }
  return value;
}
