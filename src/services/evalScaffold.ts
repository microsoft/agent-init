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
  onProgress?: (_message: string) => void;
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
            "You are an expert codebase analyst specializing in deep architectural analysis. Generate challenging, cross-cutting eval cases for this repository that require synthesizing information from multiple files and tracing logic across layers. Avoid trivial questions answerable from a single file read or grep. Use tools (glob, view, grep) extensively to inspect the codebase. Output ONLY JSON with keys: instructionFile, cases (array of {id,prompt,expectation})."
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
        `Analyze this repository and generate ${count} eval cases.`,
        "",
        "IMPORTANT: Generate HARD eval cases that require deep, cross-cutting understanding of the codebase.",
        "Each case should require synthesizing information from MULTIPLE files or tracing logic across several layers.",
        "Do NOT generate simple questions that can be answered by reading a single file or running a single grep.",
        "",
        "Good eval case examples (adapt to this repo):",
        "- Questions about how data flows end-to-end through multiple modules (e.g., 'Trace what happens when X is called — which services, transforms, and side effects are involved?')",
        "- Questions about implicit conventions or patterns that span many files (e.g., 'What error-handling pattern is used across the service layer, and where does it deviate?')",
        "- Questions requiring understanding of runtime behavior not obvious from static code (e.g., 'What is the order of initialization and what would break if module X loaded before Y?')",
        "- Questions about non-obvious interactions between components (e.g., 'How does changing config option X affect the behavior of feature Y?')",
        "- Questions about edge cases or failure modes that require reading implementation details across files",
        "- Questions that require understanding the type system, generics, or shared interfaces across module boundaries",
        "",
        "Bad eval case examples (avoid these):",
        "- 'What does this project do?' (answered by README alone)",
        "- 'How do I build/test?' (answered by package.json alone)",
        "- 'What is the entrypoint?' (answered by a single file)",
        "- Any question answerable by reading one file or searching for one keyword",
        "",
        "Use tools extensively to inspect the codebase — read multiple files, trace imports, follow call chains.",
        "If this is a monorepo (npm/pnpm/yarn workspaces, Cargo workspace, Go workspace, .NET solution, Gradle/Maven multi-module), generate cases that involve cross-app dependencies, shared libraries, and how changes in one app affect others.",
        "Ensure cases cover cross-cutting concerns: data flow, error propagation, configuration impact, implicit coupling, architectural invariants.",
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
