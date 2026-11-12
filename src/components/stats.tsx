import { currentWeek, getTotals, getWeekTotals, type PlanSettings } from "@/lib/data";
import { daysBetween } from "@/lib/dates";

export async function Stats({ settings, todayIso }: { settings: PlanSettings; todayIso: string }) {
  const week = currentWeek(settings, todayIso);
  const [thisWeek, totals] = await Promise.all([
    getWeekTotals(settings, Math.min(settings.totalWeeks, Math.max(1, week))),
    getTotals(),
  ]);
  const left = daysBetween(todayIso, settings.reviewIso);

  const items = [
    { label: "Week", value: week < 1 ? "Not started" : week > settings.totalWeeks ? "Done" : `${week} / ${settings.totalWeeks}` },
    { label: "Applications this week", value: `${thisWeek.applications} / ${settings.appsTargetWeek}` },
    { label: "Applications · replies (total)", value: `${totals.applications} · ${totals.replies}` },
    { label: "Review day", value: left > 0 ? `in ${left} days` : left === 0 ? "today" : "passed" },
  ];

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {items.map((s) => (
        <div key={s.label} className="panel flex flex-col gap-1 !p-3">
          <span className="eyebrow">{s.label}</span>
          <span className="font-mono text-lg font-semibold tabular-nums">{s.value}</span>
        </div>
      ))}
    </div>
  );
}
