import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ProfileStats from "./ProfileStats";
import { experience } from "../../data/experience";
import { courseCount } from "../../data/education";

/**
 * The "Roles, co-ops & programs" tile links to #experience, so the number it
 * shows has to match what a visitor counts when they land there.
 *
 * It previously rendered `experience.length + workTermCount` — 8 — against an
 * Experience section listing 6 roles, because the Chewy internship and the
 * AI-CARING co-op are recorded in both experience.js and education.js.
 */
describe("ProfileStats", () => {
  it("shows one entry per role, matching the Experience section", () => {
    render(<ProfileStats />);
    const tile = screen.getByText("Roles, co-ops & programs").closest("a");
    expect(tile).toHaveTextContent(String(experience.length));
  });

  it("does not inflate the roles count past the Experience section", () => {
    render(<ProfileStats />);
    const tile = screen.getByText("Roles, co-ops & programs").closest("a");
    const shown = Number(tile.textContent.match(/\d+/)[0]);
    expect(shown).toBeLessThanOrEqual(experience.length);
  });

  it("shows the course count from the education data", () => {
    render(<ProfileStats />);
    const tile = screen.getByText("CS & Math courses").closest("a");
    expect(tile).toHaveTextContent(String(courseCount));
  });

  it("links the roles tile at the section it counts", () => {
    render(<ProfileStats />);
    const tile = screen.getByText("Roles, co-ops & programs").closest("a");
    expect(tile.getAttribute("href")).toBe("#experience");
  });
});
