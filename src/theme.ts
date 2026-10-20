// Theme: light/dark toggle + accent color picker (part of the "coolness" polish)

import { $, load, save } from "./utils.js";

type Theme = "light" | "dark";

interface Accent {
  name: string;
  color: string;
}

export const ACCENTS: Accent[] = [
  { name: "Lavender", color: "#6d5bd0" },
  { name: "Ocean", color: "#1f7a9e" },
  { name: "Sunset", color: "#e0582b" },
  { name: "Forest", color: "#2f8a57" },
  { name: "Berry", color: "#c2417a" },
];

function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
  const btn = $<HTMLButtonElement>("#themeBtn");
  btn.textContent = theme === "dark" ? "☀️" : "🌙";
  btn.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
}

function applyAccent(color: string): void {
  document.documentElement.style.setProperty("--accent", color);
  document.querySelectorAll<HTMLButtonElement>(".swatch").forEach((s) =>
    s.setAttribute("aria-pressed", String(s.dataset.color === color))
  );
}

export function initTheme(): void {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  let theme = load<Theme>("crf_theme", prefersDark ? "dark" : "light");
  applyTheme(theme);

  $<HTMLButtonElement>("#themeBtn").addEventListener("click", () => {
    theme = theme === "dark" ? "light" : "dark";
    applyTheme(theme);
    save("crf_theme", theme);
  });

  const swatches = $<HTMLDivElement>("#swatches");
  swatches.innerHTML = ACCENTS.map(
    (a) => `<button class="swatch" data-color="${a.color}" style="--sw:${a.color}" aria-label="${a.name} color" title="${a.name}"></button>`
  ).join("");
  swatches.addEventListener("click", (e) => {
    const sw = (e.target as HTMLElement).closest<HTMLButtonElement>(".swatch");
    if (!sw?.dataset.color) return;
    applyAccent(sw.dataset.color);
    save("crf_accent", sw.dataset.color);
  });
  applyAccent(load<string>("crf_accent", ACCENTS[0]!.color));
}
