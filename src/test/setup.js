import "@testing-library/react";

// jsdom has no matchMedia; GSAP's matchMedia guards and usePrefersReducedMotion
// both call it. Default to "no preference" so animations are considered enabled.
if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}
