import { useEffect, useRef, useState } from "react";
import "../../components_css/JourneyTrajectory.css";

const BAND_HEIGHT_WIDE = 168;
const BAND_HEIGHT_NARROW = 120;
const POINT_GAP_WIDE = 250;
const POINT_GAP_NARROW = 150;
const NARROW_BREAKPOINT = 640;

/** Cubic path through the plotted points, in pixel space. */
function curvePath(points) {
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i += 1) {
    const a = points[i];
    const b = points[i + 1];
    const midX = (a.x + b.x) / 2;
    d += ` C ${midX} ${a.y}, ${midX} ${b.y}, ${b.x} ${b.y}`;
  }
  return d;
}

function JourneyTrajectory({ milestones, index }) {
  const bandRef = useRef(null);
  const curveRef = useRef(null);
  const [width, setWidth] = useState(1140);
  const [length, setLength] = useState(0);

  // The viewBox is in CSS pixels so plotted points stay circular. A 0 0 100 100
  // viewBox with preserveAspectRatio="none" renders them as ellipses.
  useEffect(() => {
    const node = bandRef.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) =>
      setWidth(entry.contentRect.width)
    );
    observer.observe(node);
    setWidth(node.clientWidth);
    return () => observer.disconnect();
  }, []);

  const isNarrow = width < NARROW_BREAKPOINT;
  const bandHeight = isNarrow ? BAND_HEIGHT_NARROW : BAND_HEIGHT_WIDE;
  const pointGap = isNarrow ? POINT_GAP_NARROW : POINT_GAP_WIDE;

  const count = milestones.length;
  const span = Math.max(1, count - 1);
  const points = milestones.map((_, i) => ({
    x: i * pointGap,
    y: bandHeight - 34 - (i / span) * (bandHeight - 78),
  }));
  const path = curvePath(points);

  useEffect(() => {
    if (curveRef.current) setLength(curveRef.current.getTotalLength());
  }, [path]);

  const drawn = count > 1 ? index / (count - 1) : 1;

  return (
    <div className="journey-band" ref={bandRef} aria-hidden="true">
      <svg
        className="journey-svg"
        viewBox={`0 0 ${width} ${bandHeight}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <g
          className="journey-pan"
          style={{ transform: `translateX(${width / 2 - points[index].x}px)` }}
        >
          {/* Projected future */}
          <path className="journey-curve-ghost" d={path} />
          {/* Drawn past */}
          <path
            className="journey-curve"
            d={path}
            ref={curveRef}
            style={{
              strokeDasharray: length || undefined,
              strokeDashoffset: length ? length * (1 - drawn) : undefined,
            }}
          />
          {points.map((point, i) => (
            <g key={milestones[i].id}>
              <circle
                className={`journey-halo ${i === index ? "is-now" : ""}`}
                cx={point.x}
                cy={point.y}
                r={13}
              />
              <circle
                className={`journey-point ${
                  i === index ? "is-now" : i < index ? "is-past" : ""
                }`}
                cx={point.x}
                cy={point.y}
                r={i === index ? 8 : 5}
              />
              <text
                className={`journey-point-label ${i === index ? "is-now" : ""}`}
                x={point.x}
                y={point.y - 18}
                textAnchor="middle"
              >
                {milestones[i].year}
              </text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}

export default JourneyTrajectory;
