import { StrictMode, useRef, useState } from "react";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import ProjectDetail from "./ProjectDetail";
import Projects from "./Projects";
import { projects } from "../data/projects";

// These tests exercise the content and interaction paths without scroll animation.
vi.mock("../lib/gsap", () => ({
  gsap: {},
  motion: {},
  SplitText: {},
  useGSAP: () => {},
  prefersReducedMotion: () => true,
}));

const originalShowModal = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, "showModal");
const originalClose = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, "close");

beforeAll(() => {
  // jsdom does not implement the native dialog lifecycle. Focus containment is
  // verified in a browser; here we model its open state and close event only.
  Object.defineProperties(HTMLDialogElement.prototype, {
    showModal: { configurable: true, value() { this.setAttribute("open", ""); } },
    close: { configurable: true, value() { this.removeAttribute("open"); this.dispatchEvent(new Event("close")); } },
  });
});

afterEach(() => {
  cleanup();
  document.body.style.overflow = "";
  vi.restoreAllMocks();
});

afterAll(() => {
  for (const [name, descriptor] of [["showModal", originalShowModal], ["close", originalClose]]) {
    if (descriptor) Object.defineProperty(HTMLDialogElement.prototype, name, descriptor);
    else delete HTMLDialogElement.prototype[name];
  }
});

const galleryProject = {
  id: "gallery",
  title: "Gallery project",
  blurb: "A compact card summary.",
  images: [
    { src: "/overview.png", alt: "Project overview", caption: "The overview screen." },
    { src: "/editor.png", alt: "Project editor", caption: "Editing a project." },
    { src: "/results.png", alt: "Project results" },
  ],
};

function OpenProject({ project = galleryProject }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  return (
    <>
      <button ref={triggerRef} onClick={() => setOpen(true)}>Open project</button>
      {open && <ProjectDetail project={project} onClose={() => setOpen(false)} returnFocusRef={triggerRef} />}
    </>
  );
}

describe("ProjectDetail", () => {
  it("keeps a project without images or optional metadata usable", () => {
    render(<ProjectDetail project={{ title: "Work in progress", blurb: "A project without screenshots." }} onClose={vi.fn()} />);

    expect(screen.getByRole("dialog", { name: "Work in progress" })).toBeVisible();
    expect(screen.getByRole("img", { name: "Work in progress: no image yet" })).toBeVisible();
    expect(screen.getByText("A project without screenshots.")).toBeVisible();
    expect(screen.queryByRole("button", { name: /image/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Technologies" })).not.toBeInTheDocument();
  });

  it("shows a single image and its original without redundant gallery navigation", () => {
    render(<ProjectDetail project={{ ...galleryProject, images: [galleryProject.images[0]] }} onClose={vi.fn()} />);

    expect(screen.getByRole("img", { name: "Project overview" })).toHaveAttribute("src", "/overview.png");
    expect(screen.getByRole("status")).toHaveTextContent("1 / 1");
    expect(screen.getByText("The overview screen.")).toBeVisible();
    const original = screen.getByRole("link", { name: /Open full-size image/ });
    expect(original).toHaveAttribute("href", "/overview.png");
    expect(original).toHaveAttribute("target", "_blank");
    expect(original).toHaveAttribute("rel", "noopener noreferrer");
    expect(screen.queryByRole("button", { name: "Next image" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Previous image" })).not.toBeInTheDocument();
    expect(screen.queryByRole("group", { name: "Choose an image" })).not.toBeInTheDocument();
  });

  it("synchronizes the image, caption, counter, thumbnails and original through every navigation path", () => {
    render(<ProjectDetail project={galleryProject} onClose={vi.fn()} />);
    const gallery = screen.getByRole("region", { name: "Gallery project images" });
    const firstThumbnail = screen.getByRole("button", { name: "Show image 1: Project overview" });
    const secondThumbnail = screen.getByRole("button", { name: "Show image 2: Project editor" });

    expect(firstThumbnail).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(screen.getByRole("button", { name: "Next image" }));
    expect(within(gallery).getByRole("img", { name: "Project editor" })).toHaveAttribute("src", "/editor.png");
    expect(screen.getByRole("status")).toHaveTextContent("2 / 3");
    expect(screen.getByText("Editing a project.")).toBeVisible();
    expect(screen.queryByText("The overview screen.")).not.toBeInTheDocument();
    expect(secondThumbnail).toHaveAttribute("aria-pressed", "true");
    expect(firstThumbnail).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("link", { name: /Open full-size image/ })).toHaveAttribute("href", "/editor.png");

    fireEvent.keyDown(secondThumbnail, { key: "ArrowRight" });
    expect(screen.getByRole("img", { name: "Project results" })).toBeVisible();
    expect(screen.queryByText("Editing a project.")).not.toBeInTheDocument();
    fireEvent.keyDown(secondThumbnail, { key: "ArrowRight" });
    expect(screen.getByRole("status")).toHaveTextContent("1 / 3");
    fireEvent.click(screen.getByRole("button", { name: "Previous image" }));
    expect(screen.getByRole("status")).toHaveTextContent("3 / 3");
    fireEvent.keyDown(secondThumbnail, { key: "ArrowLeft" });
    expect(screen.getByRole("status")).toHaveTextContent("2 / 3");
    fireEvent.click(firstThumbnail);
    expect(screen.getByRole("status")).toHaveTextContent("1 / 3");
    expect(screen.getByRole("img", { name: "Project overview" })).toBeVisible();
  });

  it("recovers when moving from an unavailable image to another gallery image", () => {
    render(<ProjectDetail project={galleryProject} onClose={vi.fn()} />);
    fireEvent.error(screen.getByRole("img", { name: "Project overview" }));
    expect(screen.getByRole("img", { name: "Gallery project: image unavailable" })).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: "Next image" }));
    expect(screen.getByRole("img", { name: "Project editor" })).toHaveAttribute("src", "/editor.png");
    expect(screen.queryByText("Image unavailable")).not.toBeInTheDocument();
  });

  it("displays the full story, arbitrary sections and optional project links", () => {
    const longParagraph = "A detailed explanation of the implementation and its tradeoffs. ".repeat(25).trim();
    render(<ProjectDetail project={{
      ...galleryProject,
      category: ["Web", "Coursework"],
      course: "Software Design",
      description: "The full project description.",
      highlights: ["A complete highlight.", "A second accomplishment."],
      sections: [
        { title: "How it works", paragraphs: [longParagraph, "Another paragraph."], bullets: ["A design decision."] },
        { title: "Lessons learned", paragraphs: ["What I would improve next."] },
      ],
      technologies: ["React", "PostgreSQL"],
      github: "https://github.com/example/project",
      liveUrl: "https://example.com/project",
    }} onClose={vi.fn()} />);

    expect(screen.getByText("Web / Coursework")).toBeVisible();
    expect(screen.getByText("Software Design")).toBeVisible();
    expect(screen.getByText("The full project description.")).toBeVisible();
    expect(screen.queryByText(galleryProject.blurb)).not.toBeInTheDocument();
    expect(screen.getByText(longParagraph)).toBeVisible();
    expect(screen.getByRole("heading", { name: "How it works" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "Lessons learned" })).toBeVisible();
    for (const text of ["A complete highlight.", "A second accomplishment.", "Another paragraph.", "A design decision.", "What I would improve next.", "React", "PostgreSQL"]) {
      expect(screen.getByText(text)).toBeVisible();
    }
    expect(screen.getByRole("link", { name: /View repository/ })).toHaveAttribute("href", "https://github.com/example/project");
    expect(screen.getByRole("link", { name: /Visit project/ })).toHaveAttribute("href", "https://example.com/project");
  });

  it("supports existing projectImage data with a descriptive fallback alternative", () => {
    render(<ProjectDetail project={{ title: "Older project", projectImage: "/legacy.png" }} onClose={vi.fn()} />);
    expect(screen.getByRole("img", { name: "Older project screenshot" })).toHaveAttribute("src", "/legacy.png");
    expect(screen.getByRole("status")).toHaveTextContent("1 / 1");
  });

  it.each(["Close project", "Back to projects", "Escape"])("restores scrolling and focus after %s, including under StrictMode", (action) => {
    document.body.style.overflow = "scroll";
    render(<StrictMode><OpenProject /></StrictMode>);
    const trigger = screen.getByRole("button", { name: "Open project" });
    trigger.focus();
    fireEvent.click(trigger);

    const dialog = screen.getByRole("dialog", { name: "Gallery project" });
    expect(dialog).toHaveAttribute("open");
    expect(screen.getByRole("button", { name: "Back to projects" })).toHaveFocus();
    expect(document.body.style.overflow).toBe("hidden");

    if (action === "Escape") {
      const cancel = new Event("cancel", { cancelable: true });
      fireEvent(dialog, cancel);
      expect(cancel.defaultPrevented).toBe(true);
    } else {
      fireEvent.click(screen.getByRole("button", { name: action }));
    }
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe("scroll");
    expect(trigger).toHaveFocus();
  });

  it("dismisses only clicks outside the dialog bounds", () => {
    render(<OpenProject />);
    const trigger = screen.getByRole("button", { name: "Open project" });
    fireEvent.click(trigger);
    const dialog = screen.getByRole("dialog", { name: "Gallery project" });
    vi.spyOn(dialog, "getBoundingClientRect").mockReturnValue({ left: 100, right: 700, top: 100, bottom: 800 });

    fireEvent.click(screen.getByRole("heading", { name: "Gallery project" }));
    fireEvent.click(dialog, { clientX: 200, clientY: 200 });
    expect(dialog).toBeVisible();
    fireEvent.click(dialog, { clientX: 20, clientY: 200 });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});

describe("Projects integration", () => {
  it("keeps the category filter and originating card when opening, closing and reopening a project", () => {
    render(<Projects />);
    const filters = screen.getByRole("group", { name: "Filter projects by category" });
    const webFilter = within(filters).getByRole("button", { name: /^Web/ });
    fireEvent.click(webFilter);
    expect(webFilter).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("status")).toHaveTextContent(`${projects.filter((project) => project.category.includes("Web")).length} projects shown`);

    const trigger = screen.getByRole("button", { name: "View The Invasion" });
    fireEvent.click(trigger);
    expect(screen.getByRole("dialog", { name: "The Invasion" })).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Back to projects" }));
    expect(trigger).toHaveFocus();
    expect(webFilter).toHaveAttribute("aria-pressed", "true");

    const titleTrigger = screen.getByRole("button", { name: "NEU Bookstore Web App" });
    fireEvent.click(titleTrigger);
    expect(screen.getByRole("dialog", { name: "NEU Bookstore Web App" })).toBeVisible();
    expect(within(screen.getByRole("dialog")).getByRole("status")).toHaveTextContent("1 / 1");
    fireEvent.click(screen.getByRole("button", { name: "Close project" }));
    expect(titleTrigger).toHaveFocus();
  });
});
