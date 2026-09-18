import "../components_css/Footer.css";
import { navSections, site } from "../data/site";
import {
  ArrowUpIcon,
  GithubIcon,
  LinkedinIcon,
  MailIcon,
} from "./Icons";

const socials = [
  { name: "GitHub", Icon: GithubIcon, url: site.github },
  { name: "LinkedIn", Icon: LinkedinIcon, url: site.linkedin },
];

// Split at the "@" so a long address can wrap at a natural boundary instead
// of mid-domain ("northeastern.ed" / "u").
const emails = [site.personalEmail, site.schoolEmail].map((address) => {
  const [local, domain] = address.split("@");
  return { address, local, domain };
});

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="footer" className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <span className="footer-brand-mark" aria-hidden="true">
              XM
            </span>
            <p className="footer-brand-text">
              Building responsive, accessible websites and interfaces that
              address real user needs and solve real-world problems.
            </p>
          </div>

          <nav className="footer-col" aria-label="Footer navigation">
            <h3 className="footer-col-title">Explore</h3>
            <ul>
              <li>
                <a href="#home">Home</a>
              </li>
              {navSections.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`}>{section.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="footer-col">
            <h3 className="footer-col-title">Contact</h3>
            <ul>
              {emails.map((email) => (
                <li key={email.address}>
                  <a
                    href={`mailto:${email.address}`}
                    className="footer-email footer-email--address"
                  >
                    <MailIcon width="15" height="15" />
                    <span className="footer-email-text">
                      {email.local}
                      <wbr />@{email.domain}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h3 className="footer-col-title">Elsewhere</h3>
            <ul>
              {socials.map((social) => (
                <li key={social.name}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-email"
                  >
                    <social.Icon width="15" height="15" />
                    <span>{social.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            &copy; {currentYear} {site.name}. All rights reserved.
          </p>
          <p className="footer-credit">Designed and built with React.</p>
          <a href="#home" className="footer-top-link">
            Back to top
            <ArrowUpIcon width="15" height="15" />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
