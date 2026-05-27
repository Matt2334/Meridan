# Meridian

> Turn spare time into intelligence.

Meridian is a time-calibrated learning platform that generates curated reading 
sessions based on how much time you have and what you want to learn. 
Select 5, 10, 30, or 60 minutes, choose a topic, and get a precisely 
fitted session of open-access content with key insights and conversation 
starters at the end.

**Live site:** [meridan-two.vercel.app](https://meridan-two.vercel.app)

---

## Tech Stack

**Frontend**
- Next.js 14 (App Router)
- React.js
- Styled Components
- Deployed on Vercel

**Backend**
- Node.js + Express
- Prisma ORM 7
- PostgreSQL (Supabase)
- JWT authentication via httpOnly cookies
- Deployed on Render

---

## Features

- Time-calibrated session generation across 8 topics
- JWT authentication with secure httpOnly cookies
- Session history per user
- Skeleton loading states
- Cross-origin cookie handling between separate frontend/backend deployments
- Content deduplication — previously seen content is excluded from new sessions
- Fallback pool when all content for a topic has been seen
- Rate Limiter for both general and authentication APIs


---

## Architecture
The frontend and backend are separately deployed services. Cross-site cookies 
are handled via `SameSite: None; Secure` in production and a CORS policy 
locked to the frontend origin.

\```
Next.js (Vercel)
      ↓ REST API
Express + Prisma (Render)
      ↓
PostgreSQL (Supabase)
\```

### Session Generation Algorithm

1. Fetch all content IDs the user has previously seen
2. Query content matching the selected topic and fitting within the time window
3. Shuffle the pool to ensure variety across sessions
4. Greedily select items until the time budget is exhausted
5. Fall back to the full content pool if the user has seen everything

---

## Running Locally

**Prerequisites:** Node.js, PostgreSQL or a Supabase project

**Backend**
```bash
cd backend
npm install
cp .env.example .env  # fill in your values
npx prisma generate
npx prisma migrate dev
npm run dev
```

**Frontend**
```bash
cd frontend
npm install
cp .env.example .env.local  # fill in your values
npm run dev
```

**Environment variables**

Backend `.env`:
\```
DATABASE_URL=
PORT=
ORIGIN=
JWT_SECRET=
\```

Frontend `.env.local`:
\```
NEXT_PUBLIC_API_URL=
\``


---

## Interesting Problems Solved

- **Prisma 7 migration** — navigated a breaking change with minimal community 
  documentation, moving database config from `schema.prisma` to `prisma.config.ts`
  and adopting the new driver adapter pattern

- **Cross-site cookies in production** — frontend on Vercel and backend on Render 
  required `SameSite: None; Secure` with explicit CORS credentials configuration 
  to share authentication state across domains

- **IPv6 incompatibility on Render** — Render's free tier doesn't support IPv6, 
  requiring the Supabase Supavisor pooled connection string with `?pgbouncer=true`

---

## Content Sources

All content is open-access and legally linkable