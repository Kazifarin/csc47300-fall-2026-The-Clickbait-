// Shared types used by every feature.

export type DayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday

export interface TimeRange {
  open: string;  // "09:00" (24-hour)
  close: string; // "17:00"
}

// Days that are missing = closed that day
export type WeeklyHours = Partial<Record<DayIndex, TimeRange>>;

export type Category =
  | "Academic"
  | "Basic Needs"
  | "Career"
  | "Wellness"
  | "Money"
  | "Library"
  | "Accessibility"
  | "International"
  | "Tech";

export interface Resource {
  id: number;
  name: string;
  icon: string;
  category: Category;
  tags: string[];      // extra words students might search for
  desc: string;
  location: string;
  hours: WeeklyHours;
}

export type StatusKind = "open" | "closing" | "closed";

export interface OpenStatus {
  kind: StatusKind;
  label: string;   // "Open now" / "Closing soon" / "Closed"
  detail: string;  // "Until 5pm" / "Closes in 20 min" / "Opens Mon at 9am"
}

export type ReportReason =
  | "Hours are wrong"
  | "Contact info is wrong"
  | "Location changed"
  | "Resource no longer exists"
  | "Other";

export interface IssueReport {
  id: string;
  resourceId: number;
  resourceName: string;
  reason: ReportReason;
  note: string;
  createdAt: string; // ISO date
}

export type ViewMode = "all" | "favorites";
