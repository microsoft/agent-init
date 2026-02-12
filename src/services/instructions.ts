import { assertCopilotCliReady } from "./copilot";
import { DEFAULT_MODEL } from "../config";
import { withCwd } from "../utils/cwd";

type GenerateInstructionsOptions = {
  repoPath: string;
  instructionFile?: string;
  model?: string;
  onProgress?: (message: string) => void;
};

export async function generateCopilotInstructions(options: GenerateInstructionsOptions): Promise<string> {
  const repoPath = options.repoPath;
  const progress = options.onProgress ?? (() => {});

  return withCwd(repoPath, async () => {
    progress("Checking Copilot CLI...");
    const cliPath = await assertCopilotCliReady();

    progress("Starting Copilot SDK...");
    const sdk = await import("@github/copilot-sdk");
    const client = new sdk.CopilotClient({
      cliPath,
    });

    try {
      progress("Creating session...");
      const preferredModel = options.model ?? DEFAULT_MODEL;
      const session = await client.createSession({
        model: preferredModel,
        streaming: true,
        systemMessage: {
          content: "You are an expert codebase analyst. Your task is to generate a concise .github/copilot-instructions.md file. Use the available tools (glob, view, grep) to explore the codebase. Output ONLY the final markdown content, no explanations.",
        },
        infiniteSessions: { enabled: false },
      });

      let content = "";
    
      // Subscribe to events for progress and to capture content
      session.on((event) => {
        const e = event as { type: string; data?: Record<string, unknown> };
        if (e.type === "assistant.message_delta") {
          const delta = e.data?.deltaContent as string | undefined;
          if (delta) {
            content += delta;
            progress("Generating instructions...");
          }
        } else if (e.type === "tool.execution_start") {
          const toolName = e.data?.toolName as string | undefined;
          progress(`Using tool: ${toolName ?? "..."}`);
        } else if (e.type === "session.error") {
          const errorMsg = (e.data?.message as string) ?? "Unknown error";
          if (errorMsg.toLowerCase().includes("auth") || errorMsg.toLowerCase().includes("login")) {
            throw new Error("Copilot CLI not logged in. Run `copilot` then `/login` to authenticate.");
          }
        }
      });

      // Simple prompt - let the agent use tools to explore
      const prompt = `Analyze this codebase and generate a .github/copilot-instructions.md file.

Use tools to explore:
1. Check for existing instruction files: glob for **/{.github/copilot-instructions.md,AGENT.md,CLAUDE.md,.cursorrules,README.md}
2. Identify the tech stack: look at package.json, tsconfig.json, pyproject.toml, Cargo.toml, go.mod, *.csproj, *.sln, build.gradle, pom.xml, etc.
3. Understand the structure: list key directories
4. Detect monorepo structures: check for workspace configs (npm/pnpm/yarn workspaces, Cargo.toml [workspace], go.work, .sln solution files, settings.gradle include directives, pom.xml modules)

Generate concise instructions (~20-50 lines) covering:
- Tech stack and architecture
- Build/test commands
- Project-specific conventions
- Key files/directories
- Monorepo structure and per-app layout (if this is a monorepo, describe the workspace organization, how apps relate to each other, and any shared libraries)

Output ONLY the markdown content for the instructions file.`;

      progress("Analyzing codebase...");
      await session.sendAndWait({ prompt }, 180000);
      await session.destroy();

      return content.trim() || "";
    } finally {
      await client.stop();
    }
  });
}
