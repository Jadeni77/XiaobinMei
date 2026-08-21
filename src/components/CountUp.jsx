import { useRef } from "react";
import { gsap, useGSAP } from "../lib/gsap";

/**
 * Counts a number up from zero when it scrolls into view.
 * Non-numeric values (e.g. "CS + Math") render as-is.
 */
function CountUp({ value, className }) {
  const ref = useRef(null);
  const target = typeof value === "number" ? value : Number(value);
  const isNumeric = Number.isFinite(target);

  useGSAP(
    () => {
      if (!isNumeric) return;
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const counter = { n: 0 };

        const tween = gsap.to(counter, {
          n: target,
          duration: 1.1,
          ease: "power2.out",
          // snap keeps it on whole numbers instead of flickering decimals
          snap: { n: 1 },
          onUpdate: () => {
            if (ref.current) ref.current.textContent = Math.round(counter.n);
          },
          scrollTrigger: { trigger: ref.current, start: "top 88%", once: true },
        });

        return () => {
          tween.kill();
          // Restore the real value if the tween is cut short
          if (ref.current) ref.current.textContent = target;
        };
      });

      return () => media.revert();
    },
    { dependencies: [target, isNumeric] }
  );

  return (
    <span className={className} ref={ref}>
      {value}
    </span>
  );
}

export default CountUp;
