import CalendarImage from "../assets/projectimage/calendar.png";
import MyWeb from "../assets/projectimage/myweb.png";
import NEUBookstore from "../assets/projectimage/bookstore.png";
import LightEmAll from "../assets/projectimage/LightEmAll.png";
import Connections from "../assets/projectimage/Connections.png";

export const projectCategories = [
  "All",
  "Web",
  "Game Development",
  "Coursework Projects",
];

// To add a project, append an object here — no component changes needed.
export const projects = [
  {
    id: 1,
    title: "Calendar Application",
    blurb:
      "A GUI calendar for viewing, creating, and editing events, built in Java with Swing.",
    description:
      "Built in Java for the Object-Oriented Design course. This GUI-based calendar supports viewing, creating, and editing events using the Java Swing library.",
    category: ["Coursework Projects"],
    technologies: ["Java", "Swing", "Git", "GitHub"],
    course: "Object-Oriented Design (CS 3500)",
    github: "https://github.com/Jadeni77/Calendar/tree/main",
    projectImage: CalendarImage,
  },
  {
    id: 2,
    title: "NEU Bookstore Web App",
    blurb:
      "Browse, filter, and manage book listings — React front end on a Python backend.",
    description:
      "A web application that lets users browse, filter, and manage book listings. Built with a focus on front-end design and interactivity using React, with a Python backend and a database tracking the data displayed on the site.",
    category: ["Web"],
    technologies: ["React", "Python", "Git", "GitHub"],
    github: "https://github.com/oasis-2025-charles-alpha/app",
    projectImage: NEUBookstore,
  },
  {
    id: 3,
    title: "Personal Portfolio Website",
    blurb:
      "This site. A responsive React portfolio with smooth navigation and project filtering.",
    description:
      "A responsive website built with React to showcase my projects, skills, and contact information. It features smooth navigation and project filtering.",
    category: ["Web"],
    technologies: ["React", "Vite", "CSS", "Git", "GitHub"],
    github: "https://github.com/Jadeni77/myWeb",
    projectImage: MyWeb,
  },
  {
    id: 4,
    title: "LightEmAll",
    blurb:
      "A wire-rotation puzzle game in Java, built on ImpWorld with mutable state and event handlers.",
    description:
      "A Java implementation built for Fundamentals of Computer Science II, using the provided ImpWorld documentation and the tester library. It uses big-bang syntax to run on the local desktop, relying on mutable state, built-in world classes, and event handlers for mouse and keyboard input. It is written in a largely functional style rather than an object-oriented one.",
    category: ["Game Development", "Coursework Projects"],
    technologies: ["Java"],
    course: "Fundamentals of Computer Science II",
    github: "https://github.com/Jadeni77/LightEmAll",
    projectImage: LightEmAll,
  },
  {
    id: 5,
    title: "Connections",
    blurb:
      "A word-grouping puzzle game in Java, driven by mouse and keyboard event handling.",
    description:
      "A Java implementation of the Connections game, built for Fundamentals of Computer Science II using the provided ImpWorld documentation and the tester library. It uses big-bang syntax to run on the local desktop, relying on mutable state, built-in world classes, and event handlers for mouse and keyboard input.",
    category: ["Game Development", "Coursework Projects"],
    technologies: ["Java"],
    course: "Fundamentals of Computer Science II",
    github: "https://github.com/Jadeni77/Connections",
    projectImage: Connections,
  },
];
