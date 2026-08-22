import { describe, expect, it } from "vitest";

describe("test harness", () => {
  it("runs in a DOM environment", () => {
    expect(typeof window).toBe("object");
    expect(typeof window.matchMedia).toBe("function");
  });
});
