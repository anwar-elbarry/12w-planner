import Link from "next/link";
import { connection } from "next/server";
import { saveWeekReview, togglePlanTask } from "@/app/actions";
import { CheckItem } from "@/components/check-item";
import { clampWeek, currentWeek, getScores, getSettings, getWeekTotals } from "@/lib/data";
import { addDays, SHORT_DAYS, shortDate, todayIso, weekday, weekStartOf } from "@/lib/dates";
import { prisma } from "@/lib/prisma";

export default async function WeekPage({ searchParams }: { searchParams: Promise<{ w?: string }> }) {
  await connection();
  const today = todayIso();
  const settings = await getSettings();
  const requested = Number((await searchParams).w);
  const week = clampWeek(settings, Number.isInteger(requested) ? requested : currentWeek(settings, today));
  const start = weekStartOf(settings.startIso, week);

  const [planWeek, scores, totals] = await Promise.all([
    prisma.planWeek.findUnique({
      where: { number: week },
      include: { month: true, tasks: { orderBy: { order: "asc" } }, review: true },
    }),
    getScores(settings, start, 7),
    getWeekTotals(settings, week),
  ]);
  const review = planWeek?.review;
  const tasksDone = planWeek?.tasks.filter((t) => t.done).length ?? 0;

  return (
    <>
      <div className="flex items-center gap-2">
        {week > 1 ? <Link className="btn" href={`/week?w=${week - 1}`} aria-label="Previous week">‹</Link> : <span className="btn opacity-40">‹</span>}
        <div className="min-w-0 flex-1">
          <div className="eyebrow">Month {planWeek?.month.order} · {planWeek?.month.title}</div>
          <h2 className="text-xl font-semibold">Week {week} of {settings.totalWeeks}</h2>
          <p className="font-mono text-sm text-[var(--muted)]">{shortDate(start)} – {shortDate(addDays(start, 6))}</p>
        </div>
        {week < settings.totalWeeks ? <Link className="btn" href={`/week?w=${week + 1}`} aria-label="Next week">›</Link> : <span className="btn opacity-40">›</span>}
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {scores.map((d) => {
          const state =
            d.iso < settings.startIso ? "opacity-40" : d.iso > today ? "" : d.done === 0 ? "missed" : d.done === d.total ? "full" : "partial";
          const dot =
            state === "full" ? "bg-[var(--accent)]" : state === "partial" ? "bg-[var(--partial)]" : state === "missed" ? "border-2 border-[var(--warn)]" : "bg-[var(--line)]";
          return (
            <Link
              key={d.iso}
              href={`/today?date=${d.iso}`}
              aria-label={`${d.iso}: ${d.done} of ${d.total} done`}
              className={`panel flex flex-col items-center gap-1 !px-1 !py-2 ${d.iso === today ? "!border-[var(--ink)]" : ""} ${state === "opacity-40" ? "opacity-40" : ""}`}
            >
              <span className="eyebrow">{SHORT_DAYS[weekday(d.iso)]}</span>
              <span className="font-mono text-sm">{Number(d.iso.slice(8))}</span>
              <span className={`h-3 w-3 rounded-full ${dot}`} />
            </Link>
          );
        })}
      </div>

      <div className="panel flex flex-wrap gap-6">
        <Stat label="Applications" value={`${totals.applications} / ${settings.appsTargetWeek}`} />
        <Stat label="Replies" value={String(totals.replies)} />
        <Stat label="Plan tasks" value={`${tasksDone} / ${planWeek?.tasks.length ?? 0}`} />
      </div>

      <section className="panel flex flex-col gap-3">
        <h3 className="font-semibold">Plan for this week</h3>
        <ul className="flex flex-col gap-2">
          {planWeek?.tasks.map((t) => (
            <li key={t.id}>
              <CheckItem id={`task-${t.id}`} checked={t.done} onToggle={togglePlanTask.bind(null, t.id)}>{t.text}</CheckItem>
            </li>
          ))}
        </ul>
      </section>

      <form action={saveWeekReview} className="flex flex-col gap-5" key={`review-${week}`}>
        <input type="hidden" name="week" value={week} />
        <section className="panel flex flex-col gap-3">
          <h3 className="font-semibold">Your 3 goals <span className="text-sm font-normal text-[var(--muted)]">(set them on Monday)</span></h3>
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <input type="checkbox" name={`goal-done-${i}`} defaultChecked={review?.goalsDone[i] ?? false} aria-label={`Goal ${i + 1} done`} className="h-5 w-5 accent-[var(--accent)]" />
              <input name={`goal-${i}`} defaultValue={review?.goals[i] ?? ""} placeholder={`Goal ${i + 1}`} className="field" />
            </div>
          ))}
        </section>
        <section className="panel flex flex-col gap-3">
          <h3 className="font-semibold">Sunday review</h3>
          <Area name="finished" label="1. What did I finish this week?" value={review?.finished} />
          <p className="text-sm text-[var(--muted)]">2. Applications sent: {totals.applications} · replies: {totals.replies} (counted from your days)</p>
          <Area name="blocked" label="3. What blocked or stressed me?" value={review?.blocked} />
          <Area name="next" label="4. Next week's 3 goals" value={review?.next} />
        </section>
        <button className="btn btn-primary self-start" type="submit">Save goals and review</button>
      </form>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="eyebrow">{label}</span>
      <span className="font-mono text-lg font-semibold tabular-nums">{value}</span>
    </div>
  );
}

function Area({ name, label, value }: { name: string; label: string; value?: string }) {
  return (
    <label className="flex flex-col gap-1 text-sm font-medium" htmlFor={`rv-${name}`}>
      {label}
      <textarea id={`rv-${name}`} name={name} defaultValue={value ?? ""} rows={3} className="field font-normal" />
    </label>
  );
}
