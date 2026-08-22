/**
 * Fixed header: brand, section links with scroll-spy, social icons, and a
 * mobile drawer.
 *
 * Links come from `navSections`, so adding a section there updates the navbar,
 * the scroll-spy target list, and the footer together.
 */
import { useEffect, useState } from "react";
import "../components_css/NavBar.css";
import { navSections, site } from "../data/site";
import { useActiveSection } from "../hooks/useActiveSection";
import { GithubIcon, LinkedinIcon, MenuIcon, CloseIcon } from "./Icons";

// Module-level so the array identity is stable across renders.
const SECTION_IDS = ["home", ...navSections.map((section) => section.id)];

function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const activeSection = useActiveSection(SECTION_IDS);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Escape closes the drawer, and the body stops scrolling behind it.
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <header className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <div className="container navbar-inner">
        <a href="#home" className="navbar-brand" onClick={() => setIsOpen(false)}>
          <span className="navbar-brand-mark" aria-hidden="true">
            XM
          </span>
          <span className="navbar-brand-text">{site.displayName}</span>
        </a>

        <nav className="navbar-nav" aria-label="Sections">
          {navSections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={`navbar-link ${
                activeSection === section.id ? "is-active" : ""
              }`}
              aria-current={activeSection === section.id ? "true" : undefined}
            >
              {section.label}
            </a>
          ))}
        </nav>

        <div className="navbar-actions">
          <a
            href={site.github}
            target="_blank"
            rel="noopener noreferrer"
            className="navbar-icon-btn"
            aria-label="GitHub profile (opens in a new tab)"
          >
            <GithubIcon width="18" height="18" />
          </a>
          <a
            href={site.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="navbar-icon-btn"
            aria-label="LinkedIn profile (opens in a new tab)"
          >
            <LinkedinIcon width="18" height="18" />
          </a>
          <a href="#footer" className="btn btn-primary btn-small navbar-cta">
            Get in touch
          </a>
        </div>

        <button
          type="button"
          className="navbar-toggle"
          onClick={() => setIsOpen((open) => !open)}
          aria-expanded={isOpen}
          aria-controls="mobile-nav"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? (
            <CloseIcon width="22" height="22" />
          ) : (
            <MenuIcon width="22" height="22" />
          )}
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        id="mobile-nav"
        className={`navbar-drawer ${isOpen ? "is-open" : ""}`}
        hidden={!isOpen}
      >
        <nav className="navbar-drawer-nav" aria-label="Sections">
          {navSections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={`navbar-drawer-link ${
                activeSection === section.id ? "is-active" : ""
              }`}
              onClick={() => setIsOpen(false)}
            >
              {section.label}
            </a>
          ))}
        </nav>

        <div className="navbar-drawer-footer">
          <a
            href={site.github}
            target="_blank"
            rel="noopener noreferrer"
            className="navbar-drawer-social"
          >
            <GithubIcon width="18" height="18" /> GitHub
          </a>
          <a
            href={site.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="navbar-drawer-social"
          >
            <LinkedinIcon width="18" height="18" /> LinkedIn
          </a>
        </div>
      </div>

      {isOpen && (
        <div
          className="navbar-scrim"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </header>
  );
}

export default NavBar;
