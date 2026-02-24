import { describe, expect, it } from "vitest";

import { buildAuthedUrl } from "../git";

describe("buildAuthedUrl", () => {
  it("adds github x-access-token to https URL", () => {
    expect(buildAuthedUrl("https://github.com/owner/repo", "tok123", "github")).toBe(
      "https://x-access-token:tok123@github.com/owner/repo"
    );
  });

  it("adds azure PAT to https URL", () => {
    expect(buildAuthedUrl("https://dev.azure.com/org/project/_git/repo", "pat123", "azure")).toBe(
      "https://pat:pat123@dev.azure.com/org/project/_git/repo"
    );
  });

  it("strips trailing slashes before adding auth", () => {
    expect(buildAuthedUrl("https://github.com/owner/repo///", "tok", "github")).toBe(
      "https://x-access-token:tok@github.com/owner/repo"
    );
  });

  it("replaces existing x-access-token auth", () => {
    expect(
      buildAuthedUrl("https://x-access-token:old@github.com/owner/repo", "new-tok", "github")
    ).toBe("https://x-access-token:new-tok@github.com/owner/repo");
  });

  it("replaces existing PAT auth for azure", () => {
    expect(buildAuthedUrl("https://pat:old@dev.azure.com/repo", "new-pat", "azure")).toBe(
      "https://pat:new-pat@dev.azure.com/repo"
    );
  });

  it("returns non-https URLs unchanged", () => {
    expect(buildAuthedUrl("git@github.com:owner/repo.git", "tok", "github")).toBe(
      "git@github.com:owner/repo.git"
    );
  });

  it("handles whitespace in URL", () => {
    expect(buildAuthedUrl("  https://github.com/owner/repo  ", "tok", "github")).toBe(
      "https://x-access-token:tok@github.com/owner/repo"
    );
  });
});
