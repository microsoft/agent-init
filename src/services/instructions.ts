import fs from "fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";

type GenerateInstructionsOptions = {
  repoPath: string;
  instructionFile?: string;
  model?: string;
  onProgress?: (message: string) => void;
};

type CopilotCliConfig = {
  cliPath: string;
  cliArgs?: string[];
};

export async function generateCopilotInstructions(options: GenerateInstructionsOptions): Promise<string> {
  const repoPath = options.repoPath;
  const progress = options.onProgress ?? (() => { });

  const originalCwd = process.cwd();
  process.chdir(repoPath);

  progress("Checking Copilot CLI...");
  const cliConfig = await assertCopilotCliReady();

  progress("Starting Copilot SDK...");
  const sdk = await import("@github/copilot-sdk");
  const client = new sdk.CopilotClient({
    cliPath: cliConfig.cliPath,
    cliArgs: cliConfig.cliArgs,
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
2. Identify the tech stack: look at package.json, tsconfig.json, pyproject.toml, Cargo.toml, etc.
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

async function findCopilotCliConfig(): Promise<CopilotCliConfig> {
  const isWindows = process.platform === "win32";
  const home = process.env.HOME ?? process.env.USERPROFILE ?? "";
  const appData = process.env.APPDATA ?? "";

  // On Windows, prefer npm-installed binary and use node + cliArgs approach
  // This avoids issues with .cmd/.bat files that can't be directly spawned
  // See: https://github.com/microsoft/vscode/issues/291990
  if (isWindows) {
    const npmLoaderPath = path.join(appData, "npm", "node_modules", "@github", "copilot", "npm-loader.js");
    try {
      await fs.access(npmLoaderPath);
      // Use node with the loader script - this works reliably on Windows
      return {
        cliPath: "node",
        cliArgs: [npmLoaderPath],
      };
    } catch {
      // npm binary not found, will try VS Code shim
    }
  }

  // Try standard PATH first (works on macOS/Linux)
  try {
    const whichCmd = isWindows ? "where" : "which";
    const copilotExe = isWindows ? "copilot.exe" : "copilot";
    const { stdout } = await execFileAsync(whichCmd, [copilotExe], { timeout: 5000 });
    const firstLine = stdout.trim().split(/\r?\n/)[0];
    if (firstLine) return { cliPath: firstLine };
  } catch {
    // Ignore - will try VS Code location
  }

  // VS Code Copilot Chat extension location (fallback)
  const vscodeLocations = isWindows ? [
    // Windows locations - check for .bat scripts (preferred for cmd/powershell compatibility)
    `${appData}\\Code - Insiders\\User\\globalStorage\\github.copilot-chat\\copilotCli\\copilot.bat`,
    `${appData}\\Code\\User\\globalStorage\\github.copilot-chat\\copilotCli\\copilot.bat`,
    `${home}\\.vscode-insiders\\extensions\\github.copilot-chat-*\\copilotCli\\copilot.bat`,
    `${home}\\.vscode\\extensions\\github.copilot-chat-*\\copilotCli\\copilot.bat`,
  ] : [
    // macOS/Linux locations
    `${home}/Library/Application Support/Code - Insiders/User/globalStorage/github.copilot-chat/copilotCli/copilot`,
    `${home}/Library/Application Support/Code/User/globalStorage/github.copilot-chat/copilotCli/copilot`,
    `${home}/.vscode-insiders/extensions/github.copilot-chat-*/copilotCli/copilot`,
    `${home}/.vscode/extensions/github.copilot-chat-*/copilotCli/copilot`,
  ];

  for (const location of vscodeLocations) {
    try {
      await fs.access(location);
      return { cliPath: location };
    } catch {
      // Try next location
    }
  }

  throw new Error("Copilot CLI not found. Install GitHub Copilot Chat extension in VS Code or run: npm install -g @github/copilot");
}

async function assertCopilotCliReady(): Promise<CopilotCliConfig> {
  const config = await findCopilotCliConfig();
  const isWindows = process.platform === "win32";

  try {
    // If using node + cliArgs, test that way
    if (config.cliArgs && config.cliArgs.length > 0) {
      await execFileAsync(config.cliPath, [...config.cliArgs, "--version"], { timeout: 5000 });
    } else if (isWindows && (config.cliPath.endsWith(".bat") || config.cliPath.endsWith(".cmd"))) {
      // On Windows, .bat and .cmd files need to be run via cmd /c
      await execFileAsync("cmd", ["/c", config.cliPath, "--version"], { timeout: 5000 });
    } else {
      await execFileAsync(config.cliPath, ["--version"], { timeout: 5000 });
    }
  } catch {
    const pathDesc = config.cliArgs ? `${config.cliPath} ${config.cliArgs.join(" ")}` : config.cliPath;
    throw new Error(`Copilot CLI at ${pathDesc} is not working.`);
  }

  // Note: Copilot CLI uses its own auth system, not gh CLI.
  // User must run: copilot, then /login inside the CLI.
  return config;
}