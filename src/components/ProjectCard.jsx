import "../components_css/ProjectCard.css";
import { ExternalLinkIcon, GithubIcon } from "./Icons";

function ProjectCard({ project, hidden = false }) {
  const {
    title,
    blurb,
    description,
    category,
    technologies,
    course,
    github,
    projectImage,
  } = project;

  return (
    <article
      className={`card card--interactive project-card ${
        hidden ? "project-card--hidden" : ""
      }`}
    >
      <div className="project-thumb">
        {projectImage ? (
          <img
            src={projectImage}
            alt={`${title} screenshot`}
            loading="lazy"
            width="640"
            height="400"
          />
        ) : (
          <div className="project-thumb-placeholder" aria-hidden="true">
            {title.charAt(0)}
          </div>
        )}
      </div>

      <div className="project-body">
        {Array.isArray(category) && category.length > 0 && (
          <p className="project-categories">{category.join(" · ")}</p>
        )}

        <h3 className="project-title">{title}</h3>

        {course && <p className="project-course">{course}</p>}

        {/* Short blurb scans; the full description stays available on demand */}
        <p className="project-blurb">{blurb ?? description}</p>

        {blurb && description && (
          <details className="project-details">
            <summary>Read more</summary>
            <p>{description}</p>
          </details>
        )}

        <ul className="project-tech">
          {technologies.map((tech) => (
            <li className="tag" key={tech}>
              {tech}
            </li>
          ))}
        </ul>

        {/* margin-top:auto pins the footer so every card lines up */}
        <div className="project-footer">
          {github ? (
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className="project-link"
            >
              <GithubIcon width="17" height="17" />
              View repository
              <ExternalLinkIcon width="14" height="14" />
              <span className="visually-hidden">(opens in a new tab)</span>
            </a>
          ) : (
            <span className="project-link project-link--disabled">
              Repository unavailable
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

export default ProjectCard;
