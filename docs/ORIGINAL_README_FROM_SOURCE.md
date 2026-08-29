# Portfolio Copilot System

This repository contains a production-oriented personal portfolio and private AI job copilot built with Next.js 15, TypeScript, Prisma, PostgreSQL, Tailwind CSS, Framer Motion, React Three Fiber, research lab, and a separate Playwright local apply agent.

## Apps

- `app/`: public portfolio plus hidden `/copilot` dashboard.
- `prisma/`: database schema and seed data.
- `apply-agent/`: local browser automation service that polls the portfolio API and prepares applications.

## Quick Start

```bash
npm install
cp .env.example .env
npx prisma migrate dev
npm run prisma:seed
npm run dev
```

Open `http://localhost:3000`.

To access the hidden copilot, visit:

```text
http://localhost:3000/copilot?key=your-secret-passkey-here
```

The key sets a secure cookie and redirects to `/copilot` without exposing the key in the address bar.

## Deploy

1. Create a PostgreSQL database, such as Vercel Postgres.
2. Set the environment variables from `.env.example`.
3. Deploy the root app to Vercel.
4. Run `npx prisma migrate deploy`.
5. Run `npm run prisma:seed` once for starter project data.

## Local Apply Agent

See `apply-agent/README.md` for setup. The agent is intentionally conservative: it opens the application page, fills likely fields, uploads the generated CV, and pauses before submitting.



