/**
 * Filterable project grid.
 *
 * Filtering is a two-phase crossfade: the grid fades out with every card still
 * present, the filter swaps while it is invisible so the reflow is hidden, then
 * the new cards fade up staggered. Deliberately no positional animation — FLIP
 * made cards travel the full width and height of the grid, which read as
 * sliding.
 *
 * The container height is animated because the row count changes the instant
 * React commits, and the CTA below would otherwise snap up the page.
 */
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

  /*
   * Two phases, because a one-phase fade is not legible here.
   *
   * React applies display:none the moment state changes, so outgoing cards
   * vanish in a hard cut and only the survivors have anything to animate — and
   * they are already 90% opaque within 200ms while the container is still
   * reflowing. What you see is the layout jumping, not a fade.
   *
   * So: fade the grid out first, swap the filter while it is invisible, then
   * fade the new cards back in. The reflow happens behind an empty grid.
   */
  const handleFilter = (category) => {
    if (category === selectedCategory) return;

    const grid = gridRef.current;
    if (!grid || prefersReducedMotion()) {
      setSelectedCategory(category);
      return;
    }

    gridHeightBefore.current = grid.offsetHeight;
    // A second click mid-transition must not stack tweens on the grid.
    gsap.killTweensOf(grid);

    gsap.to(grid, {
      opacity: 0,
      duration: 0.2,
      ease: "power2.in",
      onComplete: () => {
        didFilter.current = true;
        setSelectedCategory(category);
      },
    });
  };

  // First scroll into view: cards fade up in sequence.
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

  // Phase 2 of the filter: the grid is invisible, so bring it and its new
  // cards back up while the container settles onto the new row count.
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
        const cards = grid.querySelectorAll(
          ".project-card:not(.project-card--hidden)"
        );

        const tl = gsap.timeline({
          onComplete: () => {
            grid.style.height = "";
          },
        });

        // Container back to full opacity immediately; the cards carry the fade.
        tl.set(grid, { opacity: 1 })
          .fromTo(
            cards,
            { opacity: 0 },
            {
              opacity: 1,
              // Long enough to actually register as a fade.
              duration: 0.55,
              ease: "power2.out",
              stagger: 0.08,
              clearProps: "opacity",
            },
            0
          );

        if (heightFrom > 0 && heightTo > 0 && heightFrom !== heightTo) {
          tl.fromTo(
            grid,
            { height: heightFrom },
            { height: heightTo, duration: motion.settle, ease: motion.ease },
            0
          );
        }

        return () => {
          tl.kill();
          grid.style.height = "";
          gsap.set(grid, { clearProps: "opacity" });
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
