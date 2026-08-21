/**
 * Single place where GSAP plugins get registered.
 *
 * Division of labour on this site: CSS owns hover states and the section
 * reveals (zero bytes, honours prefers-reduced-motion for free). GSAP owns
 * only what CSS cannot do — the scroll-scrubbed timeline rail and the
 * per-character hero name.
 */
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

// Must run before any hook or tween uses these.
gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

/** Shared durations/eases so GSAP motion matches the CSS tokens. */
export const motion = {
  fast: 0.15,
  base: 0.25,
  slow: 0.4,
  settle: 0.55,
  ease: "power2.inOut",
  easeOut: "power3.out",
  easeBack: "back.out(1.4)",
};

/** True when the visitor has asked the OS to reduce motion. */
export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export { gsap, useGSAP, ScrollTrigger, SplitText };
