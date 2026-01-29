import fs from "fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

type GenerateInstructionsOptions = {
  repoPath: string;
  instructionFile?: string;
  model?: string;
  onProgress?: (message: string) => void;
};

export async function generateCopilotInstructions(options: GenerateInstructionsOptions): Promise<string> {
  const repoPath = options.repoPath;
  const progress = options.onProgress ?? (() => {});

  const originalCwd = process.cwd();
  process.chdir(repoPath);

  progress("Checking Copilot CLI...");
  const cliPath = await assertCopilotCliReady();

  progress("Starting Copilot SDK...");
  const sdk = await import("@github/copilot-sdk");
  const client = new sdk.CopilotClient({
    cliPath,
  });

  try {
    progress("Creating session...");
    // Try requested model, fall back to gpt-4.1 if gpt-5 fails
    const preferredModel = options.model ?? "gpt-4.1";
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
    const prompt = `Analyze this codebase at ${repoPath} and generate a .github/copilot-instructions.md file.

Use tools to explore:
1. Check for existing instruction files: glob for **/{.github/copilot-instructions.md,AGENT.md,CLAUDE.md,.cursorrules,README.md}
2. Identify the tech stack: look at package.json, tsconfig.json, pyproject.toml, Cargo.toml, .csproj, .fsproj, .sln, global.json, etc.
3. Understand the structure: list key directories

Generate concise instructions (~20-50 lines) covering:
- Tech stack and architecture
- Build/test commands  
- Project-specific conventions
- Key files/directories

Output ONLY the markdown content for the instructions file.`;

    progress("Analyzing codebase...");
    await session.sendAndWait({ prompt }, 180000);
    await session.destroy();

    return content.trim() || "";
  } finally {
    await client.stop();
    process.chdir(originalCwd);
  }
}

const execFileAsync = promisify(execFile);

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

async function assertCopilotCliReady(): Promise<string> {
  const cliPath = await findCopilotCliPath();
  
  try {
    await execFileAsync(cliPath, ["--version"], { timeout: 5000 });
  } catch {
    throw new Error(`Copilot CLI at ${cliPath} is not working.`);
  }

  // Note: Copilot CLI uses its own auth system, not gh CLI.
  // User must run: copilot, then /login inside the CLI.
  return cliPath;
}