import Link from "next/link";
import { connection } from "next/server";
import { changeCounter, saveNote, toggleBlock } from "@/app/actions";
import { CheckItem } from "@/components/check-item";
import { Stats } from "@/components/stats";
import { blocksFor, isBlockDone } from "@/lib/blocks";
import { getDay, getScores, getSettings } from "@/lib/data";
import { addDays, isoDay, niceDate, todayIso, weekNumberOf } from "@/lib/dates";

export default async function TodayPage({ searchParams }: { searchParams: Promise<{ date?: string }> }) {
  await connection();
  const today = todayIso();
  const date = isoDay((await searchParams).date) ?? today;
  const settings = await getSettings();
  const [day, recent] = await Promise.all([getDay(date), getScores(settings, addDays(today, -2), 2)]);

  const blocks = blocksFor(date, settings.gymDays, settings.reviewIso);
  const done = blocks.filter((b) => isBlockDone(b, day.checked, day.applications, settings.appsTargetDay)).length;
  const week = weekNumberOf(settings.startIso, date);
  const started = (iso: string) => iso >= settings.startIso;
  const missed = recent.filter((d) => started(d.iso) && d.done === 0).length;

  return (
    <>
      <Stats settings={settings} todayIso={today} />

      <div className="flex flex-wrap items-center gap-2">
        <Link className="btn" href={`/today?date=${addDays(date, -1)}`} aria-label="Previous day">‹</Link>
        <div className="min-w-0 flex-1">
          <div className="eyebrow">
            {date < settings.startIso ? "Before the start" : `Week ${week} of ${settings.totalWeeks}`}
            {date === today ? " · today" : ""}
          </div>
          <h2 className="text-xl font-semibold">{niceDate(date)}</h2>
        </div>
        <Link className="btn" href={`/today?date=${addDays(date, 1)}`} aria-label="Next day">›</Link>
        <Link className="btn" href="/today">Today</Link>
      </div>

      {date === today && missed === 2 && (
        <p className="rounded-lg border border-[var(--warn)] bg-[var(--warn-soft)] px-4 py-2">
          <strong className="text-[var(--warn)]">Two days missed.</strong> Start small today: 3 applications and 30 minutes of French.
        </p>
      )}
      {date === today && missed === 1 && recent[1].done === 0 && (
        <p className="rounded-lg border border-[var(--warn)] bg-[var(--warn-soft)] px-4 py-2">
          <strong className="text-[var(--warn)]">You missed yesterday.</strong> That&apos;s OK. Just don&apos;t miss two in a row.
        </p>
      )}

      <div className="flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--line)]">
          <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${Math.round((100 * done) / blocks.length)}%` }} />
        </div>
        <span className="font-mono text-sm text-[var(--muted)]">{done} of {blocks.length} done</span>
      </div>

      <ol className="panel !p-0">
        {blocks.map((b) => (
          <li key={b.id} className="grid grid-cols-1 gap-2 border-t border-[var(--line)] px-4 py-3 first:border-t-0 sm:grid-cols-[74px_1fr_auto] sm:gap-3">
            <span className="font-mono text-sm text-[var(--muted)]">{b.time}</span>
            {b.kind === "apps" ? (
              <>
                <div>
                  <div className="font-semibold">{b.title}</div>
                  <div className="text-sm text-[var(--muted)]">{b.detail}</div>
                </div>
                <div className="flex flex-wrap gap-4 sm:flex-col sm:items-end sm:gap-2">
                  <Counter date={date} field="applications" label="Sent" value={day.applications} suffix={`/${settings.appsTargetDay}`} />
                  <Counter date={date} field="replies" label="Replies" value={day.replies} />
                </div>
              </>
            ) : (
              <div className="sm:col-span-2">
                <CheckItem id={`blk-${b.id}`} checked={day.checked.has(b.id)} onToggle={toggleBlock.bind(null, date, b.id)}>
                  <span className="block font-semibold">{b.title}</span>
                  <span className="block text-sm text-[var(--muted)] no-underline">{b.detail}</span>
                </CheckItem>
              </div>
            )}
          </li>
        ))}
      </ol>

      <form action={saveNote} className="flex flex-col gap-2" key={`note-${date}`}>
        <input type="hidden" name="date" value={date} />
        <label htmlFor="note" className="text-sm font-medium">Notes for this day</label>
        <textarea id="note" name="note" defaultValue={day.note} rows={3} className="field" placeholder="What did you build? Where did you apply? What stressed you?" />
        <button className="btn btn-primary self-start" type="submit">Save note</button>
      </form>
    </>
  );
}

function Counter({ date, field, label, value, suffix = "" }: { date: string; field: string; label: string; value: number; suffix?: string }) {
  return (
    <form action={changeCounter} className="flex items-center gap-2">
      <input type="hidden" name="date" value={date} />
      <input type="hidden" name="field" value={field} />
      <span className="text-xs text-[var(--muted)]">{label}</span>
      <button className="btn !px-2" name="delta" value="-1" aria-label={`One less: ${label}`}>−</button>
      <span className="min-w-10 text-center font-mono font-semibold tabular-nums">{value}{suffix}</span>
      <button className="btn !px-2" name="delta" value="1" aria-label={`One more: ${label}`}>+</button>
    </form>
  );
}
