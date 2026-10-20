// Resource list. Loaded once with the page, so search is instant.
// NOTE: sample data — the team should verify every hour and location before the final.

import type { Category, Resource } from "./types.js";

export const CATEGORY_COLORS: Record<Category, string> = {
  Academic: "#6d5bd0",
  "Basic Needs": "#e07a2e",
  Career: "#1f7a9e",
  Wellness: "#2f9e6e",
  Money: "#c2417a",
  Library: "#8a5a2b",
  Accessibility: "#3b6fd6",
  International: "#0f9488",
  Tech: "#5c6b7a",
};

const weekdays = (open: string, close: string) => ({
  1: { open, close }, 2: { open, close }, 3: { open, close },
  4: { open, close }, 5: { open, close },
});

export const RESOURCES: Resource[] = [
  {
    id: 1, name: "Writing Center", icon: "✍️", category: "Academic",
    tags: ["tutoring", "essay", "paper", "personal statement", "english"],
    desc: "Free one-on-one help with essays, papers, and personal statements.",
    location: "North Academic Center (NAC)",
    hours: {
      1: { open: "09:00", close: "18:00" }, 2: { open: "09:00", close: "18:00" },
      3: { open: "09:00", close: "18:00" }, 4: { open: "09:00", close: "18:00" },
      5: { open: "09:00", close: "15:00" },
    },
  },
  {
    id: 2, name: "Math Tutoring Lab", icon: "🧮", category: "Academic",
    tags: ["tutoring", "math", "calculus", "statistics", "homework"],
    desc: "Drop-in tutoring for calculus, statistics, and linear algebra.",
    location: "Marshak Science Building",
    hours: { ...weekdays("10:00", "18:00"), 6: { open: "11:00", close: "15:00" } },
  },
  {
    id: 3, name: "Food Pantry", icon: "🥫", category: "Basic Needs",
    tags: ["food", "groceries", "hungry", "free food"],
    desc: "Free groceries for students and the community.",
    location: "North Academic Center (NAC)",
    hours: { 2: { open: "11:00", close: "15:00" }, 4: { open: "11:00", close: "15:00" } },
  },
  {
    id: 4, name: "Career Center", icon: "💼", category: "Career",
    tags: ["career", "jobs", "internship", "resume", "interview"],
    desc: "Resume reviews, mock interviews, and internship listings.",
    location: "North Academic Center (NAC)",
    hours: weekdays("09:00", "17:00"),
  },
  {
    id: 5, name: "Counseling Center", icon: "💬", category: "Wellness",
    tags: ["counseling", "mental health", "stress", "therapy", "support"],
    desc: "Confidential counseling and mental health support for students.",
    location: "Marshak Science Building",
    hours: weekdays("09:00", "17:00"),
  },
  {
    id: 6, name: "Student Health Services", icon: "🩺", category: "Wellness",
    tags: ["health", "doctor", "nurse", "sick", "vaccine", "clinic"],
    desc: "Basic medical care, vaccines, and health questions.",
    location: "Marshak Science Building",
    hours: weekdays("09:00", "16:30"),
  },
  {
    id: 7, name: "Financial Aid Office", icon: "💳", category: "Money",
    tags: ["financial aid", "fafsa", "tap", "scholarship", "tuition", "money"],
    desc: "Help with FAFSA, TAP, scholarships, and payment plans.",
    location: "Administration Building",
    hours: { ...weekdays("09:00", "17:00"), 5: { open: "09:00", close: "14:00" } },
  },
  {
    id: 8, name: "Cohen Library", icon: "📚", category: "Library",
    tags: ["library", "study", "books", "research", "quiet", "printing"],
    desc: "Study spaces, research help, printing, and study room bookings.",
    location: "North Academic Center (NAC)",
    hours: {
      0: { open: "12:00", close: "18:00" },
      1: { open: "08:00", close: "22:00" }, 2: { open: "08:00", close: "22:00" },
      3: { open: "08:00", close: "22:00" }, 4: { open: "08:00", close: "22:00" },
      5: { open: "08:00", close: "18:00" }, 6: { open: "10:00", close: "18:00" },
    },
  },
  {
    id: 9, name: "AccessAbility Center", icon: "♿", category: "Accessibility",
    tags: ["disability", "accommodations", "accessibility", "testing"],
    desc: "Academic accommodations, testing support, and accessibility services.",
    location: "North Academic Center (NAC)",
    hours: weekdays("09:00", "17:00"),
  },
  {
    id: 10, name: "International Student Office", icon: "🌍", category: "International",
    tags: ["international", "visa", "f-1", "opt", "cpt", "i-20"],
    desc: "Visa questions, CPT/OPT paperwork, and cultural adjustment support.",
    location: "Administration Building",
    hours: { 1: { open: "10:00", close: "16:00" }, 3: { open: "10:00", close: "16:00" }, 5: { open: "10:00", close: "16:00" } },
  },
  {
    id: 11, name: "IT Service Desk", icon: "🛠️", category: "Tech",
    tags: ["wifi", "password", "email", "laptop", "tech help", "cunyfirst"],
    desc: "Help with Wi-Fi, CUNY login, email, and laptop loans.",
    location: "North Academic Center (NAC)",
    hours: weekdays("08:00", "20:00"),
  },
  {
    id: 12, name: "Open Computer Lab", icon: "💻", category: "Tech",
    tags: ["computer", "lab", "printing", "software", "study"],
    desc: "Free computers with class software and printing.",
    location: "Steinman Hall",
    hours: { ...weekdays("08:00", "21:00"), 6: { open: "10:00", close: "16:00" } },
  },
];
