import { useEffect, useRef } from "react";
import "../../components_css/Journey.css";
import SectionHeader from "../SectionHeader";
import { ArrowRightIcon } from "../Icons";
import { gsap, SplitText, useGSAP } from "../../lib/gsap";
import { journey } from "../../data/journey";
import { accentStyle } from "../../data/journeyAccents";
import JourneyCard from "./JourneyCard";
import JourneyTrajectory from "./JourneyTrajectory";
import ProfileStats from "./ProfileStats";
import { useCarousel } from "./useCarousel";

function Journey() {
  const stageRef = useRef(null);
  const {
    index,
    dragOffset,
    isDragging,
    go,
    next,
    prev,
    atStart,
    atEnd,
    handleWheel,
    shouldSuppressClick,
    regionProps,
  } = useCarousel(journey.length);

  const active = journey[index];

  // React's onWheel is passive, so preventDefault there is a no-op. Attach a
  // non-passive listener directly.
  useEffect(() => {
    const node = stageRef.current;
    if (!node) return;
    node.addEventListener("wheel", handleWheel, { passive: false });
    return () => node.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  // Re-animate the active card's contents on every change.
  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const card = stageRef.current?.querySelector(".journey-card.is-active");
        if (!card) return;

        const split = SplitText.create(card.querySelector(".journey-card-title"), {
          type: "words",
          aria: "none",
        });

        /*
         * fromTo, not from, with explicit end states.
         *
         * These elements are stable across re-renders, so a killed tween
         * leaves its start values inline. A subsequent `from` would then read
         * opacity: 0 as its destination and animate 0 -> 0, leaving the
         * content permanently invisible. React StrictMode's double-invoked
         * effects trigger exactly that in development.
         *
         * clearProps hands styling back to CSS afterwards, which also keeps
         * the thumbnails' :hover lift working — an inline transform would
         * otherwise outrank it.
         */
        const tl = gsap.timeline({
          defaults: { ease: "power3.out", clearProps: "opacity,transform" },
        });

        tl.fromTo(
          card.querySelector(".journey-card-year"),
          { yPercent: 115, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.5 }
        )
          .fromTo(
            split.words,
            { yPercent: 110, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 0.6, stagger: 0.045 },
            "-=0.35"
          )
          .fromTo(
            card.querySelector(".journey-card-story"),
            { y: 18, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6 },
            "-=0.4"
          )
          .fromTo(
            card.querySelectorAll(".journey-thumbs button"),
            { scale: 0.6, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.45,
              stagger: 0.06,
              ease: "back.out(1.6)",
            },
            "-=0.45"
          );

        return () => {
          tl.kill();
          split.revert();
        };
      });

      return () => media.revert();
    },
    { dependencies: [index], revertOnUpdate: true, scope: stageRef }
  );

  return (
    <section
      id="journey"
      className="section journey"
      style={accentStyle(active.accent)}
    >
      <div className="container">
        <SectionHeader
          eyebrow="My Journey"
          title="How I got here"
          subtitle="The personal side of the same years my experience covers professionally."
        />

        {/* Announces the change without re-reading every card. */}
        <p className="visually-hidden" role="status">
          {`Milestone ${index + 1} of ${journey.length}: ${active.title}`}
        </p>

        <div
          className={`journey-stage ${isDragging ? "is-dragging" : ""}`}
          ref={stageRef}
          role="region"
          aria-roledescription="carousel"
          aria-label="My journey"
          {...regionProps}
        >
          <div className="journey-bloom" aria-hidden="true" />
          <div className="journey-grid" aria-hidden="true" />
          <JourneyTrajectory milestones={journey} index={index} />

          {journey.map((milestone, i) => (
            <JourneyCard
              key={milestone.id}
              milestone={milestone}
              distance={i - index - dragOffset}
              isActive={i === index}
              position={i + 1}
              total={journey.length}
              /* Guarded so releasing a drag over a side card does not also
                 count as selecting it. */
              onSelect={() => {
                if (!shouldSuppressClick()) go(i);
              }}
            />
          ))}
        </div>

        <div className="journey-controls">
          <button
            type="button"
            className="journey-nav"
            onClick={prev}
            disabled={atStart}
            aria-label="Previous milestone"
          >
            <ArrowRightIcon
              width="20"
              height="20"
              style={{ transform: "rotate(180deg)" }}
            />
          </button>

          <div className="journey-pips">
            {journey.map((milestone, i) => (
              <button
                type="button"
                key={milestone.id}
                className={i === index ? "is-on" : ""}
                onClick={() => go(i)}
                aria-label={`Go to ${milestone.year}: ${milestone.title}`}
                aria-current={i === index ? "true" : undefined}
              />
            ))}
          </div>

          <button
            type="button"
            className="journey-nav"
            onClick={next}
            disabled={atEnd}
            aria-label="Next milestone"
          >
            <ArrowRightIcon width="20" height="20" />
          </button>
        </div>

        <ProfileStats />
      </div>
    </section>
  );
}

export default Journey;
