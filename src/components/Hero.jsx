import React from "react";

function Hero() {
  return (
    <section id="home" className="hero">
      <div className="container hero-container">
        <div className="hero-content">
          <h1 className="hero-title">
            Hi, I'm <span className="highlight">Xiaobin Mei</span>
          </h1>
          <h2 className="hero-subtitle">Frontend Developer</h2>
          <p className="hero-description">
            I am studying in Northeastern University
          </p>

          <div className="here-button">
            <a href="#projects" className="btn btn-primary">
              View My Work
            </a>
            <a href="#contact" className="btn btn-secondary">
              Contact Me
            </a>
          </div>
        </div>

        <div className="hero-image-container">
          <div className="hero-image">
            <div className="hero-image-placeholder">....</div>
              <div className="badge">Open to Work!</div>
            </div>
          </div>
        </div>

    </section>
  );
}

export default Hero;
