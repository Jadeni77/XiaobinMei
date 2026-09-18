# Contact form

The Contact section sends visitors' names, email addresses, optional subjects,
and messages to **xmei59664@gmail.com** using
[FormSubmit](https://formsubmit.co/). This works with the existing static GitHub
Pages hosting; no server, account, API key, or new dependency is needed in this
repository.

## Required before treating email delivery as ready

Keep the contact-form pull request in draft until the recipient completes this
setup and a real message is confirmed in the inbox:

1. Open the contact form on the intended site or review preview and submit a
   short test message using an email address you control. The form navigates to
   FormSubmit, where you complete its spam check.
2. For a new form, FormSubmit emails the recipient an activation link. Open that
   email in **xmei59664@gmail.com** and confirm the form. Check spam if necessary.
   A successful browser submission alone does not prove inbox delivery or
   activation.
3. Submit a second test after activation. Confirm that the message reaches
   Gmail, all fields are present, and replying addresses the visitor's email.
4. Repeat the delivery check from `https://xiaobinmei.com` after deployment.
   If FormSubmit requests activation for that origin, complete it there too.

Automated tests do not send real emails or activate this service. Activation,
inbox delivery, and provider availability must be checked by the recipient.
Do not put Gmail credentials or any other secret into the frontend.

## Submission behavior

- The browser validates required fields and email format before a native HTTPS
  POST. The optional subject appears with the message body; the email's subject
  line is `New message from xiaobinmei.com`.
- FormSubmit handles the spam check, errors, and final confirmation on its own
  page. The portfolio does not show an unverified “sent” state.
- Default reCAPTCHA remains enabled. An additional hidden `_honey` field filters
  basic bots. Do not add `_captcha=false` or replace the action with an AJAX
  endpoint without reviewing the change to spam protection.
- The form explains that FormSubmit processes submissions and links its privacy
  policy. A direct email link remains available if the service is unavailable
  or a visitor prefers an email app.
- `site.personalEmail` in `src/data/site.js` controls both the form recipient and
  its direct email fallback. Changing the recipient requires activating the new
  destination and checking delivery again.

## Verification

Run `npm test`, `npm run lint`, and `npm run build`. Contact component tests
validate the named submission payload, required fields, email format, destination,
spam-protection configuration, and direct email alternative without making
network requests. Check `#contact` on desktop and mobile, light and dark modes,
and with keyboard navigation before publishing.

Provider references: [setup and activation](https://formsubmit.co/),
[supported fields and spam protection](https://formsubmit.co/documentation).
