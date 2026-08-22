/**
 * Above-the-fold introduction: status pill, cycling name, role, blurb, CTAs,
 * portrait.
 *
 * The name cycles through the three spellings in `heroNames` with a
 * per-character SplitText animation. The span is keyed on the current name on
 * purpose: SplitText.revert() restores the innerHTML it captured at split time,
 * so reusing one node let it overwrite the name React had just committed and
 * the heading silently froze on the first spelling.
 */
import { useEffect, useRef, useState } from "react";
import "../components_css/Hero.css";
import LinkedIn from "../assets/aboutimage/linkedin.jpeg";
import Resume from "../assets/Xiaobin-Mei-Resume.pdf";
import { heroNames, site } from "../data/site";
import { usePrefersReducedMotion } from "../hooks/useReveal";
import { gsap, motion, SplitText, useGSAP } from "../lib/gsap";
import { ArrowRightIcon, FileTextIcon, MailIcon, MapPinIcon } from "./Icons";

const HOLD_MS = 3200;

function Hero() {
  const reducedMotion = usePrefersReducedMotion();
  const heroRef = useRef(null);
  const nameRef = useRef(null);
  const [nameIndex, setNameIndex] = useState(0);

  const currentName = reducedMotion ? site.name : heroNames[nameIndex];

  // Cycle through the three spellings of the name.
  useEffect(() => {
    if (reducedMotion) return;

    const timer = setTimeout(
      () => setNameIndex((prev) => (prev + 1) % heroNames.length),
      HOLD_MS
    );
    return () => clearTimeout(timer);
  }, [nameIndex, reducedMotion]);

  /*
   * Entrance choreography for everything except the name. Runs once, so the
   * name cycling below can re-animate on its own without replaying the whole
   * hero every few seconds.
   */
  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          defaults: { ease: "power3.out", duration: 0.8 },
        });

        tl.from(".hero-status", { y: 24, opacity: 0, duration: 0.6 })
          .from(".hero-greeting", { y: 20, opacity: 0, duration: 0.6 }, "-=0.35")
          .from(".hero-role", { y: 22, opacity: 0 }, "-=0.3")
          .from(".hero-description", { y: 22, opacity: 0 }, "-=0.6")
          .from(".hero-meta", { y: 16, opacity: 0, duration: 0.6 }, "-=0.6")
          .from(
            ".hero-buttons .btn",
            { y: 24, opacity: 0, duration: 0.6, stagger: 0.09 },
            "-=0.45"
          )
          // Portrait rises alongside the copy rather than after it
          .from(
            ".hero-portrait-frame",
            { y: 40, scale: 0.94, opacity: 0, duration: 1.1 },
            0.1
          )
          .from(
            ".hero-portrait-shape",
            { scale: 0.82, opacity: 0, duration: 1 },
            0.3
          )
          .from(".hero-glow", { opacity: 0, scale: 0.7, duration: 1.4 }, 0);

        return () => tl.kill();
      });

      return () => media.revert();
    },
    { scope: heroRef }
  );

  // Subtle parallax: the portrait drifts as the hero scrolls away.
  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const tween = gsap.to(".hero-portrait", {
          y: 70,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.5,
          },
        });

        return () => tween.kill();
      });

      return () => media.revert();
    },
    { scope: heroRef }
  );

  // Per-character entrance, re-run each time the name changes.
  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const split = SplitText.create(nameRef.current, {
          type: "chars",
          // Keeps whole words from breaking mid-name when chars are wrapped
          smartWrap: true,
          // The full name is announced via the sibling visually-hidden span
          aria: "hidden",
        });

        const tl = gsap.timeline();

        tl.from(split.chars, {
          opacity: 0,
          yPercent: 60,
          rotateX: -70,
          color: "var(--accent)",
          duration: motion.slow,
          ease: motion.easeOut,
          stagger: 0.045,
        });

        // revert() puts the original text node back so the next split is clean
        return () => {
          tl.kill();
          split.revert();
        };
      });

      return () => media.revert();
    },
    { dependencies: [nameIndex, reducedMotion], revertOnUpdate: true, scope: heroRef }
  );

  return (
    <section id="home" className="hero" ref={heroRef}>
      <div className="hero-glow" aria-hidden="true" />

      <div className="container hero-grid">
        <div className="hero-content">
          <p className="hero-status">
            <span className="hero-status-dot" aria-hidden="true" />
            Open to Spring/Summer 2027 Co-op/internships
          </p>

          <h1 className="hero-title">
            <span className="hero-greeting">Hi, I&apos;m</span>
            {/*
              The visible name cycles and is split into characters, so it is
              hidden from assistive tech and a stable name announced instead.
            */}
            <span
              className="hero-name"
              key={currentName}
              ref={nameRef}
              aria-hidden="true"
            >
              {currentName}
            </span>
            <span className="visually-hidden">{site.name}</span>
          </h1>

          <p className="hero-role">{site.role}</p>

          <p className="hero-description">
            I build responsive, accessible websites and interfaces — solutions
            that address real user needs, improve existing systems, and solve
            real-world problems. I care about clean code and intuitive user
            experiences.
          </p>

          <div className="hero-meta">
            <span className="hero-meta-item">
              <MapPinIcon width="16" height="16" />
              {site.location}
            </span>
          </div>

          <div className="hero-buttons">
            <a href="#projects" className="btn btn-primary">
              View my work
              <ArrowRightIcon className="btn-icon" />
            </a>
            <a
              href={Resume}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
            >
              <FileTextIcon className="btn-icon" />
              Résumé
            </a>
            <a href="#footer" className="btn btn-secondary">
              <MailIcon className="btn-icon" />
              Contact
            </a>
          </div>
        </div>

        <div className="hero-portrait">
          <div className="hero-portrait-frame">
            <img
              src={LinkedIn}
              alt={`Portrait of ${site.name}`}
              className="hero-portrait-img"
              width="420"
              height="480"
            />
          </div>
          <div className="hero-portrait-shape" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}

export default Hero;
