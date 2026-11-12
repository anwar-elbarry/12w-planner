# 12w Planner

A personal planner for a 3-month career plan: daily work blocks, job-application tracking, weekly reviews and a "Later" list for ideas that must wait.

I built it because I kept changing my plan every two weeks. This app holds one plan until a fixed review day, and counts what I actually do: applications sent, replies, blocks completed.

## Features

- **Today:** the day's blocks (Build, Applications, French, Learn, Gym…) with checkboxes, an application/reply counter and daily notes. Missed-day reminders ("don't miss two in a row").
- **Week:** a 7-day strip, weekly totals, the plan tasks for that week, 3 weekly goals and the Sunday review.
- **3 months:** the full plan (14 weeks, 3 months) with progress per month, and gym-day settings.
- **Rules & Later:** the rules that protect the plan, and a parking list for new ideas.

## Stack

- Next.js 16 (App Router, Server Components, Server Actions), React 19, TypeScript
- PostgreSQL with Prisma 7 (`@prisma/adapter-pg`)
- Tailwind CSS 4

## Run it locally

```bash
cp .env.example .env
docker compose up -d
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

Then open http://localhost:3000.

The seed is safe to run again: it never deletes what you ticked.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build and server |
| `npm run lint` / `npm run typecheck` | Checks |
| `npm run db:migrate` | Create and apply a migration (development) |
| `npm run db:deploy` | Apply migrations (production) |
| `npm run db:seed` | Load the settings and the 3-month plan |

## Status

Version 1 is single-user and **has no login yet**, so run it locally only. Next steps:

1. Authentication (needed before any public deployment)
2. Edit the plan from the UI (today it comes from `src/lib/plan-content.ts`)
3. Charts: applications per week, reply rate
4. Deployment
