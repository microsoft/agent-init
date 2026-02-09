import path from "path";
import fs from "fs/promises";
import { analyzeRepo } from "../services/analyzer";
import { generateConfigs } from "../services/generator";
import { generateCopilotInstructions } from "../services/instructions";
import { ensureDir } from "../utils/fs";

type GenerateOptions = {
  force?: boolean;
  perApp?: boolean;
};

export async function generateCommand(type: string, repoPathArg: string | undefined, options: GenerateOptions): Promise<void> {
  const allowed = new Set(["mcp", "vscode", "instructions", "agents"]);
  if (!allowed.has(type)) {
    console.error("Invalid type. Use: instructions, agents, mcp, vscode.");
    process.exitCode = 1;
    return;
  }

  const repoPath = path.resolve(repoPathArg ?? process.cwd());
  const analysis = await analyzeRepo(repoPath);

  if (type === "instructions" || type === "agents") {
    const apps = analysis.apps ?? [];
    const targets: Array<{ repoPath: string; savePath: string; label: string }> = [];

    if (options.perApp && analysis.isMonorepo && apps.length > 1) {
      for (const app of apps) {
        const savePath = type === "instructions"
          ? path.join(app.path, ".github", "copilot-instructions.md")
          : path.join(app.path, "AGENTS.md");
        targets.push({ repoPath: app.path, savePath, label: app.name });
      }
    } else {
      const savePath = type === "instructions"
        ? path.join(repoPath, ".github", "copilot-instructions.md")
        : path.join(repoPath, "AGENTS.md");
      targets.push({ repoPath, savePath, label: path.basename(repoPath) });
    }

    for (const target of targets) {
      console.log(`Generating ${type} for ${target.label}...`);
      try {
        const content = await generateCopilotInstructions({
          repoPath: target.repoPath,
        });
        if (!content.trim()) {
          console.error(`  No content generated for ${target.label}.`);
          continue;
        }
        await ensureDir(path.dirname(target.savePath));
        await fs.writeFile(target.savePath, content, "utf8");
        console.log(`  ✓ ${path.relative(process.cwd(), target.savePath)}`);
      } catch (error) {
        console.error(`  ✗ ${error instanceof Error ? error.message : String(error)}`);
      }
    }
    return;
  }

  const selections = [type];
  const result = await generateConfigs({
    repoPath,
    analysis,
    selections,
    force: Boolean(options.force)
  });

  console.log(result.summary);
}
