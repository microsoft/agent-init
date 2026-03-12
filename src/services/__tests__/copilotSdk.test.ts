import {
  attachDefaultPermissionHandler,
  shouldFallbackToExternalServer,
  BAT_SHIM_PATTERN,
  type CopilotSdkModule
} from "@agentrc/core/services/copilotSdk";
import { describe, expect, it, vi } from "vitest";

function buildMockClient() {
  const createSessionSpy = vi.fn(async (config: Record<string, unknown>) => ({
    id: "mock-session",
    config
  }));
  return {
    createSession: createSessionSpy,
    _originalCreateSession: createSessionSpy,
    start: vi.fn(),
    stop: vi.fn()
  };
}

type MockClient = ReturnType<typeof buildMockClient>;
type RealClient = InstanceType<CopilotSdkModule["CopilotClient"]>;

function asRealClient(client: MockClient): RealClient {
  return client as unknown as RealClient;
}

describe("attachDefaultPermissionHandler", () => {
  it("injects onPermissionRequest when not provided", async () => {
    const client = buildMockClient();
    attachDefaultPermissionHandler(asRealClient(client));

    await client.createSession({ model: "test-model", streaming: true });

    // The original spy should have been called with the injected handler
    const passedConfig = await client._originalCreateSession.mock.results[0].value;
    expect(passedConfig.config).toHaveProperty("onPermissionRequest");
    expect(typeof passedConfig.config.onPermissionRequest).toBe("function");

    // The injected handler should approve all request kinds
    const handler = passedConfig.config.onPermissionRequest as (req: unknown) => { kind: string };
    expect(handler({ kind: "shell" })).toEqual({ kind: "approved" });
    expect(handler({ kind: "write" })).toEqual({ kind: "approved" });
    expect(handler({ kind: "read" })).toEqual({ kind: "approved" });
    expect(handler({ kind: "url" })).toEqual({ kind: "approved" });
    expect(handler({ kind: "mcp" })).toEqual({ kind: "approved" });
  });

  it("preserves a caller-supplied onPermissionRequest", async () => {
    const client = buildMockClient();
    attachDefaultPermissionHandler(asRealClient(client));

    const customHandler = vi.fn(() => ({
      kind: "denied-interactively-by-user" as const
    }));

    await client.createSession({
      model: "test-model",
      onPermissionRequest: customHandler
    });

    const passedConfig = await client._originalCreateSession.mock.results[0].value;
    expect(passedConfig.config.onPermissionRequest).toBe(customHandler);
  });

  it("passes through all other config properties unchanged", async () => {
    const client = buildMockClient();
    attachDefaultPermissionHandler(asRealClient(client));

    await client.createSession({
      model: "test-model",
      streaming: true,
      workingDirectory: "/tmp/repo",
      infiniteSessions: { enabled: false }
    });

    const passedConfig = await client._originalCreateSession.mock.results[0].value;
    expect(passedConfig.config.model).toBe("test-model");
    expect(passedConfig.config.streaming).toBe(true);
    expect(passedConfig.config.workingDirectory).toBe("/tmp/repo");
    expect(passedConfig.config.infiniteSessions).toEqual({ enabled: false });
  });
});

describe("shouldFallbackToExternalServer", () => {
  it("returns true for unknown headless option error", () => {
    expect(shouldFallbackToExternalServer(new Error("unknown option '--headless'"))).toBe(true);
  });

  it("returns true for unknown no-auto-update option error", () => {
    expect(
      shouldFallbackToExternalServer(new Error("unknown option '--no-auto-update'"))
    ).toBe(true);
  });

  it("returns true for copilot cli not found error", () => {
    expect(
      shouldFallbackToExternalServer(new Error("Copilot CLI not found at cmd. Ensure @github/copilot is installed."))
    ).toBe(true);
  });

  it("returns true for spawn EINVAL error (Windows .bat/.cmd direct spawn)", () => {
    expect(shouldFallbackToExternalServer(new Error("spawn EINVAL"))).toBe(true);
  });

  it("returns true for lowercased spawn einval variant", () => {
    expect(shouldFallbackToExternalServer(new Error("spawn einval"))).toBe(true);
  });

  it("returns false for unrelated errors", () => {
    expect(shouldFallbackToExternalServer(new Error("ENOENT: no such file or directory"))).toBe(
      false
    );
    expect(shouldFallbackToExternalServer(new Error("Network timeout"))).toBe(false);
    expect(shouldFallbackToExternalServer(new Error("spawn EACCES"))).toBe(false);
  });

  it("handles non-Error values gracefully", () => {
    expect(shouldFallbackToExternalServer("spawn einval")).toBe(true);
    expect(shouldFallbackToExternalServer("some unrelated string")).toBe(false);
  });
});

describe("isBatShim detection regex (BAT_SHIM_PATTERN)", () => {
  it("matches .bat extension", () => {
    expect(BAT_SHIM_PATTERN.test("C:\\Users\\user\\copilotCli\\copilot.bat")).toBe(true);
  });

  it("matches .cmd extension", () => {
    expect(BAT_SHIM_PATTERN.test("C:\\Users\\user\\copilotCli\\copilot.cmd")).toBe(true);
  });

  it("matches case-insensitively", () => {
    expect(BAT_SHIM_PATTERN.test("copilot.BAT")).toBe(true);
    expect(BAT_SHIM_PATTERN.test("copilot.CMD")).toBe(true);
  });

  it("does not match non-shim executables", () => {
    expect(BAT_SHIM_PATTERN.test("/usr/bin/copilot")).toBe(false);
    expect(BAT_SHIM_PATTERN.test("copilot.exe")).toBe(false);
    expect(BAT_SHIM_PATTERN.test("node")).toBe(false);
  });

  it("does not match npx paths (handled by isNpx check)", () => {
    expect(BAT_SHIM_PATTERN.test("npx")).toBe(false);
    expect(BAT_SHIM_PATTERN.test("npx.cmd")).toBe(true); // .cmd matches, but isNpx fires first
  });
});
