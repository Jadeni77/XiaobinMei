/**
 * Degree banner plus coursework, grouped into an aligned ledger by academic
 * year.
 *
 * Rows rather than cards: a term with one course beside a term with four left
 * large voids and read as unorganised. Co-ops and internships are tinted as
 * work terms and excluded from the course count.
 */
import "../components_css/Education.css";
import {
  courseworkByYear,
  degree,
  isWorkTerm,
} from "../data/education";
import { useReveal } from "../hooks/useReveal";
import SectionHeader from "./SectionHeader";
import { GraduationCapIcon, MapPinIcon } from "./Icons";

/** "4 courses · 1 work term" for a given academic year. */
function yearSummary(terms) {
  const entries = terms.flatMap((term) => term.courses);
  const courses = entries.filter((entry) => !isWorkTerm(entry)).length;
  const work = entries.filter(isWorkTerm).length;

  const parts = [];
  if (courses) parts.push(`${courses} course${courses === 1 ? "" : "s"}`);
  if (work) parts.push(`${work} work term${work === 1 ? "" : "s"}`);
  return parts.join(" · ");
}

function Education() {
  const { ref, visible } = useReveal({ threshold: 0.05 });

  return (
    <section id="education" className="section education" ref={ref}>
      <div className="container">
        <SectionHeader
          eyebrow="Education"
          title="Degree & coursework"
        />

        {/* Degree banner */}
        <div className="degree-card card">
          <GraduationCapIcon className="degree-icon" width="26" height="26" />
          <div className="degree-body">
            <h3 className="degree-credential">{degree.credential}</h3>
            <p className="degree-school">{degree.school}</p>
          </div>
          <div className="degree-meta">
            <span className="tag tag--accent">{degree.note}</span>
            <span className="degree-location">
              <MapPinIcon width="15" height="15" />
              {degree.location}
            </span>
          </div>
        </div>

        {/* One block per academic year — an aligned ledger, not a card wall */}
        <div className={`ay-list ${visible ? "is-visible" : ""}`}>
          {courseworkByYear.map((group, index) => (
            <section
              className="ay-block reveal"
              key={group.year}
              style={{ "--reveal-i": index }}
            >
              <header className="ay-head">
                <h3 className="ay-year">{group.year}</h3>
                <span className="ay-summary">{yearSummary(group.terms)}</span>
              </header>

              <div className="ay-terms">
                {group.terms.map((term) => (
                  <div className="term-row" key={term.term}>
                    <h4 className="term-label">{term.term}</h4>

                    <ul className="term-list">
                      {term.courses.map((course) => (
                        <li
                          key={course.code}
                          className={`course-row ${
                            isWorkTerm(course) ? "course-row--work" : ""
                          }`}
                        >
                          <span className="course-code">{course.code}</span>
                          <span className="course-name">{course.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Education;
