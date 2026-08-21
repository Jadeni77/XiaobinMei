import { useCallback, useRef, useState } from "react";
import {
  DRAG_DIVISOR,
  clampIndex,
  commitDrag,
  isHorizontalWheel,
} from "./carouselMath";

const WHEEL_COOLDOWN_MS = 320;

/** Pointer travel beyond this means the gesture was a drag, not a tap. */
const CLICK_SUPPRESS_PX = 6;

/**
 * Headless carousel input. Owns the active index and every way of changing it
 * — buttons, keyboard, pointer drag, horizontal wheel — and knows nothing
 * about photos, curves, or GSAP.
 */
export function useCarousel(count) {
  const [index, setIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const dragStartX = useRef(0);
  const dragDx = useRef(0);
  const wheelLocked = useRef(false);
  const suppressClick = useRef(false);

  const go = useCallback((n) => setIndex(clampIndex(n, count)), [count]);
  const next = useCallback(() => setIndex((i) => clampIndex(i + 1, count)), [count]);
  const prev = useCallback(() => setIndex((i) => clampIndex(i - 1, count)), [count]);

  const onKeyDown = useCallback(
    (event) => {
      const keys = {
        ArrowRight: () => next(),
        ArrowLeft: () => prev(),
        Home: () => go(0),
        End: () => go(count - 1),
      };
      const handler = keys[event.key];
      if (!handler) return;
      event.preventDefault();
      handler();
    },
    [count, go, next, prev]
  );

  // Non-passive listener is attached in the component via a ref effect, since
  // React's onWheel is passive and cannot call preventDefault.
  const handleWheel = useCallback(
    (event) => {
      if (!isHorizontalWheel(event.deltaX, event.deltaY)) return;
      event.preventDefault();
      if (wheelLocked.current) return;
      wheelLocked.current = true;
      setTimeout(() => {
        wheelLocked.current = false;
      }, WHEEL_COOLDOWN_MS);
      if (event.deltaX > 0) next();
      else prev();
    },
    [next, prev]
  );

  const onPointerDown = useCallback((event) => {
    // Never start a drag from a control.
    if (event.target.closest?.("button, a")) return;
    dragStartX.current = event.clientX;
    dragDx.current = 0;
    suppressClick.current = false;
    setIsDragging(true);
    event.currentTarget.setPointerCapture?.(event.pointerId);
  }, []);

  const onPointerMove = useCallback(
    (event) => {
      if (!isDragging) return;
      dragDx.current = event.clientX - dragStartX.current;
      setDragOffset(dragDx.current / DRAG_DIVISOR);
    },
    [isDragging]
  );

  const endDrag = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    setDragOffset(0);
    // A real drag must not also fire the click that lands on a side card.
    suppressClick.current = Math.abs(dragDx.current) > CLICK_SUPPRESS_PX;
    setIndex((i) => commitDrag(dragDx.current, i, count));
    dragDx.current = 0;
  }, [count, isDragging]);

  /** True when the last pointer gesture was a drag rather than a tap. */
  const shouldSuppressClick = useCallback(() => suppressClick.current, []);

  return {
    index,
    dragOffset,
    isDragging,
    go,
    next,
    prev,
    atStart: index === 0,
    atEnd: index === count - 1,
    handleWheel,
    shouldSuppressClick,
    // Spread onto the stage element.
    regionProps: {
      tabIndex: 0,
      onKeyDown,
      onPointerDown,
      onPointerMove,
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
    },
  };
}
