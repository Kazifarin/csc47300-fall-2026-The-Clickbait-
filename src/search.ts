// FEATURE 1 — Search by Name or Type (Ferdosi Hossain)
// Instant, forgiving search over the resource list already loaded on the page.

import type { Resource } from "./types.js";
import { escapeHtml } from "./utils.js";

export interface SearchHit {
  resource: Resource;
  score: number;
}

export function normalize(text: string): string {
  return text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
}

function terms(query: string): string[] {
  return normalize(query).split(/\s+/).filter(Boolean);
}

// Higher score = better match. Every typed word must match something.
function scoreResource(r: Resource, words: string[]): number {
  const name = normalize(r.name);
  const nameWords = name.split(/\s+/);
  const tags = r.tags.map(normalize);
  const category = normalize(r.category);
  const desc = normalize(r.desc);

  let total = 0;
  for (const w of words) {
    let s = 0;
    if (name.startsWith(w)) s = 100;
    else if (nameWords.some((nw) => nw.startsWith(w))) s = 80;
    else if (name.includes(w)) s = 60;
    else if (category.startsWith(w) || tags.some((t) => t.startsWith(w))) s = 40;
    else if (tags.some((t) => t.includes(w)) || desc.includes(w)) s = 20;
    if (s === 0) return 0;
    total += s;
  }
  return total;
}

export function search(list: Resource[], query: string): SearchHit[] {
  const words = terms(query);
  if (words.length === 0) return list.map((resource) => ({ resource, score: 0 }));
  return list
    .map((resource) => ({ resource, score: scoreResource(resource, words) }))
    .filter((hit) => hit.score > 0)
    .sort((a, b) => b.score - a.score);
}

// Wraps matched letters in <mark> so students see why something matched.
export function highlight(text: string, query: string): string {
  const words = terms(query).map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  if (words.length === 0) return escapeHtml(text);
  const pattern = new RegExp(`(${words.join("|")})`, "gi");
  return text
    .split(pattern)
    .map((part, i) => (i % 2 === 1 ? `<mark>${escapeHtml(part)}</mark>` : escapeHtml(part)))
    .join("");
}

// ---------- "Did you mean…?" for typos ----------
function editDistance(a: string, b: string): number {
  const dp: number[] = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    let prev = dp[0]!;
    dp[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const temp = dp[j]!;
      dp[j] = Math.min(dp[j]! + 1, dp[j - 1]! + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = temp;
    }
  }
  return dp[b.length]!;
}

export function didYouMean(list: Resource[], query: string): string | null {
  const q = normalize(query);
  if (q.length < 3) return null;
  const vocab = new Set<string>();
  for (const r of list) {
    normalize(r.name).split(/\s+/).forEach((w) => w.length > 2 && vocab.add(w));
    r.tags.forEach((t) => vocab.add(normalize(t)));
    vocab.add(normalize(r.category));
  }
  let best: string | null = null;
  let bestDist = (q.length <= 5 ? 2 : 3) + 1; // allowed typos + 1
  for (const word of vocab) {
    const d = editDistance(q, word);
    if (d < bestDist) { best = word; bestDist = d; }
  }
  return best;
}

// ---------- Search box with live suggestion dropdown ----------
interface SearchBoxOptions {
  input: HTMLInputElement;
  list: HTMLUListElement;
  clearBtn: HTMLButtonElement;
  getResources: () => Resource[];
  onQuery: (query: string) => void;
  onPick: (resource: Resource) => void;
}

export function initSearchBox(opts: SearchBoxOptions): { setQuery: (q: string) => void } {
  const { input, list, clearBtn } = opts;
  let items: Resource[] = [];
  let active = -1;

  const close = (): void => {
    items = [];
    active = -1;
    paint();
  };

  const paint = (): void => {
    list.innerHTML = items
      .map(
        (r, i) => `
        <li role="option" id="sugg-${r.id}" data-id="${r.id}" class="${i === active ? "active" : ""}" aria-selected="${i === active}">
          <span class="sugg-icon">${r.icon}</span>
          <span class="sugg-name">${highlight(r.name, input.value)}</span>
          <span class="sugg-cat">${escapeHtml(r.category)}</span>
        </li>`
      )
      .join("");
    list.hidden = items.length === 0;
    input.setAttribute("aria-expanded", String(items.length > 0));
    const current = items[active];
    if (current) input.setAttribute("aria-activedescendant", `sugg-${current.id}`);
    else input.removeAttribute("aria-activedescendant");
  };

  const update = (): void => {
    const q = input.value;
    clearBtn.hidden = q.length === 0;
    opts.onQuery(q);
    items = q.trim() ? search(opts.getResources(), q).slice(0, 5).map((h) => h.resource) : [];
    active = -1;
    paint();
  };

  const pick = (r: Resource): void => {
    input.value = r.name;
    clearBtn.hidden = false;
    opts.onQuery(r.name);
    close();
    opts.onPick(r);
  };

  input.addEventListener("input", update);
  input.addEventListener("focus", () => input.value.trim() && update());
  input.addEventListener("blur", close);

  input.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "ArrowDown" && items.length) {
      e.preventDefault();
      active = (active + 1) % items.length;
      paint();
    } else if (e.key === "ArrowUp" && items.length) {
      e.preventDefault();
      active = (active - 1 + items.length) % items.length;
      paint();
    } else if (e.key === "Enter") {
      const chosen = items[active];
      if (chosen) { e.preventDefault(); pick(chosen); }
      else close();
    } else if (e.key === "Escape") {
      if (items.length) close();
      else { input.value = ""; update(); }
    }
  });

  // mousedown (not click) so it fires before the input loses focus
  list.addEventListener("mousedown", (e: MouseEvent) => {
    const li = (e.target as HTMLElement).closest<HTMLLIElement>("li[data-id]");
    if (!li) return;
    e.preventDefault();
    const r = opts.getResources().find((x) => x.id === Number(li.dataset.id));
    if (r) pick(r);
  });

  clearBtn.addEventListener("click", () => {
    input.value = "";
    update();
    close();
    input.focus();
  });

  // Press "/" anywhere to jump to search
  document.addEventListener("keydown", (e: KeyboardEvent) => {
    const typing = (e.target as HTMLElement).matches("input, textarea, select");
    if (e.key === "/" && !typing) {
      e.preventDefault();
      input.focus();
    }
  });

  return {
    setQuery(q: string) {
      input.value = q;
      update();
      input.focus();
    },
  };
}
