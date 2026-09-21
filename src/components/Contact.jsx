import { useEffect, useRef, useState } from "react";
import "../components_css/Contact.css";
import { site } from "../data/site";
import SectionHeader from "./SectionHeader";
import { ArrowRightIcon, MailIcon } from "./Icons";

/*
 * FormSubmit redirects to `_next` only after a submission succeeds, so finding
 * this marker in the URL is a receipt from the provider rather than an
 * optimistic guess made before the message left the browser.
 */
const SENT_MARKER = "sent";
const RETURN_URL = `/?${SENT_MARKER}=1#contact`;

function arrivedFromSend() {
  return new URLSearchParams(window.location.search).get(SENT_MARKER) === "1";
}

function clearTextError(event) {
  event.currentTarget.setCustomValidity("");
}

function validateMessage(event) {
  const form = event.currentTarget;
  for (const [name, label] of [["name", "your name"], ["message", "a message"]]) {
    const field = form.elements.namedItem(name);
    field.setCustomValidity(field.value.trim() ? "" : `Please enter ${label}.`);
  }
  if (!form.checkValidity()) {
    event.preventDefault();
    form.reportValidity();
  }
}

function Contact() {
  const [sent, setSent] = useState(arrivedFromSend);
  const confirmation = useRef(null);

  useEffect(() => {
    if (!sent) return;

    // Drop the marker so a reload doesn't replay a confirmation for a message
    // that was already sent.
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}${window.location.hash}`
    );
    // Focus both announces the result and brings the panel into view.
    confirmation.current?.focus();
  }, [sent]);

  return (
    <section id="contact" className="section contact" aria-label="Contact">
      <div className="container">
        <SectionHeader
          eyebrow="Get in touch"
          title="Let’s build something."
          subtitle="Have an opportunity, a project idea, or a question? I’d love to hear from you."
        />

        <div className="contact-grid">
          <div className="contact-intro">
            <h3>A conversation starts here.</h3>
            <p>
              I&apos;m open to internships, collaborations, and a good
              conversation about code or math. Tell me a little about what you
              have in mind, and leave an email where I can reach you.
            </p>
            <div className="contact-direct">
              <MailIcon width="22" height="22" />
              <div>
                <p>Prefer to email directly?</p>
                <a href={`mailto:${site.personalEmail}`}>
                  {site.personalEmail}
                </a>
              </div>
            </div>
          </div>

          {sent ? (
            <SentConfirmation
              panelRef={confirmation}
              onReset={() => setSent(false)}
            />
          ) : (
            <ContactForm />
          )}
        </div>
      </div>
    </section>
  );
}

function SentConfirmation({ panelRef, onReset }) {
  return (
    <div
      className="contact-confirmation card"
      role="status"
      tabIndex={-1}
      ref={panelRef}
    >
      <MailIcon width="28" height="28" />
      <h3>Message sent.</h3>
      <p>
        Thanks for reaching out — it&apos;s in my inbox now. I&apos;ll reply to
        the address you left, usually within a few days.
      </p>
      <button type="button" className="btn btn-secondary" onClick={onReset}>
        Send another message
      </button>
    </div>
  );
}

/* A native POST keeps FormSubmit's hosted CAPTCHA intact. No credentials or
   email-sending code run here. */
function ContactForm() {
  return (
    <form
      className="contact-form card"
      action={`https://formsubmit.co/${site.personalEmail}`}
      method="POST"
      onSubmit={validateMessage}
      aria-label="Send a message"
      aria-describedby="contact-required contact-delivery"
    >
      <p id="contact-required" className="contact-form-note">
        All fields are required except the subject.
      </p>

      <div className="contact-form-row">
        <div className="contact-field">
          <label htmlFor="contact-name">Your name</label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            maxLength={100}
            onInput={clearTextError}
            required
          />
        </div>
        <div className="contact-field">
          <label htmlFor="contact-email">Your email</label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            maxLength={254}
            required
          />
        </div>
      </div>

      <div className="contact-field">
        <label htmlFor="contact-subject">
          Subject <span>(optional)</span>
        </label>
        <input
          id="contact-subject"
          name="subject"
          type="text"
          maxLength={160}
          placeholder="What would you like to talk about?"
        />
      </div>

      <div className="contact-field">
        <label htmlFor="contact-message">Your message</label>
        <textarea
          id="contact-message"
          name="message"
          rows={6}
          maxLength={5000}
          onInput={clearTextError}
          required
          placeholder="A little context goes a long way."
        />
      </div>

      <input
        type="hidden"
        name="_subject"
        value="New message from xiaobinmei.com"
      />
      <input type="hidden" name="_template" value="table" />
      <input
        type="hidden"
        name="_next"
        value={`${window.location.origin}${RETURN_URL}`}
      />
      <div className="contact-honeypot" aria-hidden="true">
        <label htmlFor="contact-website">Leave this field empty</label>
        <input
          id="contact-website"
          type="text"
          name="_honey"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <p id="contact-delivery" className="contact-form-note">
        Your details are sent through{" "}
        <a
          href="https://formsubmit.co/privacy.pdf"
          target="_blank"
          rel="noopener noreferrer"
        >
          FormSubmit
          <span className="visually-hidden"> privacy policy (opens in a new tab)</span>
        </a>{" "}
        so I can reply. You&apos;ll complete a spam check on the next page, then
        come straight back here.
      </p>
      <button type="submit" className="btn btn-primary contact-submit">
        Send message
        <ArrowRightIcon className="btn-icon" />
      </button>
    </form>
  );
}

export default Contact;
