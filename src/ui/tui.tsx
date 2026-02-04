import React, { useEffect, useMemo, useState } from "react";
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
import { ReadinessReport, ReadinessCriterionResult, runReadinessReport } from "../services/readiness";

type Props = {
  repoPath: string;
  skipAnimation?: boolean;
};

type Status =
  | "intro"
  | "idle"
  | "generating"
  | "readiness"
  | "bootstrapping"
  | "evaluating"
  | "preview"
  | "done"
  | "error"
  | "batch-github"
  | "batch-azure"
  | "bootstrapEvalCount"
  | "bootstrapEvalConfirm";

type EvalConfig = {
  instructionFile?: string;
  cases: Array<{ id: string; prompt: string; expectation: string }>;
  systemMessage?: string;
  outputPath?: string;
};

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
  const [readinessReport, setReadinessReport] = useState<ReadinessReport | null>(null);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [evalModel, setEvalModel] = useState<string>("gpt-4.1");
  const [judgeModel, setJudgeModel] = useState<string>("gpt-4.1");
  const repoLabel = useMemo(() => repoPath, [repoPath]);

  const handleAnimationComplete = () => {
    setStatus("idle");
  };

  const cycleModel = (current: string): string => {
    if (!availableModels.length) return current;
    const index = availableModels.indexOf(current);
    const nextIndex = index === -1 ? 0 : (index + 1) % availableModels.length;
    return availableModels[nextIndex];
  };

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
      const config = await generateEvalScaffold({
        repoPath,

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
            setMessage("Saved to .github/copilot-instructions.md");
            setGeneratedContent("");
          } catch (error) {
            setStatus("error");
            setMessage(error instanceof Error ? error.message : "Failed to save.");
          }
          return;
        }
        if (input.toLowerCase() === "d") {
          setStatus("idle");
          setMessage("Discarded generated instructions.");
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

      if (input.toLowerCase() === "g") {
        setStatus("generating");
        setMessage("Starting generation...");
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
        } catch (error) {
          setStatus("error");
          const message = error instanceof Error ? error.message : "Generation failed.";
          if (message.toLowerCase().includes("auth") || message.toLowerCase().includes("login")) {
            setMessage(`${message} Run 'copilot' then '/login' in a separate terminal.`);
          } else {
            setMessage(message);
          }
        }
      }

      if (input.toLowerCase() === "b") {
        setStatus("generating");
        setMessage("Checking GitHub authentication...");
        const token = await getGitHubToken();
        if (!token) {
          setStatus("error");
          setMessage("GitHub auth required. Run 'gh auth login' or set GITHUB_TOKEN.");
          return;
        }
        setBatchToken(token);
        setStatus("batch-github");
        return;
      }

      if (input.toLowerCase() === "z") {
        setStatus("generating");
        setMessage("Checking Azure DevOps authentication...");
        const token = getAzureDevOpsToken();
        if (!token) {
          setStatus("error");
          setMessage("Azure DevOps PAT required. Set AZURE_DEVOPS_PAT or AZDO_PAT.");
          return;
        }
        setBatchAzureToken(token);
        setStatus("batch-azure");
        return;
      }

      if (input.toLowerCase() === "e") {
        const configPath = path.join(repoPath, "primer.eval.json");
        const outputPath = path.join(repoPath, ".primer", "evals", buildTimestampedName("eval-results"));
        try {
          await fs.access(configPath);
        } catch {
          setStatus("error");
          setMessage("No primer.eval.json found. Run 'primer eval --init' to create one.");
          return;
        }

        setStatus("evaluating");
        setMessage("Running evals... (this may take a few minutes)");
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
          setMessage(`Eval complete: ${passed} pass, ${failed} fail out of ${results.length} cases.`);
        } catch (error) {
          setStatus("error");
          setMessage(error instanceof Error ? error.message : "Eval failed.");
        }
      }

      if (input.toLowerCase() === "m") {
        if (!availableModels.length) {
          setMessage("No Copilot CLI models detected; using defaults.");
          return;
        }
        const next = cycleModel(evalModel);
        setEvalModel(next);
        setMessage(`Eval model: ${next}`);
        return;
      }

      if (input.toLowerCase() === "j") {
        if (!availableModels.length) {
          setMessage("No Copilot CLI models detected; using defaults.");
          return;
        }
        const next = cycleModel(judgeModel);
        setJudgeModel(next);
        setMessage(`Judge model: ${next}`);
        return;
      }

      if (input.toLowerCase() === "i") {
        setStatus("bootstrapEvalCount");
        setMessage("Enter number of eval cases, then press Enter.");
        setEvalCaseCountInput("");
        setEvalBootstrapCount(null);
      }

      if (input.toLowerCase() === "r") {
        setStatus("readiness");
        setMessage("Running readiness report...");
        setReadinessReport(null);
        try {
          const report = await runReadinessReport({ repoPath });
          setReadinessReport(report);
          setStatus("done");
          setMessage("Readiness report complete.");
        } catch (error) {
          setStatus("error");
          setMessage(error instanceof Error ? error.message : "Readiness report failed.");
        }
      }
    });
      setEvalCaseCountInput("");
      setEvalBootstrapCount(null);
    }

    if (input.toLowerCase() === "r") {
      setStatus("readiness");
      setMessage("Running readiness report...");
      setReadinessReport(null);
      try {
        const report = await runReadinessReport({ repoPath });
        setReadinessReport(report);
        setStatus("done");
        setMessage("Readiness report complete.");
      } catch (error) {
        setStatus("error");
        setMessage(error instanceof Error ? error.message : "Readiness report failed.");
      }
    }
  });

  const statusLabel = status === "intro" ? "starting" : status === "idle" ? "ready" : status;
  const statusColor = status === "error" ? "red" : status === "done" ? "green" : "yellow";
  const formatTokens = (result: EvalResult): string => {
    const withUsage = result.metrics?.withInstructions?.tokenUsage;
    const withoutUsage = result.metrics?.withoutInstructions?.tokenUsage;
    const withTotal = withUsage?.totalTokens ?? (withUsage ? (withUsage.promptTokens ?? 0) + (withUsage.completionTokens ?? 0) : undefined);
    const withoutTotal = withoutUsage?.totalTokens ?? (withoutUsage ? (withoutUsage.promptTokens ?? 0) + (withoutUsage.completionTokens ?? 0) : undefined);
    if (withTotal == null && withoutTotal == null) return "tokens n/a";
    return `tokens w/: ${withTotal ?? "n/a"} • w/o: ${withoutTotal ?? "n/a"}`;
  };

  // Truncate preview to fit terminal
  const previewLines = generatedContent.split("\n").slice(0, 20);
  const truncatedPreview = previewLines.join("\n") + (generatedContent.split("\n").length > 20 ? "\n..." : "");

  // Render BatchTui when in batch mode
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
      <Box marginTop={1} justifyContent="space-between">
        <Text color="cyanBright">Prime your repo for AI</Text>
        <Text color={statusColor}>● {statusLabel}</Text>
      </Box>
      <Text color="gray">Repo: {repoLabel}</Text>
      <Text color="gray">Eval model: {evalModel} • Judge model: {judgeModel}</Text>

      <Box marginTop={1} borderStyle="round" borderColor="gray" paddingX={1}>
        <Text color="gray" bold>
          Activity
        </Text>
        <Text>{message || "Awaiting input."}</Text>
      </Box>
      {status === "bootstrapEvalCount" && (
        <Box marginTop={1}>
          <Text color="cyan">Eval case count: {evalCaseCountInput || ""}</Text>
        </Box>
      )}
      {status === "preview" && generatedContent && (
        <Box flexDirection="column" marginTop={1} borderStyle="single" borderColor="gray" paddingX={1}>
          <Text color="cyan" bold>Preview (.github/copilot-instructions.md):</Text>
          <Text color="gray">{truncatedPreview}</Text>
        </Box>
      )}
      {evalResults && evalResults.length > 0 && (
        <Box flexDirection="column" marginTop={1} borderStyle="single" borderColor="gray" paddingX={1}>
          <Text color="cyan" bold>Eval Results:</Text>
          {evalResults.map((r) => (
            <Text key={r.id} color={r.verdict === "pass" ? "green" : r.verdict === "fail" ? "red" : "yellow"}>
              {r.verdict === "pass" ? "✓" : r.verdict === "fail" ? "✗" : "?"} {r.id}: {r.verdict} (score: {r.score}) • {formatTokens(r)}
            </Text>
          ))}
          {evalViewerPath && (
            <Text>Trajectory viewer: {evalViewerPath}</Text>
          )}
        </Box>
      )}
      {readinessReport && (
        <Box flexDirection="column" marginTop={1} borderStyle="single" borderColor="gray" paddingX={1}>
          <Text color="cyan" bold>Readiness Report:</Text>
          <Text>Level: {readinessReport.achievedLevel || 1} ({levelName(readinessReport.achievedLevel || 1)})</Text>
          <Text>Monorepo: {readinessReport.isMonorepo ? "yes" : "no"}{readinessReport.apps.length ? ` (${readinessReport.apps.length} apps)` : ""}</Text>
          <Text color="gray">Pillars:</Text>
          {readinessReport.pillars.map((pillar) => (
            <Text key={pillar.id} color={pillar.passRate >= 0.8 ? "green" : "yellow"}>
              {pillar.name}: {pillar.passed}/{pillar.total} ({formatPercent(pillar.passRate)})
            </Text>
          ))}
          {topFixes(readinessReport.criteria).length > 0 && (
            <>
              <Text color="gray">Fix first:</Text>
              {topFixes(readinessReport.criteria).map((fix) => (
                <Text key={fix.id}>
                  - {fix.title} ({fix.impact}/{fix.effort})
                </Text>
              ))}
            </>
          )}
        </Box>
      )}
      <Box marginTop={1}>
        {status === "intro" ? (
          <Text color="gray">Press any key to skip animation...</Text>
        ) : status === "preview" ? (
          <Text color="cyan">Keys: [S] Save  [D] Discard  [Q] Quit</Text>
        ) : status === "bootstrapEvalConfirm" ? (
          <Text color="cyan">Keys: [Y] Overwrite  [N] Cancel  [Q] Quit</Text>
        ) : (
          <Text color="cyan">Keys: [A] Analyze  [G] Generate  [R] Readiness  [E] Eval  [I] Init Eval  [M] Model  [J] Judge  [B] Batch  [Z] Batch Azure  [Q] Quit</Text>
        )}
      </Box>
    </Box>
  );
}

function buildTimestampedName(baseName: string): string {
  const stamp = new Date().toISOString().replace(/[:.]/gu, "-");
  return `${baseName}-${stamp}.json`;
}

function topFixes(criteria: ReadinessCriterionResult[]): ReadinessCriterionResult[] {
  return criteria
    .filter((criterion) => criterion.status === "fail")
    .sort((a, b) => {
      const impactDelta = impactWeight(b.impact) - impactWeight(a.impact);
      if (impactDelta !== 0) return impactDelta;
      return effortWeight(a.effort) - effortWeight(b.effort);
    })
    .slice(0, 5);
}

function impactWeight(value: "high" | "medium" | "low"): number {
  if (value === "high") return 3;
  if (value === "medium") return 2;
  return 1;
}

function effortWeight(value: "low" | "medium" | "high"): number {
  if (value === "low") return 1;
  if (value === "medium") return 2;
  return 3;
}

function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

function levelName(level: number): string {
  if (level === 2) return "Documented";
  if (level === 3) return "Standardized";
  if (level === 4) return "Optimized";
  if (level === 5) return "Autonomous";
  return "Functional";
}
