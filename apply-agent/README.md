# Local Apply Agent

This is a local Node.js and Playwright worker that polls the private portfolio API for pending applications, opens the job application URL in Chromium, fills common fields, uploads the tailored CV PDF, pastes the cover letter, and pauses before submission.

It is deliberately conservative. It does not bypass CAPTCHAs, does not hide the browser by default, and asks before clicking submit.

## Setup

```bash
cd apply-agent
npm install
npx playwright install chromium
cp .env.example .env
```

Edit `.env`:

```text
PORTFOLIO_URL="https://yourname.vercel.app"
PORTFOLIO_API_KEY="same-value-as-COPILOT_ACCESS_KEY"
HEADLESS=false
CONFIRM_BEFORE_SUBMIT=true
POLL_INTERVAL_SECONDS=30
```

## First-Time Login Setup

The agent uses Playwright persistent Chromium data in `user-profiles/`. On the first run, log in manually to job boards or ATS systems when the browser opens. Later runs reuse those sessions.

## Run

```bash
npm run dev
```

For production-style use:

```bash
npm run build
npm start
```

You can run it under PM2:

```bash
pm2 start npm --name apply-agent -- start
```

## Safety

- Keep `HEADLESS=false` while testing.
- Keep `CONFIRM_BEFORE_SUBMIT=true`.
- The agent pauses before submission and waits for Enter. Press Esc or `s` to skip.
- Screenshots are saved in `screenshots/`.
- Downloaded tailored CV PDFs are saved in `downloads/`.
- If a CAPTCHA, login wall, or unexpected flow appears, solve it manually or skip.

