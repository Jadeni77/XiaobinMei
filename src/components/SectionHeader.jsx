/**
 * Shared eyebrow + title + subtitle block used by every section.
 *
 * The title animates in as masked lines via SplitText. `autoSplit` re-splits
 * when the webfont finishes loading, so line boxes are never measured against
 * the fallback face.
 */
import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "../lib/gsap";

/**
 * Section heading with a masked line reveal — the title slides up from behind
 * a clipping mask while the eyebrow and subtitle fade in around it.
 *
 * Shared by every section so the entrance reads the same all down the page.
 */
function SectionHeader({ eyebrow, title, subtitle }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const trigger = { trigger: ref.current, start: "top 82%", once: true };

        // autoSplit re-splits when the webfont finishes loading, so the line
        // boxes are never measured against the fallback font.
        const split = SplitText.create(ref.current.querySelector("h2"), {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 115,
              duration: 0.85,
              ease: "power4.out",
              stagger: 0.1,
              scrollTrigger: trigger,
            }),
        });

        const fades = gsap.from(
          ref.current.querySelectorAll(".section-eyebrow, .section-subtitle"),
          {
            y: 18,
            opacity: 0,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.12,
            scrollTrigger: trigger,
          }
        );

        return () => {
          fades.kill();
          split.revert();
        };
      });

      return () => media.revert();
    },
    { scope: ref }
  );

  return (
    <div className="section-header" ref={ref}>
      {eyebrow && <span className="section-eyebrow">{eyebrow}</span>}
      <h2>{title}</h2>
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
    </div>
  );
}

export default SectionHeader;
