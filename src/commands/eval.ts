import fs from "fs/promises";
import path from "path";

import { DEFAULT_MODEL, DEFAULT_JUDGE_MODEL } from "../config";
import { listCopilotModels } from "../services/copilot";
import { generateEvalScaffold } from "../services/evalScaffold";
import { runEval } from "../services/evaluator";
import type { CommandResult } from "../utils/output";
import { outputResult, outputError, createProgressReporter, shouldLog } from "../utils/output";

type EvalOptions = {
  repo?: string;
  model?: string;
  judgeModel?: string;
  output?: string;
  init?: boolean;
  count?: string;
  listModels?: boolean;
  json?: boolean;
  quiet?: boolean;
};

export async function evalCommand(
  configPathArg: string | undefined,
  options: EvalOptions
): Promise<void> {
  const repoPath = path.resolve(options.repo ?? process.cwd());

  if (options.listModels) {
    try {
      const models = await listCopilotModels();
      if (!models.length) {
        if (options.json) {
          const result: CommandResult<{ models: string[] }> = {
            ok: true,
            status: "success",
            data: { models: [] }
          };
          outputResult(result, true);
        } else if (shouldLog(options)) {
          process.stderr.write("No models detected from Copilot CLI.\n");
        }
        return;
      }
      if (options.json) {
        const result: CommandResult<{ models: string[] }> = {
          ok: true,
          status: "success",
          data: { models }
        };
        outputResult(result, true);
      } else if (shouldLog(options)) {
        process.stderr.write(models.join("\n") + "\n");
      }
    } catch (error) {
      outputError(
        `Failed to list models: ${error instanceof Error ? error.message : String(error)}`,
        Boolean(options.json)
      );
    }
    return;
  }

  // Handle --init flag
  if (options.init) {
    const outputPath = path.join(repoPath, "primer.eval.json");
    const desiredCount = Math.max(1, Number.parseInt(options.count ?? "5", 10) || 5);
    try {
      await fs.access(outputPath);
      outputError(`primer.eval.json already exists at ${outputPath}`, Boolean(options.json));
      return;
    } catch {
      // File doesn't exist, create it
    }
    try {
      const progress = createProgressReporter(!shouldLog(options));
      const scaffold = await generateEvalScaffold({
        repoPath,
        count: desiredCount,
        model: options.model,
        onProgress: (msg) => progress.update(msg)
      });
      await fs.writeFile(outputPath, JSON.stringify(scaffold, null, 2), "utf8");

      if (options.json) {
        const result: CommandResult<{ outputPath: string }> = {
          ok: true,
          status: "success",
          data: { outputPath }
        };
        outputResult(result, true);
      } else if (shouldLog(options)) {
        process.stderr.write(`Created ${outputPath}\n`);
        process.stderr.write(
          "Edit the file to add your own test cases, then run 'primer eval' to test.\n"
        );
      }
    } catch (error) {
      outputError(
        `Failed to scaffold eval config: ${error instanceof Error ? error.message : String(error)}`,
        Boolean(options.json)
      );
    }
    return;
  }

  const configPath = path.resolve(configPathArg ?? path.join(repoPath, "primer.eval.json"));

  try {
    const { summary, viewerPath } = await runEval({
      configPath,
      repoPath,
      model: options.model ?? DEFAULT_MODEL,
      judgeModel: options.judgeModel ?? DEFAULT_JUDGE_MODEL,
      outputPath: options.output
    });

    if (options.json) {
      const result: CommandResult<{ summary: string; viewerPath?: string }> = {
        ok: true,
        status: "success",
        data: { summary, viewerPath }
      };
      outputResult(result, true);
    } else if (shouldLog(options)) {
      process.stderr.write(summary + "\n");
      if (viewerPath) {
        process.stderr.write(`Trajectory viewer: ${viewerPath}\n`);
      }
    }
  } catch (error) {
    outputError(
      `Eval failed: ${error instanceof Error ? error.message : String(error)}`,
      Boolean(options.json)
    );
  }
}
