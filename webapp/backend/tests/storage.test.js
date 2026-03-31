import { describe, it, expect } from "vitest";
import { createStorage } from "../src/services/storage.js";

describe("storage (memory mode)", () => {
  it("saves and retrieves a report", async () => {
    const storage = createStorage(":memory:");
    const report = { achievedLevel: 3, generatedAt: "2025-01-01T00:00:00Z" };
    const id = await storage.saveReport(report);
    expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    const retrieved = await storage.getReport(id);
    expect(retrieved).toEqual(report);
  });

  it("returns null for unknown ID", async () => {
    const storage = createStorage(":memory:");
    const result = await storage.getReport("00000000-0000-0000-0000-000000000000");
    expect(result).toBeNull();
  });

  it("returns null for invalid UUID format", async () => {
    const storage = createStorage(":memory:");
    const result = await storage.getReport("not-a-uuid");
    expect(result).toBeNull();
  });

  it("cleanupExpired removes nothing when none expired", async () => {
    const storage = createStorage(":memory:");
    await storage.saveReport({ test: true });
    const cleaned = await storage.cleanupExpired();
    expect(cleaned).toBe(0);
  });
});
