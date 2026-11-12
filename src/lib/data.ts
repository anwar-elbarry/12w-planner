import "server-only";
import { prisma } from "./prisma";
import { blocksFor, isBlockDone } from "./blocks";
import { addDays, toDate, toIso, weekNumberOf, weekStartOf } from "./dates";

export type PlanSettings = {
  startIso: string;
  reviewIso: string;
  gymDays: number[];
  appsTargetDay: number;
  appsTargetWeek: number;
  totalWeeks: number;
};

export async function getSettings(): Promise<PlanSettings> {
  const [s, totalWeeks] = await Promise.all([prisma.settings.findUnique({ where: { id: 1 } }), prisma.planWeek.count()]);
  if (!s) throw new Error("No settings found. Run `npm run db:seed` first (see README).");
  return {
    startIso: toIso(s.startDate),
    reviewIso: toIso(s.reviewDate),
    gymDays: s.gymDays,
    appsTargetDay: s.appsTargetDay,
    appsTargetWeek: s.appsTargetWeek,
    totalWeeks,
  };
}

export async function getDay(iso: string) {
  const day = await prisma.dayLog.findUnique({ where: { date: toDate(iso) }, include: { checks: true } });
  return {
    applications: day?.applications ?? 0,
    replies: day?.replies ?? 0,
    note: day?.note ?? "",
    checked: new Set(day?.checks.map((c) => c.blockId) ?? []),
  };
}

/** Done / total blocks for each day in [fromIso, fromIso + days). */
export async function getScores(settings: PlanSettings, fromIso: string, days: number) {
  const logs = await prisma.dayLog.findMany({
    where: { date: { gte: toDate(fromIso), lt: toDate(addDays(fromIso, days)) } },
    include: { checks: true },
  });
  const byDay = new Map(logs.map((l) => [toIso(l.date), l]));
  return Array.from({ length: days }, (_, i) => {
    const iso = addDays(fromIso, i);
    const log = byDay.get(iso);
    const checked = new Set(log?.checks.map((c) => c.blockId) ?? []);
    const blocks = blocksFor(iso, settings.gymDays, settings.reviewIso);
    const done = blocks.filter((b) => isBlockDone(b, checked, log?.applications ?? 0, settings.appsTargetDay)).length;
    return { iso, done, total: blocks.length, applications: log?.applications ?? 0, replies: log?.replies ?? 0 };
  });
}

export async function getWeekTotals(settings: PlanSettings, week: number) {
  const from = toDate(weekStartOf(settings.startIso, week));
  const to = toDate(weekStartOf(settings.startIso, week + 1));
  const agg = await prisma.dayLog.aggregate({
    where: { date: { gte: from, lt: to } },
    _sum: { applications: true, replies: true },
  });
  return { applications: agg._sum.applications ?? 0, replies: agg._sum.replies ?? 0 };
}

export async function getTotals() {
  const agg = await prisma.dayLog.aggregate({ _sum: { applications: true, replies: true } });
  return { applications: agg._sum.applications ?? 0, replies: agg._sum.replies ?? 0 };
}

export function clampWeek(settings: PlanSettings, week: number) {
  return Math.min(settings.totalWeeks, Math.max(1, week));
}

export function currentWeek(settings: PlanSettings, todayIso: string) {
  return weekNumberOf(settings.startIso, todayIso);
}
