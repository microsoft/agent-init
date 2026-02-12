import path from "path";
import fs from "fs/promises";
import { runEval } from "../services/evaluator";
import { listCopilotModels } from "../services/copilot";
import { generateEvalScaffold } from "../services/evalScaffold";
import { DEFAULT_MODEL, DEFAULT_JUDGE_MODEL } from "../config";

type EvalOptions = {
  repo?: string;
  model?: string;
  judgeModel?: string;
  output?: string;
  init?: boolean;
  count?: string;
  listModels?: boolean;
};

export async function evalCommand(configPathArg: string | undefined, options: EvalOptions): Promise<void> {
  const repoPath = path.resolve(options.repo ?? process.cwd());

  if (options.listModels) {
    const models = await listCopilotModels();
    if (!models.length) {
      console.log("No models detected from Copilot CLI.");
      return;
    }
    console.log(models.join("\n"));
    return;
  }
  
  // Handle --init flag
  if (options.init) {
    const outputPath = path.join(repoPath, "primer.eval.json");
    const desiredCount = Math.max(1, Number.parseInt(options.count ?? "5", 10) || 5);
    try {
      await fs.access(outputPath);
      console.error(`primer.eval.json already exists at ${outputPath}`);
      process.exitCode = 1;
      return;
    } catch {
      // File doesn't exist, create it
    }
    const scaffold = await generateEvalScaffold({
      repoPath,
      count: desiredCount,
      model: options.model
    });
    await fs.writeFile(outputPath, JSON.stringify(scaffold, null, 2), "utf8");
    console.log(`Created ${outputPath}`);
    console.log("Edit the file to add your own test cases, then run 'primer eval' to test.");
    return;
  }

  const configPath = path.resolve(configPathArg ?? path.join(repoPath, "primer.eval.json"));

  const { summary, viewerPath } = await runEval({
    configPath,
    repoPath,
    model: options.model ?? DEFAULT_MODEL,
    judgeModel: options.judgeModel ?? DEFAULT_JUDGE_MODEL,
    outputPath: options.output
  });

  console.log(summary);
  if (viewerPath) {
    console.log(`Trajectory viewer: ${viewerPath}`);
  }
}
