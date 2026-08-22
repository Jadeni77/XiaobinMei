/**
 * Scroll-spy for the navbar.
 *
 * Returns the id of the section currently occupying the top of the viewport.
 * Picks the last section whose top has passed the nav line rather than using
 * IntersectionObserver ratios, which get ambiguous when a short section and a
 * tall one are on screen together.
 */
import { useEffect, useState } from "react";

/**
 * Scroll-spy: returns the id of the section currently occupying the top of the
 * viewport, so the navbar can show where the visitor is.
 *
 * Picks the last section whose top has passed the nav line rather than using
 * IntersectionObserver ratios, which get ambiguous when a short section and a
 * tall one are on screen at once.
 */
export function useActiveSection(ids, offset = 96) {
  const [active, setActive] = useState(ids[0] ?? "");

  useEffect(() => {
    let frame = null;

    const update = () => {
      frame = null;

      // Bottom of the page: the last section wins, even if it is short.
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      if (atBottom) {
        setActive(ids[ids.length - 1]);
        return;
      }

      let current = "";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= offset) {
          current = id;
        }
      }
      setActive(current);
    };

    const onScroll = () => {
      if (frame === null) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, [ids, offset]);

  return active;
}
