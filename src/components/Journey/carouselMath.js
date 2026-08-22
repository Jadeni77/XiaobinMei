/** Pixels of drag needed to commit to the next milestone. */
export const DRAG_THRESHOLD = 70;

/** Pixels of drag that equal one full slide of travel while dragging. */
export const DRAG_DIVISOR = 320;

/** Cards further than this from centre are not rendered. */
const VISIBLE_SPAN = 2.6;

export function clampIndex(n, count) {
  return Math.max(0, Math.min(count - 1, n));
}

/** Resolves where a drag lands. Below the threshold it springs back. */
export function commitDrag(dx, index, count, threshold = DRAG_THRESHOLD) {
  if (Math.abs(dx) < threshold) return index;
  return clampIndex(index + (dx < 0 ? 1 : -1), count);
}

/**
 * Only claim the wheel for clearly horizontal input. Ties go to the page so
 * vertical scrolling is never trapped by the carousel.
 */
export function isHorizontalWheel(deltaX, deltaY) {
  return Math.abs(deltaX) > Math.abs(deltaY);
}

/**
 * Signed distance of a card from the centre, including the live drag preview.
 *
 * dragOffset is ADDED, not subtracted: it is dx / DRAG_DIVISOR, so a leftward
 * drag is negative and must push cards left to travel with the finger. This
 * lived inline in Journey.jsx with the wrong sign, which no unit test could
 * reach.
 */
export function cardDistance(cardIndex, activeIndex, dragOffset = 0) {
  return cardIndex - activeIndex + dragOffset;
}

/**
 * Coverflow placement. `distance` is the signed offset from the active index
 * and may be fractional while dragging.
 */
export function cardTransform(distance) {
  const abs = Math.abs(distance);
  const x = distance * 290;
  const y = abs * 12;
  const z = -abs * 250;
  const rotateY = distance * -25;
  const scale = Math.max(0.74, 1 - abs * 0.12);

  return {
    transform:
      `translate3d(${x}px, ${y}px, ${z}px) ` +
      `rotateY(${rotateY}deg) scale(${scale})`,
    opacity: abs > VISIBLE_SPAN ? 0 : Math.max(0.22, 1 - abs * 0.3),
    zIndex: 100 - Math.round(abs * 10),
  };
}
