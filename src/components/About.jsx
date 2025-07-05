import React from "react";
import Oasis from "../assets/aboutimage/oasis.jpg";
import LinkedIn from "../assets/aboutimage/linkedin.jpeg";

function About() {
  const images = [
    {
      src: LinkedIn,
      label: "Passionate Coder",
    },

    {
      src: Oasis,
      label: "Oasis",
    },
  ];

  return (
    <section id="about" className="about">
      <div className="container">
        <div className="section-header">
          <h2>About Me</h2>
          <div className="divider"></div>
        </div>

        <div className="about-content">
          <div className="about-images">
            {images.map((img, index) => (
              <div key={index} className="about-profile-image-container">
                <div className="badge-wrapper">
                  {" "}
                  {/* Wrapper Use: Image won't move up when empty label */}
                  {img.label ? (
                    <div className="badge-top">{img.label} </div>
                  ) : null}
                </div>
                <div className="profile-image">
                  <img src={img.src} alt={`Xiaobin Mei ${index + 1}`} />
                </div>
              </div> //
            ))}
          </div>
        </div>

        <div className="about-text">
          <h3>My Journey</h3>
          <p>
            Hello, I am Xiaobin Mei, but you can call me Jaden. I'm a sophomore
            at Northeastern University, pursuing a combined major in Computer
            Science and Mathematics. I have a strong interest in software
            development, clean design, and building tools that solve real-world
            problems. In the future, I hope to become either a software engineer
            or a math teacher—two paths I deeply enjoy.
          </p>
          <p>
            During my freshman year, I focused mainly on Java, taking courses
            such as Fundamentals of Computer Science 1 & 2 (CS 2500 & 2510) and
            Object-Oriented Design (CS 3500). In Spring 2024, I joined the OASIS
            program (pictured above), where I learned React.js and built my
            first web project—the NEU Bookstore website (see Projects section
            for more details). That project was especially meaningful to me
            because it helped me realize how much effort goes into creating a
            real website, even if users might just click through and move on.
            But it's ok as every line of code is a step forward, and I'm
            exciting to keep learning, building, and growing throughout my
            journey at Northeastern!
          </p>

          <div className="info-cards">
            <div className="info-card education">
              <h4>Education</h4>
              <p>B.S. Computer Science and Mathematics</p>
              <p>Northeastern University</p>

              {/* Experience Section (Add from top to maintain date consistency)*/}
              <div className="info-card experience">
                <h4>Experience</h4>

                {/* Digital Marketing */}
                <div className="experience-title-line">
                  <h5>Digital Marketing Experiential Workshop - NUView</h5>
                  <em>May 2025 - June 2025</em>
                </div>

                <div className="experience-header">
                  <p>
                    <em>Northeastern University Boston, MA</em>
                  </p>
                  <ul>
                    <li>Develop a social media marketing strategy to raise
                       awareness of Saxbys’ student-run cafe model.</li>
                    <li>Conduct market research and create slide decks to present 
                      marketing recommendations to the project sponsor.</li>
                    <li>Collaborate with a team of four to position Saxbys as a
                      meaningful career opportunity, not just a coffee shop.</li>
                  </ul>
                </div>

                {/* AI Bootcamp */}
                <div className="experience-title-line">
                  <h5>AI Bootcamp - NU Artificial Intelligence Club</h5>
                  <em className="experience-date">January 2025 - March 2025</em>
                </div>

                <div className="experience-header">
                  <p>
                    <em>Northeastern University Boston, MA</em>
                  </p>
                  <ul>
                    <li>
                      Learn the fundamental concepts of machine learning under 
                      experienced mentors and club members.
                    </li>
                    <li>Applied concepts through hands-on coding projects using
                      Google Collab.
                    </li>
                  </ul>
                </div>

                {/* CAPS Assistant Job */}
                <div className="experience-title-line">
                  <h5>College Access and Post-Secondary Success (CAPS) Assistant Intern 
                    - Youth Center</h5>
                  <em className="experience-date">
                    September 2024 - August 2025
                  </em>
                </div>

                <div className="experience-header">
                  <p>
                    <em>
                      Boston Chinatown Neighborhood Center (BCNC),
                      Quincy/Boston, MA
                    </em>
                  </p>
                  <ul>
                    <li>Guide students through key steps of the college application process, 
                      including building resumes <br /> and writing personal statements.</li>
                    <li>Host SAT bootcamps to strengthen test-taking skills and improve scores.</li>
                    <li>Translate workshop content into Chinese to support newly immigrated 
                      students’ understanding.</li>
                  </ul>
                </div>

                {/* Quincy Coders */}
                <div className="experience-title-line">
                  <h5>Teacher Assistant Intern — Quincy Coders </h5>
                  <em className="experience-date">July 2024 – August 2024</em>
                </div>

                <div className="experience-header">
                  <p>
                    <em>
                      Boston Chinatown Neighborhood Center (BCNC), Quincy, MA
                    </em>
                  </p>
                  <ul>
                    <li>
                      Assisted supervisors in preparing and reviewing
                      coding/STEM projects before program launch.
                    </li>
                    <li>
                      Guided and supported children (ages 8–12) in hands-on
                      coding and STEM activities, <br />including 3D printing, and
                      programming language "Scratch".
                    </li>
                    <li>
                      Helped ensure a fun, engaging, and safe learning
                      environment for all participants.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
