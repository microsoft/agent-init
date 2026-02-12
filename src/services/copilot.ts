import fs from "fs/promises";
import fg from "fast-glob";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

let cachedCliPath: string | null = null;
let cachedCliPathTimestamp = 0;
const CLI_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export async function assertCopilotCliReady(): Promise<string> {
  const cliPath = await findCopilotCliPath();

  try {
    await execFileAsync(cliPath, ["--version"], { timeout: 5000 });
  } catch {
    throw new Error(`Copilot CLI at ${cliPath} is not working.`);
  }

  return cliPath;
}

export async function listCopilotModels(): Promise<string[]> {
  const cliPath = await assertCopilotCliReady();
  const { stdout } = await execFileAsync(cliPath, ["--help"], { timeout: 5000 });
  return extractModelChoices(stdout);
}

async function findCopilotCliPath(): Promise<string> {
  if (cachedCliPath && (Date.now() - cachedCliPathTimestamp) < CLI_CACHE_TTL_MS) {
    return cachedCliPath;
  }

  // Try PATH lookup first (works on all platforms)
  const whichCmd = process.platform === "win32" ? "where" : "which";
  try {
    const { stdout } = await execFileAsync(whichCmd, ["copilot"], { timeout: 5000 });
    const found = stdout.trim().split(/\r?\n/)[0];
    if (found) {
      cachedCliPath = found;
      cachedCliPathTimestamp = Date.now();
      return found;
    }
  } catch {
    // Ignore - will try VS Code locations
  }

  const home = process.env.HOME ?? process.env.USERPROFILE ?? "";
  const staticLocations: string[] = [];

  if (process.platform === "darwin") {
    staticLocations.push(
      `${home}/Library/Application Support/Code - Insiders/User/globalStorage/github.copilot-chat/copilotCli/copilot`,
      `${home}/Library/Application Support/Code/User/globalStorage/github.copilot-chat/copilotCli/copilot`
    );
  } else if (process.platform === "linux") {
    staticLocations.push(
      `${home}/.config/Code - Insiders/User/globalStorage/github.copilot-chat/copilotCli/copilot`,
      `${home}/.config/Code/User/globalStorage/github.copilot-chat/copilotCli/copilot`
    );
  } else if (process.platform === "win32") {
    const appData = process.env.APPDATA ?? "";
    if (appData) {
      staticLocations.push(
        `${appData}\\Code - Insiders\\User\\globalStorage\\github.copilot-chat\\copilotCli\\copilot.exe`,
        `${appData}\\Code\\User\\globalStorage\\github.copilot-chat\\copilotCli\\copilot.exe`
      );
    }
  }

  for (const location of staticLocations) {
    try {
      await fs.access(location);
      cachedCliPath = location;
      cachedCliPathTimestamp = Date.now();
      return location;
    } catch {
      // Try next location
    }
  }

  const ext = process.platform === "win32" ? ".exe" : "";
  const normalizedHome = home.replace(/\\/g, "/");
  const globPatterns = [
    `${normalizedHome}/.vscode-insiders/extensions/github.copilot-chat-*/copilotCli/copilot${ext}`,
    `${normalizedHome}/.vscode/extensions/github.copilot-chat-*/copilotCli/copilot${ext}`
  ];

  for (const pattern of globPatterns) {
    const matches = await fg(pattern, { onlyFiles: true });
    if (matches.length > 0) {
      cachedCliPath = matches[0];
      cachedCliPathTimestamp = Date.now();
      return matches[0];
    }
  }

  const platformHint = process.platform === "win32"
    ? " Searched APPDATA and VS Code extension paths."
    : process.platform === "linux"
      ? " Searched ~/.config/Code and VS Code extension paths."
      : " Searched ~/Library/Application Support/Code and VS Code extension paths.";

  throw new Error(`Copilot CLI not found. Install GitHub Copilot Chat extension in VS Code.${platformHint}`);
}

function extractModelChoices(helpText: string): string[] {
  const lines = helpText.split("\n");
  let captured = "";

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (!line.includes("--model")) continue;

    captured = line.trim();
    while (!captured.includes(")") && index + 1 < lines.length) {
      index += 1;
      captured += ` ${lines[index].trim()}`;
    }
    break;
  }

  const match = captured.match(/choices:\s*([^)]*)/);
  if (!match) return [];

  const models: string[] = [];
  const matcher = /"([^"]+)"/g;
  let entry = matcher.exec(match[1]);
  while (entry) {
    models.push(entry[1]);
    entry = matcher.exec(match[1]);
  }

  return models;
}
