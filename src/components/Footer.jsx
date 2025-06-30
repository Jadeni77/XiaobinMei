import React from "react";
import GithubIcon from "../assets/icons/github.png";
import LinkedInIcon from "../assets/icons/linkedin.png";
import EmailIcon from "../assets/icons/email.png";
import OutlookIcon from "../assets/icons/outlook.png";
import InstagramIcon from "../assets/icons/instagram.png";
import DiscordIcon from "../assets/icons/discord.png";

function Footer() {
  const currentYear = new Date().getFullYear();

  const socialMedia = [
    { name: "Github", icon: GithubIcon, url: "https://github.com/Jadeni77" },
    {
      name: "LinkedIn",
      icon: LinkedInIcon,
      url: "https://www.linkedin.com/in/xiaobinmei/",
    },
    { name: "Email", icon: EmailIcon, url: "mailto:xmei59664@gmail.com" },
    {
      name: "Outlook",
      icon: OutlookIcon,
      url: "mailto:mei.xiaob@northeastern.edu",
    },
    { name: "Instagram", icon: InstagramIcon, url: "https://www.instagram.com/xiaobinmei/?next=%2F" },
    { name: "Discord", icon: DiscordIcon, url: "https://discord.com/users/892505810238853121" },
  ];

  const navLinks = [
    { name: "About", url: "#about" },
    { name: "Skills", url: "#skills" },
    { name: "Projects", url: "#projects" },
    { name: "Contact", url: "#contact" },
  ];

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>Xiaobin(Jaden) Mei</h3>
            <p>
              Learning how to build responsive and accessible websites and user
              interfaces to create solutions that address user needs, improve
              existing systems, and solve real-world problems!
            </p>
          </div>

          {/* Navigation Links */}
          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              {navLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.url}>{link.name}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media Icons */}
          <div className="social-links">
            <h4>Connect With Me</h4>
            {socialMedia.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                className={social.url ? "" : "disabled-link"}
              >
                <img
                  src={social.icon}
                  alt={social.name}
                  className="social-icon"
                />
              </a>
            ))}
          </div>

          {/* Email Contact */}
          <div className="contact-section">
            <h4>Contact Me</h4>
            <div className="contact-email">
              <a href="mailto:xmei59664@gmail.com" className="email-link">
                <img src={EmailIcon} alt="Email" className="email-icon" />
                <span>Xmei59664@gmail.com</span>
              </a>
              <a href="mailto:mei.xiaob@northeastern.edu" className="email-link">
                <img src={OutlookIcon} alt="Outlook" className="email-icon" />
                <span>Mei.xiaob@northeastern.edu</span>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="footer-bottom">
          <p>&copy; {currentYear} Xiaobin Mei. All rights reserved.</p>
          <p>Design and built with React.js</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
