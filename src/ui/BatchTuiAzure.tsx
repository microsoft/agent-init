import React, { useEffect, useState } from "react";
import { Box, Text, useApp, useInput } from "ink";
import path from "path";
import fs from "fs/promises";
import {
  AzureDevOpsOrg,
  AzureDevOpsProject,
  AzureDevOpsRepo,
  listOrganizations,
  listProjects,
  listRepos,
  checkReposForInstructions,
  createPullRequest
} from "../services/azureDevops";
import simpleGit from "simple-git";
import {
  buildAuthedUrl,
  checkoutBranch,
  cloneRepo,
  commitAll,
  isGitRepo,
  pushBranch
} from "../services/git";
import { generateCopilotInstructions } from "../services/instructions";
import { ensureDir, validateCachePath } from "../utils/fs";
import { buildInstructionsPrBody } from "../utils/pr";
import { DEFAULT_MODEL } from "../config";
import { StaticBanner } from "./AnimatedBanner";

type Props = {
  token: string;
  outputPath?: string;
};

type Status =
  | "loading-orgs"
  | "select-orgs"
  | "loading-projects"
  | "select-projects"
  | "loading-repos"
  | "select-repos"
  | "confirm"
  | "processing"
  | "complete"
  | "error";

type ProcessResult = {
  repo: string;
  success: boolean;
  prUrl?: string;
  error?: string;
};

export function BatchTuiAzure({ token, outputPath }: Props): React.JSX.Element {
  const app = useApp();
  const [status, setStatus] = useState<Status>("loading-orgs");
  const [message, setMessage] = useState<string>("Fetching organizations...");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [orgs, setOrgs] = useState<AzureDevOpsOrg[]>([]);
  const [projects, setProjects] = useState<AzureDevOpsProject[]>([]);
  const [repos, setRepos] = useState<AzureDevOpsRepo[]>([]);
  const [selectedOrgIndices, setSelectedOrgIndices] = useState<Set<number>>(new Set());
  const [selectedProjectIndices, setSelectedProjectIndices] = useState<Set<number>>(new Set());
  const [selectedRepoIndices, setSelectedRepoIndices] = useState<Set<number>>(new Set());
  const [cursorIndex, setCursorIndex] = useState(0);

  const [results, setResults] = useState<ProcessResult[]>([]);
  const [currentRepoIndex, setCurrentRepoIndex] = useState(0);
  const [processingMessage, setProcessingMessage] = useState("");

  useEffect(() => {
    loadOrgs();
  }, []);

  async function loadOrgs() {
    try {
      const userOrgs = await listOrganizations(token);
      setOrgs(userOrgs);
      setStatus("select-orgs");
      setMessage("Select organizations (space to toggle, enter to confirm)");
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Failed to fetch organizations");
    }
  }

  async function loadProjects() {
    setStatus("loading-projects");
    setMessage("Fetching projects...");

    try {
      const selectedOrgs = Array.from(selectedOrgIndices).map(i => orgs[i]);
      let allProjects: AzureDevOpsProject[] = [];

      for (let idx = 0; idx < selectedOrgs.length; idx++) {
        const org = selectedOrgs[idx];
        setMessage(`Fetching projects from ${org.name} (${idx + 1}/${selectedOrgs.length})...`);
        const orgProjects = await listProjects(token, org.name);
        allProjects = [...allProjects, ...orgProjects];
      }

      setProjects(allProjects);
      setCursorIndex(0);
      setSelectedProjectIndices(new Set());
      setStatus("select-projects");
      setMessage("Select projects (space to toggle, enter to confirm)");
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Failed to fetch projects");
    }
  }

  async function loadRepos() {
    setStatus("loading-repos");
    setMessage("Fetching repositories...");

    try {
      const selectedProjects = Array.from(selectedProjectIndices).map(i => projects[i]);
      let allRepos: AzureDevOpsRepo[] = [];

      for (let idx = 0; idx < selectedProjects.length; idx++) {
        const project = selectedProjects[idx];
        setMessage(
          `Fetching repos from ${project.organization}/${project.name} (${idx + 1}/${selectedProjects.length})...`
        );
        const projectRepos = await listRepos(token, project.organization, project.name);
        allRepos = [...allRepos, ...projectRepos];
      }

      const seen = new Set<string>();
      const uniqueRepos = allRepos.filter((repo) => {
        const key = `${repo.organization}/${repo.project}/${repo.name}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      setMessage(`Checking ${uniqueRepos.length} repos for existing instructions...`);
      const reposWithStatus = await checkReposForInstructions(
        token,
        uniqueRepos,
        (checked, total) => setMessage(`Checking for existing instructions (${checked}/${total})...`)
      );

      reposWithStatus.sort((a, b) => {
        if (a.hasInstructions === b.hasInstructions) return 0;
        return a.hasInstructions ? 1 : -1;
      });

      const withInstructions = reposWithStatus.filter(r => r.hasInstructions).length;
      const withoutInstructions = reposWithStatus.length - withInstructions;

      setRepos(reposWithStatus);
      setCursorIndex(0);
      setSelectedRepoIndices(new Set());
      setStatus("select-repos");
      setMessage(`Found ${reposWithStatus.length} repos (${withoutInstructions} need instructions, ${withInstructions} already have them)`);
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Failed to fetch repositories");
    }
  }

  async function processRepos() {
    const selectedRepos = Array.from(selectedRepoIndices).map(i => repos[i]);
    setStatus("processing");
    setCurrentRepoIndex(0);
    setResults([]);

    const nextResults: ProcessResult[] = [];

    for (let i = 0; i < selectedRepos.length; i++) {
      const repo = selectedRepos[i];
      setCurrentRepoIndex(i);
      setProcessingMessage(`[${i + 1}/${selectedRepos.length}] ${repo.organization}/${repo.project}/${repo.name}: Cloning...`);

      try {
        const cacheRoot = path.join(process.cwd(), ".primer-cache");
        const repoPath = validateCachePath(cacheRoot, repo.organization, repo.project, repo.name);
        await ensureDir(repoPath);

        if (!(await isGitRepo(repoPath))) {
          const authedUrl = buildAuthedUrl(repo.cloneUrl, token, "azure");
          await cloneRepo(authedUrl, repoPath, {
            shallow: true,
            timeoutMs: 120000,
            onProgress: (stage, progress) => {
              setProcessingMessage(
                `[${i + 1}/${selectedRepos.length}] ${repo.organization}/${repo.project}/${repo.name}: Cloning (${stage} ${progress}%)...`
              );
            }
          });
          // Strip credentials from persisted remote URL
          const git = simpleGit(repoPath);
          await git.remote(["set-url", "origin", repo.cloneUrl]);
        }

        setProcessingMessage(`[${i + 1}/${selectedRepos.length}] ${repo.organization}/${repo.project}/${repo.name}: Creating branch...`);
        const branch = "primer/add-instructions";
        await checkoutBranch(repoPath, branch);

        setProcessingMessage(`[${i + 1}/${selectedRepos.length}] ${repo.organization}/${repo.project}/${repo.name}: Generating instructions...`);
        const timeoutMs = 120000;
        const instructionsPromise = generateCopilotInstructions({
          repoPath,
          model: DEFAULT_MODEL,
          onProgress: (msg) => {
            setProcessingMessage(`[${i + 1}/${selectedRepos.length}] ${repo.organization}/${repo.project}/${repo.name}: ${msg}`);
          }
        });

        let timer: ReturnType<typeof setTimeout>;
        const timeoutPromise = new Promise<string>((_, reject) => {
          timer = setTimeout(() => reject(new Error("Generation timed out after 2 minutes")), timeoutMs);
        });

        const instructions = await Promise.race([instructionsPromise, timeoutPromise])
          .finally(() => clearTimeout(timer));
        // Prevent unhandled rejection if the losing promise rejects later
        instructionsPromise.catch(() => {});

        if (!instructions.trim()) {
          throw new Error("Generated instructions were empty");
        }

        const instructionsPath = path.join(repoPath, ".github", "copilot-instructions.md");
        await fs.mkdir(path.dirname(instructionsPath), { recursive: true });
        await fs.writeFile(instructionsPath, instructions, "utf8");

        setProcessingMessage(`[${i + 1}/${selectedRepos.length}] ${repo.organization}/${repo.project}/${repo.name}: Committing...`);
        await commitAll(repoPath, "chore: add copilot instructions via Primer");

        setProcessingMessage(`[${i + 1}/${selectedRepos.length}] ${repo.organization}/${repo.project}/${repo.name}: Pushing...`);
        await pushBranch(repoPath, branch, token, "azure");

        setProcessingMessage(`[${i + 1}/${selectedRepos.length}] ${repo.organization}/${repo.project}/${repo.name}: Creating PR...`);
        const prUrl = await createPullRequest({
          token,
          organization: repo.organization,
          project: repo.project,
          repoId: repo.id,
          repoName: repo.name,
          title: "🤖 Add Copilot instructions via Primer",
          body: buildInstructionsPrBody(),
          sourceBranch: branch,
          targetBranch: repo.defaultBranch
        });

        nextResults.push({ repo: `${repo.organization}/${repo.project}/${repo.name}`, success: true, prUrl });
        setResults([...nextResults]);
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "Unknown error";
        nextResults.push({ repo: `${repo.organization}/${repo.project}/${repo.name}`, success: false, error: errorMsg });
        setResults([...nextResults]);
      }
    }

    if (outputPath) {
      await fs.writeFile(outputPath, JSON.stringify(nextResults, null, 2), "utf8");
    }

    setStatus("complete");
    setMessage("Batch processing complete!");
  }

  useInput((input, key) => {
    if (key.escape || input.toLowerCase() === "q") {
      app.exit();
      return;
    }

    if (status === "select-orgs") {
      if (key.upArrow) {
        setCursorIndex(prev => Math.max(0, prev - 1));
      } else if (key.downArrow) {
        setCursorIndex(prev => Math.min(orgs.length - 1, prev + 1));
      } else if (input === " ") {
        setSelectedOrgIndices(prev => {
          const next = new Set(prev);
          if (next.has(cursorIndex)) {
            next.delete(cursorIndex);
          } else {
            next.add(cursorIndex);
          }
          return next;
        });
      } else if (key.return && selectedOrgIndices.size > 0) {
        loadProjects().catch(err => {
          setStatus("error");
          setErrorMessage(err instanceof Error ? err.message : "Failed to load projects");
        });
      }
    }

    if (status === "select-projects") {
      if (key.upArrow) {
        setCursorIndex(prev => Math.max(0, prev - 1));
      } else if (key.downArrow) {
        setCursorIndex(prev => Math.min(projects.length - 1, prev + 1));
      } else if (input === " ") {
        setSelectedProjectIndices(prev => {
          const next = new Set(prev);
          if (next.has(cursorIndex)) {
            next.delete(cursorIndex);
          } else {
            next.add(cursorIndex);
          }
          return next;
        });
      } else if (key.return && selectedProjectIndices.size > 0) {
        loadRepos().catch(err => {
          setStatus("error");
          setErrorMessage(err instanceof Error ? err.message : "Failed to load repos");
        });
      }
    }

    if (status === "select-repos") {
      if (key.upArrow) {
        setCursorIndex(prev => Math.max(0, prev - 1));
      } else if (key.downArrow) {
        setCursorIndex(prev => Math.min(repos.length - 1, prev + 1));
      } else if (input === " ") {
        setSelectedRepoIndices(prev => {
          const next = new Set(prev);
          if (next.has(cursorIndex)) {
            next.delete(cursorIndex);
          } else {
            next.add(cursorIndex);
          }
          return next;
        });
      } else if (input.toLowerCase() === "a") {
        const indicesWithoutInstructions = repos
          .map((r, i) => ({ r, i }))
          .filter(({ r }) => !r.hasInstructions)
          .map(({ i }) => i);
        setSelectedRepoIndices(new Set(indicesWithoutInstructions));
      } else if (key.return && selectedRepoIndices.size > 0) {
        setStatus("confirm");
        setMessage(`Ready to process ${selectedRepoIndices.size} repositories. Press Y to confirm, N to go back.`);
      }
    }

    if (status === "confirm") {
      if (input.toLowerCase() === "y") {
        processRepos().catch(err => {
          setStatus("error");
          setErrorMessage(err instanceof Error ? err.message : "Processing failed");
        });
      } else if (input.toLowerCase() === "n") {
        setStatus("select-repos");
        setMessage("Select repos (space to toggle, enter to confirm)");
      }
    }
  });

  const windowSize = 15;
  const getVisibleItems = <T,>(items: T[], cursor: number): { items: T[]; startIndex: number } => {
    const start = Math.max(0, cursor - Math.floor(windowSize / 2));
    const end = Math.min(items.length, start + windowSize);
    const adjustedStart = Math.max(0, end - windowSize);
    return { items: items.slice(adjustedStart, end), startIndex: adjustedStart };
  };

  return (
    <Box flexDirection="column" padding={1} borderStyle="round">
      <StaticBanner />
      <Text color="cyan">Batch Processing - Azure DevOps</Text>
      <Box marginTop={1}>
        <Text>{message}</Text>
      </Box>

      {status === "error" && (
        <Box marginTop={1}>
          <Text color="red">Error: {errorMessage}</Text>
        </Box>
      )}

      {status === "select-orgs" && (
        <Box flexDirection="column" marginTop={1}>
          {(() => {
            const { items: visibleOrgs, startIndex } = getVisibleItems(orgs, cursorIndex);
            return visibleOrgs.map((org, i) => {
              const realIndex = startIndex + i;
              const isSelected = selectedOrgIndices.has(realIndex);
              const isCursor = realIndex === cursorIndex;
              return (
                <Text key={org.id}>
                  <Text color={isCursor ? "cyan" : undefined}>{isCursor ? "❯ " : "  "}</Text>
                  <Text color={isSelected ? "green" : "gray"}>{isSelected ? "◉" : "○"} </Text>
                  <Text>{org.name}</Text>
                </Text>
              );
            });
          })()}
          {orgs.length > windowSize && (
            <Text color="gray" dimColor>
              Showing {Math.min(windowSize, orgs.length)} of {orgs.length} • Use ↑↓ to scroll
            </Text>
          )}
        </Box>
      )}

      {status === "select-projects" && (
        <Box flexDirection="column" marginTop={1}>
          {(() => {
            const { items: visibleProjects, startIndex } = getVisibleItems(projects, cursorIndex);
            return visibleProjects.map((project, i) => {
              const realIndex = startIndex + i;
              const isSelected = selectedProjectIndices.has(realIndex);
              const isCursor = realIndex === cursorIndex;
              return (
                <Text key={`${project.organization}/${project.id}`}>
                  <Text color={isCursor ? "cyan" : undefined}>{isCursor ? "❯ " : "  "}</Text>
                  <Text color={isSelected ? "green" : "gray"}>{isSelected ? "◉" : "○"} </Text>
                  <Text>{project.organization}/{project.name}</Text>
                </Text>
              );
            });
          })()}
          {projects.length > windowSize && (
            <Text color="gray" dimColor>
              Showing {Math.min(windowSize, projects.length)} of {projects.length} • Use ↑↓ to scroll
            </Text>
          )}
        </Box>
      )}

      {status === "select-repos" && (
        <Box flexDirection="column" marginTop={1}>
          {(() => {
            const { items: visibleRepos, startIndex } = getVisibleItems(repos, cursorIndex);
            return visibleRepos.map((repo, i) => {
              const realIndex = startIndex + i;
              const isSelected = selectedRepoIndices.has(realIndex);
              const isCursor = realIndex === cursorIndex;
              return (
                <Text key={`${repo.organization}/${repo.project}/${repo.name}`}>
                  <Text color={isCursor ? "cyan" : undefined}>{isCursor ? "❯ " : "  "}</Text>
                  <Text color={isSelected ? "green" : "gray"}>{isSelected ? "◉" : "○"} </Text>
                  <Text color={repo.hasInstructions ? "green" : "red"}>{repo.hasInstructions ? "✓" : "✗"} </Text>
                  <Text color={repo.hasInstructions ? "gray" : undefined}>
                    {repo.organization}/{repo.project}/{repo.name}
                  </Text>
                  {repo.isPrivate && <Text color="yellow"> (private)</Text>}
                </Text>
              );
            });
          })()}
          {repos.length > windowSize && (
            <Text color="gray" dimColor>
              Showing {Math.min(windowSize, repos.length)} of {repos.length} • Use ↑↓ to scroll
            </Text>
          )}
          <Box marginTop={1}>
            <Text color="gray" dimColor>
              Selected: {selectedRepoIndices.size} repos
            </Text>
          </Box>
        </Box>
      )}

      {status === "processing" && (
        <Box flexDirection="column" marginTop={1}>
          <Text color="yellow">{processingMessage}</Text>
          {results.length > 0 && (
            <Box flexDirection="column" marginTop={1}>
              <Text color="cyan">Completed:</Text>
              {results.slice(-5).map((r) => (
                <Text key={r.repo} color={r.success ? "green" : "red"}>
                  {r.success ? "✓" : "✗"} {r.repo}
                  {r.success && r.prUrl && <Text color="gray"> → {r.prUrl}</Text>}
                  {!r.success && r.error && <Text color="gray"> ({r.error})</Text>}
                </Text>
              ))}
            </Box>
          )}
        </Box>
      )}

      {status === "complete" && (
        <Box flexDirection="column" marginTop={1}>
          <Text color="green" bold>
            ✓ Batch complete: {results.filter(r => r.success).length} succeeded, {results.filter(r => !r.success).length} failed
          </Text>
          <Box flexDirection="column" marginTop={1}>
            {results.map((r) => (
              <Text key={r.repo} color={r.success ? "green" : "red"}>
                {r.success ? "✓" : "✗"} {r.repo}
                {r.success && r.prUrl && <Text color="gray"> → {r.prUrl}</Text>}
                {!r.success && r.error && <Text color="gray"> ({r.error})</Text>}
              </Text>
            ))}
          </Box>
        </Box>
      )}

      <Box marginTop={1}>
        {status === "select-orgs" && (
          <Text color="cyan">Keys: [Space] Toggle  [Enter] Confirm  [Q] Quit</Text>
        )}
        {status === "select-projects" && (
          <Text color="cyan">Keys: [Space] Toggle  [Enter] Confirm  [Q] Quit</Text>
        )}
        {status === "select-repos" && (
          <Text color="cyan">Keys: [Space] Toggle  [A] Select Missing  [Enter] Confirm  [Q] Quit</Text>
        )}
        {status === "confirm" && (
          <Text color="cyan">Keys: [Y] Yes, proceed  [N] Go back  [Q] Quit</Text>
        )}
        {(status === "complete" || status === "error") && (
          <Text color="cyan">Keys: [Q] Quit</Text>
        )}
      </Box>
    </Box>
  );
}