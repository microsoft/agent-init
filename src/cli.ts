import { Command } from "commander";
import { initCommand } from "./commands/init";
import { generateCommand } from "./commands/generate";
import { prCommand } from "./commands/pr";
import { evalCommand } from "./commands/eval";
import { tuiCommand } from "./commands/tui";
import { instructionsCommand } from "./commands/instructions";
import { batchCommand } from "./commands/batch";
import { readinessCommand } from "./commands/readiness";
import { batchReadinessCommand } from "./commands/batchReadiness";
import { DEFAULT_MODEL, DEFAULT_JUDGE_MODEL } from "./config";

export function runCli(argv: string[]): void {
  const program = new Command();

  program
    .name("primer")
    .description("Prime repositories for AI-assisted development")
    .version("0.1.0");

  program
    .command("init")
    .argument("[path]", "Path to a local repository")
    .option("--github", "Use a GitHub repository")
    .option("--provider <provider>", "Repo provider (github|azure)")
    .option("--yes", "Accept defaults (generates instructions, MCP, and VS Code configs)")
    .option("--force", "Overwrite existing files")
    .action(initCommand);


  program
    .command("generate")
    .argument("<type>", "instructions|agents|mcp|vscode")
    .argument("[path]", "Path to a local repository")
    .option("--force", "Overwrite existing files")
    .option("--per-app", "Generate per-app in monorepos")
    .action(generateCommand);

  program
    .command("pr")
    .argument("[repo]", "Repo identifier (github: owner/name, azure: org/project/repo)")
    .option("--branch <name>", "Branch name")
    .option("--provider <provider>", "Repo provider (github|azure)")
    .action(prCommand);

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
    .action(evalCommand);

  program
    .command("tui")
    .option("--repo <path>", "Repository path", process.cwd())
    .option("--no-animation", "Skip the animated banner intro")
    .action(tuiCommand);

  program
    .command("instructions")
    .option("--repo <path>", "Repository path", process.cwd())
    .option("--output <path>", "Output path for copilot instructions")
    .option("--model <name>", "Model for instructions generation", DEFAULT_MODEL)
    .action(instructionsCommand);

  program
    .command("readiness")
    .argument("[path]", "Path to a local repository")
    .option("--json", "Output JSON")
    .option("--output <path>", "Write report to file (.json or .html)")
    .option("--visual", "Generate visual HTML report")
    .action(readinessCommand);

  program
    .command("batch")
    .description("Batch process multiple repos across orgs")
    .option("--output <path>", "Write results JSON to file")
    .option("--provider <provider>", "Repo provider (github|azure)", "github")
    .action(batchCommand);

  program
    .command("batch-readiness")
    .description("Generate batch AI readiness report for multiple repos")
    .option("--output <path>", "Write HTML report to file")
    .action(batchReadinessCommand);

  program.parse(argv);
}
