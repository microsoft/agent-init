import path from "path";

import {
  generateCopilotInstructions,
  generateAreaInstructions,
  writeAreaInstruction,
  areaInstructionPath
} from "../services/instructions";
import { analyzeRepo } from "../services/analyzer";
import type { Area } from "../services/analyzer";
import { ensureDir, safeWriteFile } from "../utils/fs";
import type { FileAction } from "../services/generator";
import type { CommandResult } from "../utils/output";
import {
  outputResult,
  outputError,
  deriveFileStatus,
  createProgressReporter,
  shouldLog
} from "../utils/output";

type InstructionsFormat = "copilot-instructions" | "agents-md";

type InstructionsOptions = {
  repo?: string;
  output?: string;
  model?: string;
  format?: InstructionsFormat;
  perApp?: boolean;
  json?: boolean;
  quiet?: boolean;
  force?: boolean;
  areas?: boolean;
  areasOnly?: boolean;
  area?: string;
};

export function resolveOutputPath(
  basePath: string,
  format: InstructionsFormat,
  customOutput?: string
): string {
  if (customOutput) return path.resolve(customOutput);
  return format === "agents-md"
    ? path.join(basePath, "AGENTS.md")
    : path.join(basePath, ".github", "copilot-instructions.md");
}

export async function instructionsCommand(options: InstructionsOptions): Promise<void> {
  const repoPath = path.resolve(options.repo ?? process.cwd());
  const format: InstructionsFormat = options.format ?? "copilot-instructions";
  const progress = createProgressReporter(!shouldLog(options));
  const wantAreas = options.areas || options.areasOnly || options.area;
  const allFiles: FileAction[] = [];

  try {
    // Validate option conflicts
    if (options.perApp && options.output) {
      outputError(
        "--output cannot be combined with --per-app (each app gets its own file)",
        Boolean(options.json)
      );
      return;
    }

    // Analyze repo for --per-app or --areas
    let analysis;
    if (options.perApp || wantAreas) {
      try {
        analysis = await analyzeRepo(repoPath);
      } catch (error) {
        outputError(
          `Failed to analyze repository: ${error instanceof Error ? error.message : String(error)}`,
          Boolean(options.json)
        );
        return;
      }
    }

    // Validate --area early (before generating root instructions)
    let targetAreas: Area[] = [];
    if (wantAreas) {
      const areas = analysis!.areas ?? [];
      if (options.area) {
        const areaFilter = options.area.toLowerCase();
        targetAreas = areas.filter((a) => a.name.toLowerCase() === areaFilter);
        if (targetAreas.length === 0) {
          outputError(
            `Area "${options.area}" not found. Available: ${areas.map((a) => a.name).join(", ")}`,
            Boolean(options.json)
          );
          return;
        }
      } else {
        targetAreas = areas;
      }
    }

    // Build generation targets
    const targets: Array<{ repoPath: string; savePath: string; label: string }> = [];
    const apps = analysis?.apps ?? [];

    if (options.perApp && analysis?.isMonorepo && apps.length > 1) {
      for (const app of apps) {
        const savePath = resolveOutputPath(app.path, format);
        targets.push({ repoPath: app.path, savePath, label: app.name });
      }
    } else if (!options.areasOnly && !options.area) {
      const outputPath = resolveOutputPath(repoPath, format, options.output);
      targets.push({ repoPath, savePath: outputPath, label: path.basename(repoPath) });
    }

    // Generate root instructions for each target
    for (const target of targets) {
      progress.update(`Generating ${format} for ${target.label}...`);
      try {
        const content = await generateCopilotInstructions({
          repoPath: target.repoPath,
          model: options.model,
          onProgress: (msg) => progress.update(msg)
        });
        if (!content.trim()) {
          progress.update(`No content generated for ${target.label}.`);
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
          progress.update(`Skipped ${rel}: ${why}`);
          allFiles.push({ path: rel, action: "skipped" });
        } else {
          allFiles.push({ path: rel, action: "wrote" });
          progress.succeed(`Wrote ${rel}`);
        }
      } catch (error) {
        const msg =
          "Failed to generate instructions with Copilot SDK. " +
          "Ensure the Copilot CLI is installed (copilot --version) and logged in. " +
          (error instanceof Error ? error.message : String(error));
        progress.fail(msg);
        allFiles.push({ path: path.relative(process.cwd(), target.savePath), action: "skipped" });
        if (!wantAreas) {
          break;
        }
      }
    }

    // Generate area-based instructions
    if (wantAreas) {
      if (targetAreas.length === 0) {
        progress.update("No areas detected. Use primer.config.json to define custom areas.");
      } else {
        progress.update(`Generating file-based instructions for ${targetAreas.length} area(s)...`);

        for (const area of targetAreas) {
          const areaRel = path.relative(process.cwd(), areaInstructionPath(repoPath, area));
          try {
            progress.update(
              `Generating for "${area.name}" (${Array.isArray(area.applyTo) ? area.applyTo.join(", ") : area.applyTo})...`
            );
            const body = await generateAreaInstructions({
              repoPath,
              area,
              model: options.model,
              onProgress: (msg) => progress.update(msg)
            });

            if (!body.trim()) {
              progress.update(`Skipped "${area.name}" — no content generated.`);
              allFiles.push({ path: areaRel, action: "skipped" });
              continue;
            }

            const result = await writeAreaInstruction(repoPath, area, body, options.force);
            if (result.status === "written") {
              allFiles.push({ path: areaRel, action: "wrote" });
              progress.succeed(`Wrote ${areaRel}`);
            } else {
              const why =
                result.status === "symlink"
                  ? "path is a symlink"
                  : "file exists (use --force to overwrite)";
              progress.update(`Skipped "${area.name}" — ${why}.`);
              allFiles.push({ path: areaRel, action: "skipped" });
            }
          } catch (error) {
            progress.fail(
              `Failed for "${area.name}": ${error instanceof Error ? error.message : String(error)}`
            );
            allFiles.push({ path: areaRel, action: "skipped" });
          }
        }
      }
    }

    // Output JSON result
    if (options.json) {
      const { ok, status } = deriveFileStatus(allFiles);
      const result: CommandResult<{ format: string; files: FileAction[] }> = {
        ok,
        status,
        data: { format, files: allFiles }
      };
      outputResult(result, true);
      if (!ok) process.exitCode = 1;
    } else if (!wantAreas && shouldLog(options)) {
      process.stderr.write(
        "Please review and share feedback on any unclear or incomplete sections.\n"
      );
    }
  } catch (error) {
    outputError(
      `Instructions failed: ${error instanceof Error ? error.message : String(error)}`,
      Boolean(options.json)
    );
  }
}
