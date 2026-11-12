import { connection } from "next/server";
import { setGymDays, togglePlanTask } from "@/app/actions";
import { CheckItem } from "@/components/check-item";
import { currentWeek, getSettings } from "@/lib/data";
import { SHORT_DAYS, shortDate, todayIso, weekStartOf } from "@/lib/dates";
import { prisma } from "@/lib/prisma";

export default async function PlanPage() {
  await connection();
  const settings = await getSettings();
  const now = currentWeek(settings, todayIso());
  const months = await prisma.planMonth.findMany({
    orderBy: { order: "asc" },
    include: { weeks: { orderBy: { number: "asc" }, include: { tasks: { orderBy: { order: "asc" } } } } },
  });

  return (
    <>
      <section className="panel flex flex-col gap-2">
        <h3 className="font-semibold">Settings</h3>
        <p className="text-sm text-[var(--muted)]">
          Started on {shortDate(settings.startIso)} · Review day {shortDate(settings.reviewIso)} {settings.reviewIso.slice(0, 4)}. No plan changes before that date.
        </p>
        <form action={setGymDays} className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium">Gym days (19:00):</span>
          {[1, 2, 3, 4, 5, 6, 0].map((d) => (
            <label key={d} className="flex items-center gap-1.5 rounded-lg border border-[var(--line)] px-2.5 py-1 text-sm">
              <input type="checkbox" name="gym" value={d} defaultChecked={settings.gymDays.includes(d)} className="accent-[var(--accent)]" />
              {SHORT_DAYS[d]}
            </label>
          ))}
          <button className="btn" type="submit">Save</button>
        </form>
      </section>

      {months.map((m) => {
        const tasks = m.weeks.flatMap((w) => w.tasks);
        const done = tasks.filter((t) => t.done).length;
        return (
          <section key={m.id} className="panel flex flex-col gap-3">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <div className="eyebrow">Month {m.order}</div>
                <h3 className="font-semibold">{m.title}</h3>
              </div>
              <span className="font-mono text-sm text-[var(--muted)]">{done} / {tasks.length}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[var(--line)]">
              <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${tasks.length ? Math.round((100 * done) / tasks.length) : 0}%` }} />
            </div>
            <p className="text-sm text-[var(--muted)]"><b className="text-[var(--ink)]">End-of-month target:</b> {m.target}</p>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {m.weeks.map((w) => (
                <div key={w.number} className={`flex flex-col gap-2 rounded-lg border p-3 ${w.number === now ? "border-[var(--accent)] shadow-[inset_3px_0_0_var(--accent)]" : "border-[var(--line)]"}`}>
                  <div className="flex items-baseline justify-between gap-2">
                    <b>Week {w.number}{w.number === now && <span className="ml-2 rounded-full bg-[var(--accent-soft)] px-2 py-0.5 text-xs">now</span>}</b>
                    <span className="font-mono text-xs text-[var(--muted)]">{shortDate(weekStartOf(settings.startIso, w.number))}</span>
                  </div>
                  <ul className="flex flex-col gap-2">
                    {w.tasks.map((t) => (
                      <li key={t.id}>
                        <CheckItem id={`plan-${t.id}`} checked={t.done} onToggle={togglePlanTask.bind(null, t.id)}>{t.text}</CheckItem>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </>
  );
}
