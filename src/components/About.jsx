import React from "react";

function About() {
  return (
    <section id="about" className="about">
      <div className="container">
        <div className="section-header">
          <h2>About Me</h2>
          <div className="divider"></div>
        </div>

        <div className="about-content">
          <div className="about-image">
            <div className="about-image-placeholder">...</div>
            <div className="image-badge">Passionate Coder</div>
          </div>
        </div>

        <div className="about-text">
          <h3>My Journey</h3>
          <p>Hello, I am blah</p>
          <p>blah</p>

          <div className="info-cards">
            <div className="info-card education">
              <h4>Education</h4>
              <p>B.S. Computer Science and Mathematics</p>
              <p>Northeastern University</p>

              <div className="info-card experience">
                <h4>Experience</h4>
                <p>IDK</p>
                <p>IDK</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
