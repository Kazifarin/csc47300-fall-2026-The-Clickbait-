// App entry point — connects the features and draws the resource cards.

import type { OpenStatus, Resource, ViewMode } from "./types.js";
import { CATEGORY_COLORS, RESOURCES } from "./data.js";
import { didYouMean, highlight, initSearchBox, search } from "./search.js";
import { DAY_LONG, getStatus, hoursSummary, weeklyRows } from "./hours.js";
import { initReports, openLog, openReport, reportCountFor } from "./report.js";
import { initResponsive } from "./responsive.js";
import { isFavorite, toggleFavorite } from "./favorites.js";
import { initTheme } from "./theme.js";
import { $, escapeHtml, showToast } from "./utils.js";

interface AppState {
  query: string;
  view: ViewMode;
  expanded: Set<number>;
}

const state: AppState = { query: "", view: "all", expanded: new Set() };

const grid = $<HTMLDivElement>("#grid");
const countEl = $<HTMLParagraphElement>("#count");
const emptyEl = $<HTMLDivElement>("#empty");

// ---------- Card ----------
function badgeHTML(s: OpenStatus): string {
  return `<span class="badge ${s.kind}"><span class="dot"></span>${s.label}</span>`;
}

function cardHTML(r: Resource): string {
  const now = new Date();
  const status = getStatus(r.hours, now);
  const fav = isFavorite(r.id);
  const open = state.expanded.has(r.id);
  const flags = reportCountFor(r.id);
  const q = state.query;

  const week = weeklyRows(r.hours, now)
    .map((row) => `<li class="${row.isToday ? "today" : ""}"><span>${row.day}</span><span>${row.text}</span></li>`)
    .join("");

  return `
  <article class="card status-${status.kind}" id="res-${r.id}" data-id="${r.id}" style="--cat:${CATEGORY_COLORS[r.category]}">
    <div class="card-media">
      <span class="card-emoji" aria-hidden="true">${r.icon}</span>
      <span class="cat-pill">${escapeHtml(r.category)}</span>
      <button class="star-btn" data-action="fav" data-id="${r.id}" aria-pressed="${fav}"
        aria-label="${fav ? "Remove" : "Save"} ${escapeHtml(r.name)} ${fav ? "from" : "to"} favorites">${fav ? "★" : "☆"}</button>
    </div>
    <div class="card-body">
      <div class="card-top">
        <h3 class="name">${highlight(r.name, q)}</h3>
        <span class="js-badge">${badgeHTML(status)}</span>
      </div>
      <p class="status-detail js-detail">${status.detail}</p>
      <p class="desc">${highlight(r.desc, q)}</p>
      <p class="meta">📍 ${escapeHtml(r.location)}</p>
      <p class="meta">🕒 ${hoursSummary(r.hours)}</p>
      ${flags ? `<p class="flag">⚠️ ${flags} student report${flags > 1 ? "s" : ""} — info under review</p>` : ""}
      <ul class="week" ${open ? "" : "hidden"} aria-label="Weekly hours">${week}</ul>
      <div class="card-actions">
        <button class="link-btn" data-action="details" data-id="${r.id}" aria-expanded="${open}">
          ${open ? "Hide hours ▴" : "Full week ▾"}
        </button>
        <button class="link-btn muted" data-action="report" data-id="${r.id}">Is this info wrong?</button>
      </div>
    </div>
  </article>`;
}

// ---------- Render ----------
function render(): void {
  // Remember focus so re-rendering doesn't kick keyboard users out
  const focused = document.activeElement as HTMLElement | null;
  const focusKey = focused?.dataset.action ? `[data-action="${focused.dataset.action}"][data-id="${focused.dataset.id}"]` : null;

  let list = search(RESOURCES, state.query).map((h) => h.resource);
  if (state.view === "favorites") list = list.filter((r) => isFavorite(r.id));

  grid.innerHTML = list.map(cardHTML).join("");

  if (list.length === 0) {
    emptyEl.hidden = false;
    countEl.textContent = "";
    const guess = state.query ? didYouMean(RESOURCES, state.query) : null;
    if (state.view === "favorites" && !state.query) {
      emptyEl.innerHTML = `<div class="empty-icon">☆</div><p>No favorites yet — tap the star on any resource to save it.</p>`;
    } else {
      emptyEl.innerHTML = `
        <div class="empty-icon">🔍</div>
        <p>No resources found — try a different term.</p>
        ${guess ? `<button class="btn" data-suggest="${escapeHtml(guess)}">Did you mean “${escapeHtml(guess)}”?</button>` : ""}`;
    }
  } else {
    emptyEl.hidden = true;
    countEl.textContent = `${list.length} resource${list.length === 1 ? "" : "s"}`;
  }

  if (focusKey) document.querySelector<HTMLElement>(focusKey)?.focus();
}

// Live update: only refresh the badges (keeps scroll + focus steady)
function refreshStatuses(): void {
  const now = new Date();
  grid.querySelectorAll<HTMLElement>(".card").forEach((card) => {
    const r = RESOURCES.find((x) => x.id === Number(card.dataset.id));
    if (!r) return;
    const s = getStatus(r.hours, now);
    card.className = `card status-${s.kind}`;
    card.querySelector(".js-badge")!.innerHTML = badgeHTML(s);
    card.querySelector(".js-detail")!.textContent = s.detail;
  });
}

function paintClock(): void {
  const t = new Date();
  const time = t.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  $<HTMLElement>("#clock").textContent = `${DAY_LONG[t.getDay()]} · ${time}`;
}

// ---------- Events ----------
function setView(view: ViewMode): void {
  state.view = view;
  document.querySelectorAll<HTMLButtonElement>(".tab").forEach((t) =>
    t.setAttribute("aria-pressed", String(t.dataset.view === view))
  );
  render();
}

function initEvents(searchBox: { setQuery: (q: string) => void }): void {
  grid.addEventListener("click", (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>("[data-action]");
    if (!btn) return;
    const id = Number(btn.dataset.id);
    const r = RESOURCES.find((x) => x.id === id);
    if (!r) return;

    if (btn.dataset.action === "fav") {
      const nowFav = toggleFavorite(id);
      showToast(nowFav ? `★ Saved ${r.name}` : `Removed ${r.name} from favorites`);
      render();
    } else if (btn.dataset.action === "details") {
      if (state.expanded.has(id)) state.expanded.delete(id);
      else state.expanded.add(id);
      render();
    } else if (btn.dataset.action === "report") {
      openReport(r);
    }
  });

  document.querySelectorAll<HTMLButtonElement>(".tab").forEach((t) =>
    t.addEventListener("click", () => setView(t.dataset.view as ViewMode))
  );

  emptyEl.addEventListener("click", (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>("[data-suggest]");
    if (btn?.dataset.suggest) searchBox.setQuery(btn.dataset.suggest);
  });

  // Nav links
  document.querySelectorAll<HTMLElement>("[data-nav]").forEach((link) =>
    link.addEventListener("click", (e) => {
      const action = link.dataset.nav;
      if (action === "favorites") {
        e.preventDefault();
        setView("favorites");
        $<HTMLElement>("#results").scrollIntoView({ behavior: "smooth", block: "start" });
      }
      if (action === "log") {
        e.preventDefault();
        openLog();
      }
    })
  );
}

// ---------- Start ----------
function start(): void {
  initTheme();
  initResponsive();
  initReports(render);

  const searchBox = initSearchBox({
    input: $<HTMLInputElement>("#searchInput"),
    list: $<HTMLUListElement>("#suggestions"),
    clearBtn: $<HTMLButtonElement>("#clearSearch"),
    getResources: () => RESOURCES,
    onQuery: (q) => {
      state.query = q;
      render();
    },
    onPick: (r) => {
      requestAnimationFrame(() => {
        const card = document.getElementById(`res-${r.id}`);
        card?.scrollIntoView({ behavior: "smooth", block: "center" });
        card?.classList.add("flash");
        window.setTimeout(() => card?.classList.remove("flash"), 1400);
      });
    },
  });

  initEvents(searchBox);
  paintClock();
  render();

  // Re-check open/closed every 30 seconds — badges flip without a refresh
  window.setInterval(() => {
    paintClock();
    refreshStatuses();
  }, 30_000);
}

start();
