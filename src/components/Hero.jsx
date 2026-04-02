import { useState, useEffect } from "react";
import "../components_css/Hero.css";
import LinkedIn from "../assets/aboutimage/linkedin.jpeg";
import Resume from "../assets/Xiaobin-Mei-Resume.pdf";

const names = ["Xiaobin Mei", "Jaden Mei", "梅晓彬"];
const TYPE_SPEED = 100;
const DELETE_SPEED = 60;
const PAUSE_AFTER_TYPE = 2000;
const PAUSE_AFTER_DELETE = 800;

function Hero() {
  const [nameIndex, setNameIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = names[nameIndex];
    let delay = isDeleting ? DELETE_SPEED : TYPE_SPEED;

    if (!isDeleting && displayed === current) {
      delay = PAUSE_AFTER_TYPE;
    }
    if (isDeleting && displayed === "") {
      delay = PAUSE_AFTER_DELETE;
    }

    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (displayed === current) {
          setIsDeleting(true);
        } else {
          setDisplayed(current.slice(0, displayed.length + 1));
        }
      } else {
        if (displayed === "") {
          setIsDeleting(false);
          setNameIndex((prev) => (prev + 1) % names.length);
        } else {
          setDisplayed(displayed.slice(0, -1));
        }
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [displayed, isDeleting, nameIndex]);

  return (
    <section id="home" className="hero">
      <div className="container hero-container">
        <div className="hero-content">
          <h1 className="hero-title">
            Hi, I'm{" "}
            <span className="highlight hero-name">
              {displayed}
              <span className="hero-cursor" />
            </span>
          </h1>
          <h2 className="hero-subtitle">CS & Math Student @ Northeastern</h2>
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
            <a href={Resume} target="_blank"  rel="noopener noreferrer" className="btn btn-primary">
              Download Resume
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
