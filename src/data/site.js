/**
 * Identity, contact details, and the section list.
 *
 * navSections is the single source of truth for site navigation: the navbar
 * renders it, the scroll-spy derives its target ids from it, and the footer
 * echoes it. Adding a section here wires all three.
 */
export const site = {
  name: "Xiaobin Mei",
  nickname: "Jaden",
  displayName: "Xiaobin (Jaden) Mei",
  role: "CS & Math Student @ Northeastern",
  location: "Boston, MA",
  github: "https://github.com/Jadeni77",
  linkedin: "https://www.linkedin.com/in/xiaobinmei/",
  personalEmail: "xmei59664@gmail.com",
  schoolEmail: "mei.xiaob@northeastern.edu",
};

// Names cycled by the hero typing animation.
export const heroNames = ["Xiaobin Mei", "Jaden Mei", "梅晓彬"];

export const navSections = [
  { id: "journey", label: "Journey" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
];
