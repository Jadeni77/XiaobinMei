import React from "react";
import Oasis from "../assets/aboutimage/oasis.jpg";
import LinkedIn from "../assets/aboutimage/linkedin.jpeg";

function About() {
  const images = [
    {
      src: LinkedIn,
       label: "Passionate Coder",
    },

    {
      src: Oasis,
      label: "Oasis",
    },
  ];

  return (
    <section id="about" className="about">
      <div className="container">
        <div className="section-header">
          <h2>About Me</h2>
          <div className="divider"></div>
        </div>

        <div className="about-content">
          <div className="about-images">
            {images.map((img, index) => (
              <div key={index} className="about-profile-image-container">
                <div className="badge-wrapper"> {/* Wrapper Use: Image won't move up when empty label */}
                  {img.label ? (
                    <div className="badge-top">{img.label} </div>
                  ) : null}
                </div>
                <div className="profile-image">
                  <img src={img.src} alt={`Xiaobin Mei ${index + 1}`} />
                </div>
              </div> //
            ))}
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
