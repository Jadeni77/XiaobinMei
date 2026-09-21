# Xiaobin (Jaden) Mei - Portfolio Website

Hi👋, this is Xiaobin Mei. Feel free to call me Jaden if you can't pronounce my first name. The repository you are looking at contains the source code for my personal portfolio website, where I showcase my experiences, projects, and skills. If you would like to know more about me, feel free to explore and connect with me!

## 🚀 Live Demo
[xiaobinmei.com](https://xiaobinmei.com)

## ⚙️ Setup
To run this project locally:
1. Install [Node.js](https://nodejs.org/en/download) 
2. Clone this repository
3. npm install
4. Start the development server: npm run dev

### Commands
| Command | What it does |
|---|---|
| `npm run dev` | Dev server at `http://localhost:5173/` |
| `npm test` | Unit tests (Vitest + jsdom) |
| `npm run lint` | ESLint |
| `npm run build` | Production build into `dist/` |
| `npm run deploy` | Builds, then publishes `dist/` to the `gh-pages` branch |

## 🛠️ Technology Used
* React.js - Frontend Framework
* Vite - Development/build tool
* GSAP - Scroll-linked and timeline animation
* Vitest + jsdom - Unit tests
* Github Pages - Hosting & deployment

## 📁 Project Structure

```
src/
  main.jsx              entry point; mounts App and loads the design tokens
  App.jsx               page shell: skip link, navbar, sections, footer
  data/                 all content. Editing the site is usually editing here
  components/           one folder-level file per section, plus shared pieces
  components/Journey/   the carousel: shell, card, backdrop, stats, input hook
  components_css/       one stylesheet per component
  styles/tokens.css     design tokens, reset, and shared primitives
  hooks/                useReveal (scroll-into-view), useActiveSection (nav)
  lib/gsap.js           registers GSAP plugins once; shared durations/eases
scripts/                browser verification, driven over CDP
```

### How it fits together

**Content lives in `src/data/`.** Adding a role, project, milestone, or course
is a data edit, not a component edit. `data/site.js` holds `navSections`, which
is the single source of truth for navigation — the navbar, the scroll-spy, and
the footer all derive from it.

**Styling is token-driven.** `styles/tokens.css` defines the palette, type
scale, spacing, and motion curves, plus light and dark values for each. Nothing
in `components_css/` should hard-code a hex value.

**Animation is split deliberately.** CSS owns hover states and section reveals,
which costs nothing and honours `prefers-reduced-motion` for free. GSAP owns
only what CSS cannot do: the scroll-scrubbed timeline rail, the per-character
hero name, and the masked section headings. Every GSAP block sits inside
`gsap.matchMedia("(prefers-reduced-motion: no-preference)")` so it self-reverts.

**Two registers, on purpose.** `Experience` is the third-person professional
record: metrics, technologies, skimmable bullets. `Journey` covers the same
years in the first person — what it felt like, with photos. Letting them blur is
what made the old About section redundant with the hero.

### Testing

Unit tests sit beside their source as `<name>.test.js(x)` and cover the parts
worth isolating: accent contrast ratios, data invariants, carousel index maths,
and hook behaviour.

`scripts/verify-journey.mjs` and `scripts/verify-experience.mjs` drive headless
Chrome over the DevTools Protocol for the things unit tests cannot reach —
scroll-linked animation, touch gestures, tab order, reduced motion. They use
real wall-clock timing because GSAP's requestAnimationFrame ticker does **not**
advance under Chrome's `--virtual-time-budget`, which silently freezes
animations and reports false failures. Usage is in each file's header.


## 🙏 Acknowledgement:
The website icon is from [Wikimedia Commons (no changes made beyond)](https://commons.wikimedia.org/wiki/File:WLA_icon_official_website.svg)
The technology and app icons are from [Icons](https://icon-icons.com/)

## 📜 License
This project is for personal/portfolio use. Please do not copy content without permission
