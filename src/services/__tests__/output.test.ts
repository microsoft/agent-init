import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  outputResult,
  outputError,
  createProgressReporter,
  type CommandResult
} from "../../utils/output";

describe("outputResult", () => {
  let stdoutSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    stdoutSpy = vi.spyOn(process.stdout, "write").mockReturnValue(true);
  });

  afterEach(() => {
    stdoutSpy.mockRestore();
  });

  it("writes JSON to stdout when json=true", () => {
    const result: CommandResult<{ count: number }> = {
      ok: true,
      status: "success",
      data: { count: 42 }
    };
    outputResult(result, true);
    expect(stdoutSpy).toHaveBeenCalledOnce();
    const written = stdoutSpy.mock.calls[0][0] as string;
    expect(JSON.parse(written)).toEqual(result);
  });

  it("writes nothing when json=false", () => {
    const result: CommandResult = { ok: true, status: "success" };
    outputResult(result, false);
    expect(stdoutSpy).not.toHaveBeenCalled();
  });
});

describe("outputError", () => {
  let stdoutSpy: ReturnType<typeof vi.spyOn>;
  let stderrSpy: ReturnType<typeof vi.spyOn>;
  const origExitCode = process.exitCode;

  beforeEach(() => {
    stdoutSpy = vi.spyOn(process.stdout, "write").mockReturnValue(true);
    stderrSpy = vi.spyOn(process.stderr, "write").mockReturnValue(true);
    process.exitCode = undefined;
  });

  afterEach(() => {
    stdoutSpy.mockRestore();
    stderrSpy.mockRestore();
    process.exitCode = origExitCode;
  });

  it("writes JSON error to stdout when json=true", () => {
    outputError("something broke", true);
    expect(stdoutSpy).toHaveBeenCalledOnce();
    const parsed = JSON.parse(stdoutSpy.mock.calls[0][0] as string);
    expect(parsed.ok).toBe(false);
    expect(parsed.status).toBe("error");
    expect(parsed.errors).toEqual(["something broke"]);
    expect(stderrSpy).not.toHaveBeenCalled();
  });

  it("writes human error to stderr when json=false", () => {
    outputError("something broke", false);
    expect(stderrSpy).toHaveBeenCalledOnce();
    expect(stderrSpy.mock.calls[0][0]).toContain("something broke");
    expect(stdoutSpy).not.toHaveBeenCalled();
  });

  it("sets process.exitCode to 1", () => {
    outputError("fail", false);
    expect(process.exitCode).toBe(1);
  });
});

describe("createProgressReporter", () => {
  let stderrSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    stderrSpy = vi.spyOn(process.stderr, "write").mockReturnValue(true);
  });

  afterEach(() => {
    stderrSpy.mockRestore();
  });

  it("human reporter writes to stderr", () => {
    const reporter = createProgressReporter(false);
    reporter.update("loading...");
    reporter.succeed("done!");
    reporter.fail("oops");
    reporter.done();
    expect(stderrSpy).toHaveBeenCalledTimes(3);
    expect(stderrSpy.mock.calls[0][0]).toContain("loading...");
    expect(stderrSpy.mock.calls[1][0]).toContain("done!");
    expect(stderrSpy.mock.calls[2][0]).toContain("oops");
  });

  it("silent reporter writes nothing", () => {
    const reporter = createProgressReporter(true);
    reporter.update("loading...");
    reporter.succeed("done!");
    reporter.fail("oops");
    reporter.done();
    expect(stderrSpy).not.toHaveBeenCalled();
  });
});
