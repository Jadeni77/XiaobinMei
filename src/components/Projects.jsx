import { useRef, useState } from "react";
import "../components_css/Projects.css";
import ProjectCard from "./ProjectCard";
import { projects, projectCategories } from "../data/projects";
import { site } from "../data/site";
import {
  Flip,
  gsap,
  motion,
  prefersReducedMotion,
  useGSAP,
} from "../lib/gsap";
import { ArrowRightIcon, GithubIcon } from "./Icons";
import SectionHeader from "./SectionHeader";

const matchesCategory = (project, category) =>
  category === "All" || project.category?.includes(category);

function Projects() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const gridRef = useRef(null);
  // Layout snapshot taken before React re-renders, consumed after it commits.
  const flipState = useRef(null);
  // Grid height before the re-layout, so the container can be held open.
  const gridHeightBefore = useRef(0);

  const visibleCount = projects.filter((project) =>
    matchesCategory(project, selectedCategory)
  ).length;

  const handleFilter = (category) => {
    if (category === selectedCategory) return;

    // FLIP needs "first" positions measured before the DOM changes.
    // Spread into a static array — `.children` is a live HTMLCollection that
    // mutates as React re-renders, which corrupts the captured state.
    if (gridRef.current && !prefersReducedMotion()) {
      gridHeightBefore.current = gridRef.current.offsetHeight;
      flipState.current = Flip.getState([
        ...gridRef.current.querySelectorAll(".project-card"),
      ]);
    }
    setSelectedCategory(category);
  };

  // Entrance: GSAP owns transforms on these cards so it never fights the FLIP.
  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".project-card:not(.project-card--hidden)", {
          opacity: 0,
          y: 24,
          scale: 0.97,
          duration: motion.slow,
          ease: motion.easeBack,
          stagger: 0.07,
          // Hand transform back to CSS afterwards, so the :hover lift works.
          clearProps: "opacity,transform",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 85%",
            once: true,
          },
        });
      });

      return () => media.revert();
    },
    { scope: gridRef }
  );

  // Re-layout: animate cards to their new grid slots instead of snapping.
  useGSAP(
    () => {
      const state = flipState.current;
      if (!state) return;
      flipState.current = null;

      const grid = gridRef.current;
      /*
       * `absolute: true` pulls every card out of flow for the duration, so the
       * grid has no in-flow children and its height collapses to zero. That
       * yanked the "Want to see more" CTA and the footer up the page and
       * dropped them back when the flip finished.
       *
       * Read the new layout's natural height NOW, while the cards are still
       * static, then animate the container from the old height to that. The
       * content below glides instead of jumping.
       */
      const heightFrom = gridHeightBefore.current;
      const heightTo = grid.offsetHeight;
      const releaseHeight = () => {
        if (grid) grid.style.height = "";
      };

      Flip.from(state, {
        duration: motion.flip,
        ease: motion.ease,
        scale: true,
        // Take cards out of flow while they move so siblings don't jitter.
        absolute: true,
        onEnter: (elements) =>
          gsap.fromTo(
            elements,
            { opacity: 0, scale: 0.9 },
            { opacity: 1, scale: 1, duration: motion.slow, ease: motion.easeOut }
          ),
        onLeave: (elements) =>
          gsap.to(elements, {
            opacity: 0,
            scale: 0.9,
            duration: motion.base,
            ease: motion.ease,
          }),
        // `absolute` lifts cards out of flow while they move. Belt-and-braces
        // cleanup: if any card kept its absolute positioning the grid would
        // have no in-flow children and collapse to zero height.
        onComplete: () => {
          const cards = grid?.querySelectorAll(".project-card");
          if (cards) {
            gsap.set(cards, {
              clearProps: "position,top,left,width,height,transform,opacity",
            });
          }
          releaseHeight();
        },
      });

      // Hold the container open, then settle it onto the new layout's height.
      if (heightFrom > 0 && heightTo > 0) {
        gsap.fromTo(
          grid,
          { height: heightFrom },
          {
            height: heightTo,
            duration: motion.flip,
            ease: motion.ease,
            onComplete: releaseHeight,
          }
        );
      }
    },
    { dependencies: [selectedCategory], scope: gridRef }
  );

  return (
    <section id="projects" className="section projects">
      <div className="container">
        <SectionHeader
          eyebrow="Projects"
          title="Things I've built"
          subtitle="A selection of coursework and personal projects. Each one reflects what I was learning at the time."
        />

        <div
          className="project-filters"
          role="group"
          aria-label="Filter projects by category"
        >
          {projectCategories.map((category) => {
            const count =
              category === "All"
                ? projects.length
                : projects.filter((project) =>
                    matchesCategory(project, category)
                  ).length;

            return (
              <button
                type="button"
                key={category}
                onClick={() => handleFilter(category)}
                className={`filter-btn ${
                  selectedCategory === category ? "is-active" : ""
                }`}
                aria-pressed={selectedCategory === category}
              >
                {category}
                <span className="filter-btn-count">{count}</span>
              </button>
            );
          })}
        </div>

        {/* Announce the result instead of putting aria-live on the grid, which
            would read every card as it is shown or hidden. */}
        <p className="visually-hidden" role="status">
          {visibleCount} {visibleCount === 1 ? "project" : "projects"} shown
        </p>

        {/*
          Every card stays mounted and filtered-out ones get display: none.
          Unmounting them would remove the nodes FLIP needs to animate out,
          and display: none also drops them from the accessibility tree.
        */}
        <div className="projects-grid" ref={gridRef}>
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              hidden={!matchesCategory(project, selectedCategory)}
            />
          ))}
        </div>

        <div className="projects-cta">
          <div>
            <h3 className="projects-cta-title">Want to see more?</h3>
            <p className="projects-cta-text">
              Everything else lives on my GitHub, including work in progress.
            </p>
          </div>
          <a
            href={site.github}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            <GithubIcon className="btn-icon" />
            View GitHub profile
            <ArrowRightIcon className="btn-icon" />
          </a>
        </div>
      </div>
    </section>
  );
}

export default Projects;
