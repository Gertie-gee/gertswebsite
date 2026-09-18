# Mazda 2 Rally form — email setup

This site is **static HTML** (no server). Registrations are sent with [Formspree](https://formspree.io) — free tier is enough to start.

## Steps

1. Create a free account at [formspree.io](https://formspree.io).
2. **New form** → set the notification email to **gertiegeyer@gmail.com**.
3. Copy your form endpoint (looks like `https://formspree.io/f/xxxxxxxx`).
4. The endpoint is set in **`baby-dog-studio.js`** as `RALLY_FORM_ENDPOINT` (currently `https://formspree.io/f/xljdeqdd`).

5. After any endpoint change, deploy to GitHub and submit a test entry from the live page to confirm email arrives.

Formspree may ask you to confirm your email address the first time.

## Privacy

Submissions go to Formspree, then to your inbox. Formspree’s privacy policy applies to data they store; see their dashboard for retention settings.

## Alternatives

- **Netlify Forms** — only if you host on Netlify.
- **Google Apps Script** — free, but more setup.

No Gmail password or API key belongs in this repository.
