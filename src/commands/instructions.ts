import path from "path";

import {
  generateCopilotInstructions,
  generateAreaInstructions,
  writeAreaInstruction
} from "../services/instructions";
import { analyzeRepo } from "../services/analyzer";
import { ensureDir, safeWriteFile } from "../utils/fs";
import type { CommandResult } from "../utils/output";
import { outputResult, outputError, createProgressReporter, shouldLog } from "../utils/output";

type InstructionsOptions = {
  repo?: string;
  output?: string;
  model?: string;
  json?: boolean;
  quiet?: boolean;
  force?: boolean;
  areas?: boolean;
  areasOnly?: boolean;
  area?: string;
};

export async function instructionsCommand(options: InstructionsOptions): Promise<void> {
  const repoPath = path.resolve(options.repo ?? process.cwd());
  const outputPath = path.resolve(
    options.output ?? path.join(repoPath, ".github", "copilot-instructions.md")
  );
  const progress = createProgressReporter(!shouldLog(options));
  const wantAreas = options.areas || options.areasOnly || options.area;

  try {
    // Generate root instructions unless --areas-only
    if (!options.areasOnly && !options.area) {
      let content = "";
      try {
        progress.update("Generating instructions...");
        content = await generateCopilotInstructions({
          repoPath,
          model: options.model
        });
      } catch (error) {
        const msg =
          "Failed to generate instructions with Copilot SDK. " +
          "Ensure the Copilot CLI is installed (copilot --version) and logged in. " +
          (error instanceof Error ? error.message : String(error));
        outputError(msg, Boolean(options.json));
        if (!wantAreas) return;
      }
      if (!content && !wantAreas) {
        outputError("No instructions were generated.", Boolean(options.json));
        return;
      }

      if (content) {
        await ensureDir(path.dirname(outputPath));
        const { wrote, reason } = await safeWriteFile(
          outputPath,
          content,
          Boolean(options.force)
        );

        if (!wrote) {
          const relPath = path.relative(process.cwd(), outputPath);
          const why = reason === "symlink" ? "path is a symlink" : "file exists (use --force)";
          if (options.json) {
            const result: CommandResult<{ outputPath: string; skipped: true; reason: string }> = {
              ok: true,
              status: "noop",
              data: { outputPath, skipped: true, reason: why }
            };
            outputResult(result, true);
          } else if (shouldLog(options)) {
            progress.update(`Skipped ${relPath}: ${why}`);
          }
        } else {
          const byteCount = Buffer.byteLength(content, "utf8");

          if (options.json) {
            const result: CommandResult<{ outputPath: string; model: string; byteCount: number }> = {
              ok: true,
              status: "success",
              data: { outputPath, model: options.model ?? "default", byteCount }
            };
            outputResult(result, true);
          } else if (shouldLog(options)) {
            progress.succeed(`Updated ${path.relative(process.cwd(), outputPath)}`);
          }
        }
      }
    }

    // Generate area-based instructions
    if (wantAreas) {
      let analysis;
      try {
        analysis = await analyzeRepo(repoPath);
      } catch (error) {
        outputError(
          `Failed to analyze repository: ${error instanceof Error ? error.message : String(error)}`,
          Boolean(options.json)
        );
        return;
      }
      const areas = analysis.areas ?? [];

      if (areas.length === 0) {
        if (shouldLog(options)) {
          progress.update("No areas detected. Use primer.config.json to define custom areas.");
        }
        return;
      }

      const areaFilter = options.area?.toLowerCase();
      const targetAreas = areaFilter
        ? areas.filter((a) => a.name.toLowerCase() === areaFilter)
        : areas;

      if (options.area && targetAreas.length === 0) {
        outputError(
          `Area "${options.area}" not found. Available: ${areas.map((a) => a.name).join(", ")}`,
          Boolean(options.json)
        );
        return;
      }

      if (shouldLog(options)) {
        progress.update(`Generating file-based instructions for ${targetAreas.length} area(s)...`);
      }

      for (const area of targetAreas) {
        try {
          if (shouldLog(options)) {
            progress.update(
              `Generating for "${area.name}" (${Array.isArray(area.applyTo) ? area.applyTo.join(", ") : area.applyTo})...`
            );
          }
          const body = await generateAreaInstructions({
            repoPath,
            area,
            model: options.model,
            onProgress: shouldLog(options) ? (msg) => progress.update(msg) : undefined
          });

          if (!body.trim()) {
            if (shouldLog(options)) {
              progress.update(`Skipped "${area.name}" — no content generated.`);
            }
            continue;
          }

          const result = await writeAreaInstruction(repoPath, area, body, options.force);
          if (result.status === "skipped") {
            if (shouldLog(options)) {
              progress.update(`Skipped "${area.name}" — file exists (use --force to overwrite).`);
            }
            continue;
          }
          if (result.status === "symlink") {
            if (shouldLog(options)) {
              progress.update(`Skipped "${area.name}" — path is a symlink.`);
            }
            continue;
          }
          if (shouldLog(options)) {
            progress.succeed(`Wrote ${path.relative(process.cwd(), result.filePath)}`);
          }
        } catch (error) {
          if (shouldLog(options)) {
            progress.update(
              `Failed for "${area.name}": ${error instanceof Error ? error.message : String(error)}`
            );
          }
        }
      }
    }

    if (!wantAreas && shouldLog(options) && !options.json) {
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
