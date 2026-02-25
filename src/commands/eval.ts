import path from "path";

import { DEFAULT_MODEL, DEFAULT_JUDGE_MODEL } from "../config";
import { listCopilotModels } from "../services/copilot";
import { generateEvalScaffold } from "../services/evalScaffold";
import { runEval } from "../services/evaluator";
import { safeWriteFile } from "../utils/fs";
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
  failLevel?: string;
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
    const outputPath = path.join(repoPath, "agentrc.eval.json");
    const desiredCount = Math.max(1, Number.parseInt(options.count ?? "5", 10) || 5);
    try {
      const progress = createProgressReporter(!shouldLog(options));
      const scaffold = await generateEvalScaffold({
        repoPath,
        count: desiredCount,
        model: options.model,
        onProgress: (msg) => progress.update(msg)
      });
      const { wrote, reason } = await safeWriteFile(
        outputPath,
        JSON.stringify(scaffold, null, 2),
        false
      );
      if (!wrote) {
        const why = reason === "symlink" ? "path is a symlink" : "file exists";
        outputError(`Skipped ${outputPath}: ${why}`, Boolean(options.json));
        return;
      }

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
          "Edit the file to add your own test cases, then run 'agentrc eval' to test.\n"
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

  const configPath = path.resolve(configPathArg ?? path.join(repoPath, "agentrc.eval.json"));

  try {
    const progress = createProgressReporter(!shouldLog(options));
    const { summary, results, viewerPath } = await runEval({
      configPath,
      repoPath,
      model: options.model ?? DEFAULT_MODEL,
      judgeModel: options.judgeModel ?? DEFAULT_JUDGE_MODEL,
      outputPath: options.output,
      onProgress: (msg) => progress.update(msg)
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

    const threshold = Number.parseInt(options.failLevel ?? "", 10);
    if (Number.isFinite(threshold)) {
      const total = results.length;
      const passed = results.filter((r) => r.verdict === "pass").length;
      const passRate = total > 0 ? Math.round((passed / total) * 100) : 0;
      if (passRate < threshold) {
        outputError(
          `Pass rate ${passRate}% (${passed}/${total}) is below threshold ${threshold}%`,
          Boolean(options.json)
        );
        process.exitCode = 1;
      }
    }
  } catch (error) {
    outputError(
      `Eval failed: ${error instanceof Error ? error.message : String(error)}`,
      Boolean(options.json)
    );
  }
}
