import React from "react";
import LinkedIn from "../assets/aboutimage/linkedin.jpeg";

function Hero() {
  return (
    <section id="home" className="hero">
      <div className="container hero-container">
        <div className="hero-content">
          <h1 className="hero-title">
            Hi, I'm <span className="highlight">Xiaobin Mei</span>
          </h1>
          <h2 className="hero-subtitle">CS Student @ Northeastern</h2>
          <p className="hero-description">
            As a computer science student, I'm learning how to build responsive and 
            accessible websites and user interfaces to create solutions that address
            user needs, improve existing systems, and solve real-world problems. I'm
            passinate about clean code and intuitive user experiences.
          </p>

          <div className="hero-buttons">
            <a href="#projects" className="btn btn-primary">
              View My Work
            </a>
            <a href="#footer" className="btn btn-secondary">
              Contact Me
            </a>
          </div>
        </div>

        <div className="hero-image-container">
          <div className="hero-image">
            <div className="hero-image-linkedin">
                <img src={LinkedIn}
                alt="Xiaobin Mei"
                className="profile-image"
                />
            </div>
            <div className="badge">Open to Work!</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
