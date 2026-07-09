# Meridan

> Turn spare time into intelligence.

Meridan is a time-calibrated learning platform that generates curated reading 
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

- Time-calibrated session generation across 8 topics with content deduplication
- JWT authentication with secure httpOnly cookies and cross-origin cookie handling
- AI-generated session summaries and key takeaways powered by Gemini
- AI-powered cross-session connection generation with strength scoring
- Interactive knowledge graph visualizing learning connections across sessions
- Session history with pagination
- Redis caching for session history, bookmarks, and user profiles
- Skeleton loading states
- Rate limiting on general and authentication endpoints
- Fallback content pool when all topic content has been seen


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
      ↓
Redis Cache (upstash)
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
GEMINI_API_KEY =
REDIS_URL=
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

- **Knowledge graph with AI connections** — implemented a node-based
  constellation graph using React Flow where sessions are connected 
  by AI-generated conceptual relationships scored by strength, 
  requiring a custom edge component with hover tooltips and a 
  force-directed radial layout

- **Redis caching layer** — added Redis for session history, bookmarks,
  and user profiles with cache invalidation on write operations and 
  pattern-based deletion for paginated data

- **TypeScript migration** — incrementally migrated the Express backend 
  from JavaScript to TypeScript, adding typed request/response interfaces,
  controller generics, and a shared types barrel file

---

## Content Sources

All content is open-access and legally linkable