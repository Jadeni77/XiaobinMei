/**
 * Per-milestone accent ramp for the Journey carousel.
 *
 * Cool hues only — warm accents read as off-brand against the site's
 * monochrome-plus-blue palette. Each step carries a light and a dark value
 * because mid-weight blues that pass on #fafafa fail on #09090b.
 *
 * Every pair is verified at >= 4.5:1 by journeyAccents.test.js.
 */
export const ACCENTS = {
  indigo: { light: "#4338ca", dark: "#a5b4fc" },
  blue: { light: "#2563eb", dark: "#60a5fa" },
  sky: { light: "#0369a1", dark: "#7dd3fc" },
  teal: { light: "#0f766e", dark: "#5eead4" },
  violet: { light: "#6d28d9", dark: "#c4b5fd" },
};

export const ACCENT_STEPS = Object.keys(ACCENTS);

/** Relative luminance per WCAG 2.1. */
function luminance(hex) {
  const c = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4]
    .map((i) => parseInt(c.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast ratio between two hex colours, 1–21. */
export function contrastRatio(hexA, hexB) {
  const [hi, lo] = [luminance(hexA), luminance(hexB)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * Inline style supplying both values for a milestone. CSS resolves which one
 * applies via prefers-color-scheme, so no JS reads the colour scheme.
 */
export function accentStyle(step) {
  const accent = ACCENTS[step] ?? ACCENTS.blue;
  return {
    "--journey-accent-light": accent.light,
    "--journey-accent-dark": accent.dark,
  };
}
