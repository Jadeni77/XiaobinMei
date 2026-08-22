import { describe, expect, it } from "vitest";
import { ACCENTS, ACCENT_STEPS, accentStyle, contrastRatio } from "./journeyAccents";

const LIGHT_BG = "#fafafa";
const DARK_BG = "#09090b";

describe("contrastRatio", () => {
  it("returns 21 for black on white", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 1);
  });

  it("returns 1 for identical colours", () => {
    expect(contrastRatio("#2563eb", "#2563eb")).toBeCloseTo(1, 5);
  });
});

describe("accentStyle", () => {
  it("supplies both scheme values so CSS resolves which applies", () => {
    expect(accentStyle("teal")).toEqual({
      "--journey-accent-light": "#0f766e",
      "--journey-accent-dark": "#5eead4",
    });
  });

  it("falls back to blue for an unknown step", () => {
    expect(accentStyle("chartreuse")).toEqual({
      "--journey-accent-light": "#2563eb",
      "--journey-accent-dark": "#60a5fa",
    });
  });
});

describe("ACCENTS", () => {
  it("exposes five cool-ramp steps", () => {
    expect(ACCENT_STEPS).toEqual(["indigo", "blue", "sky", "teal", "violet"]);
  });

  it.each(["indigo", "blue", "sky", "teal", "violet"])(
    "%s passes 4.5:1 in both colour schemes",
    (step) => {
      expect(contrastRatio(ACCENTS[step].light, LIGHT_BG)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(ACCENTS[step].dark, DARK_BG)).toBeGreaterThanOrEqual(4.5);
    }
  );
});
