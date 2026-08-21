import { useEffect, useState } from "react";
import "../../components_css/JourneyCard.css";
import { cardTransform } from "./carouselMath";

/** How long each photo holds before the deck advances. */
const PHOTO_HOLD_MS = 4000;

function JourneyCard({
  milestone,
  distance,
  isActive,
  position,
  total,
  onSelect,
  autoplay,
  onStopAutoplay,
}) {
  const [photoIndex, setPhotoIndex] = useState(0);
  // Local, temporary pause — distinct from the permanent one a click sets.
  const [hovered, setHovered] = useState(false);

  const photoCount = milestone.photos.length;
  const cycling = autoplay && !hovered && photoCount > 1;

  useEffect(() => {
    if (!cycling) return;
    const timer = setInterval(
      () => setPhotoIndex((i) => (i + 1) % photoCount),
      PHOTO_HOLD_MS
    );
    return () => clearInterval(timer);
  }, [cycling, photoCount]);

  const selectPhoto = (i) => {
    setPhotoIndex(i);
    // Choosing a photo stops this deck for good. Other decks are unaffected.
    onStopAutoplay?.();
  };

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
      /* WCAG 2.2.2 wants a discoverable way to pause auto-updating content.
         Clicking a thumbnail stops the deck permanently; hover and keyboard
         focus pause it for as long as attention is on the card. */
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setHovered(true)}
      onBlurCapture={() => setHovered(false)}
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
                  onClick={() => selectPhoto(i)}
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
