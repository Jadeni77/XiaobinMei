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
            I create engaging, responsive websites with modern JavaScript
            frameworks. Passionate about clean code and intuitive user
            experiences.
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
            <div className="hero-image-placeholder">
                <img src="https://media.licdn.com/dms/image/v2/D4D03AQGqhZ6j96dmnQ/profile-displayphoto-shrink_800_800/B4DZVtvWHkHYAc-/0/1741302883892?e=1756944000&v=beta&t=m2tPR5TXL58QibvAEbTmOnD7e4LvpzWluFpDshbb9Ao"
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
