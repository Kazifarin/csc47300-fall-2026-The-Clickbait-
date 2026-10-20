// App entry point — connects the features and draws the resource cards.

import type { Category, OpenStatus, Resource, ViewMode } from "./types.js";
import { RESOURCES } from "./data.js";
import { didYouMean, highlight, initSearchBox, search } from "./search.js";
import { getStatus, hoursSummary, weeklyRows } from "./hours.js";
import { initReports, openLog, openReport, reportCountFor } from "./report.js";
import { initResponsive } from "./responsive.js";
import { isFavorite, toggleFavorite } from "./favorites.js";
import { initTheme } from "./theme.js";
import { $, escapeHtml, showToast } from "./utils.js";
import { icon, paintIcons, type IconName } from "./icons.js";
import { initVisuals } from "./visuals.js";

interface AppState {
  query: string;
  view: ViewMode;
  expanded: Set<number>;
  category: Category | 'all';
  openOnly: boolean;
}

const state: AppState = { query: "", view: "all", expanded: new Set(), category: 'all', openOnly: false };
const categoryIcons: Record<Category, IconName> = { Academic: 'book', 'Basic Needs': 'bag', Career: 'briefcase', Wellness: 'heart', Money: 'wallet', Library: 'book', Accessibility: 'users', International: 'globe', Tech: 'monitor' };

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
  <article class="card status-${status.kind}" id="res-${r.id}" data-id="${r.id}">
    <div class="card-media">
      <span class="card-category-icon">${icon(categoryIcons[r.category])}</span>
      <span class="cat-pill">${escapeHtml(r.category)}</span>
      <button class="star-btn" data-action="fav" data-id="${r.id}" aria-pressed="${fav}"
        aria-label="${fav ? "Remove" : "Save"} ${escapeHtml(r.name)} ${fav ? "from" : "to"} favorites">${icon('bookmark')}</button>
    </div>
    <div class="card-body">
      <div class="card-top">
        <h3 class="name">${highlight(r.name, q)}</h3>
        <span class="js-badge">${badgeHTML(status)}</span>
      </div>
      <p class="status-detail js-detail">${status.detail}</p>
      <p class="desc">${highlight(r.desc, q)}</p>
      <p class="meta">${icon('pin')} ${escapeHtml(r.location)}</p>
      <p class="meta hours-meta">${icon('clock')} ${hoursSummary(r.hours)}</p>
      ${flags ? `<p class="flag">⚠️ ${flags} student report${flags > 1 ? "s" : ""} — info under review</p>` : ""}
      <ul id="week-${r.id}" class="week" ${open ? "" : "hidden"} aria-label="Weekly hours for ${escapeHtml(r.name)}">${week}</ul>
      <div class="card-actions">
        <button class="link-btn" data-action="details" data-id="${r.id}" aria-expanded="${open}" aria-controls="week-${r.id}">
          ${open ? "Hide hours" : "Weekly hours"} ${icon('chevron')}
        </button>
        <button class="link-btn muted" data-action="report" data-id="${r.id}">${icon('flag')} Report an issue</button>
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
  if (state.category !== 'all') list = list.filter(r => r.category === state.category);
  if (state.openOnly) list = list.filter(r => getStatus(r.hours, new Date()).kind !== 'closed');
  $<HTMLSelectElement>('#categoryFilter').value = state.category;
  $<HTMLInputElement>('#openOnly').checked = state.openOnly;
  $<HTMLElement>('#savedCount').textContent = String(RESOURCES.filter(r => isFavorite(r.id)).length);

  grid.innerHTML = list.map(cardHTML).join("");

  if (list.length === 0) {
    emptyEl.hidden = false;
    countEl.textContent = "0 resources match these filters";
    const guess = state.query ? didYouMean(RESOURCES, state.query) : null;
    if (state.view === "favorites" && !state.query) {
      emptyEl.innerHTML = `<div class="empty-icon">${icon('bookmark')}</div><h3>Keep your go-to places close.</h3><p>Tap a bookmark on any resource. It’ll be waiting here next time.</p><button class="btn" data-reset>Explore all resources ${icon('arrow')}</button>`;
    } else {
      emptyEl.innerHTML = `
        <div class="empty-icon">${icon('search')}</div><h3>A different direction, perhaps?</h3>
        <p>No resources match these filters. Try another word or a different category.</p>
        ${guess ? `<button class="btn" data-suggest="${escapeHtml(guess)}">Did you mean “${escapeHtml(guess)}”?</button>` : ""}<button class="btn" data-reset>Reset filters ${icon('arrow')}</button>`;
    }
  } else {
    emptyEl.hidden = true;
    countEl.textContent = `${list.length} resource${list.length === 1 ? "" : "s"}${state.view === 'favorites' ? ' saved' : ' to explore'}`;
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
  const time = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', weekday: 'short', hour: 'numeric', minute: '2-digit' }).format(new Date());
  $<HTMLElement>("#clock").textContent = time;
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
  const goToResults = (): void => { $<HTMLElement>('#results').scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' }); };
  const reset = (): void => { state.category = 'all'; state.openOnly = false; setView('all'); searchBox.setQuery(''); };
  $<HTMLButtonElement>('#findResources').addEventListener('click', () => { $<HTMLInputElement>('#searchInput').blur(); goToResults(); });
  $<HTMLInputElement>('#searchInput').addEventListener('keydown', e => { if (e.key === 'Enter' && !e.defaultPrevented) { e.preventDefault(); $<HTMLInputElement>('#searchInput').blur(); goToResults(); } });
  $<HTMLSelectElement>('#categoryFilter').addEventListener('change', e => { state.category = (e.currentTarget as HTMLSelectElement).value as AppState['category']; render(); });
  $<HTMLInputElement>('#openOnly').addEventListener('change', e => { state.openOnly = (e.currentTarget as HTMLInputElement).checked; render(); });
  $<HTMLButtonElement>('#resetFilters').addEventListener('click', () => { reset(); goToResults(); });
  document.querySelectorAll<HTMLButtonElement>('[data-query]').forEach(button => button.addEventListener('click', () => { reset(); searchBox.setQuery(button.dataset.query ?? ''); $<HTMLInputElement>('#searchInput').blur(); goToResults(); }));
  document.querySelectorAll<HTMLButtonElement>('[data-category]').forEach(button => button.addEventListener('click', () => { reset(); state.category = button.dataset.category as Category; render(); $<HTMLInputElement>('#searchInput').blur(); goToResults(); }));
  grid.addEventListener("click", (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>("[data-action]");
    if (!btn) return;
    const id = Number(btn.dataset.id);
    const r = RESOURCES.find((x) => x.id === id);
    if (!r) return;

    if (btn.dataset.action === "fav") {
      const nowFav = toggleFavorite(id);
      showToast(nowFav ? `Saved ${r.name} on this device` : `Removed ${r.name} from saved resources`);
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
    if ((e.target as HTMLElement).closest('[data-reset]')) { reset(); goToResults(); return; }
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>("[data-suggest]");
    if (btn?.dataset.suggest) searchBox.setQuery(btn.dataset.suggest);
  });

  // Nav links
  document.querySelectorAll<HTMLElement>("[data-nav]").forEach((link) =>
    link.addEventListener("click", (e) => {
      const action = link.dataset.nav;
      if (action === 'browse') { e.preventDefault(); reset(); $<HTMLInputElement>('#searchInput').blur(); goToResults(); }
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
  const categorySelect = $<HTMLSelectElement>('#categoryFilter');
  for (const category of new Set(RESOURCES.map(r => r.category))) {
    const option = document.createElement('option'); option.value = category; option.textContent = category; categorySelect.append(option);
  }
  initTheme();
  initResponsive();
  paintIcons();
  initVisuals();
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
      state.category = 'all'; state.openOnly = false; setView('all');
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
    if (state.openOnly) render(); else refreshStatuses();
  }, 30_000);
}

start();
