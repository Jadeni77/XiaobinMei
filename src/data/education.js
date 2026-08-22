export const degree = {
  credential: "B.S. Computer Science and Mathematics",
  school: "Northeastern University",
  location: "Boston, MA",
  note: "Combined major",
};

// Semesters newest first. Entries typed "coop" or "intern" get the accent
// treatment and count as work experience, not coursework.
export const coursework = [
  {
    term: "Fall 2026",
    courses: [
      {  code: "CS4535", name: "Professional Practicum Capstone"},
      {  code: "CS3800", name: "Theory of Computation"},
      {  code: "MATH4025", name: "Applied Mathematics Capstone"},
      {  code: "MATH4570", name: "Matrix Methods in Data Analysis and Machine Learning"},
    ]
  },
  {
    term: "Summer 2026",
    courses: [
      { 
        code: "Internship", 
        name: "Software Engineer Intern @ Chewy",
        type: "intern",
      }
    ],
  },
  {
    term: "Spring 2026",
    courses: [
      {
        code: "Co-op",
        name: "AI-CARING Research Assistant @ NEU",
        type: "coop",
      },
    ],
  },
  {
    term: "Fall 2025",
    courses: [
      { code: "CS3000", name: "Algorithms & Data" },
      { code: "DS3000", name: "Foundations of Data Science" },
      { code: "MATH4545", name: "Fourier Series and PDEs" },
      { code: "MATH3181", name: "Advanced Probability and Statistics" },
    ],
  },
  {
    term: "Summer 2025",
    courses: [
      { code: "CS3500", name: "Object-Oriented Design" },
      { code: "MATH3527", name: "Number Theory 1" },
      { code: "MATH2331", name: "Linear Algebra" },
    ],
  },
  {
    term: "Spring 2025",
    courses: [
      { code: "CS2510", name: "Computer Science 2" },
      { code: "MATH2341", name: "Differential Equations and Linear Algebra" },
      { code: "CS2800", name: "Logic and Computation" },
    ],
  },
  {
    term: "Fall 2024",
    courses: [
      { code: "CS2500", name: "Computer Science 1" },
      { code: "CS1800", name: "Discrete Structures" },
      { code: "MATH2321", name: "Calculus 3 for Science and Engineering" },
    ],
  },
];

/** Co-ops and internships are work terms, not classes. */
export const isWorkTerm = (course) =>
  course.type === "coop" || course.type === "intern";

const allEntries = coursework.flatMap((term) => term.courses);

// Derived so the profile stat tiles can never drift out of sync with the list above.
export const courseCount = allEntries.filter(
  (entry) => !isWorkTerm(entry)
).length;

export const workTermCount = allEntries.filter(isWorkTerm).length;

/**
 * Northeastern academic years run Fall → Summer, so Fall 2025, Spring 2026,
 * and Summer 2026 all belong to AY 2025–26.
 */
function academicYear(term) {
  const [season, year] = term.split(" ");
  const start = season === "Fall" ? Number(year) : Number(year) - 1;
  return `${start}–${String(start + 1).slice(2)}`;
}

/**
 * Groups terms by academic year, preserving the newest-first order above.
 * Grouping is what keeps the section from reading as a ragged card wall.
 */
export const courseworkByYear = coursework.reduce((groups, term) => {
  const year = academicYear(term.term);
  const group = groups.find((candidate) => candidate.year === year);
  const entry = { ...term };

  if (group) {
    group.terms.push(entry);
  } else {
    groups.push({ year, terms: [entry] });
  }
  return groups;
}, []);
