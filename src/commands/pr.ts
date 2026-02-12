import path from "path";
import fs from "fs/promises";
import { analyzeRepo } from "../services/analyzer";
import { generateConfigs } from "../services/generator";
import { createPullRequest, getRepo } from "../services/github";
import { generateCopilotInstructions } from "../services/instructions";
import {
  createPullRequest as createAzurePullRequest,
  getAzureDevOpsToken,
  getRepo as getAzureRepo
} from "../services/azureDevops";
import { buildAuthedUrl, checkoutBranch, cloneRepo, commitAll, isGitRepo, pushBranch } from "../services/git";
import { ensureDir, validateCachePath } from "../utils/fs";
import { buildConfigsPrBody, buildInstructionsPrBody } from "../utils/pr";
import { DEFAULT_MODEL } from "../config";

type PrOptions = {
  branch?: string;
  provider?: string;
};

export async function prCommand(repo: string | undefined, options: PrOptions): Promise<void> {
  const provider = options.provider ?? "github";
  if (provider !== "github" && provider !== "azure") {
    console.error("Invalid provider. Use github or azure.");
    process.exitCode = 1;
    return;
  }

  if (!repo) {
    console.error("Provide a repo identifier (github: owner/name, azure: org/project/repo).");
    process.exitCode = 1;
    return;
  }

  if (provider === "azure") {
    const token = getAzureDevOpsToken();
    if (!token) {
      console.error("Set AZURE_DEVOPS_PAT (or AZDO_PAT) to use Azure DevOps PR automation.");
      process.exitCode = 1;
      return;
    }

    const [organization, project, name] = repo.split("/");
    if (!organization || !project || !name) {
      console.error("Invalid Azure DevOps repo format. Use org/project/repo.");
      process.exitCode = 1;
      return;
    }

    const repoInfo = await getAzureRepo(token, organization, project, name);
    const cacheRoot = path.join(process.cwd(), ".primer-cache");
    const repoPath = validateCachePath(cacheRoot, organization, project, name);
    await ensureDir(repoPath);

    if (!(await isGitRepo(repoPath))) {
      const authedUrl = buildAuthedUrl(repoInfo.cloneUrl, token, "azure");
      await cloneRepo(authedUrl, repoPath);
    }

    const branch = options.branch ?? "primer/add-instructions";
    await checkoutBranch(repoPath, branch);

    const instructions = await generateCopilotInstructions({ repoPath, model: DEFAULT_MODEL });
    const instructionsPath = path.join(repoPath, ".github", "copilot-instructions.md");
    await ensureDir(path.dirname(instructionsPath));
    await fs.writeFile(instructionsPath, instructions, "utf8");

    await commitAll(repoPath, "chore: add copilot instructions via Primer");
    await pushBranch(repoPath, branch, token, "azure");

    const prUrl = await createAzurePullRequest({
      token,
      organization,
      project,
      repoId: repoInfo.id,
      repoName: repoInfo.name,
      title: "🤖 Add Copilot instructions via Primer",
      body: buildInstructionsPrBody(),
      sourceBranch: branch,
      targetBranch: repoInfo.defaultBranch
    });

    console.log(`Created PR: ${prUrl}`);
    return;
  }

  const token = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN;
  if (!token) {
    console.error("Set GITHUB_TOKEN or GH_TOKEN to use PR automation.");
    process.exitCode = 1;
    return;
  }

  const [owner, name] = repo.split("/");
  if (!owner || !name) {
    console.error("Invalid repo format. Use owner/name.");
    process.exitCode = 1;
    return;
  }

  const repoInfo = await getRepo(token, owner, name);
  const cacheRoot = path.join(process.cwd(), ".primer-cache");
  const repoPath = validateCachePath(cacheRoot, owner, name);
  await ensureDir(repoPath);

  if (!(await isGitRepo(repoPath))) {
    await cloneRepo(repoInfo.cloneUrl, repoPath);
  }

  const branch = options.branch ?? "primer/add-configs";
  await checkoutBranch(repoPath, branch);

  const analysis = await analyzeRepo(repoPath);
  await generateConfigs({
    repoPath,
    analysis,
    selections: ["mcp", "vscode"],
    force: true
  });

  await commitAll(repoPath, "chore: add AI configurations via Primer");
  await pushBranch(repoPath, branch, token, "github");

  const prUrl = await createPullRequest({
    token,
    owner,
    repo: name,
    title: "🤖 Prime this repo for AI",
    body: buildConfigsPrBody(),
    head: `${owner}:${branch}`,
    base: repoInfo.defaultBranch
  });

  console.log(`Created PR: ${prUrl}`);
}
