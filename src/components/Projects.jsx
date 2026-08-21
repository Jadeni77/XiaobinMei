import { useRef, useState } from "react";
import "../components_css/Projects.css";
import ProjectCard from "./ProjectCard";
import { projects, projectCategories } from "../data/projects";
import { site } from "../data/site";
import { gsap, motion, prefersReducedMotion, useGSAP } from "../lib/gsap";
import { ArrowRightIcon, GithubIcon } from "./Icons";
import SectionHeader from "./SectionHeader";

const matchesCategory = (project, category) =>
  category === "All" || project.category?.includes(category);

function Projects() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const gridRef = useRef(null);
  // Grid height before the re-layout, so the container can settle smoothly
  // instead of snapping when the row count changes.
  const gridHeightBefore = useRef(0);
  // Distinguishes a filter change from the initial mount.
  const didFilter = useRef(false);

  const visibleCount = projects.filter((project) =>
    matchesCategory(project, selectedCategory)
  ).length;

  const handleFilter = (category) => {
    if (category === selectedCategory) return;

    if (gridRef.current && !prefersReducedMotion()) {
      gridHeightBefore.current = gridRef.current.offsetHeight;
      didFilter.current = true;
    }
    setSelectedCategory(category);
  };

  // Entrance: GSAP owns transforms on these cards so it never fights the FLIP.
  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        // Fade only. No rise or scale: every movement in this grid reads as
        // sliding, which is what we are deliberately avoiding here.
        gsap.fromTo(
          ".project-card:not(.project-card--hidden)",
          { opacity: 0 },
          {
            opacity: 1,
            duration: motion.slow,
            ease: motion.easeOut,
            stagger: 0.07,
            // Hand opacity back to CSS so nothing stays pinned inline.
            clearProps: "opacity",
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );
      });

      return () => media.revert();
    },
    { scope: gridRef }
  );

  /*
   * Re-layout on filter change: cards fade in at their new slots.
   *
   * This previously used the Flip plugin. FLIP is correct but for a grid that
   * reflows rows it makes cards travel the full width and height of the
   * container — a card moving from row 2 to row 1 swept 367px across and 565px
   * up. That reads as sliding, so it is gone.
   *
   * The container height still animates: the row count changes the instant
   * React commits, and without it everything below would snap up the page.
   */
  useGSAP(
    () => {
      if (!didFilter.current) return;
      didFilter.current = false;

      const grid = gridRef.current;
      if (!grid) return;

      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const heightFrom = gridHeightBefore.current;
        const heightTo = grid.offsetHeight;

        const fade = gsap.fromTo(
          grid.querySelectorAll(".project-card:not(.project-card--hidden)"),
          { opacity: 0 },
          {
            opacity: 1,
            duration: motion.slow,
            ease: motion.easeOut,
            stagger: 0.05,
            clearProps: "opacity",
          }
        );

        const settle =
          heightFrom > 0 && heightTo > 0
            ? gsap.fromTo(
                grid,
                { height: heightFrom },
                {
                  height: heightTo,
                  duration: motion.settle,
                  ease: motion.ease,
                  onComplete: () => {
                    grid.style.height = "";
                  },
                }
              )
            : null;

        return () => {
          fade.kill();
          settle?.kill();
          grid.style.height = "";
        };
      });

      return () => media.revert();
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
