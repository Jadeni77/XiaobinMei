import "../components_css/Skills.css";
import { skillCategories } from "../data/skills";
import { useReveal } from "../hooks/useReveal";
import SectionHeader from "./SectionHeader";

function Skills() {
  const { ref, visible } = useReveal({ threshold: 0.05 });

  // Running index so the stagger flows across categories, not within each one.
  let staggerIndex = 0;

  return (
    <section id="skills" className="section section--alt skills" ref={ref}>
      <div className="container">
        <SectionHeader
          eyebrow="Skills"
          title="Tools I build with"
          subtitle="Technologies I've picked up through coursework, personal projects, and professional experience."
        />

        <div className={`skills-groups ${visible ? "is-visible" : ""}`}>
          {skillCategories.map((category) => (
            <div className="skills-group" key={category.title}>
              <h3 className="skills-group-title">
                {category.title}
                <span className="skills-group-count">
                  {category.items.length}
                </span>
              </h3>

              <ul className="skills-grid">
                {category.items.map((item) => {
                  const delay = staggerIndex++;
                  return (
                    <li
                      className="skill-chip reveal"
                      style={{ "--reveal-i": delay }}
                      key={`${category.title}-${item.name}`}
                    >
                      <img
                        src={item.icon}
                        alt=""
                        className="skill-chip-icon"
                        width="24"
                        height="24"
                        loading="lazy"
                      />
                      <span className="skill-chip-name">{item.name}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Skills;
