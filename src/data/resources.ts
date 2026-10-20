import type { Category, Resource, WeeklyHours, Review } from "../types";
export const categories: {
  name: Category;
  description: string;
  short: string;
}[] = [
  {
    name: "Tutoring",
    short: "A little clarity goes a long way.",
    description: "Work through the tricky parts, together.",
  },
  {
    name: "Writing",
    short: "Find the words. Make them yours.",
    description: "From a first draft to a final thought.",
  },
  {
    name: "Careers",
    short: "Your next chapter starts here.",
    description: "Make room for what comes after college.",
  },
  {
    name: "Wellness",
    short: "Take care of the person, too.",
    description: "Support for your mind and your everyday.",
  },
  {
    name: "Food & Essentials",
    short: "The basics, taken care of.",
    description: "A helping hand with daily necessities.",
  },
  {
    name: "Student Services",
    short: "A nudge in the right direction.",
    description: "Find your people. Find your next step.",
  },
];
function weekdays(open = "09:00", close = "17:00"): WeeklyHours {
  return [[], ...Array.from({ length: 5 }, () => [{ open, close }]), []];
}
// Resource identities are campus examples. All locations, hours, and schematic positions
// are illustrative, unverified demo data. Never use these positions as geographic coordinates.
export const resources: Resource[] = [
  {
    id: "tutoring",
    name: "Academic Tutoring",
    category: "Tutoring",
    description:
      "A fresh perspective on a tough problem. Get one-on-one support in math, science, and the subjects that need a second look.",
    building: "Marshak Science Building",
    location: "Example location · confirm room with CCNY",
    services: ["Math & science", "Peer learning", "Study strategies"],
    hours: weekdays("10:00", "18:00"),
    position: [69, 29],
    number: "01",
  },
  {
    id: "writing",
    name: "The Writing Center",
    category: "Writing",
    description:
      "Bring your ideas, your outline, or your almost-finished paper. Talk it through with a writing consultant and leave with a clearer next step.",
    building: "North Academic Center",
    location: "Example location · confirm room with CCNY",
    services: ["Essay feedback", "Brainstorming", "Writing consultations"],
    hours: [
      [],
      [{ open: "10:00", close: "18:00" }],
      [
        { open: "10:00", close: "13:00" },
        { open: "14:00", close: "18:00" },
      ],
      [{ open: "10:00", close: "18:00" }],
      [{ open: "10:00", close: "18:00" }],
      [{ open: "10:00", close: "15:00" }],
      [],
    ],
    position: [37, 55],
    number: "02",
  },
  {
    id: "careers",
    name: "Career & Professional Development",
    category: "Careers",
    description:
      "Turn your interests into a next step. Explore internships, work on your résumé, and prepare for conversations with future employers.",
    building: "North Academic Center",
    location: "Example location · confirm room with CCNY",
    services: ["Résumé support", "Internships", "Interview preparation"],
    hours: weekdays(),
    position: [46, 65],
    number: "03",
  },
  {
    id: "counseling",
    name: "Counseling Center",
    category: "Wellness",
    description:
      "You don’t have to figure everything out alone. Discover counseling and wellbeing support, and learn how to make an appointment.",
    building: "Marshak Science Building",
    location: "Example location · confirm room with CCNY",
    services: ["Counseling", "Wellbeing", "Appointment guidance"],
    hours: weekdays(),
    position: [78, 42],
    number: "04",
  },
  {
    id: "pantry",
    name: "Benny’s Food Pantry",
    category: "Food & Essentials",
    description:
      "One less thing on your plate. Find food and everyday essentials, with a welcoming space to ask about available support.",
    building: "Student support location",
    location: "Location and appointments must be confirmed with CCNY",
    services: ["Food support", "Everyday essentials", "Student assistance"],
    hours: Array.from({ length: 7 }, () => null),
    position: [24, 74],
    number: "05",
  },
  {
    id: "advising",
    name: "Academic Advising",
    category: "Student Services",
    description:
      "Make a plan that feels like yours. Get help with course choices, degree requirements, and navigating your academic journey.",
    building: "North Academic Center",
    location: "Example location · confirm your division’s office",
    services: ["Course planning", "Degree requirements", "Academic guidance"],
    hours: weekdays("09:30", "16:30"),
    position: [52, 43],
    number: "06",
  },
  {
    id: "access",
    name: "AccessAbility Center",
    category: "Student Services",
    description:
      "Explore accommodations and accessibility support for a more equitable college experience. Contact the college for current procedures.",
    building: "North Academic Center",
    location: "Example location · confirm room with CCNY",
    services: ["Accommodations", "Accessibility", "Learning support"],
    hours: weekdays(),
    position: [30, 42],
    number: "07",
  },
  {
    id: "library",
    name: "Library Study Support",
    category: "Tutoring",
    description:
      "Find a quiet corner, a research starting point, or a librarian who can help you navigate the next assignment.",
    building: "North Academic Center",
    location: "Example location · confirm library hours with CCNY",
    services: ["Research help", "Study spaces", "Library resources"],
    hours: [
      [],
      [{ open: "08:00", close: "22:00" }],
      [{ open: "08:00", close: "22:00" }],
      [{ open: "08:00", close: "22:00" }],
      [{ open: "08:00", close: "22:00" }],
      [{ open: "08:00", close: "18:00" }],
      [{ open: "10:00", close: "16:00" }],
    ],
    position: [58, 76],
    number: "08",
  },
];
export const demoReviews: Review[] = [
  {
    id: "demo-1",
    resourceId: "writing",
    name: "Sample student",
    rating: 5,
    comment:
      "Talking through my outline helped me find a stronger structure. I left knowing what to work on next.",
    createdAt: "2026-09-15T15:00:00Z",
    demo: true,
  },
  {
    id: "demo-2",
    resourceId: "tutoring",
    name: "Sample student",
    rating: 4,
    comment:
      "A helpful place to slow down and work through a problem step by step.",
    createdAt: "2026-09-18T15:00:00Z",
    demo: true,
  },
];
