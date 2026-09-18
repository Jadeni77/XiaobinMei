/** The first gallery image is the cover. Legacy projectImage entries still work. */
export function getProjectImages(project) {
  const images = project.images ?? (project.projectImage ? [{ src: project.projectImage }] : []);
  return images.filter((image) => image?.src).map((image) => ({
    ...image,
    alt: image.alt || `${project.title} screenshot`,
  }));
}
