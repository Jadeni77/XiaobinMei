/**
 * Single place where GSAP plugins get registered.
 *
 * Division of labour on this site: CSS owns hover states and the section
 * reveals (zero bytes, honours prefers-reduced-motion for free). GSAP owns
 * only the three things CSS cannot do — the project-filter FLIP, the
 * scroll-scrubbed timeline rail, and the per-character hero name.
 */
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

// Must run before any hook or tween uses these.
gsap.registerPlugin(useGSAP, Flip, ScrollTrigger, SplitText);

/** Shared durations/eases so GSAP motion matches the CSS tokens. */
export const motion = {
  fast: 0.15,
  base: 0.25,
  slow: 0.4,
  flip: 0.55,
  ease: "power2.inOut",
  easeOut: "power3.out",
  easeBack: "back.out(1.4)",
};

/** True when the visitor has asked the OS to reduce motion. */
export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export { gsap, useGSAP, Flip, ScrollTrigger, SplitText };
