import { describe, it, expect } from "vitest";
import type { WeeklyHours } from "../types";
import { campusTime, getStatus, formatTime } from "./hours";
const schedule: WeeklyHours = [
  [],
  [{ open: "09:00", close: "17:00" }],
  [
    { open: "09:00", close: "12:00" },
    { open: "14:00", close: "18:00" },
  ],
  [{ open: "22:00", close: "02:00" }],
  [],
  [],
  null,
];
describe("Eastern Time operating hours", () => {
  it("uses Eastern Time instead of the device timezone", () => {
    expect(campusTime(new Date("2026-10-19T14:00:00Z"))).toEqual({
      day: 1,
      minute: 600,
    });
  });
  it("opens at the opening boundary and closes at the closing boundary", () => {
    expect(getStatus(schedule, new Date("2026-10-19T13:00:00Z")).state).toBe(
      "open",
    );
    expect(getStatus(schedule, new Date("2026-10-19T21:00:00Z")).state).toBe(
      "closed",
    );
  });
  it("shows closing soon with at most 60 minutes left", () => {
    expect(getStatus(schedule, new Date("2026-10-19T20:00:00Z")).state).toBe(
      "closing",
    );
  });
  it("finds the next opening between split intervals", () => {
    expect(getStatus(schedule, new Date("2026-10-20T17:00:00Z"))).toMatchObject(
      { state: "closed", detail: "Opens today at 2 PM" },
    );
  });
  it("supports overnight opening on both sides of midnight", () => {
    expect(getStatus(schedule, new Date("2026-10-22T03:00:00Z")).state).toBe(
      "open",
    );
    expect(getStatus(schedule, new Date("2026-10-22T05:30:00Z")).state).toBe(
      "closing",
    );
    expect(getStatus(schedule, new Date("2026-10-22T06:00:00Z")).state).toBe(
      "closed",
    );
  });
  it("never treats unknown hours as open", () => {
    expect(getStatus(schedule, new Date("2026-10-24T14:00:00Z")).state).toBe(
      "unknown",
    );
  });
  it("handles daylight saving transitions through Intl", () => {
    expect(campusTime(new Date("2026-03-08T06:30:00Z")).minute).toBe(90);
    expect(campusTime(new Date("2026-03-08T07:30:00Z")).minute).toBe(210);
    expect(campusTime(new Date("2026-11-01T05:30:00Z")).minute).toBe(90);
    expect(campusTime(new Date("2026-11-01T06:30:00Z")).minute).toBe(90);
  });
  it("formats noon and midnight clearly", () => {
    expect(formatTime("00:00")).toBe("12 AM");
    expect(formatTime("12:30")).toBe("12:30 PM");
  });
});
