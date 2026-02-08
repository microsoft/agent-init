import React, { useEffect, useMemo, useState, useRef } from "react";
import { Box, Key, Text, useApp, useInput } from "ink";
import fs from "fs/promises";
import path from "path";
import { generateCopilotInstructions } from "../services/instructions";
import { runEval, type EvalResult } from "../services/evaluator";
import { generateEvalScaffold } from "../services/evalScaffold";
import { listCopilotModels } from "../services/copilot";
import { AnimatedBanner, StaticBanner } from "./AnimatedBanner";
import { BatchTui } from "./BatchTui";
import { BatchTuiAzure } from "./BatchTuiAzure";
import { getGitHubToken } from "../services/github";
import { getAzureDevOpsToken } from "../services/azureDevops";
import { safeWriteFile } from "../utils/fs";

type Props = {
  repoPath: string;
  skipAnimation?: boolean;
};

type Status =
  | "intro"
  | "idle"
  | "generating"
  | "bootstrapping"
  | "evaluating"
  | "preview"
  | "done"
  | "error"
  | "batch-pick"
  | "batch-github"
  | "batch-azure"
  | "eval-pick"
  | "bootstrapEvalCount"
  | "bootstrapEvalConfirm";

type LogEntry = {
  text: string;
  type: "info" | "success" | "error" | "progress";
  time: string;
};

const SPINNER_FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

function useSpinner(active: boolean): string {
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      setFrame((f) => (f + 1) % SPINNER_FRAMES.length);
    }, 80);
    return () => clearInterval(interval);
  }, [active]);
  return active ? SPINNER_FRAMES[frame] : "";
}

function timestamp(): string {
  return new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function KeyHint({ k, label }: { k: string; label: string }): React.JSX.Element {
  return (
    <Text>
      <Text color="gray" dimColor>{"["}</Text>
      <Text color="cyanBright" bold>{k}</Text>
      <Text color="gray" dimColor>{"]"}</Text>
      <Text color="gray"> {label}  </Text>
    </Text>
  );
}

function Divider({ label }: { label?: string }): React.JSX.Element {
  if (label) {
    return (
      <Box marginTop={1}>
        <Text color="gray" dimColor>{"── "}</Text>
        <Text color="gray" bold>{label}</Text>
        <Text color="gray" dimColor>{" ──────────────────────────────────────────"}</Text>
      </Box>
    );
  }
  return (
    <Box marginTop={1}>
      <Text color="gray" dimColor>{"────────────────────────────────────────────────────"}</Text>
    </Box>
  );
}

export function PrimerTui({ repoPath, skipAnimation = false }: Props): React.JSX.Element {
  const app = useApp();
  const [status, setStatus] = useState<Status>(skipAnimation ? "idle" : "intro");
  const [message, setMessage] = useState<string>("");
  const [generatedContent, setGeneratedContent] = useState<string>("");
  const [evalResults, setEvalResults] = useState<EvalResult[] | null>(null);
  const [evalViewerPath, setEvalViewerPath] = useState<string | null>(null);
  const [batchToken, setBatchToken] = useState<string | null>(null);
  const [batchAzureToken, setBatchAzureToken] = useState<string | null>(null);
  const [evalCaseCountInput, setEvalCaseCountInput] = useState<string>("");
  const [evalBootstrapCount, setEvalBootstrapCount] = useState<number | null>(null);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [evalModel, setEvalModel] = useState<string>("gpt-4.1");
  const [judgeModel, setJudgeModel] = useState<string>("gpt-4.1");
  const [hasEvalConfig, setHasEvalConfig] = useState<boolean | null>(null);
  const [activityLog, setActivityLog] = useState<LogEntry[]>([]);
  const repoLabel = useMemo(() => path.basename(repoPath), [repoPath]);
  const repoFull = useMemo(() => repoPath, [repoPath]);
  const isLoading = status === "generating" || status === "bootstrapping" || status === "evaluating";
  const spinner = useSpinner(isLoading);

  const addLog = (text: string, type: LogEntry["type"] = "info") => {
    setActivityLog((prev) => [...prev.slice(-4), { text, type, time: timestamp() }]);
  };

  const handleAnimationComplete = () => {
    setStatus("idle");
  };

  const cycleModel = (current: string): string => {
    if (!availableModels.length) return current;
    const index = availableModels.indexOf(current);
    const nextIndex = index === -1 ? 0 : (index + 1) % availableModels.length;
    return availableModels[nextIndex];
  };

  // Check for eval config on mount
  useEffect(() => {
    const configPath = path.join(repoPath, "primer.eval.json");
    fs.access(configPath).then(() => setHasEvalConfig(true)).catch(() => setHasEvalConfig(false));
  }, [repoPath]);

  useEffect(() => {
    let active = true;
    listCopilotModels()
      .then((models) => {
        if (!active) return;
        setAvailableModels(models);
        if (models.length === 0) return;
        setEvalModel((current) => (models.includes(current) ? current : models[0]));
        setJudgeModel((current) => (models.includes(current) ? current : models[0]));
      })
      .catch(() => {
        if (!active) return;
        setAvailableModels([]);
      });
    return () => {
      active = false;
    };
  }, []);

  const bootstrapEvalConfig = async (count: number, force: boolean): Promise<void> => {
    const configPath = path.join(repoPath, "primer.eval.json");
    try {
      setStatus("bootstrapping");
      setMessage("Generating eval cases with Copilot SDK...");
      addLog("Generating eval scaffold...", "progress");
      const config = await generateEvalScaffold({
        repoPath,
        count,
        model: evalModel,
        onProgress: (msg) => setMessage(msg)
      });
      await safeWriteFile(configPath, JSON.stringify(config, null, 2), force);
      setHasEvalConfig(true);
      setStatus("idle");
      const msg = `Generated primer.eval.json with ${config.cases.length} cases.`;
      setMessage(msg);
      addLog(msg, "success");
    } catch (error) {
      setStatus("error");
      const msg = error instanceof Error ? error.message : "Failed to generate eval config.";
      setMessage(msg);
      addLog(msg, "error");
    }
  };

  useInput(async (input: string, key: Key) => {
      if (status === "intro") {
        setStatus("idle");
        return;
      }

      if (key.escape || input.toLowerCase() === "q") {
        app.exit();
        return;
      }

      if (status === "preview") {
        if (input.toLowerCase() === "s") {
          try {
            const outputPath = path.join(repoPath, ".github", "copilot-instructions.md");
            await fs.mkdir(path.dirname(outputPath), { recursive: true });
            await fs.writeFile(outputPath, generatedContent, "utf8");
            setStatus("done");
            const msg = "Saved to .github/copilot-instructions.md";
            setMessage(msg);
            addLog(msg, "success");
            setGeneratedContent("");
          } catch (error) {
            setStatus("error");
            const msg = error instanceof Error ? error.message : "Failed to save.";
            setMessage(msg);
            addLog(msg, "error");
          }
          return;
        }
        if (input.toLowerCase() === "d") {
          setStatus("idle");
          setMessage("Discarded generated instructions.");
          addLog("Discarded instructions.", "info");
          setGeneratedContent("");
          return;
        }
        return;
      }

      if (status === "bootstrapEvalCount") {
        if (key.return) {
          const trimmed = evalCaseCountInput.trim();
          const count = Number.parseInt(trimmed, 10);
          if (!trimmed || !Number.isFinite(count) || count <= 0) {
            setMessage("Enter a positive number of eval cases, then press Enter.");
            return;
          }

          const configPath = path.join(repoPath, "primer.eval.json");
          setEvalBootstrapCount(count);
          try {
            await fs.access(configPath);
            setStatus("bootstrapEvalConfirm");
            setMessage("primer.eval.json exists. Overwrite? (Y/N)");
          } catch {
            await bootstrapEvalConfig(count, false);
          }
          return;
        }

        if (key.backspace || key.delete) {
          setEvalCaseCountInput((prev) => prev.slice(0, -1));
          return;
        }

        if (/^\d$/.test(input)) {
          setEvalCaseCountInput((prev) => prev + input);
          return;
        }

        return;
      }

      if (status === "bootstrapEvalConfirm") {
        if (input.toLowerCase() === "y") {
          const count = evalBootstrapCount ?? 0;
          if (count <= 0) {
            setStatus("error");
            setMessage("Missing eval case count. Restart bootstrap.");
            return;
          }
          await bootstrapEvalConfig(count, true);
          return;
        }

        if (input.toLowerCase() === "n") {
          setStatus("idle");
          setMessage("Bootstrap cancelled.");
          setEvalCaseCountInput("");
          setEvalBootstrapCount(null);
        }
        return;
      }

      if (status === "eval-pick") {
        if (input.toLowerCase() === "r") {
          // Run eval
          const configPath = path.join(repoPath, "primer.eval.json");
          const outputPath = path.join(repoPath, ".primer", "evals", buildTimestampedName("eval-results"));
          try {
            await fs.access(configPath);
          } catch {
            setStatus("error");
            const msg = "No primer.eval.json found. Press [E] then [I] to create one.";
            setMessage(msg);
            addLog(msg, "error");
            return;
          }

          setStatus("evaluating");
          setMessage("Running evals... (this may take a few minutes)");
          addLog("Running evals...", "progress");
          setEvalResults(null);
          setEvalViewerPath(null);
          try {
            const { results, viewerPath } = await runEval({
              configPath,
              repoPath,
              model: evalModel,
              judgeModel: judgeModel,
              outputPath
            });
            setEvalResults(results);
            setEvalViewerPath(viewerPath ?? null);
            const passed = results.filter((r) => r.verdict === "pass").length;
            const failed = results.filter((r) => r.verdict === "fail").length;
            setStatus("done");
            const msg = `Eval complete: ${passed} pass, ${failed} fail out of ${results.length} cases.`;
            setMessage(msg);
            addLog(msg, "success");
          } catch (error) {
            setStatus("error");
            const msg = error instanceof Error ? error.message : "Eval failed.";
            setMessage(msg);
            addLog(msg, "error");
          }
          return;
        }
        if (input.toLowerCase() === "i") {
          setStatus("bootstrapEvalCount");
          setMessage("Enter number of eval cases, then press Enter.");
          setEvalCaseCountInput("");
          setEvalBootstrapCount(null);
          return;
        }
        if (key.escape || input.toLowerCase() === "b") {
          setStatus("idle");
          setMessage("");
          return;
        }
        return;
      }

      if (status === "batch-pick") {
        if (input.toLowerCase() === "g") {
          setStatus("generating");
          setMessage("Checking GitHub authentication...");
          addLog("Starting batch (GitHub)...", "progress");
          const token = await getGitHubToken();
          if (!token) {
            setStatus("error");
            const msg = "GitHub auth required. Run 'gh auth login' or set GITHUB_TOKEN.";
            setMessage(msg);
            addLog(msg, "error");
            return;
          }
          setBatchToken(token);
          setStatus("batch-github");
          return;
        }
        if (input.toLowerCase() === "a") {
          setStatus("generating");
          setMessage("Checking Azure DevOps authentication...");
          addLog("Starting batch (Azure DevOps)...", "progress");
          const token = getAzureDevOpsToken();
          if (!token) {
            setStatus("error");
            const msg = "Azure DevOps PAT required. Set AZURE_DEVOPS_PAT or AZDO_PAT.";
            setMessage(msg);
            addLog(msg, "error");
            return;
          }
          setBatchAzureToken(token);
          setStatus("batch-azure");
          return;
        }
        if (key.escape || input.toLowerCase() === "b") {
          setStatus("idle");
          setMessage("");
          return;
        }
        return;
      }

      if (input.toLowerCase() === "g") {
        setStatus("generating");
        setMessage("Starting generation...");
        addLog("Generating copilot instructions...", "progress");
        try {
          const content = await generateCopilotInstructions({
            repoPath,
            onProgress: (msg) => setMessage(msg)
          });
          if (!content.trim()) {
            throw new Error("Copilot SDK returned empty instructions.");
          }
          setGeneratedContent(content);
          setStatus("preview");
          setMessage("Review the generated instructions below.");
          addLog("Instructions generated — review and save.", "success");
        } catch (error) {
          setStatus("error");
          const msg = error instanceof Error ? error.message : "Generation failed.";
          if (msg.toLowerCase().includes("auth") || msg.toLowerCase().includes("login")) {
            setMessage(`${msg} Run 'copilot' then '/login' in a separate terminal.`);
          } else {
            setMessage(msg);
          }
          addLog(msg, "error");
        }
      }

      if (input.toLowerCase() === "b") {
        setStatus("batch-pick");
        setMessage("Select batch provider.");
        return;
      }

      if (input.toLowerCase() === "e") {
        setStatus("eval-pick");
        setMessage("Select eval action.");
        return;
      }

      if (input.toLowerCase() === "m") {
        if (!availableModels.length) {
          setMessage("No Copilot CLI models detected; using defaults.");
          return;
        }
        const next = cycleModel(evalModel);
        setEvalModel(next);
        setMessage(`Eval model → ${next}`);
        return;
      }

      if (input.toLowerCase() === "j") {
        if (!availableModels.length) {
          setMessage("No Copilot CLI models detected; using defaults.");
          return;
        }
        const next = cycleModel(judgeModel);
        setJudgeModel(next);
        setMessage(`Judge model → ${next}`);
        return;
      }
  });

  const statusIcon = status === "error" ? "✗" : status === "done" ? "✓" : isLoading ? spinner : "●";
  const statusLabel = status === "intro" ? "starting" : status === "idle" ? "ready" : status === "bootstrapEvalCount" ? "input" : status === "bootstrapEvalConfirm" ? "confirm" : status === "eval-pick" ? "eval" : status === "batch-pick" ? "batch" : status;
  const statusColor = status === "error" ? "red" : status === "done" ? "green" : isLoading ? "yellow" : "cyanBright";

  const formatTokens = (result: EvalResult): string => {
    const withUsage = result.metrics?.withInstructions?.tokenUsage;
    const withoutUsage = result.metrics?.withoutInstructions?.tokenUsage;
    const withTotal = withUsage?.totalTokens ?? (withUsage ? (withUsage.promptTokens ?? 0) + (withUsage.completionTokens ?? 0) : undefined);
    const withoutTotal = withoutUsage?.totalTokens ?? (withoutUsage ? (withoutUsage.promptTokens ?? 0) + (withoutUsage.completionTokens ?? 0) : undefined);
    if (withTotal == null && withoutTotal == null) return "tokens n/a";
    return `tokens w/: ${withTotal ?? "n/a"} • w/o: ${withoutTotal ?? "n/a"}`;
  };

  const previewLines = generatedContent.split("\n").slice(0, 20);
  const truncatedPreview = previewLines.join("\n") + (generatedContent.split("\n").length > 20 ? "\n..." : "");

  if (status === "batch-github" && batchToken) {
    return <BatchTui token={batchToken} />;
  }

  if (status === "batch-azure" && batchAzureToken) {
    return <BatchTuiAzure token={batchAzureToken} />;
  }

  return (
    <Box flexDirection="column" padding={1} borderStyle="round" borderColor="magenta">
      {status === "intro" ? (
        <AnimatedBanner onComplete={handleAnimationComplete} />
      ) : (
        <StaticBanner />
      )}

      {/* Status Bar */}
      <Box marginTop={1} justifyContent="space-between">
        <Text color="cyanBright" bold>Prime your repo for AI</Text>
        <Text color={statusColor}>{statusIcon} {statusLabel}</Text>
      </Box>

      {/* Context */}
      <Divider label="Context" />
      <Box marginTop={0} flexDirection="column" paddingLeft={1}>
        <Text>
          <Text color="gray">Repo  </Text>
          <Text color="white" bold>{repoLabel}</Text>
          <Text color="gray" dimColor>  {repoFull}</Text>
        </Text>
        <Text>
          <Text color="gray">Model </Text>
          <Text color="cyanBright">{evalModel}</Text>
          <Text color="gray"> • Judge </Text>
          <Text color="cyanBright">{judgeModel}</Text>
          {availableModels.length > 0 && <Text color="gray" dimColor>  ({availableModels.length} available)</Text>}
        </Text>
        <Text>
          <Text color="gray">Eval  </Text>
          {hasEvalConfig === null ? (
            <Text color="gray" dimColor>checking...</Text>
          ) : hasEvalConfig ? (
            <Text color="green">primer.eval.json found</Text>
          ) : (
            <Text color="yellow">no eval config — press [I] to create</Text>
          )}
        </Text>
      </Box>

      {/* Activity */}
      <Divider label="Activity" />
      <Box marginTop={0} flexDirection="column" paddingLeft={1}>
        {activityLog.length === 0 && !message ? (
          <Text color="gray" dimColor>Awaiting input.</Text>
        ) : (
          <>
            {activityLog.slice(-3).map((entry, i) => (
              <Text key={i}>
                <Text color="gray" dimColor>{entry.time} </Text>
                <Text color={entry.type === "error" ? "red" : entry.type === "success" ? "green" : entry.type === "progress" ? "yellow" : "gray"} dimColor={entry.type === "info"}>
                  {entry.text}
                </Text>
              </Text>
            ))}
            {message && !activityLog.some(e => e.text === message) && (
              <Text>
                <Text color={isLoading ? "yellow" : "white"}>{isLoading ? `${spinner} ` : ""}{message}</Text>
              </Text>
            )}
          </>
        )}
      </Box>

      {/* Input: eval case count */}
      {status === "bootstrapEvalCount" && (
        <Box marginTop={1} paddingLeft={1}>
          <Text color="cyan">Eval case count: </Text>
          <Text color="white" bold>{evalCaseCountInput || "▍"}</Text>
        </Box>
      )}

      {/* Preview */}
      {status === "preview" && generatedContent && (
        <Box flexDirection="column" marginTop={1} borderStyle="single" borderColor="gray" paddingX={1}>
          <Text color="cyan" bold>Preview (.github/copilot-instructions.md)</Text>
          <Text color="gray">{truncatedPreview}</Text>
        </Box>
      )}

      {/* Eval Results */}
      {evalResults && evalResults.length > 0 && (
        <>
          <Divider label="Eval Results" />
          <Box flexDirection="column" paddingLeft={1}>
            {evalResults.map((r) => (
              <Text key={r.id}>
                <Text color={r.verdict === "pass" ? "green" : r.verdict === "fail" ? "red" : "yellow"}>
                  {r.verdict === "pass" ? "✓" : r.verdict === "fail" ? "✗" : "?"}{" "}
                </Text>
                <Text>{r.id}</Text>
                <Text color="gray"> score:{r.score} • {formatTokens(r)}</Text>
              </Text>
            ))}
            {evalViewerPath && (
              <Text color="gray" dimColor>Viewer: {evalViewerPath}</Text>
            )}
          </Box>
        </>
      )}

      {/* Commands */}
      <Divider label="Commands" />
      <Box marginTop={0} paddingLeft={1} flexDirection="column">
        {status === "intro" ? (
          <Text color="gray">Press any key to skip animation...</Text>
        ) : status === "preview" ? (
          <Box>
            <KeyHint k="S" label="Save" />
            <KeyHint k="D" label="Discard" />
            <KeyHint k="Q" label="Quit" />
          </Box>
        ) : status === "bootstrapEvalConfirm" ? (
          <Box>
            <KeyHint k="Y" label="Overwrite" />
            <KeyHint k="N" label="Cancel" />
            <KeyHint k="Q" label="Quit" />
          </Box>
        ) : status === "eval-pick" ? (
          <Box>
            <KeyHint k="R" label="Run eval" />
            <KeyHint k="I" label="Init eval" />
            <KeyHint k="Esc" label="Back" />
          </Box>
        ) : status === "batch-pick" ? (
          <Box>
            <KeyHint k="G" label="GitHub" />
            <KeyHint k="A" label="Azure DevOps" />
            <KeyHint k="Esc" label="Back" />
          </Box>
        ) : (
          <Box flexDirection="column">
            <Box>
              <KeyHint k="G" label="Generate" />
              <KeyHint k="E" label="Eval" />
              <KeyHint k="B" label="Batch" />
            </Box>
            <Box>
              <KeyHint k="M" label="Cycle model" />
              <KeyHint k="J" label="Cycle judge" />
              <KeyHint k="Q" label="Quit" />
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}

function buildTimestampedName(baseName: string): string {
  const stamp = new Date().toISOString().replace(/[:.]/gu, "-");
  return `${baseName}-${stamp}.json`;
}
