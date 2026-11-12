import { weekday } from "./dates";

export type Block = {
  id: string;
  time: string;
  title: string;
  detail: string;
  /** "apps" blocks are done when the application counter reaches the daily target. */
  kind?: "apps";
};

export const BLOCKS = {
  goals: { id: "goals", time: "08:30", title: "Set this week's 3 goals", detail: "Write them on the Week page." },
  build: { id: "build", time: "09:00", title: "Build · 3 h", detail: "A freelance project or a portfolio project: backend + design. Phone in another room." },
  apply: { id: "apply", time: "13:30", title: "Job applications · 3 to 5", detail: "Targeted: adapted CV + a short message. Start with companies that hire YouCode graduates.", kind: "apps" },
  french: { id: "french", time: "15:30", title: "French · 30 min", detail: "Interview French: your 2-minute intro, your projects, the 10 classic questions. Record yourself." },
  talk: { id: "talk", time: "Any time", title: "Speak French with a real person", detail: "A friend, a tutor or a language-exchange app. 15 minutes is enough." },
  learn: { id: "learn", time: "16:00", title: "Learn Java/Spring · 1.5 h", detail: "This week's topic is on the Week page. Read 30 min, code a small example, then explain it out loud in French in 2 minutes." },
  post: { id: "post", time: "17:30", title: "Post your story", detail: "One post about what you built or learned this week." },
  gym: { id: "gym", time: "19:00", title: "Gym", detail: "Your stress control. Not optional." },
  plan: { id: "plan", time: "Evening", title: "Write tomorrow's 3 tasks", detail: "10 minutes before bed. Sleep before midnight." },
  freelance: { id: "freelance", time: "10:00", title: "Freelance outreach", detail: "Follow up NIXEL's friends' projects, or show your work to 2–3 small businesses." },
  rest: { id: "rest", time: "All day", title: "Rest", detail: "No job sites, no code. Family, friends, nature." },
  review: { id: "review", time: "Evening", title: "Weekly review · 30 min", detail: "Count applications, replies and what you finished. Answer the questions on the Week page." },
} satisfies Record<string, Block>;

/** The blocks planned for a given day. */
export function blocksFor(iso: string, gymDays: number[], reviewIso: string): Block[] {
  if (iso === reviewIso) return [BLOCKS.review];
  const wd = weekday(iso);
  const gym = gymDays.includes(wd);
  if (wd === 0) return gym ? [BLOCKS.rest, BLOCKS.gym, BLOCKS.review] : [BLOCKS.rest, BLOCKS.review];
  if (wd === 6) return gym ? [BLOCKS.french, BLOCKS.freelance, BLOCKS.gym] : [BLOCKS.french, BLOCKS.freelance];

  const list: Block[] = [BLOCKS.build, BLOCKS.apply, BLOCKS.french];
  if (wd === 3) list.push(BLOCKS.talk);
  list.push(BLOCKS.learn);
  if (wd === 5) list.push(BLOCKS.post);
  if (gym) list.push(BLOCKS.gym);
  list.push(BLOCKS.plan);
  if (wd === 1) list.unshift(BLOCKS.goals);
  return list;
}

export function isBlockDone(block: Block, checked: Set<string>, applications: number, appsTarget: number) {
  return block.kind === "apps" ? applications >= appsTarget : checked.has(block.id);
}
