import { describe, expect, it } from "vitest";
import { journey } from "./journey";
import { ACCENT_STEPS } from "./journeyAccents";

describe("journey data", () => {
  it("has at least four milestones", () => {
    expect(journey.length).toBeGreaterThanOrEqual(4);
  });

  it("uses unique ids", () => {
    const ids = journey.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("is ordered oldest-first", () => {
    const years = journey.map((m) => Number(m.year));
    expect(years).toEqual([...years].sort((a, b) => a - b));
  });

  it("only uses accents from the verified ramp", () => {
    journey.forEach((m) => expect(ACCENT_STEPS).toContain(m.accent));
  });

  it("gives every photo a non-empty alt", () => {
    journey.forEach((m) => {
      expect(m.photos.length).toBeGreaterThan(0);
      m.photos.forEach((p) => {
        expect(typeof p.alt).toBe("string");
        expect(p.alt.trim().length).toBeGreaterThan(0);
      });
    });
  });

  it("gives every milestone a story", () => {
    journey.forEach((m) => expect(m.story.trim().length).toBeGreaterThan(0));
  });
});
