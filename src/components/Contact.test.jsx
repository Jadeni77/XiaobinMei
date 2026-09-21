import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import Contact from "./Contact";
import { site } from "../data/site";

/** FormSubmit sends the visitor back here only after a successful send. */
function returnFromSend() {
  window.history.replaceState({}, "", "/?sent=1#contact");
}

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
  beforeEach(() => {
    window.history.replaceState({}, "", "/");
  });

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

  it("retains hosted spam protection", () => {
    render(<Contact />);
    const form = screen.getByRole("form", { name: "Send a message" });
    const payload = new FormData(form);
    const honeypot = form.querySelector('[name="_honey"]');

    expect(payload.get("_captcha")).not.toBe("false");
    expect(payload.get("_honey")).toBe("");
    expect(honeypot).toHaveAttribute("tabindex", "-1");
    expect(honeypot.parentElement).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByText(/spam check on the next page/)).toBeInTheDocument();
  });

  it("returns the visitor to this site instead of the provider's page", () => {
    render(<Contact />);
    const payload = new FormData(
      screen.getByRole("form", { name: "Send a message" })
    );

    expect(payload.get("_next")).toBe(
      `${window.location.origin}/?sent=1#contact`
    );
  });

  it("confirms the send in place of the form when the visitor returns", () => {
    returnFromSend();
    render(<Contact />);

    expect(screen.getByRole("status")).toHaveTextContent(/message sent/i);
    expect(
      screen.queryByRole("form", { name: "Send a message" })
    ).not.toBeInTheDocument();
  });

  it("shows no confirmation on an ordinary visit", () => {
    render(<Contact />);

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(
      screen.getByRole("form", { name: "Send a message" })
    ).toBeInTheDocument();
  });

  it("clears the sent marker so a reload does not repeat the confirmation", () => {
    returnFromSend();
    render(<Contact />);

    expect(window.location.search).toBe("");
    expect(window.location.hash).toBe("#contact");
  });

  it("moves focus to the confirmation so it is announced on arrival", () => {
    returnFromSend();
    render(<Contact />);

    expect(screen.getByRole("status")).toHaveFocus();
  });

  it("restores an empty form when the visitor sends another message", () => {
    returnFromSend();
    render(<Contact />);

    fireEvent.click(screen.getByRole("button", { name: /send another/i }));

    expect(
      screen.getByRole("form", { name: "Send a message" })
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Your name")).toHaveValue("");
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
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
