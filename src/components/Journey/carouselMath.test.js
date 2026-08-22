import { describe, expect, it } from "vitest";
import {
  DRAG_THRESHOLD,
  cardTransform,
  clampIndex,
  commitDrag,
  isHorizontalWheel,
} from "./carouselMath";

describe("clampIndex", () => {
  it("keeps an in-range index", () => expect(clampIndex(2, 5)).toBe(2));
  it("clamps below zero", () => expect(clampIndex(-3, 5)).toBe(0));
  it("clamps above the last index", () => expect(clampIndex(9, 5)).toBe(4));
});

describe("commitDrag", () => {
  it("stays put below the threshold", () => {
    expect(commitDrag(DRAG_THRESHOLD - 1, 2, 5)).toBe(2);
    expect(commitDrag(-(DRAG_THRESHOLD - 1), 2, 5)).toBe(2);
  });

  it("advances when dragged left past the threshold", () => {
    expect(commitDrag(-(DRAG_THRESHOLD + 1), 2, 5)).toBe(3);
  });

  it("goes back when dragged right past the threshold", () => {
    expect(commitDrag(DRAG_THRESHOLD + 1, 2, 5)).toBe(1);
  });

  it("does not wrap past either end", () => {
    expect(commitDrag(-500, 4, 5)).toBe(4);
    expect(commitDrag(500, 0, 5)).toBe(0);
  });
});

describe("isHorizontalWheel", () => {
  it("is true for a sideways swipe", () => expect(isHorizontalWheel(30, 4)).toBe(true));
  it("is false for a vertical scroll", () => expect(isHorizontalWheel(4, 30)).toBe(false));
  it("is false for an equal diagonal, so the page keeps scrolling", () => {
    expect(isHorizontalWheel(10, 10)).toBe(false);
  });
});

describe("cardTransform", () => {
  it("leaves the active card untransformed and fully opaque", () => {
    const { transform, opacity, zIndex } = cardTransform(0);
    expect(transform).toContain("translate3d(0px, 0px, 0px)");
    expect(transform).toContain("rotateY(0deg)");
    expect(transform).toContain("scale(1)");
    expect(opacity).toBe(1);
    expect(zIndex).toBe(100);
  });

  it("mirrors left and right neighbours", () => {
    const left = cardTransform(-1);
    const right = cardTransform(1);
    expect(left.opacity).toBeCloseTo(right.opacity, 5);
    expect(left.zIndex).toBe(right.zIndex);
    expect(left.transform).toContain("rotateY(25deg)");
    expect(right.transform).toContain("rotateY(-25deg)");
  });

  it("hides cards beyond the visible span", () => {
    expect(cardTransform(3).opacity).toBe(0);
  });
});
