import React from "react";

function ProjectCard({ project }) {
  const {
    title,
    description,
    category,
    technologies,
    course,
    github,
    projectImage,
  } = project;

  return (
    <div className="project-card">
      <div className="project-image">
        {projectImage ? (
        <img src={projectImage} alt={`${title} screenshot`}
        className="project-screenshot" />) : (
        <div className="image-placeholder">
            <span>{category.charAt(0)}</span>
        </div>)}
      </div>

      <div className="project-content">
        <div className="project-header">
          <span className="project-category">{category}</span>
          <h3 className="project-title">{title}</h3>
        </div>
      </div>

      <p className="project-description">{description}</p>

      <div className="project-technologies">
        {technologies.map((tech, index) => (
          <span className="tech-tag" key={index}>
            {tech}
          </span>
        ))}
      </div>

      <div className="project-buttons">
        {github ? (
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-small"
          >
            Github Repo
          </a>
        ) : (
          <span className="no-link-text">Repository is private/unavailable</span>
        )}
      </div>
    </div>
  );
}

export default ProjectCard;
