import "../components_css/About.css";
import Oasis from "../assets/aboutimage/oasis.jpg";
import LinkedIn from "../assets/aboutimage/linkedin.jpeg";
import { site } from "../data/site";
import { experience } from "../data/experience";
import { courseCount, degree, workTermCount } from "../data/education";
import { useReveal } from "../hooks/useReveal";
import SectionHeader from "./SectionHeader";
import CountUp from "./CountUp";
import {
  ArrowRightIcon,
  BookIcon,
  BriefcaseIcon,
  GraduationCapIcon,
  MapPinIcon,
} from "./Icons";

const photos = [
  { src: LinkedIn, alt: `${site.name} — portrait`, caption: "Passionate coder" },
  { src: Oasis, alt: `${site.name} at the Oasis program`, caption: "Oasis" },
];

function About() {
  const { ref, visible } = useReveal();

  // Counts come from the data files so the tiles cannot drift out of sync.
  const stats = [
    {
      icon: GraduationCapIcon,
      value: "CS + Math",
      label: `${degree.note}, ${degree.school}`,
      href: "#education",
    },
    {
      icon: MapPinIcon,
      value: site.location,
      label: "Where I'm based",
    },
    {
      icon: BriefcaseIcon,
      // Co-ops and internships are work experience, so they belong here
      // rather than in the course count.
      value: experience.length + workTermCount,
      label: "Roles, co-ops & programs",
      href: "#experience",
    },
    {
      icon: BookIcon,
      value: courseCount,
      label: "CS & Math courses",
      href: "#education",
    },
  ];

  return (
    <section id="about" className="section about" ref={ref}>
      <div className="container">
        <SectionHeader eyebrow="About" title="A quick introduction" />

        <div className={`about-bento ${visible ? "is-visible" : ""}`}>
          {/* Bio */}
          <article className="card about-bio reveal">
            <h3 className="about-bio-title">My journey</h3>
            <div className="prose">
              <p>
                Hello — I&apos;m {site.name}, but you can call me{" "}
                {site.nickname}. I&apos;m a sophomore at {degree.school}{" "}
                pursuing a combined major in Computer Science and Mathematics.
              </p>
              <p>
                I have a strong interest in software development, clean design,
                and building tools that solve real-world problems. Looking
                ahead, I hope to become either a software engineer or a math
                teacher — two paths I genuinely enjoy.
              </p>
            </div>
          </article>

          {/* Photos */}
          <div className="about-photos reveal">
            {photos.map((photo) => (
              <figure className="about-photo" key={photo.caption}>
                <img src={photo.src} alt={photo.alt} loading="lazy" />
                <figcaption>{photo.caption}</figcaption>
              </figure>
            ))}
          </div>

          {/* Stat tiles */}
          {stats.map((stat) => {
            const { value, label, href } = stat;
            const Tile = href ? "a" : "div";
            const Icon = stat.icon;
            return (
              <Tile
                key={label}
                href={href}
                className={`card about-stat reveal ${
                  href ? "about-stat--link card--interactive" : ""
                }`}
              >
                <Icon className="about-stat-icon" width="20" height="20" />
                <CountUp className="about-stat-value" value={value} />
                <span className="about-stat-label">{label}</span>
                {href && (
                  <ArrowRightIcon
                    className="about-stat-arrow"
                    width="16"
                    height="16"
                  />
                )}
              </Tile>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default About;
