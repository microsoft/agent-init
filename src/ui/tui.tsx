import React, { useMemo, useState } from "react";
import { Box, Key, Text, useApp, useInput } from "ink";
import fs from "fs/promises";
import path from "path";
import { analyzeRepo, RepoAnalysis } from "../services/analyzer";
import { generateCopilotInstructions } from "../services/instructions";
import { runEval, type EvalResult } from "../services/evaluator";
import { AnimatedBanner, StaticBanner } from "./AnimatedBanner";
import { BatchTui } from "./BatchTui";
import { getGitHubToken } from "../services/github";
import { safeWriteFile } from "../utils/fs";

type Props = {
  repoPath: string;
  skipAnimation?: boolean;
};

type Status =
  | "intro"
  | "idle"
  | "analyzing"
  | "generating"
  | "evaluating"
  | "preview"
  | "done"
  | "error"
  | "batch"
  | "bootstrapEvalCount"
  | "bootstrapEvalConfirm";

type EvalCase = {
  id: string;
  prompt: string;
  expectation: string;
};

type EvalConfig = {
  instructionFile?: string;
  cases: EvalCase[];
  systemMessage?: string;
  outputPath?: string;
};

function buildBootstrapEvalConfig(count: number): EvalConfig {
  const templates = [
    {
      prompt: "Summarize this repository's purpose and main entry points. Use the README and package.json if available.",
      expectation: "A concise summary of repo purpose plus key entry points (CLI or main files) and how to run it."
    },
    {
      prompt: "Identify the primary languages, frameworks, and package manager used in this repo.",
      expectation: "A brief list of languages/frameworks and the detected package manager, with short justification."
    },
    {
      prompt: "Draft a minimal .github/copilot-instructions.md tailored to this repo's conventions.",
      expectation: "A short instruction file referencing observed conventions, avoiding assumptions or secrets."
    },
    {
      prompt: "Describe how to run the CLI and list its core commands and flags.",
      expectation: "Clear usage instructions with command names and key flags derived from docs or source."
    },
    {
      prompt: "Propose an eval case that checks consistency between CLI and TUI behaviors.",
      expectation: "One eval case that validates parity between CLI and TUI outputs or workflows."
    }
  ];

  const cases = Array.from({ length: count }, (_, index) => {
    const template = templates[index % templates.length];
    const variant = Math.floor(index / templates.length);
    const suffix = variant > 0 ? ` (variant ${variant + 1})` : "";
    return {
      id: `case-${index + 1}`,
      prompt: `${template.prompt}${suffix}`,
      expectation: `${template.expectation}${suffix}`
    } satisfies EvalCase;
  });

  return {
    instructionFile: ".github/copilot-instructions.md",
    cases
  };
}

export function PrimerTui({ repoPath, skipAnimation = false }: Props): React.JSX.Element {
  const app = useApp();
  const [status, setStatus] = useState<Status>(skipAnimation ? "idle" : "intro");
  const [analysis, setAnalysis] = useState<RepoAnalysis | null>(null);
  const [message, setMessage] = useState<string>("");
  const [generatedContent, setGeneratedContent] = useState<string>("");
  const [evalResults, setEvalResults] = useState<EvalResult[] | null>(null);
  const [evalViewerPath, setEvalViewerPath] = useState<string | null>(null);
  const [batchToken, setBatchToken] = useState<string | null>(null);
  const [evalCaseCountInput, setEvalCaseCountInput] = useState<string>("");
  const [evalBootstrapCount, setEvalBootstrapCount] = useState<number | null>(null);
  const repoLabel = useMemo(() => repoPath, [repoPath]);

  const handleAnimationComplete = () => {
    setStatus("idle");
  };

  useInput(async (input: string, key: Key) => {
    // During intro animation, any key skips it
    if (status === "intro") {
      setStatus("idle");
      return;
    }

    if (key.escape || input.toLowerCase() === "q") {
      app.exit();
      return;
    }

    // In preview mode, handle save/discard
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
          const config = buildBootstrapEvalConfig(count);
          const resultMessage = await safeWriteFile(configPath, JSON.stringify(config, null, 2), false);
          setStatus("done");
          setMessage(`Bootstrapped eval: ${resultMessage}`);
          setEvalCaseCountInput("");
          setEvalBootstrapCount(null);
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
        try {
          const configPath = path.join(repoPath, "primer.eval.json");
          const config = buildBootstrapEvalConfig(count);
          const resultMessage = await safeWriteFile(configPath, JSON.stringify(config, null, 2), true);
          setStatus("done");
          setMessage(`Bootstrapped eval: ${resultMessage}`);
        } catch (error) {
          setStatus("error");
          setMessage(error instanceof Error ? error.message : "Failed to write eval config.");
        } finally {
          setEvalCaseCountInput("");
          setEvalBootstrapCount(null);
        }
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

    if (input.toLowerCase() === "a") {
      setStatus("analyzing");
      try {
        const result = await analyzeRepo(repoPath);
        setAnalysis(result);
        setStatus("done");
        setMessage("Analysis complete.");
      } catch (error) {
        setStatus("error");
        setMessage(error instanceof Error ? error.message : "Analysis failed.");
      }
      return;
    }

    if (input.toLowerCase() === "g") {
      setStatus("generating");
      setMessage("Starting generation...");
      try {
        const content = await generateCopilotInstructions({ 
          repoPath,
          onProgress: (msg) => setMessage(msg),
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
      setStatus("analyzing");
      setMessage("Checking GitHub authentication...");
      const token = await getGitHubToken();
      if (!token) {
        setStatus("error");
        setMessage("GitHub auth required. Run 'gh auth login' or set GITHUB_TOKEN.");
        return;
      }
      setBatchToken(token);
      setStatus("batch");
      return;
    }

    if (input.toLowerCase() === "e") {
      const configPath = path.join(repoPath, "primer.eval.json");
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
          model: "gpt-4.1",
          judgeModel: "gpt-4.1",
          // Note: onProgress removed - causes issues with SDK in React/Ink context
        });
        setEvalResults(results);
        setEvalViewerPath(viewerPath ?? null);
        const passed = results.filter(r => r.verdict === "pass").length;
        const failed = results.filter(r => r.verdict === "fail").length;
        setStatus("done");
        setMessage(`Eval complete: ${passed} pass, ${failed} fail out of ${results.length} cases.`);
      } catch (error) {
        setStatus("error");
        setMessage(error instanceof Error ? error.message : "Eval failed.");
      }
    }

    if (input.toLowerCase() === "i") {
      setStatus("bootstrapEvalCount");
      setMessage("Enter number of eval cases, then press Enter.");
      setEvalCaseCountInput("");
      setEvalBootstrapCount(null);
    }
  });

  const statusLabel = status === "intro" ? "..." : status === "idle" ? "ready (awaiting input)" : status;

  // Truncate preview to fit terminal
  const previewLines = generatedContent.split("\n").slice(0, 20);
  const truncatedPreview = previewLines.join("\n") + (generatedContent.split("\n").length > 20 ? "\n..." : "");

  // Render BatchTui when in batch mode
  if (status === "batch" && batchToken) {
    return <BatchTui token={batchToken} />;
  }

  return (
    <Box flexDirection="column" padding={1} borderStyle="round">
      {status === "intro" ? (
        <AnimatedBanner onComplete={handleAnimationComplete} />
      ) : (
        <StaticBanner />
      )}
      <Text color="cyan">Prime your repo for AI.</Text>
      <Text color="gray">Repo: {repoLabel}</Text>
      <Box flexDirection="column" marginTop={1}>
        <Text>Status: {statusLabel}</Text>
        {analysis && (
          <Box flexDirection="column" marginTop={1}>
            <Text>Languages: {analysis.languages.join(", ") || "unknown"}</Text>
            <Text>Frameworks: {analysis.frameworks.join(", ") || "none"}</Text>
            <Text>Package manager: {analysis.packageManager ?? "unknown"}</Text>
          </Box>
        )}
      </Box>
      <Box marginTop={1}>
        <Text>{message}</Text>
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
              {r.verdict === "pass" ? "✓" : r.verdict === "fail" ? "✗" : "?"} {r.id}: {r.verdict} (score: {r.score})
            </Text>
          ))}
          {evalViewerPath && (
            <Text>Trajectory viewer: {evalViewerPath}</Text>
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
          <Text color="cyan">Keys: [A] Analyze  [G] Generate  [E] Eval  [I] Init Eval  [B] Batch  [Q] Quit</Text>
        )}
      </Box>
    </Box>
  );
}
