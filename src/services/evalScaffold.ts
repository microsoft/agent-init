import { assertCopilotCliReady } from "./copilot";
import { DEFAULT_MODEL } from "../config";
import { withCwd } from "../utils/cwd";

export type EvalCase = {
  id?: string;
  prompt: string;
  expectation: string;
};

export type EvalConfig = {
  instructionFile?: string;
  cases: EvalCase[];
  systemMessage?: string;
  outputPath?: string;
  ui?: {
    modelPicker?: "visible" | "hidden";
  };
};

type EvalScaffoldOptions = {
  repoPath: string;
  count: number;
  model?: string;
  // eslint-disable-next-line no-unused-vars
  onProgress?: (message: string) => void;
};

export async function generateEvalScaffold(options: EvalScaffoldOptions): Promise<EvalConfig> {
  const repoPath = options.repoPath;
  const count = Math.max(1, options.count);
  const progress = options.onProgress ?? (() => {});

  return withCwd(repoPath, async () => {
    progress("Checking Copilot CLI...");
    const cliPath = await assertCopilotCliReady();

    progress("Starting Copilot SDK...");
    const sdk = await import("@github/copilot-sdk");
    const client = new sdk.CopilotClient({ cliPath });

    try {
      progress("Creating session...");
      const preferredModel = options.model ?? DEFAULT_MODEL;
      const session = await client.createSession({
        model: preferredModel,
        streaming: true,
        systemMessage: {
          content:
            "You are an expert codebase analyst. Generate developer-oriented eval cases for this repository. Use tools (glob, view, grep) to inspect the codebase. Output ONLY JSON with keys: instructionFile, cases (array of {id,prompt,expectation})."
        },
        infiniteSessions: { enabled: false }
      });

      let content = "";
      session.on((event: { type: string; data?: Record<string, unknown> }) => {
        if (event.type === "assistant.message_delta") {
          const delta = event.data?.deltaContent as string | undefined;
          if (delta) {
            content += delta;
            progress("Generating eval cases...");
          }
        } else if (event.type === "tool.execution_start") {
          const toolName = event.data?.toolName as string | undefined;
          progress(`Using tool: ${toolName ?? "..."}`);
        } else if (event.type === "session.error") {
          const errorMsg = (event.data?.message as string) ?? "Unknown error";
          if (errorMsg.toLowerCase().includes("auth") || errorMsg.toLowerCase().includes("login")) {
            throw new Error("Copilot CLI not logged in. Run `copilot` then `/login` to authenticate.");
          }
        }
      });

      const prompt = [
        `Analyze the repository at ${repoPath} and generate ${count} eval cases.`,
        "The cases should mirror realistic developer questions about this repo.",
        "Use tools to inspect README, package.json, CLI commands, and key files.",
        "Ensure cases cover a range of topics: purpose, entrypoints, build/test, configuration, workflows.",
        "Include a systemMessage that keeps answers scoped to this repository (avoid generic Copilot CLI details unless asked).",
        "Return JSON ONLY (no markdown, no commentary) in this schema:",
        "{\n  \"instructionFile\": \".github/copilot-instructions.md\",\n  \"systemMessage\": \"...\",\n  \"cases\": [\n    {\"id\": \"case-1\", \"prompt\": \"...\", \"expectation\": \"...\"}\n  ]\n}"
      ].join("\n");

      progress("Analyzing codebase...");
      await session.sendAndWait({ prompt }, 180000);
      await session.destroy();

      const parsed = parseEvalConfig(content);
      const normalized = normalizeEvalConfig(parsed, count);
      return normalized;
    } finally {
      await client.stop();
    }
  });
}

function parseEvalConfig(raw: string): EvalConfig {
  const match = raw.match(/\{[\s\S]*\}/u);
  if (!match) {
    throw new Error("Failed to parse eval scaffold JSON.");
  }
  const parsed = JSON.parse(match[0]) as EvalConfig;
  if (!parsed || !Array.isArray(parsed.cases)) {
    throw new Error("Eval scaffold JSON is missing cases.");
  }
  return parsed;
}

function normalizeEvalConfig(parsed: EvalConfig, count: number): EvalConfig {
  const cases = (parsed.cases ?? []).slice(0, count).map((entry, index) => {
    const id = typeof entry.id === "string" && entry.id.trim() ? entry.id : `case-${index + 1}`;
    return {
      id,
      prompt: String(entry.prompt ?? "").trim(),
      expectation: String(entry.expectation ?? "").trim()
    };
  });

  if (!cases.length) {
    throw new Error("Eval scaffold JSON did not include any usable cases.");
  }

  const defaultSystemMessage =
    "You are answering questions about this repository. Use tools to inspect the repo and cite its files. Avoid generic Copilot CLI details unless the prompt explicitly asks for them.";

  return {
    instructionFile: parsed.instructionFile ?? ".github/copilot-instructions.md",
    systemMessage: parsed.systemMessage ?? defaultSystemMessage,
    cases
  };
}
