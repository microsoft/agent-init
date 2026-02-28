import { Box, Text, useApp, useInput, useIsScreenReaderEnabled } from "ink";
import React, { useEffect, useState } from "react";

import { processGitHubRepo } from "../services/batch";
import type { ProcessResult } from "../services/batch";
import type { GitHubOrg, GitHubRepo } from "../services/github";
import {
  listUserOrgs,
  listOrgRepos,
  listAccessibleRepos,
  checkReposForInstructions
} from "../services/github";
import { safeWriteFile } from "../utils/fs";

import { StaticBanner } from "./AnimatedBanner";

type Props = {
  token: string;
  outputPath?: string;
};

type Status =
  | "loading-orgs"
  | "select-orgs"
  | "loading-repos"
  | "select-repos"
  | "confirm"
  | "processing"
  | "complete"
  | "error";

export function BatchTui({ token, outputPath }: Props): React.JSX.Element {
  const app = useApp();
  const accessible = useIsScreenReaderEnabled();
  const [status, setStatus] = useState<Status>("loading-orgs");
  const [message, setMessage] = useState<string>("Fetching organizations...");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Data
  const [orgs, setOrgs] = useState<GitHubOrg[]>([]);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [selectedOrgIndices, setSelectedOrgIndices] = useState<Set<number>>(new Set());
  const [selectedRepoIndices, setSelectedRepoIndices] = useState<Set<number>>(new Set());
  const [cursorIndex, setCursorIndex] = useState(0);

  // Processing
  const [results, setResults] = useState<ProcessResult[]>([]);
  const [processingMessage, setProcessingMessage] = useState("");

  // Load orgs on mount
  useEffect(() => {
    loadOrgs();
  }, []);

  async function loadOrgs() {
    try {
      const userOrgs = await listUserOrgs(token);
      // Add a "personal repos" option
      const allOrgs: GitHubOrg[] = [
        { login: "__personal__", name: "Personal Repositories" },
        ...userOrgs
      ];
      setOrgs(allOrgs);
      setStatus("select-orgs");
      setMessage("Select organizations (space to toggle, enter to confirm)");
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Failed to fetch organizations");
    }
  }

  async function loadRepos() {
    setStatus("loading-repos");
    setMessage("Fetching repositories...");
    try {
      const selectedOrgs = Array.from(selectedOrgIndices).map((i) => orgs[i]);
      let allRepos: GitHubRepo[] = [];

      for (let idx = 0; idx < selectedOrgs.length; idx++) {
        const org = selectedOrgs[idx];
        setMessage(
          `Fetching repos from ${org.name ?? org.login} (${idx + 1}/${selectedOrgs.length})...`
        );

        if (org.login === "__personal__") {
          // Fetch personal repos (limited to 100 most recently pushed)
          const personalRepos = await listAccessibleRepos(token);
          // Filter to only repos owned by the user (not org repos)
          const userRepos = personalRepos
            .filter((r) => !orgs.some((o) => o.login !== "__personal__" && o.login === r.owner))
            .slice(0, 100);
          allRepos = [...allRepos, ...userRepos];
        } else {
          // Limit to 100 most recently pushed repos per org
          const orgRepos = await listOrgRepos(token, org.login, 100);
          allRepos = [...allRepos, ...orgRepos];
        }
      }

      // Deduplicate by fullName
      const seen = new Set<string>();
      const uniqueRepos = allRepos.filter((r) => {
        if (seen.has(r.fullName)) return false;
        seen.add(r.fullName);
        return true;
      });

      // Check which repos already have instructions
      setMessage(`Checking ${uniqueRepos.length} repos for existing instructions...`);
      const reposWithStatus = await checkReposForInstructions(
        token,
        uniqueRepos,
        (checked, total) =>
          setMessage(`Checking for existing instructions (${checked}/${total})...`)
      );

      // Sort: repos without instructions first
      reposWithStatus.sort((a, b) => {
        if (a.hasInstructions === b.hasInstructions) return 0;
        return a.hasInstructions ? 1 : -1;
      });

      const withInstructions = reposWithStatus.filter((r) => r.hasInstructions).length;
      const withoutInstructions = reposWithStatus.length - withInstructions;

      setRepos(reposWithStatus);
      setCursorIndex(0);
      setSelectedRepoIndices(new Set());
      setStatus("select-repos");
      setMessage(
        `Found ${reposWithStatus.length} repos (${withoutInstructions} need instructions, ${withInstructions} already have them)`
      );
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Failed to fetch repositories");
    }
  }

  async function processRepos() {
    const selectedRepos = Array.from(selectedRepoIndices).map((i) => repos[i]);
    setStatus("processing");
    setResults([]);

    const localResults: ProcessResult[] = [];

    for (let i = 0; i < selectedRepos.length; i++) {
      const repo = selectedRepos[i];
      setProcessingMessage(`[${i + 1}/${selectedRepos.length}] ${repo.fullName}: Starting...`);

      const result = await processGitHubRepo({
        repo,
        token,
        progress: {
          update: (msg) => setProcessingMessage(`[${i + 1}/${selectedRepos.length}] ${msg}`),
          succeed: (msg) =>
            setProcessingMessage(
              `[${i + 1}/${selectedRepos.length}] ${accessible ? "OK" : "✓"} ${msg}`
            ),
          fail: (msg) =>
            setProcessingMessage(
              `[${i + 1}/${selectedRepos.length}] ${accessible ? "FAIL" : "✗"} ${msg}`
            ),
          done: () => {}
        }
      });

      localResults.push(result);
      setResults([...localResults]);
    }

    // Write results if output path specified
    if (outputPath) {
      await safeWriteFile(outputPath, JSON.stringify(localResults, null, 2), true);
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
      const items = orgs;
      if (key.upArrow) {
        setCursorIndex((prev) => Math.max(0, prev - 1));
      } else if (key.downArrow) {
        setCursorIndex((prev) => Math.min(items.length - 1, prev + 1));
      } else if (input === " ") {
        setSelectedOrgIndices((prev) => {
          const next = new Set(prev);
          if (next.has(cursorIndex)) {
            next.delete(cursorIndex);
          } else {
            next.add(cursorIndex);
          }
          return next;
        });
      } else if (key.return && selectedOrgIndices.size > 0) {
        loadRepos().catch((err) => {
          setStatus("error");
          setErrorMessage(err instanceof Error ? err.message : "Failed to load repos");
        });
      }
    }

    if (status === "select-repos") {
      const items = repos;
      if (key.upArrow) {
        setCursorIndex((prev) => Math.max(0, prev - 1));
      } else if (key.downArrow) {
        setCursorIndex((prev) => Math.min(items.length - 1, prev + 1));
      } else if (input === " ") {
        setSelectedRepoIndices((prev) => {
          const next = new Set(prev);
          if (next.has(cursorIndex)) {
            next.delete(cursorIndex);
          } else {
            next.add(cursorIndex);
          }
          return next;
        });
      } else if (input.toLowerCase() === "a") {
        // Select all repos WITHOUT instructions
        const indicesWithoutInstructions = repos
          .map((r, i) => ({ r, i }))
          .filter(({ r }) => !r.hasInstructions)
          .map(({ i }) => i);
        setSelectedRepoIndices(new Set(indicesWithoutInstructions));
      } else if (key.return && selectedRepoIndices.size > 0) {
        setStatus("confirm");
        setMessage(
          `Ready to process ${selectedRepoIndices.size} repositories. Press Y to confirm, N to go back.`
        );
      }
    }

    if (status === "confirm") {
      if (input.toLowerCase() === "y") {
        processRepos().catch((err) => {
          setStatus("error");
          setErrorMessage(err instanceof Error ? err.message : "Processing failed");
        });
      } else if (input.toLowerCase() === "n") {
        setStatus("select-repos");
        setMessage("Select repos (space to toggle, enter to confirm)");
      }
    }
  });

  // Visible window for long lists
  const windowSize = 15;
  const getVisibleItems = <T,>(items: T[], cursor: number): { items: T[]; startIndex: number } => {
    const start = Math.max(0, cursor - Math.floor(windowSize / 2));
    const end = Math.min(items.length, start + windowSize);
    const adjustedStart = Math.max(0, end - windowSize);
    return { items: items.slice(adjustedStart, end), startIndex: adjustedStart };
  };

  return (
    <Box
      flexDirection="column"
      padding={1}
      {...(accessible ? {} : { borderStyle: "round" as const })}
    >
      <StaticBanner />
      <Text color="cyan">Batch Processing - Prime repositories at scale</Text>
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
                <Text key={org.login}>
                  <Text color={isCursor ? "cyan" : undefined}>
                    {isCursor ? (accessible ? "> " : "❯ ") : "  "}
                  </Text>
                  <Text color={isSelected ? "green" : "gray"}>
                    {isSelected ? (accessible ? "[x]" : "◉") : accessible ? "[ ]" : "○"}{" "}
                  </Text>
                  <Text>{org.name ?? org.login}</Text>
                  <Text color="gray"> ({org.login})</Text>
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

      {status === "select-repos" && (
        <Box flexDirection="column" marginTop={1}>
          {(() => {
            const { items: visibleRepos, startIndex } = getVisibleItems(repos, cursorIndex);
            return visibleRepos.map((repo, i) => {
              const realIndex = startIndex + i;
              const isSelected = selectedRepoIndices.has(realIndex);
              const isCursor = realIndex === cursorIndex;
              return (
                <Text key={repo.fullName}>
                  <Text color={isCursor ? "cyan" : undefined}>
                    {isCursor ? (accessible ? "> " : "❯ ") : "  "}
                  </Text>
                  <Text color={isSelected ? "green" : "gray"}>
                    {isSelected ? (accessible ? "[x]" : "◉") : accessible ? "[ ]" : "○"}{" "}
                  </Text>
                  <Text color={repo.hasInstructions ? "green" : "red"}>
                    {repo.hasInstructions
                      ? accessible
                        ? "HAS_INSTRUCTIONS"
                        : "✓"
                      : accessible
                        ? "NEEDS_INSTRUCTIONS"
                        : "✗"}{" "}
                  </Text>
                  <Text color={repo.hasInstructions ? "gray" : undefined}>{repo.fullName}</Text>
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
                  {r.success ? (accessible ? "OK" : "✓") : accessible ? "FAIL" : "✗"} {r.repo}
                  {r.success && r.prUrl && (
                    <Text color="gray">
                      {" "}
                      {accessible ? "-" : "→"} {r.prUrl}
                    </Text>
                  )}
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
            {accessible ? "OK" : "✓"} Batch complete: {results.filter((r) => r.success).length}{" "}
            succeeded, {results.filter((r) => !r.success).length} failed
          </Text>
          <Box flexDirection="column" marginTop={1}>
            {results.map((r) => (
              <Text key={r.repo} color={r.success ? "green" : "red"}>
                {r.success ? (accessible ? "OK" : "✓") : accessible ? "FAIL" : "✗"} {r.repo}
                {r.success && r.prUrl && (
                  <Text color="gray">
                    {" "}
                    {accessible ? "-" : "→"} {r.prUrl}
                  </Text>
                )}
                {!r.success && r.error && <Text color="gray"> ({r.error})</Text>}
              </Text>
            ))}
          </Box>
        </Box>
      )}

      <Box marginTop={1}>
        {status === "select-orgs" && (
          <Text color="cyan">Keys: [Space] Toggle [Enter] Confirm [Q] Quit</Text>
        )}
        {status === "select-repos" && (
          <Text color="cyan">Keys: [Space] Toggle [A] Select Missing [Enter] Confirm [Q] Quit</Text>
        )}
        {status === "confirm" && (
          <Text color="cyan">Keys: [Y] Yes, proceed [N] Go back [Q] Quit</Text>
        )}
        {(status === "complete" || status === "error") && <Text color="cyan">Keys: [Q] Quit</Text>}
      </Box>
    </Box>
  );
}
