import path from "path";
import fs from "fs/promises";
import { checkbox, select } from "@inquirer/prompts";
import { analyzeRepo } from "../services/analyzer";
import { generateConfigs } from "../services/generator";
import { GitHubRepo, listAccessibleRepos } from "../services/github";
import {
  AzureDevOpsOrg,
  AzureDevOpsProject,
  AzureDevOpsRepo,
  getAzureDevOpsToken,
  listOrganizations,
  listProjects,
  listRepos
} from "../services/azureDevops";
import { buildAuthedUrl, cloneRepo, isGitRepo } from "../services/git";
import { generateCopilotInstructions } from "../services/instructions";
import { ensureDir, validateCachePath } from "../utils/fs";
import { prettyPrintSummary } from "../utils/logger";

type InitOptions = {
  github?: boolean;
  provider?: string;
  yes?: boolean;
  force?: boolean;
};

export async function initCommand(repoPathArg: string | undefined, options: InitOptions): Promise<void> {
  let repoPath = path.resolve(repoPathArg ?? process.cwd());
  const provider = options.provider ?? (options.github ? "github" : undefined);

  if (provider && provider !== "github" && provider !== "azure") {
    console.error("Invalid provider. Use github or azure.");
    process.exitCode = 1;
    return;
  }

  if (provider === "github") {
    const token = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN;
    if (!token) {
      console.error("Set GITHUB_TOKEN or GH_TOKEN to use GitHub mode.");
      process.exitCode = 1;
      return;
    }

    const repos = await listAccessibleRepos(token);
    if (repos.length === 0) {
      console.error("No accessible repositories found.");
      process.exitCode = 1;
      return;
    }

    const selection = await select<GitHubRepo>({
      message: "Choose a repository",
      choices: repos.map((repo) => ({
        name: `${repo.fullName}${repo.isPrivate ? " (private)" : ""}`,
        value: repo
      }))
    });

    const cacheRoot = path.join(process.cwd(), ".primer-cache");
    repoPath = validateCachePath(cacheRoot, selection.owner, selection.name);
    await ensureDir(repoPath);

    const hasGit = await isGitRepo(repoPath);
    if (!hasGit) {
      await cloneRepo(selection.cloneUrl, repoPath);
    }
  }

  if (provider === "azure") {
    const token = getAzureDevOpsToken();
    if (!token) {
      console.error("Set AZURE_DEVOPS_PAT (or AZDO_PAT) to use Azure DevOps mode.");
      process.exitCode = 1;
      return;
    }

    const orgs = await listOrganizations(token);
    if (orgs.length === 0) {
      console.error("No Azure DevOps organizations found.");
      process.exitCode = 1;
      return;
    }

    const orgSelection = await select<AzureDevOpsOrg>({
      message: "Choose an Azure DevOps organization",
      choices: orgs.map((org) => ({
        name: org.name,
        value: org
      }))
    });

    const projects = await listProjects(token, orgSelection.name);
    if (projects.length === 0) {
      console.error("No Azure DevOps projects found.");
      process.exitCode = 1;
      return;
    }

    const projectSelection = await select<AzureDevOpsProject>({
      message: "Choose an Azure DevOps project",
      choices: projects.map((project) => ({
        name: project.name,
        value: project
      }))
    });

    const repos = await listRepos(token, orgSelection.name, projectSelection.name);
    if (repos.length === 0) {
      console.error("No Azure DevOps repositories found.");
      process.exitCode = 1;
      return;
    }

    const repoSelection = await select<AzureDevOpsRepo>({
      message: "Choose a repository",
      choices: repos.map((repo) => ({
        name: `${repo.name}${repo.isPrivate ? " (private)" : ""}`,
        value: repo
      }))
    });

    const cacheRoot = path.join(process.cwd(), ".primer-cache");
    repoPath = validateCachePath(cacheRoot, orgSelection.name, projectSelection.name, repoSelection.name);
    await ensureDir(repoPath);

    const hasGit = await isGitRepo(repoPath);
    if (!hasGit) {
      const authedUrl = buildAuthedUrl(repoSelection.cloneUrl, token, "azure");
      await cloneRepo(authedUrl, repoPath);
    }
  }
  const analysis = await analyzeRepo(repoPath);
  prettyPrintSummary(analysis);

  const selections = options.yes
    ? ["instructions", "mcp", "vscode"]
    : await checkbox({
        message: "What would you like to generate?",
        choices: [
          { name: "Custom instructions (.github/copilot-instructions.md)", value: "instructions" },
          { name: "MCP configuration", value: "mcp" },
          { name: "VS Code settings", value: "vscode" }
        ],
        required: true
      });

  if (selections.includes("instructions")) {
    const outputPath = path.join(repoPath, ".github", "copilot-instructions.md");
    await ensureDir(path.dirname(outputPath));
    const content = await generateCopilotInstructions({ repoPath });
    await fs.writeFile(outputPath, content, "utf8");
    console.log(`Updated ${path.relative(process.cwd(), outputPath)}`);
  }

  const result = await generateConfigs({
    repoPath,
    analysis,
    selections: selections.filter((item) => item !== "instructions"),
    force: Boolean(options.force)
  });

  console.log(result.summary);
}
