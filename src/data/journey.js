/**
 * Milestones for the My Journey carousel.
 *
 * ORDERED OLDEST-FIRST, unlike experience.js which is newest-first. The
 * trajectory curve rises left to right through time, so reversing this breaks
 * the backdrop. A test asserts the order; do not "fix" it.
 *
 * Journey is the personal register: what a year felt like and what was learned.
 * Responsibilities, metrics and technologies belong in experience.js. Keeping
 * them apart is the whole reason both sections exist.
 *
 * Fields:
 *   accent  a step name from journeyAccents.js, not a hex. Five cool steps are
 *           available; avoid giving adjacent milestones the same one or the
 *           theme does not visibly change between them.
 *   alt     required on every photo. These images carry meaning, so a generic
 *           fallback would be worse than useless to a screen-reader user.
 *   focus   optional object-position anchor for a photo that crops badly, e.g.
 *           focus: "center top". Photos fill a landscape slot biased upward,
 *           so portrait sources lose roughly half their height.
 *
 * Photos live in src/assets/journeyImage/<event>/.
 */
import oasis from "../assets/aboutimage/oasis.jpg";
import bookstore from "../assets/projectimage/bookstore.png";

import aicgroup from "../assets/journeyImage/ai-caring/full-group.jpg";
import aicjadenzhi from "../assets/journeyImage/ai-caring/jaden-zhi.jpg";
import aicjadenfolks from "../assets/journeyImage/ai-caring/jaden-folks.jpg";

import chewygroup from "../assets/journeyImage/chewy/full-group.jpg";
import chewyjadentopy0 from "../assets/journeyImage/chewy/jaden-topy-0.jpg";
import chewyjadentopy1 from "../assets/journeyImage/chewy/jaden-topy-1.jpg";
import chewyjadentopy2 from "../assets/journeyImage/chewy/jaden-topy-2.jpg";
import chewyjadenwill from "../assets/journeyImage/chewy/jaden-will.jpg";

import neuselfie1 from "../assets/journeyImage/neu/selfie.jpg";
import neuselfie2 from "../assets/journeyImage/neu/selfie1.jpg";
import krentzman from "../assets/journeyImage/neu/krentzman.jpg";

// CAPS
import bcncambassador from "../assets/journeyImage/bcnc/ambassador.jpg";
// NU Tour
import bcnctour from "../assets/journeyImage/bcnc/neu-tour.jpg";
import bcnctour1 from "../assets/journeyImage/bcnc/neu-tour1.jpg";
// Quincy Coder
import mittour from "../assets/journeyImage/bcnc/mittour.jpg";
import googletour from "../assets/journeyImage/bcnc/googletour.jpg";
import bcncqccoder1 from "../assets/journeyImage/bcnc/qccoder1.jpg";


export const journey = [
  {
    id: "quincy-coders",
    year: "2024",
    title: "Teaching kids to code",
    story:
      "Quincy Coders at BCNC — 3D printing and Scratch with eight- to " +
      "twelve-year-olds. Explaining something turned out to be how I actually " +
      "learned it. There were lovely Google and MIT tours too!",
    photos: [
      { src: mittour, alt: "The Quincy Coders group on a tour of MIT" },
      { src: googletour, alt: "The Quincy Coders group on a tour of Google" },
      { src: bcncqccoder1, alt: "Helping two students at a laptop" },
    ],
    accent: "teal",
  },
  {
    id: "started-neu",
    year: "2024",
    title: "Started at Northeastern",
    story:
      "I got into Northeastern in Boston for a combined Computer Science and " +
      "Mathematics major. I could not wait to start something new.",
    photos: [
      { src: krentzman, alt: "Krentzman Quad on the Northeastern campus" },
      { src: neuselfie1, alt: "A selfie on campus during my first weeks" },
      { src: neuselfie2, alt: "Another selfie on campus" },
    ],
    accent: "indigo",
  },
  {
    id: "bcnc-caps",
    year: "2024",
    title: "CAPS assistant at BCNC",
    story:
      "I helped high school students find their way through the college " +
      "application process — building resumes, coaching essays, and running SAT " +
      "bootcamps. Sitting with someone as they figure out what to say about " +
      "themselves is harder, and better, than it sounds.",
    photos: [
      { src: bcncambassador, alt: "Serving as an ambassador at a BCNC event" },
      { src: bcnctour, alt: "Blackman Auditorium during a campus tour" },
      { src: bcnctour1, alt: "Outside the Marino Center on a campus tour" },
    ],
    accent: "sky",
  },
  {
    id: "oasis",
    year: "2025",
    title: "OASIS club",
    story:
      "I joined the OASIS club in Spring 2025, where I first picked up React, " +
      "backends, and Supabase. My team built a bookstore simulator. A very " +
      "memorable place to learn all of it.",
    photos: [
      { src: oasis, alt: "Presenting the OASIS final project" },
      { src: bookstore, alt: "The bookstore simulator my team built" },
    ],
    accent: "teal",
  },
  {
    id: "ai-caring",
    year: "2026",
    title: "AI-CARING co-op",
    story:
      "AI-CARING was my first co-op. At the PARCS lab I met a lot of great " +
      "people: fellow co-ops, graduate students, and upperclassmen. Thanks to " +
      "Zhi for the opportunity!",
    photos: [
      { src: aicgroup, alt: "A group photo of the PARCS lab" },
      { src: aicjadenzhi, alt: "With Zhi, the principal investigator of PARCS" },
      { src: aicjadenfolks, alt: "One of our regular team lunches" },
    ],
    accent: "violet",
  },
  {
    id: "chewy",
    year: "2026",
    title: "Chewy internship",
    story:
      "My first time contributing to an e-commerce company. I landed on " +
      "Autoship, the team that earns the most for Chewy. Thank you to Eliza, " +
      "my recruiter, and to the whole Autoship team!",
    photos: [
      { src: chewygroup, alt: "The Autoship team together, joining up from different states" },
      { src: chewyjadenwill, alt: "With Will, my manager" },
      { src: chewyjadentopy0, alt: "With Topy at the Chewy office" },
      { src: chewyjadentopy1, alt: "With Topy at the Chewy office 1" },
      { src: chewyjadentopy2, alt: "With Topy at the Chewy office 2" },
    ],
    accent: "blue",
  },
];
