import { connection } from "next/server";
import { addIdea, deleteIdea } from "@/app/actions";
import { shortDate, toIso } from "@/lib/dates";
import { prisma } from "@/lib/prisma";

const RULES = [
  ["No plan changes before the review day.", "When stress comes, park the idea below, talk about it if you want, and keep going."],
  ["Missing one day is OK.", "Never miss two in a row."],
  ["Depth over 5%.", "One direction, done well, builds confidence. Jumping between plans keeps you at 5% everywhere."],
  ["Do what depends on you every day:", "applications, building, French, learning. Send messages to others, then forget them; a reply is a bonus."],
  ["A decent job offer comes?", "Take it. The plan adapts. That means it worked."],
  ["Measure actions, not feelings.", "Count applications, replies, things built."],
];

export default async function LaterPage() {
  await connection();
  const ideas = await prisma.laterIdea.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <>
      <section className="panel flex flex-col gap-3">
        <h3 className="font-semibold">Rules that protect the plan</h3>
        <ol className="flex list-decimal flex-col gap-2 pl-5">
          {RULES.map(([title, text]) => (
            <li key={title}><b>{title}</b> {text}</li>
          ))}
        </ol>
      </section>

      <section className="panel flex flex-col gap-3">
        <h3 className="font-semibold">Later</h3>
        <p className="text-sm text-[var(--muted)]">Ideas paused until the review day: SaaS projects, Germany, a new Bac, scholarships, new languages.</p>
        <form action={addIdea} className="flex gap-2">
          <input name="text" aria-label="New idea" placeholder="e.g. Ausbildung in Germany, a new SaaS idea…" className="field" maxLength={300} />
          <button className="btn btn-primary whitespace-nowrap" type="submit">Park it</button>
        </form>
        {ideas.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">Nothing parked yet.</p>
        ) : (
          <ul className="flex flex-col">
            {ideas.map((idea) => (
              <li key={idea.id} className="flex items-start justify-between gap-3 border-t border-[var(--line)] py-2.5 first:border-t-0">
                <div className="min-w-0">
                  <div className="break-words">{idea.text}</div>
                  <div className="font-mono text-xs text-[var(--muted)]">Parked {shortDate(toIso(idea.createdAt))}</div>
                </div>
                <form action={deleteIdea}>
                  <input type="hidden" name="id" value={idea.id} />
                  <button className="btn" type="submit">Remove</button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
