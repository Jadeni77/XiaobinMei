import React from "react";

function Skill() {
  const technicalSkills = [
    { name: "HTML", level: 6 },
    { name: "Java", level: 60 },
  ];

  const otherSkills = ["UI/UX Design", "Git & Github", "Testing"];

  return (
    <section id="skills" className="skills">
      <div className="container">
        <div className="section-header">
          <h2>My Skills</h2>
          <div className="divider"></div>
          <p className="section-subtitle">
            Here are the technologies and skills I've developed through
            coursework, personal projects, and professional experience.
          </p>
        </div>

        <div className="skills-container">
          <div className="technical-skills">
            <h3>Technical Skills</h3>
            <div className="skill-bars">
              {technicalSkills.map((skill, index) => (
                <div className="skill-item" key={index}>
                  <div className="skill-info">
                    <span>{skill.name}</span>
                    <span>{skill.level}%</span>
                  </div>

                  <div className="skill-bar">
                    <div
                      className="skill-progress"
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="other-skills">
            <h3>Additional Skills</h3>
            <div className="skill-tags">
              {otherSkills.map((skill, index) => (
                <div className="skill-tag" key={index}>
                  {skill}
                </div>
              ))}
            </div>

            <div className="tools-section">
              <h3>Tools & Technologies</h3>
              <div className="tools-grid">
                {["VS Code", "Eclipse", "IntellJ IDE", "Git", "Github"].map(
                  (tool, index) => (
                    <div className="tool-item" key={index}>
                      <div className="tool-icon"></div>
                      <span>{tool}</span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Skill;
