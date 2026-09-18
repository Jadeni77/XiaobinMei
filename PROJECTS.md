# Editing projects

All portfolio content is in `src/data/projects.js`. Add, remove, or reorder project objects there; no component edits or website login are needed. The first image becomes the card cover. Selecting **View project** or the title opens the complete story and gallery. The existing category filters still apply.

## Project fields

- `id`: unique, stable identifier (required).
- `title`: project name (required).
- `blurb`: short card preview, displayed up to three lines.
- `description`: full introduction in the detail view. Newlines are preserved.
- `highlights`: optional list of achievements, rendered as bullets.
- `images`: ordered list of `{ src, alt, caption? }`. Import files from `src/assets/projectimage/` or use public HTTPS URLs. Include descriptive alt text; captions are optional. Add as many entries as you need. Removing all entries shows a neutral placeholder.
- `sections`: optional list of `{ title, paragraphs?, bullets? }` for architecture, lessons learned, or other longer content.
- `technologies`: optional list of technology names.
- `category`: list of categories. Add new filter labels to `projectCategories` too.
- `course`: optional course name.
- `github` and `liveUrl`: optional repository and live project links. Omit unavailable links.

The old `projectImage` field is still supported when `images` is omitted. Existing projects begin with their current screenshots; additional screenshots can be added without changing the UI.

## Example

```js
import Cover from "../assets/projectimage/project-cover.png";
import Gameplay from "../assets/projectimage/project-gameplay.png";

{
  id: 6,
  title: "My project",
  blurb: "A short overview for the card.",
  description: "The complete introduction for the detail view.",
  category: ["Web"],
  images: [
    { src: Cover, alt: "Main dashboard", caption: "An overview of the dashboard." },
    { src: Gameplay, alt: "Detail screen", caption: "A closer look at the interaction." },
  ],
  highlights: ["What I built.", "What I learned."],
  sections: [
    { title: "How it works", paragraphs: ["Explain the architecture here."], bullets: ["An important design choice."] },
  ],
  technologies: ["React"],
  github: "https://github.com/your-account/your-project",
  liveUrl: "https://your-project.example",
}
```

Use the previous/next buttons, thumbnails, or left/right arrow keys while focused in the gallery to browse images. **Open full-size image** opens the original in a separate tab. Escape, **Back to projects**, the close button, or clicking outside the dialog returns to the card. The page stays in place and keyboard focus returns to the opening control.
