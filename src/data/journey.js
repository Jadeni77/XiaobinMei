/*
 * Milestones for the My Journey carousel.
 *
 * ORDERED OLDEST-FIRST, unlike experience.js which is newest-first. The
 * trajectory curve rises left-to-right through time, so reversing this breaks
 * the backdrop. Do not "fix" the order.
 *
 * Journey is the personal register: what a year felt like and what was learned.
 * The professional record — responsibilities, metrics, technologies — belongs in
 * experience.js. Keeping them apart is the whole reason both sections exist.
 *
 * `accent` is a step name from journeyAccents.js, not a hex.
 * `alt` is required on every photo — these images carry meaning.
 *
 * Photos are cropped to fill a landscape slot, biased upward so faces survive.
 * Add an optional `focus` to any photo that needs a different anchor, using
 * object-position syntax: `focus: "center top"`, `focus: "30% 40%"`.
 *
 * PLACEHOLDER CONTENT: photos below are existing repo assets. Replace with
 * real photos in src/assets/journey/ and rewrite each `story` in first person.
 */
import portrait from "../assets/aboutimage/linkedin.jpeg";
import oasis from "../assets/aboutimage/oasis.jpg";
import calendar from "../assets/projectimage/calendar.png";
import bookstore from "../assets/projectimage/bookstore.png";
import lightEmAll from "../assets/projectimage/LightEmAll.png";
import connections from "../assets/projectimage/Connections.png";

export const journey = [
  {
    id: "started-neu",
    year: "2024",
    title: "Started at Northeastern",
    story:
      "PLACEHOLDER. Arrived in Boston for a combined Computer Science and Mathematics major, and wrote my first real programs in CS 2500.",
    photos: [
      { src: portrait, alt: "Placeholder: portrait on campus" },
      { src: lightEmAll, alt: "Placeholder: the LightEmAll puzzle game" },
      { src: connections, alt: "Placeholder: the Connections word game" },
    ],
    accent: "indigo",
  },
  {
    id: "quincy-coders",
    year: "2024",
    title: "Teaching kids to code",
    story:
      "PLACEHOLDER. Quincy Coders at BCNC — 3D printing and Scratch with eight to twelve year olds. Explaining something turned out to be how I actually learned it.",
    photos: [
      { src: oasis, alt: "Placeholder: students working at a table" },
      { src: calendar, alt: "Placeholder: the Java calendar application" },
    ],
    accent: "teal",
  },
  {
    id: "ai-and-access",
    year: "2025",
    title: "Into AI and college access",
    story:
      "PLACEHOLDER. An AI bootcamp with the NU AI Club, alongside a year guiding students through college applications and SAT prep.",
    photos: [
      { src: bookstore, alt: "Placeholder: the NEU bookstore web app" },
      { src: portrait, alt: "Placeholder: portrait on campus" },
    ],
    accent: "sky",
  },
  {
    id: "ai-caring",
    year: "2026",
    title: "AI-CARING co-op",
    story:
      "PLACEHOLDER. An elderly-care reminder system spanning a Python backend, a Node WebSocket server, and a Swift iOS app, deployed to more than forty care homes.",
    photos: [
      { src: calendar, alt: "Placeholder: a scheduling interface" },
      { src: bookstore, alt: "Placeholder: a web application dashboard" },
    ],
    accent: "violet",
  },
  {
    id: "chewy",
    year: "2026",
    title: "Chewy internship",
    story:
      "PLACEHOLDER. Modernised a 480,000-event-per-day order processor onto Java and Spring Boot, and found a defect quietly dropping hundreds of messages a day.",
    photos: [
      { src: lightEmAll, alt: "Placeholder: a systems diagram" },
      { src: connections, alt: "Placeholder: a monitoring dashboard" },
    ],
    accent: "blue",
  },
];
