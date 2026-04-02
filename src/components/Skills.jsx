import { useEffect, useRef, useState } from "react";
import "../components_css/Skills.css";
import GitIcon from "../assets/icons/git.png";
import RacketIcon from "../assets/icons/racket.png";
import JavaIcon from "../assets/icons/java.png";
import PythonIcon from "../assets/icons/python.png";
import JavaScriptIcon from "../assets/icons/javascript.png";
import HTMLIcon from "../assets/icons/html.png";
import CSSIcon from "../assets/icons/css.png";
import SwiftIcon from "../assets/icons/swift.png";
import JUnitIcon from "../assets/icons/junit.png";
import WebSocketIcon from "../assets/icons/websocket.png";

function Skills() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const devicon = (name) =>
    `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${name}/${name}-original.svg`;

  const categories = [
    {
      title: "Languages",
      items: [
        { name: "Java", icon: JavaIcon },
        { name: "JavaScript", icon: JavaScriptIcon },
        { name: "Python", icon: PythonIcon },
        { name: "Swift", icon: SwiftIcon },
        { name: "Racket", icon: RacketIcon },
        { name: "HTML", icon: HTMLIcon },
        { name: "CSS", icon: CSSIcon },
      ],
    },
    {
      title: "Development",
      items: [
        { name: "React", icon: devicon("react") },
        { name: "Spring Boot", icon: devicon("spring") },
        { name: "Node.js", icon: devicon("nodejs") },
        { name: "PostgreSQL", icon: devicon("postgresql") },
        { name: "SQLite", icon: devicon("sqlite") },
        { name: "WebSocket", icon: WebSocketIcon },
        { name: "SwiftUI", icon: SwiftIcon },
        { name: "Swing", icon: JavaIcon },
      ],
    },
    {
      title: "Testing & Tools",
      items: [
        { name: "AWS EC2", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" },
        { name: "JUnit", icon: JUnitIcon },
        { name: "Jest", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jest/jest-plain.svg" },
        { name: "Pytest", icon: devicon("pytest") },
        { name: "Git", icon: GitIcon },
        { name: "Xcode", icon: devicon("xcode") },
        { name: "LaTeX", icon: devicon("latex") },
      ],
    },
  ];

  let globalIndex = 0;

  return (
    <section id="skills" className="skills" ref={sectionRef}>
      <div className="container">
        <div className="section-header">
          <h2>My Skills</h2>
          <div className="divider"></div>
          <p className="section-subtitle">
            Here are the technologies and skills I've developed through
            coursework, personal projects, and professional experience.
          </p>
        </div>

        {categories.map((category) => (
          <div className="skills-category" key={category.title}>
            <h3 className="skills-category-title">{category.title}</h3>
            <div className="skills-grid">
              {category.items.map((item) => {
                const delay = globalIndex * 0.08;
                globalIndex++;
                return (
                  <div
                    className={`skill-card ${visible ? "skill-card--visible" : ""}`}
                    style={{ transitionDelay: `${delay}s` }}
                    key={item.name}
                  >
                    {item.icon ? (
                      <img
                        src={item.icon}
                        alt={item.name}
                        className="skill-card-icon"
                      />
                    ) : (
                      <div className="skill-card-letter">
                        {item.name.charAt(0)}
                      </div>
                    )}
                    <span className="skill-card-name">{item.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Skills;
