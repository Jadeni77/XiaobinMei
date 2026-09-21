/** Keep missing or unavailable images from leaving a broken image in the gallery. */
import { useState } from "react";
import { CameraIcon } from "./Icons";

function ImageWithFallback({ image, title, loading }) {
  const [failed, setFailed] = useState(false);

  if (!image || failed) {
    return (
      <span className="project-image-placeholder" role="img" aria-label={`${title}: ${failed ? "image unavailable" : "no image yet"}`}>
        <CameraIcon width="44" height="44" />
        <span>{failed ? "Image unavailable" : "Project preview"}</span>
      </span>
    );
  }

  return <img src={image.src} alt={image.alt} loading={loading} onError={() => setFailed(true)} />;
}

export default function ProjectImage(props) {
  return <ImageWithFallback key={props.image?.src ?? "placeholder"} loading="lazy" {...props} />;
}
