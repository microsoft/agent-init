import path from "path";

import { analyzeRepo } from "../services/analyzer";
import type { FileAction } from "../services/generator";
import { generateConfigs } from "../services/generator";
import type { CommandResult } from "../utils/output";
import { outputResult, outputError, deriveFileStatus, shouldLog } from "../utils/output";

type GenerateOptions = {
  force?: boolean;
  json?: boolean;
  quiet?: boolean;
};

export async function generateCommand(
  type: string,
  repoPathArg: string | undefined,
  options: GenerateOptions
): Promise<void> {
  const allowed = new Set(["mcp", "vscode"]);
  if (!allowed.has(type)) {
    outputError(
      "Invalid type. Use: mcp, vscode. For instructions, use the 'instructions' command.",
      Boolean(options.json)
    );
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
