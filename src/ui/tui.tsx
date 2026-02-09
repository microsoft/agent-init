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
import { analyzeRepo, RepoApp } from "../services/analyzer";

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
  | "model-pick"
  | "generate-pick"
  | "generate-app-pick"
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

const PREFERRED_MODELS = ["claude-sonnet-4.5", "claude-sonnet-4", "gpt-4.1", "gpt-5"];

function pickBestModel(available: string[], fallback: string): string {
  for (const preferred of PREFERRED_MODELS) {
    if (available.includes(preferred)) return preferred;
  }
  return available[0] || fallback;
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
  const [evalModel, setEvalModel] = useState<string>("claude-sonnet-4.5");
  const [judgeModel, setJudgeModel] = useState<string>("claude-sonnet-4.5");
  const [modelPickTarget, setModelPickTarget] = useState<"eval" | "judge">("eval");
  const [modelCursor, setModelCursor] = useState(0);
  const [hasEvalConfig, setHasEvalConfig] = useState<boolean | null>(null);
  const [activityLog, setActivityLog] = useState<LogEntry[]>([]);
  const [generateTarget, setGenerateTarget] = useState<"copilot-instructions" | "agents-md">("copilot-instructions");
  const [generateSavePath, setGenerateSavePath] = useState<string>("");
  const [repoApps, setRepoApps] = useState<RepoApp[]>([]);
  const [isMonorepo, setIsMonorepo] = useState(false);
  const repoLabel = useMemo(() => path.basename(repoPath), [repoPath]);
  const repoFull = useMemo(() => repoPath, [repoPath]);
  const isLoading = status === "generating" || status === "bootstrapping" || status === "evaluating";
  const isMenu = status === "model-pick" || status === "eval-pick" || status === "batch-pick" || status === "generate-pick" || status === "generate-app-pick";
  const spinner = useSpinner(isLoading);

  const addLog = (text: string, type: LogEntry["type"] = "info") => {
    setActivityLog((prev) => [...prev.slice(-4), { text, type, time: timestamp() }]);
  };

  const handleAnimationComplete = () => {
    setStatus("idle");
  };

  // Check for eval config and repo structure on mount
  useEffect(() => {
    const configPath = path.join(repoPath, "primer.eval.json");
    fs.access(configPath).then(() => setHasEvalConfig(true)).catch(() => setHasEvalConfig(false));
    analyzeRepo(repoPath).then((analysis) => {
      const apps = analysis.apps ?? [];
      setRepoApps(apps);
      setIsMonorepo(analysis.isMonorepo ?? false);
    }).catch(() => {});
  }, [repoPath]);

  useEffect(() => {
    let active = true;
    listCopilotModels()
      .then((models) => {
        if (!active) return;
        setAvailableModels(models);
        if (models.length === 0) return;
        setEvalModel((current) => (models.includes(current) ? current : pickBestModel(models, current)));
        setJudgeModel((current) => (models.includes(current) ? current : pickBestModel(models, current)));
      })
      .catch(() => {
        if (!active) return;
        setAvailableModels([]);
      });
    return () => {
      active = false;
    };
  }, []);

  const doGenerate = async (targetRepoPath: string, savePath: string, target: string): Promise<void> => {
    setStatus("generating");
    setMessage(`Generating ${target}...`);
    addLog(`Generating ${target}...`, "progress");
    try {
      const content = await generateCopilotInstructions({
        repoPath: targetRepoPath,
        onProgress: (msg) => setMessage(msg)
      });
      if (!content.trim()) {
        throw new Error("Copilot SDK returned empty content.");
      }
      setGeneratedContent(content);
      setGenerateSavePath(savePath);
      setStatus("preview");
      setMessage("Review the generated content below.");
      addLog(`${target} generated — review and save.`, "success");
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
  };

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
            const outputPath = generateSavePath || path.join(repoPath, ".github", "copilot-instructions.md");
            await fs.mkdir(path.dirname(outputPath), { recursive: true });
            await fs.writeFile(outputPath, generatedContent, "utf8");
            setStatus("done");
            const relPath = path.relative(repoPath, outputPath);
            const msg = `Saved to ${relPath}`;
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

      if (status === "generate-pick") {
        if (input.toLowerCase() === "c") {
          setGenerateTarget("copilot-instructions");
          if (isMonorepo && repoApps.length > 1) {
            setStatus("generate-app-pick");
            setMessage("Generate for root or per-app?");
          } else {
            const savePath = path.join(repoPath, ".github", "copilot-instructions.md");
            setGenerateSavePath(savePath);
            await doGenerate(repoPath, savePath, "copilot-instructions");
          }
          return;
        }
        if (input.toLowerCase() === "a") {
          setGenerateTarget("agents-md");
          if (isMonorepo && repoApps.length > 1) {
            setStatus("generate-app-pick");
            setMessage("Generate for root or per-app?");
          } else {
            const savePath = path.join(repoPath, "AGENTS.md");
            setGenerateSavePath(savePath);
            await doGenerate(repoPath, savePath, "agents-md");
          }
          return;
        }
        if (key.escape) {
          setStatus("idle");
          setMessage("");
          return;
        }
        return;
      }

      if (status === "generate-app-pick") {
        if (input.toLowerCase() === "r") {
          // Root only
          const savePath = generateTarget === "copilot-instructions"
            ? path.join(repoPath, ".github", "copilot-instructions.md")
            : path.join(repoPath, "AGENTS.md");
          setGenerateSavePath(savePath);
          await doGenerate(repoPath, savePath, generateTarget);
          return;
        }
        if (input.toLowerCase() === "a") {
          // All apps sequentially
          setStatus("generating");
          addLog(`Generating ${generateTarget} for ${repoApps.length} apps...`, "progress");
          let count = 0;
          for (const app of repoApps) {
            const savePath = generateTarget === "copilot-instructions"
              ? path.join(app.path, ".github", "copilot-instructions.md")
              : path.join(app.path, "AGENTS.md");
            setMessage(`Generating for ${app.name} (${count + 1}/${repoApps.length})...`);
            try {
              const content = await generateCopilotInstructions({
                repoPath: app.path,
                onProgress: (msg) => setMessage(`${app.name}: ${msg}`)
              });
              if (content.trim()) {
                await fs.mkdir(path.dirname(savePath), { recursive: true });
                await fs.writeFile(savePath, content, "utf8");
                count++;
                addLog(`${app.name}: saved ${path.basename(savePath)}`, "success");
              }
            } catch (error) {
              const msg = error instanceof Error ? error.message : "Failed.";
              addLog(`${app.name}: ${msg}`, "error");
            }
          }
          setStatus("done");
          setMessage(`Generated ${generateTarget} for ${count}/${repoApps.length} apps.`);
          return;
        }
        // Number to pick a specific app
        const num = Number.parseInt(input, 10);
        if (Number.isFinite(num) && num >= 1 && num <= repoApps.length) {
          const app = repoApps[num - 1];
          const savePath = generateTarget === "copilot-instructions"
            ? path.join(app.path, ".github", "copilot-instructions.md")
            : path.join(app.path, "AGENTS.md");
          setGenerateSavePath(savePath);
          await doGenerate(app.path, savePath, generateTarget);
          return;
        }
        if (key.escape) {
          setStatus("generate-pick");
          setMessage("Select what to generate.");
          return;
        }
        return;
      }

      if (status === "model-pick") {
        if (key.escape) {
          setStatus("idle");
          setMessage("");
          return;
        }
        if (key.upArrow) {
          setModelCursor((prev) => Math.max(0, prev - 1));
          return;
        }
        if (key.downArrow) {
          setModelCursor((prev) => Math.min(availableModels.length - 1, prev + 1));
          return;
        }
        if (key.return) {
          const chosen = availableModels[modelCursor];
          if (chosen) {
            if (modelPickTarget === "eval") {
              setEvalModel(chosen);
              addLog(`Eval model → ${chosen}`, "success");
            } else {
              setJudgeModel(chosen);
              addLog(`Judge model → ${chosen}`, "success");
            }
            setStatus("idle");
            setMessage(`${modelPickTarget === "eval" ? "Eval" : "Judge"} model set to ${chosen}`);
          }
          return;
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
        setStatus("generate-pick");
        setMessage("Select what to generate.");
        return;
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
        setModelPickTarget("eval");
        setStatus("model-pick");
        setMessage("Pick eval model.");
        // Set cursor to current model
        const idx = availableModels.indexOf(evalModel);
        setModelCursor(idx >= 0 ? idx : 0);
        return;
      }

      if (input.toLowerCase() === "j") {
        if (!availableModels.length) {
          setMessage("No Copilot CLI models detected; using defaults.");
          return;
        }
        setModelPickTarget("judge");
        setStatus("model-pick");
        setMessage("Pick judge model.");
        const idx = availableModels.indexOf(judgeModel);
        setModelCursor(idx >= 0 ? idx : 0);
        return;
      }
  });

  const statusIcon = status === "error" ? "✗" : status === "done" ? "✓" : isLoading ? spinner : "●";
  const statusLabel = status === "intro" ? "starting" : status === "idle" ? "ready" : status === "bootstrapEvalCount" ? "input" : status === "bootstrapEvalConfirm" ? "confirm" : status === "eval-pick" ? "eval" : status === "batch-pick" ? "batch" : status === "model-pick" ? "models" : status;
  const statusColor = status === "error" ? "red" : status === "done" ? "green" : isLoading ? "yellow" : isMenu ? "magentaBright" : "cyanBright";

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
          {isMonorepo && <Text color="magentaBright"> monorepo · {repoApps.length} apps</Text>}
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

      {/* Model Picker */}
      {status === "model-pick" && availableModels.length > 0 && (
        <>
          <Divider label={`Pick ${modelPickTarget} model`} />
          <Box flexDirection="column" paddingLeft={1}>
            {availableModels.map((model, i) => {
              const current = modelPickTarget === "eval" ? evalModel : judgeModel;
              const isCurrent = model === current;
              const isCursor = i === modelCursor;
              return (
                <Text key={model}>
                  <Text color={isCursor ? "cyan" : undefined}>{isCursor ? "\u276F " : "  "}</Text>
                  <Text color={isCurrent ? "green" : isCursor ? "cyanBright" : "white"} bold={isCursor}>{model}</Text>
                  {isCurrent && <Text color="green" dimColor> (current)</Text>}
                </Text>
              );
            })}
            {availableModels.length > 15 && (
              <Text color="gray" dimColor>Use {"\u2191\u2193"} to scroll</Text>
            )}
          </Box>
        </>
      )}

      {/* App picker for monorepo generate */}
      {status === "generate-app-pick" && repoApps.length > 0 && (
        <>
          <Divider label={`Generate ${generateTarget}`} />
          <Box flexDirection="column" paddingLeft={1}>
            {repoApps.map((app, i) => (
              <Text key={app.name}>
                <Text color="cyanBright" bold>{i + 1}</Text>
                <Text color="gray"> </Text>
                <Text color="white">{app.name}</Text>
                <Text color="gray" dimColor>  {path.relative(repoPath, app.path)}</Text>
              </Text>
            ))}
          </Box>
        </>
      )}

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
          <Text color="cyan" bold>Preview ({path.relative(repoPath, generateSavePath) || generateTarget})</Text>
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
        ) : status === "model-pick" ? (
          <Box>
            <Text color="cyan">Use </Text>
            <Text color="cyanBright" bold>{"\u2191\u2193"}</Text>
            <Text color="cyan"> to navigate, </Text>
            <Text color="cyanBright" bold>Enter</Text>
            <Text color="cyan"> to select  </Text>
            <KeyHint k="Esc" label="Back" />
          </Box>
        ) : status === "generate-pick" ? (
          <Box>
            <KeyHint k="C" label="Copilot instructions" />
            <KeyHint k="A" label="AGENTS.md" />
            <KeyHint k="Esc" label="Back" />
          </Box>
        ) : status === "generate-app-pick" ? (
          <Box>
            <KeyHint k="R" label="Root only" />
            <KeyHint k="A" label="All apps" />
            <Text color="gray" dimColor>  or press </Text>
            <Text color="cyanBright" bold>1</Text>
            <Text color="gray" dimColor>-</Text>
            <Text color="cyanBright" bold>{repoApps.length}</Text>
            <Text color="gray" dimColor>  </Text>
            <KeyHint k="Esc" label="Back" />
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
              <KeyHint k="M" label="Model" />
              <KeyHint k="J" label="Judge" />
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
