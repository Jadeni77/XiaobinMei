/** Compact project preview; the full story and gallery open in ProjectDetail. */
import "../components_css/ProjectCard.css";
import { ExternalLinkIcon, EyeIcon, CameraIcon } from "./Icons";
import ProjectImage from "./ProjectImage";
import { getProjectImages } from "../data/projectMedia";

function ProjectCard({ project, hidden = false, onView }) {
  const images = getProjectImages(project);
  const externalUrl = project.liveUrl || project.github;

  return (
    <article className={`card card--interactive project-card ${hidden ? "project-card--hidden" : ""}`}>
      <button
        type="button"
        className="project-thumb"
        aria-label={`View ${project.title}`}
        aria-haspopup="dialog"
        onClick={onView}
      >
        <ProjectImage image={images[0]} title={project.title} />
        <span className="project-view"><EyeIcon width="20" height="20" /> View project</span>
        {images.length > 0 && (
          <span className="project-image-count" aria-label={`${images.length} ${images.length === 1 ? "image" : "images"}`}>
            <CameraIcon width="17" height="17" /> {images.length}
          </span>
        )}
      </button>

      <div className="project-body">
        <div className="project-title-row">
          <h3 className="project-title">
            <button type="button" onClick={onView} aria-haspopup="dialog">{project.title}</button>
          </h3>
          {externalUrl && (
            <a href={externalUrl} target="_blank" rel="noopener noreferrer" className="project-external"
              aria-label={`${project.title}: ${project.liveUrl ? "visit project" : "view repository"} (opens in a new tab)`}>
              <ExternalLinkIcon width="19" height="19" />
            </a>
          )}
        </div>
        {project.course && <p className="project-course">{project.course}</p>}
        <p className="project-blurb">{project.blurb || project.description || project.highlights?.[0]}</p>
        {project.technologies?.length > 0 && (
          <ul className="project-tech" aria-label="Technologies">
            {project.technologies.map((tech) => <li className="tag" key={tech}>{tech}</li>)}
          </ul>
        )}
      </div>
    </article>
  );
}

export default ProjectCard;
