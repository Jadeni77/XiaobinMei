/**
 * Page shell: the skip link, navbar, the six sections in reading order, footer.
 *
 * Section order here is the order visitors scroll through, and it must match
 * `navSections` in data/site.js, which drives both the navbar scroll-spy and
 * the footer links.
 */
import { useEffect } from "react";
import NavBar from "./components/NavBar";
import Hero from "./components/Hero";
import Journey from "./components/Journey/Journey";
import Experience from "./components/Experience";
import Education from "./components/Education";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  /*
   * On a cold load of a shared link like /#projects, the browser tries to
   * scroll while #root is still empty, finds nothing, and gives up. Retry
   * once after mount so deep links actually land on their section.
   */
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id) return;

    const target = document.getElementById(id);
    target?.scrollIntoView({ behavior: "instant", block: "start" });
  }, []);

  return (
    <div className="app-shell">
      {/* Lets keyboard users jump past the nav */}
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <NavBar />

      <main id="main">
        <Hero />
        <Journey />
        <Experience />
        <Education />
        <Skills />
        <Projects />
      </main>

      <Footer />
    </div>
  );
}

export default App;
