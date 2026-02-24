/**
 * Structured output utilities for headless / JSON CLI mode.
 *
 * Convention:
 *  - stdout  → machine-readable JSON (only when `json` flag is set)
 *  - stderr  → human-readable progress, logs, and errors
 */

export type CommandResult<T = unknown> = {
  ok: boolean;
  status: "success" | "partial" | "noop" | "error";
  data?: T;
  errors?: string[];
};

export interface ProgressReporter {
  update(message: string): void;
  succeed(message: string): void;
  fail(message: string): void;
  done(): void;
}

class HumanProgressReporter implements ProgressReporter {
  update(message: string): void {
    process.stderr.write(`  ${message}\n`);
  }
  succeed(message: string): void {
    process.stderr.write(`  ✓ ${message}\n`);
  }
  fail(message: string): void {
    process.stderr.write(`  ✗ ${message}\n`);
  }
  done(): void {
    /* noop */
  }
}

class SilentProgressReporter implements ProgressReporter {
  update(): void {
    /* noop */
  }
  succeed(): void {
    /* noop */
  }
  fail(): void {
    /* noop */
  }
  done(): void {
    /* noop */
  }
}

export function createProgressReporter(silent: boolean): ProgressReporter {
  return silent ? new SilentProgressReporter() : new HumanProgressReporter();
}

export function shouldLog(options: { json?: boolean; quiet?: boolean }): boolean {
  return !options.json && !options.quiet;
}

export function outputResult<T>(result: CommandResult<T>, json: boolean): void {
  if (json) {
    process.stdout.write(JSON.stringify(result, null, 2) + "\n");
  }
}

export function deriveFileStatus(files: { action: "wrote" | "skipped" }[]): {
  ok: boolean;
  status: "success" | "partial" | "noop";
} {
  const hasWrites = files.some((f) => f.action === "wrote");
  const hasSkips = files.some((f) => f.action === "skipped");
  if (hasWrites && hasSkips) return { ok: true, status: "partial" };
  if (hasWrites || files.length === 0) return { ok: true, status: "success" };
  return { ok: true, status: "noop" };
}

export function outputError(message: string, json: boolean): void {
  if (json) {
    const result: CommandResult = { ok: false, status: "error", errors: [message] };
    process.stdout.write(JSON.stringify(result, null, 2) + "\n");
  } else {
    process.stderr.write(`Error: ${message}\n`);
  }
  process.exitCode = 1;
}
