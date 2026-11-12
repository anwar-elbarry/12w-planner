"use server";

// Version 1 is single-user and has no login: run it locally only.
// Before deploying it publicly, add authentication and check it in every action below.

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { isoDay, toDate } from "@/lib/dates";

function requireDay(value: unknown) {
  const iso = isoDay(typeof value === "string" ? value : undefined);
  if (!iso) throw new Error("Invalid date");
  return toDate(iso);
}

function refresh() {
  revalidatePath("/", "layout");
}

async function ensureDay(date: Date) {
  await prisma.dayLog.upsert({ where: { date }, update: {}, create: { date } });
}

export async function toggleBlock(dateIso: string, blockId: string, done: boolean) {
  const date = requireDay(dateIso);
  if (!/^[a-z]{2,20}$/.test(blockId)) throw new Error("Invalid block");
  await ensureDay(date);
  if (done) {
    await prisma.blockCheck.upsert({ where: { date_blockId: { date, blockId } }, update: {}, create: { date, blockId } });
  } else {
    await prisma.blockCheck.deleteMany({ where: { date, blockId } });
  }
  refresh();
}

export async function changeCounter(formData: FormData) {
  const date = requireDay(formData.get("date"));
  const field = formData.get("field");
  const delta = Number(formData.get("delta"));
  if ((field !== "applications" && field !== "replies") || (delta !== 1 && delta !== -1)) throw new Error("Invalid counter");
  const day = await prisma.dayLog.upsert({ where: { date }, update: {}, create: { date } });
  await prisma.dayLog.update({ where: { date }, data: { [field]: Math.max(0, day[field] + delta) } });
  refresh();
}

export async function saveNote(formData: FormData) {
  const date = requireDay(formData.get("date"));
  const note = String(formData.get("note") ?? "").slice(0, 5000);
  await prisma.dayLog.upsert({ where: { date }, update: { note }, create: { date, note } });
  refresh();
}

export async function togglePlanTask(id: number, done: boolean) {
  await prisma.planTask.update({ where: { id }, data: { done } });
  refresh();
}

export async function saveWeekReview(formData: FormData) {
  const weekNumber = Number(formData.get("week"));
  if (!Number.isInteger(weekNumber) || weekNumber < 1) throw new Error("Invalid week");
  const text = (name: string) => String(formData.get(name) ?? "").slice(0, 2000);
  const data = {
    goals: [0, 1, 2].map((i) => text(`goal-${i}`)),
    goalsDone: [0, 1, 2].map((i) => formData.get(`goal-done-${i}`) === "on"),
    finished: text("finished"),
    blocked: text("blocked"),
    next: text("next"),
  };
  await prisma.weekReview.upsert({ where: { weekNumber }, update: data, create: { weekNumber, ...data } });
  refresh();
}

export async function addIdea(formData: FormData) {
  const text = String(formData.get("text") ?? "").trim().slice(0, 300);
  if (!text) return;
  await prisma.laterIdea.create({ data: { text } });
  refresh();
}

export async function deleteIdea(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) throw new Error("Invalid idea");
  await prisma.laterIdea.deleteMany({ where: { id } });
  refresh();
}

export async function setGymDays(formData: FormData) {
  const days = formData.getAll("gym").map(Number).filter((d) => Number.isInteger(d) && d >= 0 && d <= 6);
  await prisma.settings.update({ where: { id: 1 }, data: { gymDays: [...new Set(days)].sort() } });
  refresh();
}
