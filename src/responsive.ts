// FEATURE 4 — Responsive Design (Rahat Hossain)
// Most of this feature lives in css/styles.css (mobile-first media queries,
// Flexbox and Grid). This file handles the parts that need code:
// the mobile menu and the back-to-top button.

import { $ } from "./utils.js";

const DESKTOP = window.matchMedia("(min-width: 768px)");

export function initResponsive(): void {
  const menuBtn = $<HTMLButtonElement>("#menuBtn");
  const nav = $<HTMLElement>("#siteNav");
  const toTop = $<HTMLButtonElement>("#toTop");

  const setMenu = (open: boolean): void => {
    nav.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };

  menuBtn.addEventListener("click", () => setMenu(!nav.classList.contains("open")));

  // Close the menu after picking a link, pressing Esc, or growing to desktop size
  nav.addEventListener("click", (e) => {
    if ((e.target as HTMLElement).closest("a, button")) setMenu(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains('open')) { setMenu(false); menuBtn.focus(); }
  });
  DESKTOP.addEventListener("change", (e) => {
    if (e.matches) setMenu(false);
  });

  // Back-to-top button for long lists on phones
  const onScroll = (): void => {
    toTop.classList.toggle("show", window.scrollY > 600);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }));
  onScroll();
}
