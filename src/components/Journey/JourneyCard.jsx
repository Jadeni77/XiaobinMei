import { useEffect, useState } from "react";
import "../../components_css/JourneyCard.css";
import { cardTransform } from "./carouselMath";

function JourneyCard({
  milestone,
  distance,
  isActive,
  position,
  total,
  onSelect,
}) {
  const [photoIndex, setPhotoIndex] = useState(0);

  // Reset to the lead photo whenever this card leaves the centre, so returning
  // to it does not resume mid-set.
  useEffect(() => {
    if (!isActive) setPhotoIndex(0);
  }, [isActive]);

  const { transform, opacity, zIndex } = cardTransform(distance);

  return (
    <article
      className={`card journey-card ${isActive ? "is-active" : ""}`}
      style={{ transform, opacity, zIndex }}
      role="group"
      aria-roledescription="slide"
      aria-label={`${position} of ${total}: ${milestone.title}`}
      /* Keeps Tab and screen readers out of off-centre cards. Without this,
         Tab walks into invisible cards' thumbnail buttons. React 19 supports
         inert as a boolean and omits the attribute when false. */
      inert={!isActive}
      onClick={isActive ? undefined : onSelect}
    >
      <div className="journey-card-inner">
        <div className="journey-card-top">
          <span className="journey-card-year">{milestone.year}</span>
        </div>

        <h3 className="journey-card-title">{milestone.title}</h3>

        <div className="journey-photos">
          <div className="journey-photo-main">
            {milestone.photos.map((photo, i) => (
              <img
                key={photo.src}
                src={photo.src}
                alt={i === photoIndex ? photo.alt : ""}
                className={i === photoIndex ? "is-on" : ""}
                style={photo.focus ? { "--photo-focus": photo.focus } : undefined}
                loading="lazy"
              />
            ))}
          </div>

          {milestone.photos.length > 1 && (
            <div className="journey-thumbs">
              {milestone.photos.map((photo, i) => (
                <button
                  type="button"
                  key={photo.src}
                  className={i === photoIndex ? "is-on" : ""}
                  aria-label={`Photo ${i + 1} of ${milestone.photos.length}`}
                  aria-pressed={i === photoIndex}
                  onClick={() => setPhotoIndex(i)}
                >
                  <img src={photo.src} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <p className="journey-card-story">{milestone.story}</p>
      </div>
    </article>
  );
}

export default JourneyCard;
