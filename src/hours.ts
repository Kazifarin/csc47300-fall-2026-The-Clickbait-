// FEATURE 2 — Hours and Open-Now Status (Kazi Mehzabin)
// Compares the current campus time (America/New_York) to stored example hours.
// No outside service needed — runs instantly and for free.

import type { DayIndex, OpenStatus, TimeRange, WeeklyHours } from "./types.js";

export const DAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
export const DAY_LONG = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;

// Show the week starting Monday, like most schedules do
const WEEK_ORDER: DayIndex[] = [1, 2, 3, 4, 5, 6, 0];

export const CLOSING_SOON_MINUTES = 60;

function campusClock(now: Date): { day: DayIndex; minute: number } {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(now);
  const value = (type: Intl.DateTimeFormatPartTypes): string => parts.find(p => p.type === type)?.value ?? '';
  return { day: DAY_SHORT.indexOf(value('weekday') as typeof DAY_SHORT[number]) as DayIndex, minute: Number(value('hour')) * 60 + Number(value('minute')) };
}

export function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

// "17:30" -> "5:30pm", "09:00" -> "9am"
export function formatTime(time: string): string {
  const total = toMinutes(time);
  const h = Math.floor(total / 60);
  const m = total % 60;
  const suffix = h < 12 || h === 24 ? "am" : "pm";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${h12}${suffix}` : `${h12}:${String(m).padStart(2, "0")}${suffix}`;
}

function rangeText(range: TimeRange | undefined): string {
  return range ? `${formatTime(range.open)}–${formatTime(range.close)}` : "Closed";
}

export function getStatus(hours: WeeklyHours, now: Date): OpenStatus {
  const { day, minute: current } = campusClock(now);
  const today = hours[day];

  if (today) {
    const open = toMinutes(today.open);
    const close = toMinutes(today.close);

    if (current >= open && current < close) {
      const left = close - current;
      if (left <= CLOSING_SOON_MINUTES) {
        return { kind: "closing", label: "Closing soon", detail: `Closes in ${left} min` };
      }
      return { kind: "open", label: "Open now", detail: `Until ${formatTime(today.close)}` };
    }
    if (current < open) {
      const wait = open - current;
      const detail = wait <= 60 ? `Opens in ${wait} min` : `Opens today at ${formatTime(today.open)}`;
      return { kind: "closed", label: "Closed", detail };
    }
  }

  // Find the next day it opens
  for (let i = 1; i <= 7; i++) {
    const next = ((day + i) % 7) as DayIndex;
    const range = hours[next];
    if (range) {
      const when = i === 1 ? "tomorrow" : DAY_LONG[next];
      return { kind: "closed", label: "Closed", detail: `Opens ${when} at ${formatTime(range.open)}` };
    }
  }
  return { kind: "closed", label: "Closed", detail: "No hours listed" };
}

export interface WeekRow {
  day: string;
  text: string;
  isToday: boolean;
}

export function weeklyRows(hours: WeeklyHours, now: Date): WeekRow[] {
  const today = campusClock(now).day;
  return WEEK_ORDER.map((d) => ({
    day: DAY_LONG[d],
    text: rangeText(hours[d]),
    isToday: d === today,
  }));
}

// Short one-line summary: "Mon–Thu 9am–6pm · Fri 9am–3pm"
export function hoursSummary(hours: WeeklyHours): string {
  const groups: { start: DayIndex; end: DayIndex; text: string }[] = [];
  for (const d of WEEK_ORDER) {
    const text = rangeText(hours[d]);
    const last = groups[groups.length - 1];
    if (last && last.text === text) last.end = d;
    else groups.push({ start: d, end: d, text });
  }
  const parts = groups
    .filter((g) => g.text !== "Closed")
    .map((g) => {
      const days = g.start === g.end ? DAY_SHORT[g.start] : `${DAY_SHORT[g.start]}–${DAY_SHORT[g.end]}`;
      return `${days} ${g.text}`;
    });
  return parts.length ? parts.join(" · ") : "No hours listed";
}

