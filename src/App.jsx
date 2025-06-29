import React from "react";
import NavBar from "./components/NavBar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  return (
    <div className="myWeb">
      {/* Navigation bar at the top*/}
      <NavBar />

      {/* Main Content */}
      <main>
        {/* Hero section - first thing visitors see */}
        <Hero />

        {/* About section - personal introduction */}
        <About />

        {/* Skills section - showcase technical abilities */}
        <Skills />

        {/* Projects section - highlight work */}
        <Projects />

        {/* Contact section - form for visitors to reach out */}
        <Contact />
      </main>

      {/* Footer - copyright and social links */}
      <Footer />
    </div>
  );
}

export default App;
