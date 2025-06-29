import React, { useState } from "react";
import ProjectCard from "./ProjectCard";
import CalendarImage from "../assets/projectimage/calendar.png";
import MyWeb from "../assets/projectimage/myweb.png";
import NEUBookstore from "../assets/projectimage/bookstore.png";

function Project() {
  const category = ["All", "Web", "Game Development", "Coursework Projects"];

  const projects = [
    {
      id: 1,
      title: "Calendar Application",
      description:
        "Built in Java for the Object-Oriented Design course. This" +
        "GUI-based calendar supports viewing, creating, and editing events using" +
        "the Java Swing library.",
      category: ["Coursework Projects", "Web"],
      technologies: ["Java", "Git", "Github", "Swing"],
      course: "Object-Oriented Design (CS 3500)",
      github:
        "https://github.com/Jadeni77/OODGroupProject/tree/main/Assignment6",
      projectImage: CalendarImage,
    },

    {
      id: 2,
      title: "NEU Bookstore Web App",
      description:
        "A web application that allows users to browse, filter and manage" +
        "book listings. Built with a focus on frontend design and interactivity using React.js.",
      category: ["Web"],
      technologies: ["React.js", "Python", "Git", "Github"],
      github: "https://github.com/oasis-2025-charles-alpha/app",
      projectImage: NEUBookstore,
    },

    {
      id: 3,
      title: "Personal Portfolio Website",
      description:
        "A responsive website built with React.js to showccase my projects" +
        "skills, and contact information. It features smooth navigation, and project filtering.",
      category: ["Web"],
      technologies: ["React.js", "Git", "Github"],
      github: "https://github.com/Jadeni77/myWeb",
      projectImage: MyWeb,
    },
    //for further projects, just add more items inside this array
  ];

  const [selectedCategory, setSelectedCategory] = useState("All");
  const filterProjects =
    selectedCategory === "All"
      ? projects
      : projects.filter((project) =>
          project.category?.includes(selectedCategory)
        );

  return (
    <section id="projects" className="projects">
      <div className="container">
        <div className="section-header">
          <h2>My Projects</h2>
          <div className="divider"></div>
          <p className="section-subtitle">
            Here are some of my projects. Each project reflect my skills and
            passionate for development.
          </p>
        </div>

        <div className="project-filters">
          {category.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`filter-btn ${
                selectedCategory == category ? "active" : ""
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="projects-grid">
          {filterProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        <div className="cta-section">
          <p>Interested in seeing more? Check out my GitHub profile!</p>
          <a
            href="https://github.com/Jadeni77"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            View Github Profile
          </a>
        </div>
      </div>
    </section>
  );
}

export default Project;
