import { Command } from "commander";

import { analyzeCommand } from "./commands/analyze";
import { batchCommand } from "./commands/batch";
import { batchReadinessCommand } from "./commands/batchReadiness";
import { evalCommand } from "./commands/eval";
import { generateCommand } from "./commands/generate";
import { initCommand } from "./commands/init";
import { instructionsCommand } from "./commands/instructions";
import { prCommand } from "./commands/pr";
import { readinessCommand } from "./commands/readiness";
import { tuiCommand } from "./commands/tui";
import { DEFAULT_MODEL, DEFAULT_JUDGE_MODEL } from "./config";

/**
 * Merge program-level --json/--quiet into each command's local options
 * so every action handler receives a unified options object.
 */
export function withGlobalOpts<TArgs extends unknown[], TOptions extends Record<string, unknown>>(
  fn: (...args: [...TArgs, TOptions]) => Promise<void>
): (...raw: unknown[]) => Promise<void> {
  return async (...raw: unknown[]) => {
    const cmd = raw[raw.length - 1] as Command;
    const localOpts = raw[raw.length - 2] as TOptions;
    const globalOpts = cmd.optsWithGlobals();
    const merged = { ...localOpts, json: globalOpts.json, quiet: globalOpts.quiet } as TOptions;
    raw[raw.length - 2] = merged;
    raw.pop(); // remove Command
    await (fn as (...args: unknown[]) => Promise<void>)(...raw);
  };
}

export function runCli(argv: string[]): void {
  const program = new Command();

  program
    .name("primer")
    .description("Prime repositories for AI-assisted development")
    .version("1.0.0")
    .option("--json", "Output machine-readable JSON to stdout")
    .option("--quiet", "Suppress stderr progress output");

  program
    .command("init")
    .argument("[path]", "Path to a local repository")
    .option("--github", "Use a GitHub repository")
    .option("--provider <provider>", "Repo provider (github|azure)")
    .option("--yes", "Accept defaults (generates instructions, MCP, and VS Code configs)")
    .option("--force", "Overwrite existing files")
    .action(withGlobalOpts(initCommand));

  program
    .command("analyze")
    .argument("[path]", "Path to a local repository")
    .action(withGlobalOpts(analyzeCommand));

  program
    .command("generate")
    .argument("<type>", "instructions|agents|mcp|vscode")
    .argument("[path]", "Path to a local repository")
    .option("--force", "Overwrite existing files")
    .option("--per-app", "Generate per-app in monorepos")
    .action(withGlobalOpts(generateCommand));

  program
    .command("pr")
    .argument("[repo]", "Repo identifier (github: owner/name, azure: org/project/repo)")
    .option("--branch <name>", "Branch name")
    .option("--provider <provider>", "Repo provider (github|azure)")
    .action(withGlobalOpts(prCommand));

  program
    .command("eval")
    .argument("[path]", "Path to eval config JSON")
    .option("--repo <path>", "Repository path", process.cwd())
    .option("--model <name>", "Model for responses", DEFAULT_MODEL)
    .option("--judge-model <name>", "Model for judging", DEFAULT_JUDGE_MODEL)
    .option("--list-models", "List Copilot CLI models and exit")
    .option("--output <path>", "Write results JSON to file")
    .option("--init", "Create a starter primer.eval.json file")
    .option("--count <number>", "Number of eval cases to generate (with --init)")
    .action(withGlobalOpts(evalCommand));

  program
    .command("tui")
    .option("--repo <path>", "Repository path", process.cwd())
    .option("--no-animation", "Skip the animated banner intro")
    .action(withGlobalOpts(tuiCommand));

  program
    .command("instructions")
    .option("--repo <path>", "Repository path", process.cwd())
    .option("--output <path>", "Output path for copilot instructions")
    .option("--model <name>", "Model for instructions generation", DEFAULT_MODEL)
    .option("--force", "Overwrite existing area instruction files")
    .option("--areas", "Also generate file-based instructions for detected areas")
    .option("--areas-only", "Generate only file-based area instructions (skip root)")
    .option("--area <name>", "Generate file-based instructions for a specific area")
    .action(withGlobalOpts(instructionsCommand));

  program
    .command("readiness")
    .argument("[path]", "Path to a local repository")
    .option("--output <path>", "Write report to file (.json or .html)")
    .option("--visual", "Generate visual HTML report")
    .option("--per-area", "Show per-area readiness breakdown")
    .action(withGlobalOpts(readinessCommand));

  program
    .command("batch")
    .description("Batch process multiple repos across orgs")
    .argument("[repos...]", "Repos in owner/name form (GitHub) or org/project/repo (Azure)")
    .option("--output <path>", "Write results JSON to file")
    .option("--provider <provider>", "Repo provider (github|azure)", "github")
    .action(withGlobalOpts(batchCommand));

  program
    .command("batch-readiness")
    .description("Generate batch AI readiness report for multiple repos")
    .option("--output <path>", "Write HTML report to file")
    .action(withGlobalOpts(batchReadinessCommand));

  program.parse(argv);
}
