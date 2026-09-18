import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Contact from "./Contact";
import { site } from "../data/site";

function fillRequiredFields() {
  fireEvent.change(screen.getByLabelText("Your name"), {
    target: { value: "Portfolio visitor" },
  });
  fireEvent.change(screen.getByLabelText("Your email"), {
    target: { value: "visitor@example.com" },
  });
  fireEvent.change(screen.getByLabelText("Your message"), {
    target: { value: "I'd like to discuss a collaboration." },
  });
}

describe("Contact", () => {
  it("requires a name, valid reply email, and message before submission", () => {
    render(<Contact />);
    const form = screen.getByRole("form", { name: "Send a message" });

    expect(form.checkValidity()).toBe(false);
    fillRequiredFields();
    expect(form.checkValidity()).toBe(true);

    fireEvent.change(screen.getByLabelText("Your email"), {
      target: { value: "not-an-email" },
    });
    expect(form.checkValidity()).toBe(false);
  });

  it("rejects whitespace-only names or messages and allows corrections", () => {
    render(<Contact />);
    fillRequiredFields();
    const form = screen.getByRole("form", { name: "Send a message" });
    const name = screen.getByLabelText("Your name");
    const message = screen.getByLabelText("Your message");

    fireEvent.input(name, { target: { value: "   " } });
    fireEvent.input(message, { target: { value: "\n  " } });
    expect(fireEvent.submit(form)).toBe(false);
    expect(name.validationMessage).toBe("Please enter your name.");
    expect(message.validationMessage).toBe("Please enter a message.");

    fireEvent.input(name, { target: { value: "Portfolio visitor" } });
    fireEvent.input(message, { target: { value: "Let's collaborate." } });
    expect(form.checkValidity()).toBe(true);
  });

  it("posts the visitor's fields to the owner's email with a usable Reply-To", () => {
    render(<Contact />);
    fillRequiredFields();
    fireEvent.change(screen.getByLabelText("Subject (optional)"), {
      target: { value: "Collaboration" },
    });

    const form = screen.getByRole("form", { name: "Send a message" });
    const payload = new FormData(form);

    expect(form).toHaveAttribute("method", "POST");
    expect(form).toHaveAttribute(
      "action",
      `https://formsubmit.co/${site.personalEmail}`
    );
    expect(payload.get("name")).toBe("Portfolio visitor");
    // FormSubmit uses the email field for Reply-To.
    expect(payload.get("email")).toBe("visitor@example.com");
    expect(payload.get("subject")).toBe("Collaboration");
    expect(payload.get("message")).toBe("I'd like to discuss a collaboration.");
    expect(payload.get("_subject")).toContain("xiaobinmei.com");
  });

  it("retains hosted spam protection and avoids a premature success redirect", () => {
    render(<Contact />);
    const form = screen.getByRole("form", { name: "Send a message" });
    const payload = new FormData(form);
    const honeypot = form.querySelector('[name="_honey"]');

    expect(payload.get("_captcha")).not.toBe("false");
    expect(payload.has("_next")).toBe(false);
    expect(payload.get("_honey")).toBe("");
    expect(honeypot).toHaveAttribute("tabindex", "-1");
    expect(honeypot.parentElement).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByText(/spam check on the next page/)).toBeInTheDocument();
  });

  it("offers direct email if the visitor cannot use the hosted form", () => {
    render(<Contact />);

    expect(screen.getByRole("link", { name: site.personalEmail })).toHaveAttribute(
      "href",
      `mailto:${site.personalEmail}`
    );
    expect(
      screen.getByRole("link", { name: /FormSubmit privacy policy/ })
    ).toHaveAttribute("href", "https://formsubmit.co/privacy.pdf");
  });
});
