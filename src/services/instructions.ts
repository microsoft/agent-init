import fs from "fs/promises";
import path from "path";

import { DEFAULT_MODEL } from "../config";
import { ensureDir, safeWriteFile } from "../utils/fs";

import type { Area } from "./analyzer";
import { sanitizeAreaName } from "./analyzer";
import { assertCopilotCliReady } from "./copilot";
import { createCopilotClient } from "./copilotSdk";

export type ExistingInstructionsContext = {
  /** AGENTS.md files found in the repo tree. */
  agentsMdFiles: string[];
  /** CLAUDE.md files found in the repo tree. */
  claudeMdFiles: string[];
  /** .github/instructions/*.instructions.md files. */
  instructionMdFiles: string[];
};

/**
 * Detect existing AI instruction files in a repository.
 * Returns context about AGENTS.md, CLAUDE.md, and .instructions.md files
 * so instruction generation can avoid duplicating content they already cover.
 */
export async function detectExistingInstructions(
  repoPath: string
): Promise<ExistingInstructionsContext> {
  const { agentsMdFiles, claudeMdFiles } = await findInstructionMarkerFiles(repoPath);
  const instructionMdFiles = await findModularInstructionFiles(repoPath);
  return { agentsMdFiles, claudeMdFiles, instructionMdFiles };
}

/**
 * Walk the repo tree to find AGENTS.md and CLAUDE.md files,
 * excluding directories that cannot contain user-authored content.
 */
async function findInstructionMarkerFiles(repoPath: string): Promise<{
  agentsMdFiles: string[];
  claudeMdFiles: string[];
}> {
  const agentsMdFiles: string[] = [];
  const claudeMdFiles: string[] = [];
  const excludeDirs = new Set([".git", "node_modules", "apm_modules", ".apm"]);

  async function walk(dir: string, relPath: string): Promise<void> {
    const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => []);
    for (const entry of entries) {
      if (excludeDirs.has(entry.name)) continue;
      if (entry.isSymbolicLink()) continue;
      if (entry.isFile()) {
        if (entry.name === "AGENTS.md") {
          agentsMdFiles.push(relPath ? `${relPath}/${entry.name}` : entry.name);
        } else if (entry.name === "CLAUDE.md") {
          claudeMdFiles.push(relPath ? `${relPath}/${entry.name}` : entry.name);
        }
      } else if (entry.isDirectory()) {
        await walk(path.join(dir, entry.name), relPath ? `${relPath}/${entry.name}` : entry.name);
      }
    }
  }

  await walk(repoPath, "");
  return { agentsMdFiles: agentsMdFiles.sort(), claudeMdFiles: claudeMdFiles.sort() };
}

/**
 * Find modular .instructions.md files in .github/instructions/.
 */
async function findModularInstructionFiles(repoPath: string): Promise<string[]> {
  const dir = path.join(repoPath, ".github", "instructions");
  const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => []);
  return entries
    .filter((e) => !e.isSymbolicLink() && e.isFile() && e.name.endsWith(".instructions.md"))
    .map((e) => `.github/instructions/${e.name}`)
    .sort();
}

/**
 * Build a prompt section listing existing instruction files.
 * Only emits content when instruction files actually exist,
 * so the LLM knows what content is already covered.
 */
export function buildExistingInstructionsSection(ctx: ExistingInstructionsContext): string {
  const allFiles = [...ctx.agentsMdFiles, ...ctx.claudeMdFiles, ...ctx.instructionMdFiles];
  if (allFiles.length === 0) return "";

  const lines: string[] = [
    "",
    "## Existing Instruction Files",
    "This repo already contains instruction files that AI agents load automatically:",
    ...allFiles.map((f) => `- \`${f}\``),
    "",
    "### Output rules",
    "- Content in the above files is already loaded by AI agents — do not restate it.",
    "- For topics covered by existing files, use a single markdown link (e.g., `See [AGENTS.md](AGENTS.md)`).",
    "- Focus only on project-specific conventions not already covered by the above files.",
    ""
  ];

  return lines.join("\n");
}

type GenerateInstructionsOptions = {
  repoPath: string;
  model?: string;
  onProgress?: (message: string) => void;
};

export async function generateCopilotInstructions(
  options: GenerateInstructionsOptions
): Promise<string> {
  const repoPath = options.repoPath;
  const progress = options.onProgress ?? (() => {});

  progress("Checking Copilot CLI...");
  const cliConfig = await assertCopilotCliReady();

  progress("Detecting existing instructions...");
  const existingCtx = await detectExistingInstructions(repoPath);
  const existingSection = buildExistingInstructionsSection(existingCtx);
  const hasExistingInstructions = existingSection.length > 0;

  progress("Starting Copilot SDK...");
  const client = await createCopilotClient(cliConfig);

  try {
    progress("Creating session...");
    const preferredModel = options.model ?? DEFAULT_MODEL;

    const systemContent = hasExistingInstructions
      ? "You are an expert codebase analyst. Your task is to generate a concise .github/copilot-instructions.md that complements existing instruction files. Use the available tools (glob, view, grep) to explore the codebase. Output ONLY the final markdown content, no explanations."
      : "You are an expert codebase analyst. Your task is to generate a concise .github/copilot-instructions.md file. Use the available tools (glob, view, grep) to explore the codebase. Output ONLY the final markdown content, no explanations.";

    const session = await client.createSession({
      model: preferredModel,
      streaming: true,
      workingDirectory: repoPath,
      systemMessage: {
        content: systemContent
      },
      infiniteSessions: { enabled: false }
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
          throw new Error(
            "Copilot CLI not logged in. Run `copilot` then `/login` to authenticate."
          );
        }
      }
    });

    // Simple prompt - let the agent use tools to explore
    const prompt = `Analyze this codebase and generate a .github/copilot-instructions.md file.

Fan out multiple Explore subagents to map out the codebase in parallel:
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
${existingSection}
Output ONLY the markdown content for the instructions file, not wrapped in markdown code fences.`;

    progress("Analyzing codebase...");
    await session.sendAndWait({ prompt }, 180000);
    await session.destroy();

    return content.trim() || "";
  } finally {
    await client.stop();
  }
}

type GenerateAreaInstructionsOptions = {
  repoPath: string;
  area: Area;
  model?: string;
  onProgress?: (message: string) => void;
};

export async function generateAreaInstructions(
  options: GenerateAreaInstructionsOptions
): Promise<string> {
  const { repoPath, area } = options;
  const progress = options.onProgress ?? (() => {});

  progress(`Checking Copilot CLI for area "${area.name}"...`);
  const cliConfig = await assertCopilotCliReady();

  progress(`Detecting existing instructions for area "${area.name}"...`);
  const existingCtx = await detectExistingInstructions(repoPath);
  const existingSection = buildExistingInstructionsSection(existingCtx);
  const hasExistingInstructions = existingSection.length > 0;

  progress(`Starting Copilot SDK for area "${area.name}"...`);
  const client = await createCopilotClient(cliConfig);

  try {
    const applyToPatterns = Array.isArray(area.applyTo) ? area.applyTo : [area.applyTo];
    const applyToStr = applyToPatterns.join(", ");

    progress(`Creating session for area "${area.name}"...`);
    const preferredModel = options.model ?? DEFAULT_MODEL;

    const areaSystemContent = hasExistingInstructions
      ? `You are an expert codebase analyst. Your task is to generate a concise .instructions.md file for a specific area of a codebase. This file will be used as a file-based custom instruction in VS Code Copilot, automatically applied when working on files matching certain patterns. This file should complement, not duplicate, existing instruction files. Use the Explore subagents and read-only tools to explore the codebase. Output ONLY the final markdown content, not wrapped in markdown code fences.`
      : `You are an expert codebase analyst. Your task is to generate a concise .instructions.md file for a specific area of a codebase. This file will be used as a file-based custom instruction in VS Code Copilot, automatically applied when working on files matching certain patterns. Use the Explore subagents and read-only tools to explore the codebase. Output ONLY the final markdown content, not wrapped in markdown code fences.`;

    const session = await client.createSession({
      model: preferredModel,
      streaming: true,
      workingDirectory: repoPath,
      systemMessage: {
        content: areaSystemContent
      },
      infiniteSessions: { enabled: false }
    });

    let content = "";

    session.on((event) => {
      const e = event as { type: string; data?: Record<string, unknown> };
      if (e.type === "assistant.message_delta") {
        const delta = e.data?.deltaContent as string | undefined;
        if (delta) {
          content += delta;
          progress(`Generating instructions for "${area.name}"...`);
        }
      } else if (e.type === "tool.execution_start") {
        const toolName = e.data?.toolName as string | undefined;
        progress(`${area.name}: using tool ${toolName ?? "..."}`);
      } else if (e.type === "session.error") {
        const errorMsg = (e.data?.message as string) ?? "Unknown error";
        if (errorMsg.toLowerCase().includes("auth") || errorMsg.toLowerCase().includes("login")) {
          throw new Error(
            "Copilot CLI not logged in. Run `copilot` then `/login` to authenticate."
          );
        }
      }
    });

    const prompt = `Analyze the "${area.name}" area of this codebase and generate a file-based instruction file.

This area covers files matching: ${applyToStr}
${area.description ? `Description: ${area.description}` : ""}

Use tools to explore ONLY the files and directories within this area:
1. List the key files: glob for ${applyToPatterns.map((p) => `"${p}"`).join(", ")}
2. Identify the tech stack, dependencies, and frameworks used in this area
3. Look at key source files to understand patterns and conventions specific to this area

Generate concise instructions (~10-30 lines) covering:
- What this area does and its role in the overall project
- Area-specific tech stack, dependencies, and frameworks
- Coding conventions and patterns specific to this area
- Build/test commands relevant to this area (if different from root)
- Key files and directory structure within this area

IMPORTANT:
- Focus ONLY on this specific area, not the whole repo
- Do NOT repeat repo-wide information (that goes in the root copilot-instructions.md)
- Keep it complementary to root instructions
${existingSection ? `- Do NOT duplicate content already covered by existing instruction files\n${existingSection}` : ""}
- Output ONLY the markdown content, no YAML frontmatter, no code fences`;

    progress(`Analyzing area "${area.name}"...`);
    await session.sendAndWait({ prompt }, 180000);
    await session.destroy();

    return content.trim() || "";
  } finally {
    await client.stop();
  }
}

function escapeYamlString(value: string): string {
  return value
    .replace(/\0/gu, "")
    .replace(/\\/gu, "\\\\")
    .replace(/"/gu, '\\"')
    .replace(/\n/gu, "\\n")
    .replace(/\r/gu, "\\r")
    .replace(/\t/gu, "\\t");
}

export function buildAreaFrontmatter(area: Area): string {
  const applyTo = Array.isArray(area.applyTo) ? area.applyTo : [area.applyTo];
  const applyToValue =
    applyTo.length === 1
      ? `"${escapeYamlString(applyTo[0])}"`
      : `[${applyTo.map((p) => `"${escapeYamlString(p)}"`).join(", ")}]`;
  const desc = area.description
    ? `Use when working on ${area.name}. ${area.description}`
    : `Use when working on ${area.name}`;

  return `---
description: "${escapeYamlString(desc)}"
applyTo: ${applyToValue}
---`;
}

export function buildAreaInstructionContent(area: Area, body: string): string {
  return `${buildAreaFrontmatter(area)}\n\n${body}\n`;
}

export function areaInstructionPath(repoPath: string, area: Area): string {
  return path.join(
    repoPath,
    ".github",
    "instructions",
    `${sanitizeAreaName(area.name)}.instructions.md`
  );
}

export type WriteAreaResult = {
  status: "written" | "skipped" | "symlink" | "empty";
  filePath: string;
};

export async function writeAreaInstruction(
  repoPath: string,
  area: Area,
  body: string,
  force?: boolean
): Promise<WriteAreaResult> {
  const filePath = areaInstructionPath(repoPath, area);
  if (!body.trim()) return { status: "empty", filePath };
  await ensureDir(path.dirname(filePath));
  const { wrote, reason } = await safeWriteFile(
    filePath,
    buildAreaInstructionContent(area, body),
    Boolean(force)
  );
  if (!wrote) {
    return { status: reason === "symlink" ? "symlink" : "skipped", filePath };
  }
  return { status: "written", filePath };
}
