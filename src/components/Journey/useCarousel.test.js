import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useCarousel } from "./useCarousel";

describe("useCarousel", () => {
  it("starts at the first milestone", () => {
    const { result } = renderHook(() => useCarousel(5));
    expect(result.current.index).toBe(0);
    expect(result.current.atStart).toBe(true);
    expect(result.current.atEnd).toBe(false);
  });

  it("advances and reverses without wrapping", () => {
    const { result } = renderHook(() => useCarousel(3));
    act(() => result.current.next());
    expect(result.current.index).toBe(1);
    act(() => result.current.next());
    act(() => result.current.next());
    expect(result.current.index).toBe(2);
    expect(result.current.atEnd).toBe(true);
    act(() => result.current.prev());
    expect(result.current.index).toBe(1);
  });

  it("jumps to an arbitrary index, clamped", () => {
    const { result } = renderHook(() => useCarousel(4));
    act(() => result.current.go(99));
    expect(result.current.index).toBe(3);
  });

  it("moves on ArrowRight and ArrowLeft", () => {
    const { result } = renderHook(() => useCarousel(4));
    act(() =>
      result.current.regionProps.onKeyDown({
        key: "ArrowRight",
        preventDefault: () => {},
      })
    );
    expect(result.current.index).toBe(1);
    act(() =>
      result.current.regionProps.onKeyDown({
        key: "ArrowLeft",
        preventDefault: () => {},
      })
    );
    expect(result.current.index).toBe(0);
  });

  it("jumps to the ends on Home and End", () => {
    const { result } = renderHook(() => useCarousel(5));
    act(() =>
      result.current.regionProps.onKeyDown({ key: "End", preventDefault: () => {} })
    );
    expect(result.current.index).toBe(4);
    act(() =>
      result.current.regionProps.onKeyDown({ key: "Home", preventDefault: () => {} })
    );
    expect(result.current.index).toBe(0);
  });

  it("ignores unrelated keys", () => {
    const { result } = renderHook(() => useCarousel(5));
    act(() =>
      result.current.regionProps.onKeyDown({ key: "a", preventDefault: () => {} })
    );
    expect(result.current.index).toBe(0);
  });

  it("suppresses the click that follows a real drag", () => {
    const { result } = renderHook(() => useCarousel(5));
    const target = { closest: () => null };

    act(() =>
      result.current.regionProps.onPointerDown({
        clientX: 0, pointerId: 1, target, currentTarget: {},
      })
    );
    act(() => result.current.regionProps.onPointerMove({ clientX: 40 }));
    act(() => result.current.regionProps.onPointerUp());

    expect(result.current.shouldSuppressClick()).toBe(true);
  });

  it("allows a click after a stationary tap", () => {
    const { result } = renderHook(() => useCarousel(5));
    const target = { closest: () => null };

    act(() =>
      result.current.regionProps.onPointerDown({
        clientX: 0, pointerId: 1, target, currentTarget: {},
      })
    );
    act(() => result.current.regionProps.onPointerMove({ clientX: 3 }));
    act(() => result.current.regionProps.onPointerUp());

    expect(result.current.shouldSuppressClick()).toBe(false);
  });
});
