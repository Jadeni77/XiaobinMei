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
                                    <img src={img.src} alt={`Xiaobin Mei ${index + 1}`}/>
                                </div>
                            </div> //
                        ))}
                    </div>
                </div>

                <div className="about-text">
                    <h3>My Journey</h3>
                    <p>
                        Hello, I am Xiaobin Mei, but you can call me Jaden. I'm a sophomore
                        at Northeastern University in 2026, pursuing a combined major in Computer
                        Science and Mathematics. I have a strong interest in software
                        development, clean design, and building tools that solve real-world
                        problems. In the future, I hope to become either a software engineer
                        or a math teacher—two paths I deeply enjoy.
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
                                        <li>
                                            Develop a social media marketing strategy to raise
                                            awareness of Saxbys’ student-run cafe model.
                                        </li>
                                        <li>
                                            Conduct market research and create slide decks to
                                            present
                                            marketing recommendations to the project sponsor.
                                        </li>
                                        <li>
                                            Collaborate with a team of four to position Saxbys as a
                                            meaningful career opportunity, not just a coffee shop.
                                        </li>
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
                                        <li>
                                            Applied concepts through hands-on coding projects using
                                            Google Collab.
                                        </li>
                                    </ul>
                                </div>

                                {/* CAPS Assistant Job */}
                                <div className="experience-title-line">
                                    <h5>
                                        College Access and Post-Secondary Success (CAPS) Assistant
                                        Intern - Youth Center
                                    </h5>
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
                                        <li>
                                            Guide students through key steps of the college
                                            application process, including building
                                            resumes <br/> and
                                            writing personal statements.
                                        </li>
                                        <li>
                                            Host SAT bootcamps to strengthen test-taking skills and
                                            improve scores.
                                        </li>
                                        <li>
                                            Translate workshop content into Chinese to support newly
                                            immigrated students’ understanding.
                                        </li>
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
                                            coding and STEM activities, <br/>
                                            including 3D printing, and programming language
                                            "Scratch".
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

                    {/* Relevant Coursework Section */}
                    <div className="info-cards">
                      <div className="info-card relevant-course">
                        <h4>Relevant Coursework</h4>

                        <div className="info-card semester-section">
                          <h4 className="">Fall 2025</h4>
                          <ul>
                            <li>CS3000: Algorithms & Data</li>
                            <li>DS3000: Foundation of Data Science</li>
                            <li>MATH4545: Fourier Series and PDEs</li>
                            <li>MATH3181: Advanced Probability and Statistics</li>
                          </ul>
                        </div>

                        <div className="info-card semester-section">
                          <h4 className="">Summer 2025</h4>
                          <ul>
                            <li>CS3500: Object-Oriented Design</li>
                            <li>MATH3527: Number Theory 1</li>
                            <li>MATH2331: Linear Algebra</li>
                          </ul>
                        </div>

                        <div className="info-card semester-section">
                          <h4 className="">Spring 2025</h4>
                          <ul>
                            <li>CS2510: Computer Science 2</li>
                            <li>MATH2341: Differential Equations and Linear Algebra</li>
                            <li>CS2800: Logic and Computation</li>
                          </ul>
                        </div>

                        <div className="info-card semester-section">
                          <h4 className="">Fall 2024</h4>
                          <ul>
                            <li>CS2500: Computer Science 1</li>
                            <li>CS1800: Discrete Structure</li>
                            <li>MATH2321: Calculus 3 for Science and Engineering</li>
                          </ul>
                        </div>

                      </div>
                    </div>


                </div>
            </div>
        </section>
    );
}

export default About;
