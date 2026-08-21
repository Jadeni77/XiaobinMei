import { useRef } from "react";
import "../components_css/Experience.css";
import { experience } from "../data/experience";
import { gsap, motion, ScrollTrigger, useGSAP } from "../lib/gsap";
import SectionHeader from "./SectionHeader";

function Experience() {
  const sectionRef = useRef(null);
  const railRef = useRef(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        // The rail draws itself in step with scroll position.
        gsap.fromTo(
          railRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: ".timeline",
              start: "top 75%",
              end: "bottom 60%",
              scrub: 0.4,
            },
          }
        );

        // Each dot lights up as the rail reaches it. CSS owns the look;
        // ScrollTrigger only toggles the class.
        gsap.utils.toArray(".timeline-item").forEach((item) => {
          ScrollTrigger.create({
            trigger: item,
            start: "top 70%",
            // Stays lit once passed, so the dots read as progress alongside
            // the rail. toggleClass would un-light them again on the way down.
            onEnter: () => item.classList.add("is-reached"),
            onLeaveBack: () => item.classList.remove("is-reached"),
          });
        });

        // Cards fade up as they arrive.
        gsap.from(".timeline-card", {
          opacity: 0,
          y: 28,
          duration: motion.slow,
          ease: motion.easeOut,
          stagger: 0.1,
          clearProps: "opacity,transform",
          scrollTrigger: {
            trigger: ".timeline",
            start: "top 80%",
            once: true,
          },
        });
      });

      return () => media.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="experience"
      className="section section--alt experience"
      ref={sectionRef}
    >
      <div className="container">
        <SectionHeader
          eyebrow="Experience"
          title="Where I've worked and learned"
          subtitle="Internships, workshops, and programs across software, education, and community work."
        />

        <ol className="timeline">
          {/* Real element rather than a pseudo-element, so GSAP can scale it */}
          <span className="timeline-rail" ref={railRef} aria-hidden="true" />

          {experience.map((role, index) => (
            <li className="timeline-item" key={role.id}>
              <div className="timeline-marker" aria-hidden="true">
                <span className="timeline-dot" />
              </div>

              <article className="card card--interactive timeline-card">
                <div className="timeline-card-head">
                  <div className="timeline-card-meta">
                    <p className="timeline-period">
                      {role.start} <span aria-hidden="true">&ndash;</span>{" "}
                      {role.end}
                    </p>

                    <h3 className="timeline-role">{role.role}</h3>
                    <p className="timeline-org">{role.org}</p>
                    <p className="timeline-location">{role.location}</p>
                  </div>

                  {/* Optional — roles without a photo render nothing here */}
                  {role.photo && (
                    <figure className="timeline-photo">
                      <img
                        src={role.photo}
                        alt={role.photoAlt ?? `${role.role} at ${role.org}`}
                        loading="lazy"
                      />
                    </figure>
                  )}
                </div>

                {/* Collapsed by default past the first role, so the whole
                    timeline stays scannable. The first opens to show the
                    section has substance. */}
                <details className="timeline-details" open={index === 0}>
                  <summary>
                    <span className="timeline-details-open">
                      {role.highlights.length} highlight
                      {role.highlights.length === 1 ? "" : "s"}
                    </span>
                  </summary>

                  <ul className="timeline-highlights">
                    {role.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                </details>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default Experience;
