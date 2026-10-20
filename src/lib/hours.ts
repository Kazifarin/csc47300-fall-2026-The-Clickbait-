import type { WeeklyHours } from "../types";
export const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const minutes = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};
export function campusTime(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "";
  return {
    day: days.indexOf(value("weekday")),
    minute: Number(value("hour")) * 60 + Number(value("minute")),
  };
}
export function formatTime(time: string) {
  const [h, m] = time.split(":").map(Number);
  return `${h % 12 || 12}${m ? `:${String(m).padStart(2, "0")}` : ""} ${h >= 12 ? "PM" : "AM"}`;
}
export function getStatus(
  hours: WeeklyHours,
  now = new Date(),
): {
  state: "open" | "closing" | "closed" | "unknown";
  label: string;
  detail: string;
} {
  const { day, minute } = campusTime(now);
  const today = hours[day];
  const yesterday = hours[(day + 6) % 7];
  const ongoing = yesterday?.find(
    (i) => minutes(i.close) <= minutes(i.open) && minute < minutes(i.close),
  );
  const interval = today?.find(
    (i) =>
      minute >= minutes(i.open) &&
      (minutes(i.close) <= minutes(i.open) || minute < minutes(i.close)),
  );
  if (ongoing || interval) {
    const current = ongoing ?? interval!;
    const remaining = ongoing
      ? minutes(current.close) - minute
      : (minutes(current.close) <= minutes(current.open) ? 1440 : 0) +
        minutes(current.close) -
        minute;
    return {
      state: remaining <= 60 ? "closing" : "open",
      label: remaining <= 60 ? "Closing soon" : "Open now",
      detail: `Closes ${formatTime(current.close)}${!ongoing && minutes(current.close) <= minutes(current.open) ? " tomorrow" : ""}`,
    };
  }
  if (today == null)
    return {
      state: "unknown",
      label: "Hours unconfirmed",
      detail: "Check with the resource before visiting",
    };
  for (let offset = 0; offset <= 7; offset++) {
    const schedule = hours[(day + offset) % 7];
    // An unknown intervening day prevents a definitive next-opening claim.
    if (schedule == null) break;
    const next = [...schedule]
      .sort((a, b) => minutes(a.open) - minutes(b.open))
      .find((i) => offset > 0 || minutes(i.open) > minute);
    if (next)
      return {
        state: "closed",
        label: "Closed",
        detail: `Opens ${offset === 0 ? "today" : offset === 1 ? "tomorrow" : days[(day + offset) % 7]} at ${formatTime(next.open)}`,
      };
  }
  return {
    state: "closed",
    label: "Closed",
    detail: "Next opening unconfirmed",
  };
}
