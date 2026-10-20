export type Category =
  | "Tutoring"
  | "Writing"
  | "Careers"
  | "Wellness"
  | "Food & Essentials"
  | "Student Services";
export type Interval = { open: string; close: string };
// Sunday = 0. null means unknown; [] means confirmed closed within the demo schedule.
export type WeeklyHours = (Interval[] | null)[];
export type Resource = {
  id: string;
  name: string;
  category: Category;
  description: string;
  building: string;
  location: string;
  services: string[];
  hours: WeeklyHours;
  position: [number, number];
  number: string;
};
export type Review = {
  id: string;
  resourceId: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
  demo?: boolean;
};
export type Filters = {
  query: string;
  category: Category | "All Resources";
  openOnly: boolean;
  savedOnly: boolean;
};
