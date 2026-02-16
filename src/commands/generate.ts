import path from "path";

import { analyzeRepo } from "../services/analyzer";
import type { FileAction } from "../services/generator";
import { generateConfigs } from "../services/generator";
import { generateCopilotInstructions } from "../services/instructions";
import { ensureDir, safeWriteFile } from "../utils/fs";
import type { CommandResult } from "../utils/output";
import {
  outputResult,
  outputError,
  deriveFileStatus,
  createProgressReporter,
  shouldLog
} from "../utils/output";

type GenerateOptions = {
  force?: boolean;
  perApp?: boolean;
  model?: string;
  json?: boolean;
  quiet?: boolean;
};

export async function generateCommand(
  type: string,
  repoPathArg: string | undefined,
  options: GenerateOptions
): Promise<void> {
  const allowed = new Set(["mcp", "vscode", "instructions", "agents"]);
  if (!allowed.has(type)) {
    outputError("Invalid type. Use: instructions, agents, mcp, vscode.", Boolean(options.json));
    return;
  }

  const repoPath = path.resolve(repoPathArg ?? process.cwd());
  let analysis;
  try {
    analysis = await analyzeRepo(repoPath);
  } catch (error) {
    outputError(
      `Failed to analyze repo: ${error instanceof Error ? error.message : String(error)}`,
      Boolean(options.json)
    );
    return;
  }
  const allFiles: FileAction[] = [];

  if (type === "instructions" || type === "agents") {
    const apps = analysis.apps ?? [];
    const targets: Array<{ repoPath: string; savePath: string; label: string }> = [];

    if (options.perApp && analysis.isMonorepo && apps.length > 1) {
      for (const app of apps) {
        const savePath =
          type === "instructions"
            ? path.join(app.path, ".github", "copilot-instructions.md")
            : path.join(app.path, "AGENTS.md");
        targets.push({ repoPath: app.path, savePath, label: app.name });
      }
    } else {
      const savePath =
        type === "instructions"
          ? path.join(repoPath, ".github", "copilot-instructions.md")
          : path.join(repoPath, "AGENTS.md");
      targets.push({ repoPath, savePath, label: path.basename(repoPath) });
    }

    for (const target of targets) {
      if (shouldLog(options)) {
        process.stderr.write(`Generating ${type} for ${target.label}...\n`);
      }
      try {
        const progress = createProgressReporter(!shouldLog(options));
        const content = await generateCopilotInstructions({
          repoPath: target.repoPath,
          model: options.model,
          onProgress: (msg) => progress.update(msg)
        });
        if (!content.trim()) {
          if (shouldLog(options)) {
            process.stderr.write(`  No content generated for ${target.label}.\n`);
          }
          allFiles.push({ path: path.relative(process.cwd(), target.savePath), action: "skipped" });
          continue;
        }
        await ensureDir(path.dirname(target.savePath));
        const rel = path.relative(process.cwd(), target.savePath);
        const { wrote, reason } = await safeWriteFile(
          target.savePath,
          content,
          Boolean(options.force)
        );
        if (!wrote) {
          const why = reason === "symlink" ? "path is a symlink" : "file exists (use --force)";
          if (shouldLog(options)) {
            process.stderr.write(`  Skipped ${rel}: ${why}\n`);
          }
          allFiles.push({ path: rel, action: "skipped" });
          continue;
        }
        allFiles.push({ path: rel, action: "wrote" });
        if (shouldLog(options)) {
          process.stderr.write(`  ✓ ${rel}\n`);
        }
      } catch (error) {
        if (shouldLog(options)) {
          process.stderr.write(`  ✗ ${error instanceof Error ? error.message : String(error)}\n`);
        }
        allFiles.push({ path: path.relative(process.cwd(), target.savePath), action: "skipped" });
      }
    }

    if (options.json) {
      const { ok, status } = deriveFileStatus(allFiles);
      const result: CommandResult<{ type: string; files: FileAction[] }> = {
        ok,
        status,
        data: { type, files: allFiles }
      };
      outputResult(result, true);
      if (!ok) process.exitCode = 1;
    }
    return;
  }

  const selections = [type];
  let genResult;
  try {
    genResult = await generateConfigs({
      repoPath,
      analysis,
      selections,
      force: Boolean(options.force)
    });
  } catch (error) {
    outputError(
      `Failed to generate configs: ${error instanceof Error ? error.message : String(error)}`,
      Boolean(options.json)
    );
    return;
  }

  if (options.json) {
    const { ok, status } = deriveFileStatus(genResult.files);
    const result: CommandResult<{ type: string; files: FileAction[] }> = {
      ok,
      status,
      data: { type, files: genResult.files }
    };
    outputResult(result, true);
    if (!ok) process.exitCode = 1;
  } else {
    for (const file of genResult.files) {
      if (shouldLog(options)) {
        process.stderr.write(`${file.action === "wrote" ? "Wrote" : "Skipped"} ${file.path}\n`);
      }
    }
    if (genResult.files.length === 0 && shouldLog(options)) {
      process.stderr.write("No changes made.\n");
    }
  }
}
