@AGENTS.md

# 12w Planner

Personal 3-month planner. Next.js 16 App Router + Prisma 7 + PostgreSQL + Tailwind 4.

## Layout
- `src/app/{today,week,plan,later}/page.tsx` — Server Components; each calls `await connection()` so it renders per request.
- `src/app/actions.ts` — all mutations (Server Actions). Validate every input there.
- `src/lib/blocks.ts` — daily block definitions and which blocks apply to which day (code, not DB).
- `src/lib/plan-content.ts` — the plan text and dates; loaded by `prisma/seed.ts`.
- `src/lib/dates.ts` — calendar dates as `YYYY-MM-DD` strings, UTC-based; "today" uses `Africa/Casablanca`.
- `src/lib/data.ts` — read queries (server-only).
- `prisma/schema.prisma` — the database. Prisma client is created with `@prisma/adapter-pg` in `src/lib/prisma.ts`.

## Commands
`npm run dev` · `npm run build` · `npm run lint` · `npm run typecheck` · `npm run db:migrate` · `npm run db:seed`
Local DB: `docker compose up -d`, `DATABASE_URL` from `.env.example`.

## Rules
- No login yet: never deploy publicly until authentication is added and checked inside every Server Action.
- Dates: store `@db.Date`, convert with `toDate()` / `toIso()`; never use local-time `Date` arithmetic.
- The seed must stay idempotent (upserts, no deletes).
- Colors come from the CSS variables in `src/app/globals.css` (light and dark).
