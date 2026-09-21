/** Native modal provides focus containment, Escape dismissal and inert background. */
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowRightIcon, CloseIcon, ExternalLinkIcon, GithubIcon } from "./Icons";
import ProjectImage from "./ProjectImage";
import { getProjectImages } from "../data/projectMedia";
import "../components_css/ProjectDetail.css";

function ProjectDetail({ project, onClose, returnFocusRef }) {
  const dialogRef = useRef(null);
  const backButtonRef = useRef(null);
  const titleId = useId();
  const [imageIndex, setImageIndex] = useState(0);
  const images = getProjectImages(project);
  const currentImage = images[imageIndex];
  const hasGallery = images.length > 1;

  useEffect(() => {
    const dialog = dialogRef.current;
    const trigger = returnFocusRef?.current ?? document.activeElement;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    backButtonRef.current?.focus({ preventScroll: true });
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    };
  }, [returnFocusRef]);

  const moveImage = (step) => setImageIndex((index) => (index + step + images.length) % images.length);

  return createPortal(
    <dialog
      ref={dialogRef}
      className="project-dialog"
      aria-labelledby={titleId}
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose();
      }}
    >
      <div className="project-detail-toolbar">
        <button ref={backButtonRef} type="button" className="project-back" onClick={onClose}>
          <ArrowRightIcon width="19" height="19" /> Back to projects
        </button>
        <button type="button" className="project-close" aria-label="Close project" onClick={onClose}>
          <CloseIcon width="22" height="22" />
        </button>
      </div>
      <div className="project-detail-content">
        <div className="project-gallery" role="region" aria-label={`${project.title} images`}
          onKeyDown={(event) => {
            if (!hasGallery || !["ArrowLeft", "ArrowRight"].includes(event.key)) return;
            event.preventDefault();
            moveImage(event.key === "ArrowRight" ? 1 : -1);
          }}>
          <figure>
            <div className="project-gallery-stage">
              <ProjectImage image={currentImage} title={project.title} loading="eager" />
            </div>
            {currentImage?.caption && <figcaption>{currentImage.caption}</figcaption>}
          </figure>
          {images.length > 0 && (
            <div className="project-gallery-controls">
              <div className="project-gallery-pagination">
                {hasGallery && <button type="button" className="project-gallery-arrow project-gallery-arrow--previous" onClick={() => moveImage(-1)} aria-label="Previous image"><ArrowRightIcon width="20" height="20" /></button>}
                <span role="status" aria-live="polite" aria-atomic="true">{imageIndex + 1} / {images.length}</span>
                {hasGallery && <button type="button" className="project-gallery-arrow" onClick={() => moveImage(1)} aria-label="Next image"><ArrowRightIcon width="20" height="20" /></button>}
              </div>
              <a className="project-image-original" href={currentImage.src} target="_blank" rel="noopener noreferrer">
                Open full-size image <ExternalLinkIcon width="15" height="15" /><span className="visually-hidden"> (opens in a new tab)</span>
              </a>
            </div>
          )}
          {hasGallery && (
            <div className="project-gallery-thumbnails" role="group" aria-label="Choose an image">
              {images.map((image, index) => (
                <button type="button" key={`${image.src}-${index}`} aria-label={`Show image ${index + 1}: ${image.alt}`}
                  aria-pressed={index === imageIndex} onClick={() => setImageIndex(index)}>
                  <ProjectImage image={{ ...image, alt: "" }} title={project.title} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="project-story">
          {project.category?.length > 0 && <p className="project-detail-eyebrow">{project.category.join(" / ")}</p>}
          <h2 id={titleId}>{project.title}</h2>
          {project.course && <p className="project-detail-course">{project.course}</p>}
          {project.description && <p className="project-detail-description">{project.description}</p>}
          {!project.description && project.blurb && <p className="project-detail-description">{project.blurb}</p>}
          {project.highlights?.length > 0 && <ul className="project-highlights">{project.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>}
          {project.sections?.map((section, index) => (
            <section className="project-story-section" key={index}>
              <h3>{section.title}</h3>
              {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {section.bullets?.length > 0 && <ul className="project-highlights">{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}
            </section>
          ))}
          {project.technologies?.length > 0 && (
            <section className="project-detail-technologies">
              <h3>Technologies</h3>
              <ul className="project-tech">{project.technologies.map((tech) => <li className="tag" key={tech}>{tech}</li>)}</ul>
            </section>
          )}
          {(project.github || project.liveUrl) && (
            <div className="project-detail-links">
              {project.github && <a href={project.github} target="_blank" rel="noopener noreferrer" className="btn btn-primary"><GithubIcon className="btn-icon" /> View repository<span className="visually-hidden"> (opens in a new tab)</span></a>}
              {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">Visit project <ExternalLinkIcon className="btn-icon" /><span className="visually-hidden"> (opens in a new tab)</span></a>}
            </div>
          )}
        </div>
      </div>
    </dialog>,
    document.body
  );
}

export default ProjectDetail;
