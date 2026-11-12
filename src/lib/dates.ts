// Plain calendar dates ("YYYY-MM-DD"), handled in UTC so a day never shifts with time zones.

const DAY_MS = 86_400_000;

export const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export const SHORT_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function isoDay(value: string | undefined): string | null {
  return value && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value)) ? value : null;
}

/** Today in Morocco (Africa/Casablanca), as YYYY-MM-DD. */
export function todayIso(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Casablanca" }).format(new Date());
}

export const toDate = (iso: string) => new Date(`${iso}T00:00:00.000Z`);
export const toIso = (d: Date) => d.toISOString().slice(0, 10);
export const addDays = (iso: string, n: number) => toIso(new Date(toDate(iso).getTime() + n * DAY_MS));
export const weekday = (iso: string) => toDate(iso).getUTCDay();
export const daysBetween = (a: string, b: string) => Math.round((toDate(b).getTime() - toDate(a).getTime()) / DAY_MS);

/** Monday of the week that contains `iso`. */
export const mondayOf = (iso: string) => addDays(iso, -((weekday(iso) + 6) % 7));

/** 1-based plan week of a date (week 1 = the week containing the start date, Monday–Sunday). */
export const weekNumberOf = (startIso: string, iso: string) =>
  Math.floor(daysBetween(mondayOf(startIso), iso) / 7) + 1;

export const weekStartOf = (startIso: string, week: number) => addDays(mondayOf(startIso), (week - 1) * 7);

export function niceDate(iso: string): string {
  const d = toDate(iso);
  return `${WEEKDAYS[d.getUTCDay()]} ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;
}

export function shortDate(iso: string): string {
  const d = toDate(iso);
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;
}
