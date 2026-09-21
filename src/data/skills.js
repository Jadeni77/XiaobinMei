/**
 * Technology chips, grouped by category.
 *
 * Brand logos come from local PNGs where colour matters and from the devicon
 * CDN otherwise, so the repo does not carry an icon for every technology.
 */
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

const devicon = (name, variant = "original") =>
  `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${name}/${name}-${variant}.svg`;

export const skillCategories = [
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
      { name: "TypeScript", icon: devicon("typescript")}
    ],
  },
  {
    title: "Development",
    items: [
      { name: "React", icon: devicon("react") },
      { name: "FastAPI", icon: devicon("fastapi") },
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
      { name: "Git", icon: GitIcon },
      { name: "AWS", icon: devicon("amazonwebservices", "original-wordmark") },
      { name: "JUnit", icon: JUnitIcon },
      { name: "Jest", icon: devicon("jest", "plain") },
      { name: "Pytest", icon: devicon("pytest") },
      { name: "Xcode", icon: devicon("xcode") },
      { name: "LaTeX", icon: devicon("latex") },
      { name: "Jenkins", icon: devicon("jenkins")},
      { name: "Dynatrace", icon: devicon("dynatrace")},
      { name: "Docker", icon: devicon("docker")},
      { name: "Kubernetes", icon: devicon("kubernetes")}
    ],
  },
];
