"use strict";
(() => {
  // src/data.ts
  var CATEGORY_COLORS = {
    Academic: "#6d5bd0",
    "Basic Needs": "#e07a2e",
    Career: "#1f7a9e",
    Wellness: "#2f9e6e",
    Money: "#c2417a",
    Library: "#8a5a2b",
    Accessibility: "#3b6fd6",
    International: "#0f9488",
    Tech: "#5c6b7a"
  };
  var weekdays = (open, close) => ({
    1: { open, close },
    2: { open, close },
    3: { open, close },
    4: { open, close },
    5: { open, close }
  });
  var RESOURCES = [
    {
      id: 1,
      name: "Writing Center",
      icon: "\u270D\uFE0F",
      category: "Academic",
      tags: ["tutoring", "essay", "paper", "personal statement", "english"],
      desc: "Free one-on-one help with essays, papers, and personal statements.",
      location: "North Academic Center (NAC)",
      hours: {
        1: { open: "09:00", close: "18:00" },
        2: { open: "09:00", close: "18:00" },
        3: { open: "09:00", close: "18:00" },
        4: { open: "09:00", close: "18:00" },
        5: { open: "09:00", close: "15:00" }
      }
    },
    {
      id: 2,
      name: "Math Tutoring Lab",
      icon: "\u{1F9EE}",
      category: "Academic",
      tags: ["tutoring", "math", "calculus", "statistics", "homework"],
      desc: "Drop-in tutoring for calculus, statistics, and linear algebra.",
      location: "Marshak Science Building",
      hours: { ...weekdays("10:00", "18:00"), 6: { open: "11:00", close: "15:00" } }
    },
    {
      id: 3,
      name: "Food Pantry",
      icon: "\u{1F96B}",
      category: "Basic Needs",
      tags: ["food", "groceries", "hungry", "free food"],
      desc: "Free groceries for students and the community.",
      location: "North Academic Center (NAC)",
      hours: { 2: { open: "11:00", close: "15:00" }, 4: { open: "11:00", close: "15:00" } }
    },
    {
      id: 4,
      name: "Career Center",
      icon: "\u{1F4BC}",
      category: "Career",
      tags: ["career", "jobs", "internship", "resume", "interview"],
      desc: "Resume reviews, mock interviews, and internship listings.",
      location: "North Academic Center (NAC)",
      hours: weekdays("09:00", "17:00")
    },
    {
      id: 5,
      name: "Counseling Center",
      icon: "\u{1F4AC}",
      category: "Wellness",
      tags: ["counseling", "mental health", "stress", "therapy", "support"],
      desc: "Confidential counseling and mental health support for students.",
      location: "Marshak Science Building",
      hours: weekdays("09:00", "17:00")
    },
    {
      id: 6,
      name: "Student Health Services",
      icon: "\u{1FA7A}",
      category: "Wellness",
      tags: ["health", "doctor", "nurse", "sick", "vaccine", "clinic"],
      desc: "Basic medical care, vaccines, and health questions.",
      location: "Marshak Science Building",
      hours: weekdays("09:00", "16:30")
    },
    {
      id: 7,
      name: "Financial Aid Office",
      icon: "\u{1F4B3}",
      category: "Money",
      tags: ["financial aid", "fafsa", "tap", "scholarship", "tuition", "money"],
      desc: "Help with FAFSA, TAP, scholarships, and payment plans.",
      location: "Administration Building",
      hours: { ...weekdays("09:00", "17:00"), 5: { open: "09:00", close: "14:00" } }
    },
    {
      id: 8,
      name: "Cohen Library",
      icon: "\u{1F4DA}",
      category: "Library",
      tags: ["library", "study", "books", "research", "quiet", "printing"],
      desc: "Study spaces, research help, printing, and study room bookings.",
      location: "North Academic Center (NAC)",
      hours: {
        0: { open: "12:00", close: "18:00" },
        1: { open: "08:00", close: "22:00" },
        2: { open: "08:00", close: "22:00" },
        3: { open: "08:00", close: "22:00" },
        4: { open: "08:00", close: "22:00" },
        5: { open: "08:00", close: "18:00" },
        6: { open: "10:00", close: "18:00" }
      }
    },
    {
      id: 9,
      name: "AccessAbility Center",
      icon: "\u267F",
      category: "Accessibility",
      tags: ["disability", "accommodations", "accessibility", "testing"],
      desc: "Academic accommodations, testing support, and accessibility services.",
      location: "North Academic Center (NAC)",
      hours: weekdays("09:00", "17:00")
    },
    {
      id: 10,
      name: "International Student Office",
      icon: "\u{1F30D}",
      category: "International",
      tags: ["international", "visa", "f-1", "opt", "cpt", "i-20"],
      desc: "Visa questions, CPT/OPT paperwork, and cultural adjustment support.",
      location: "Administration Building",
      hours: { 1: { open: "10:00", close: "16:00" }, 3: { open: "10:00", close: "16:00" }, 5: { open: "10:00", close: "16:00" } }
    },
    {
      id: 11,
      name: "IT Service Desk",
      icon: "\u{1F6E0}\uFE0F",
      category: "Tech",
      tags: ["wifi", "password", "email", "laptop", "tech help", "cunyfirst"],
      desc: "Help with Wi-Fi, CUNY login, email, and laptop loans.",
      location: "North Academic Center (NAC)",
      hours: weekdays("08:00", "20:00")
    },
    {
      id: 12,
      name: "Open Computer Lab",
      icon: "\u{1F4BB}",
      category: "Tech",
      tags: ["computer", "lab", "printing", "software", "study"],
      desc: "Free computers with class software and printing.",
      location: "Steinman Hall",
      hours: { ...weekdays("08:00", "21:00"), 6: { open: "10:00", close: "16:00" } }
    }
  ];

  // src/utils.ts
  function $(selector) {
    const el = document.querySelector(selector);
    if (!el) throw new Error(`Missing element: ${selector}`);
    return el;
  }
  function escapeHtml(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function load(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }
  function save(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
    }
  }
  var toastTimer;
  function showToast(message) {
    const toast = $("#toast");
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2600);
  }

  // src/search.ts
  function normalize(text) {
    return text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
  }
  function terms(query) {
    return normalize(query).split(/\s+/).filter(Boolean);
  }
  function scoreResource(r, words) {
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
  function search(list, query) {
    const words = terms(query);
    if (words.length === 0) return list.map((resource) => ({ resource, score: 0 }));
    return list.map((resource) => ({ resource, score: scoreResource(resource, words) })).filter((hit) => hit.score > 0).sort((a, b) => b.score - a.score);
  }
  function highlight(text, query) {
    const words = terms(query).map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    if (words.length === 0) return escapeHtml(text);
    const pattern = new RegExp(`(${words.join("|")})`, "gi");
    return text.split(pattern).map((part, i) => i % 2 === 1 ? `<mark>${escapeHtml(part)}</mark>` : escapeHtml(part)).join("");
  }
  function editDistance(a, b) {
    const dp = Array.from({ length: b.length + 1 }, (_, j) => j);
    for (let i = 1; i <= a.length; i++) {
      let prev = dp[0];
      dp[0] = i;
      for (let j = 1; j <= b.length; j++) {
        const temp = dp[j];
        dp[j] = Math.min(dp[j] + 1, dp[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
        prev = temp;
      }
    }
    return dp[b.length];
  }
  function didYouMean(list, query) {
    const q = normalize(query);
    if (q.length < 3) return null;
    const vocab = /* @__PURE__ */ new Set();
    for (const r of list) {
      normalize(r.name).split(/\s+/).forEach((w) => w.length > 2 && vocab.add(w));
      r.tags.forEach((t) => vocab.add(normalize(t)));
      vocab.add(normalize(r.category));
    }
    let best = null;
    let bestDist = (q.length <= 5 ? 2 : 3) + 1;
    for (const word of vocab) {
      const d = editDistance(q, word);
      if (d < bestDist) {
        best = word;
        bestDist = d;
      }
    }
    return best;
  }
  function initSearchBox(opts) {
    const { input, list, clearBtn } = opts;
    let items = [];
    let active = -1;
    const close = () => {
      items = [];
      active = -1;
      paint();
    };
    const paint = () => {
      list.innerHTML = items.map(
        (r, i) => `
        <li role="option" id="sugg-${r.id}" data-id="${r.id}" class="${i === active ? "active" : ""}" aria-selected="${i === active}">
          <span class="sugg-icon">${r.icon}</span>
          <span class="sugg-name">${highlight(r.name, input.value)}</span>
          <span class="sugg-cat">${escapeHtml(r.category)}</span>
        </li>`
      ).join("");
      list.hidden = items.length === 0;
      input.setAttribute("aria-expanded", String(items.length > 0));
      const current = items[active];
      if (current) input.setAttribute("aria-activedescendant", `sugg-${current.id}`);
      else input.removeAttribute("aria-activedescendant");
    };
    const update = () => {
      const q = input.value;
      clearBtn.hidden = q.length === 0;
      opts.onQuery(q);
      items = q.trim() ? search(opts.getResources(), q).slice(0, 5).map((h) => h.resource) : [];
      active = -1;
      paint();
    };
    const pick = (r) => {
      input.value = r.name;
      clearBtn.hidden = false;
      opts.onQuery(r.name);
      close();
      opts.onPick(r);
    };
    input.addEventListener("input", update);
    input.addEventListener("focus", () => input.value.trim() && update());
    input.addEventListener("blur", close);
    input.addEventListener("keydown", (e) => {
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
        if (chosen) {
          e.preventDefault();
          pick(chosen);
        } else close();
      } else if (e.key === "Escape") {
        if (items.length) close();
        else {
          input.value = "";
          update();
        }
      }
    });
    list.addEventListener("mousedown", (e) => {
      const li = e.target.closest("li[data-id]");
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
    document.addEventListener("keydown", (e) => {
      const typing = e.target.matches("input, textarea, select");
      if (e.key === "/" && !typing) {
        e.preventDefault();
        input.focus();
      }
    });
    return {
      setQuery(q) {
        input.value = q;
        update();
        input.focus();
      }
    };
  }

  // src/hours.ts
  var DAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var DAY_LONG = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0];
  var CLOSING_SOON_MINUTES = 60;
  function toMinutes(time) {
    const [h, m] = time.split(":").map(Number);
    return (h ?? 0) * 60 + (m ?? 0);
  }
  function formatTime(time) {
    const total = toMinutes(time);
    const h = Math.floor(total / 60);
    const m = total % 60;
    const suffix = h < 12 || h === 24 ? "am" : "pm";
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return m === 0 ? `${h12}${suffix}` : `${h12}:${String(m).padStart(2, "0")}${suffix}`;
  }
  function rangeText(range) {
    return range ? `${formatTime(range.open)}\u2013${formatTime(range.close)}` : "Closed";
  }
  function getStatus(hours, now) {
    const day = now.getDay();
    const current = now.getHours() * 60 + now.getMinutes();
    const today = hours[day];
    if (today) {
      const open = toMinutes(today.open);
      const close = toMinutes(today.close);
      if (current >= open && current < close) {
        const left = close - current;
        if (left <= CLOSING_SOON_MINUTES) {
          return { kind: "closing", label: "Closing soon", detail: `Closes in ${left} min` };
        }
        return { kind: "open", label: "Open now", detail: `Until ${formatTime(today.close)}` };
      }
      if (current < open) {
        const wait = open - current;
        const detail = wait <= 60 ? `Opens in ${wait} min` : `Opens today at ${formatTime(today.open)}`;
        return { kind: "closed", label: "Closed", detail };
      }
    }
    for (let i = 1; i <= 7; i++) {
      const next = (day + i) % 7;
      const range = hours[next];
      if (range) {
        const when = i === 1 ? "tomorrow" : DAY_LONG[next];
        return { kind: "closed", label: "Closed", detail: `Opens ${when} at ${formatTime(range.open)}` };
      }
    }
    return { kind: "closed", label: "Closed", detail: "No hours listed" };
  }
  function weeklyRows(hours, now) {
    const today = now.getDay();
    return WEEK_ORDER.map((d) => ({
      day: DAY_LONG[d],
      text: rangeText(hours[d]),
      isToday: d === today
    }));
  }
  function hoursSummary(hours) {
    const groups = [];
    for (const d of WEEK_ORDER) {
      const text = rangeText(hours[d]);
      const last = groups[groups.length - 1];
      if (last && last.text === text) last.end = d;
      else groups.push({ start: d, end: d, text });
    }
    const parts = groups.filter((g) => g.text !== "Closed").map((g) => {
      const days = g.start === g.end ? DAY_SHORT[g.start] : `${DAY_SHORT[g.start]}\u2013${DAY_SHORT[g.end]}`;
      return `${days} ${g.text}`;
    });
    return parts.length ? parts.join(" \xB7 ") : "No hours listed";
  }

  // src/report.ts
  var KEY = "crf_reports";
  var NOTE_MAX = 300;
  var REASONS = [
    "Hours are wrong",
    "Contact info is wrong",
    "Location changed",
    "Resource no longer exists",
    "Other"
  ];
  var reports = load(KEY, []);
  var target = null;
  var onChange = () => {
  };
  function reportCountFor(resourceId) {
    return reports.filter((r) => r.resourceId === resourceId).length;
  }
  function timeAgo(iso) {
    const mins = Math.round((Date.now() - new Date(iso).getTime()) / 6e4);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins} min ago`;
    const hrs = Math.round(mins / 60);
    if (hrs < 24) return `${hrs} hr ago`;
    return `${Math.round(hrs / 24)} days ago`;
  }
  function openReport(resource) {
    target = resource;
    const dialog = $("#reportDialog");
    $("#reportResource").textContent = `${resource.icon} ${resource.name}`;
    $("#reportForm").reset();
    $("#reportForm").hidden = false;
    $("#reportThanks").hidden = true;
    $("#reportSubmit").disabled = true;
    $("#noteCount").textContent = `0/${NOTE_MAX}`;
    dialog.showModal();
  }
  function renderLog() {
    const list = $("#logList");
    $("#logEmpty").hidden = reports.length > 0;
    list.innerHTML = [...reports].reverse().map(
      (r) => `
      <li class="log-item">
        <div class="log-top"><strong>${escapeHtml(r.resourceName)}</strong><span>${timeAgo(r.createdAt)}</span></div>
        <span class="log-reason">${escapeHtml(r.reason)}</span>
        ${r.note ? `<p>${escapeHtml(r.note)}</p>` : ""}
      </li>`
    ).join("");
    document.querySelectorAll("[data-report-count]").forEach((el) => {
      el.textContent = String(reports.length);
      el.hidden = reports.length === 0;
    });
  }
  function openLog() {
    renderLog();
    $("#logDialog").showModal();
  }
  function initReports(changed) {
    onChange = changed;
    const dialog = $("#reportDialog");
    const form = $("#reportForm");
    const reasons = $("#reasonChips");
    const note = $("#reportNote");
    const submit = $("#reportSubmit");
    reasons.innerHTML = REASONS.map(
      (r, i) => `
    <label class="chip-radio">
      <input type="radio" name="reason" value="${r}" ${i === 0 ? "required" : ""}>
      <span>${r}</span>
    </label>`
    ).join("");
    note.maxLength = NOTE_MAX;
    note.addEventListener("input", () => {
      $("#noteCount").textContent = `${note.value.length}/${NOTE_MAX}`;
    });
    form.addEventListener("change", () => {
      submit.disabled = !form.querySelector('input[name="reason"]:checked');
    });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const checked = form.querySelector('input[name="reason"]:checked');
      if (!checked || !target) return;
      reports.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        resourceId: target.id,
        resourceName: target.name,
        reason: checked.value,
        note: note.value.trim(),
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      });
      save(KEY, reports);
      form.hidden = true;
      $("#reportThanks").hidden = false;
      renderLog();
      onChange();
    });
    document.querySelectorAll("[data-close]").forEach(
      (btn) => btn.addEventListener("click", () => btn.closest("dialog")?.close())
    );
    document.querySelectorAll("dialog").forEach(
      (d) => d.addEventListener("click", (e) => {
        if (e.target === d) d.close();
      })
    );
    $("#logCopy").addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(JSON.stringify(reports, null, 2));
        showToast("Reports copied as JSON");
      } catch {
        showToast("Couldn't copy \u2014 your browser blocked it");
      }
    });
    $("#logClear").addEventListener("click", () => {
      if (!reports.length) return;
      reports = [];
      save(KEY, reports);
      renderLog();
      onChange();
      showToast("All reports marked as reviewed");
    });
    dialog.addEventListener("close", () => target = null);
    renderLog();
  }

  // src/responsive.ts
  var DESKTOP = window.matchMedia("(min-width: 768px)");
  function initResponsive() {
    const menuBtn = $("#menuBtn");
    const nav = $("#siteNav");
    const toTop = $("#toTop");
    const setMenu = (open) => {
      nav.classList.toggle("open", open);
      menuBtn.setAttribute("aria-expanded", String(open));
      menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };
    menuBtn.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
    nav.addEventListener("click", (e) => {
      if (e.target.closest("a, button")) setMenu(false);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setMenu(false);
    });
    DESKTOP.addEventListener("change", (e) => {
      if (e.matches) setMenu(false);
    });
    const onScroll = () => {
      toTop.classList.toggle("show", window.scrollY > 600);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    onScroll();
  }

  // src/favorites.ts
  var KEY2 = "crf_favorites";
  var favorites = new Set(load(KEY2, []));
  function isFavorite(id) {
    return favorites.has(id);
  }
  function toggleFavorite(id) {
    if (favorites.has(id)) favorites.delete(id);
    else favorites.add(id);
    save(KEY2, [...favorites]);
    return favorites.has(id);
  }

  // src/theme.ts
  var ACCENTS = [
    { name: "Lavender", color: "#6d5bd0" },
    { name: "Ocean", color: "#1f7a9e" },
    { name: "Sunset", color: "#e0582b" },
    { name: "Forest", color: "#2f8a57" },
    { name: "Berry", color: "#c2417a" }
  ];
  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    const btn = $("#themeBtn");
    btn.textContent = theme === "dark" ? "\u2600\uFE0F" : "\u{1F319}";
    btn.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
  }
  function applyAccent(color) {
    document.documentElement.style.setProperty("--accent", color);
    document.querySelectorAll(".swatch").forEach(
      (s) => s.setAttribute("aria-pressed", String(s.dataset.color === color))
    );
  }
  function initTheme() {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    let theme = load("crf_theme", prefersDark ? "dark" : "light");
    applyTheme(theme);
    $("#themeBtn").addEventListener("click", () => {
      theme = theme === "dark" ? "light" : "dark";
      applyTheme(theme);
      save("crf_theme", theme);
    });
    const swatches = $("#swatches");
    swatches.innerHTML = ACCENTS.map(
      (a) => `<button class="swatch" data-color="${a.color}" style="--sw:${a.color}" aria-label="${a.name} color" title="${a.name}"></button>`
    ).join("");
    swatches.addEventListener("click", (e) => {
      const sw = e.target.closest(".swatch");
      if (!sw?.dataset.color) return;
      applyAccent(sw.dataset.color);
      save("crf_accent", sw.dataset.color);
    });
    applyAccent(load("crf_accent", ACCENTS[0].color));
  }

  // src/main.ts
  var state = { query: "", view: "all", expanded: /* @__PURE__ */ new Set() };
  var grid = $("#grid");
  var countEl = $("#count");
  var emptyEl = $("#empty");
  function badgeHTML(s) {
    return `<span class="badge ${s.kind}"><span class="dot"></span>${s.label}</span>`;
  }
  function cardHTML(r) {
    const now = /* @__PURE__ */ new Date();
    const status = getStatus(r.hours, now);
    const fav = isFavorite(r.id);
    const open = state.expanded.has(r.id);
    const flags = reportCountFor(r.id);
    const q = state.query;
    const week = weeklyRows(r.hours, now).map((row) => `<li class="${row.isToday ? "today" : ""}"><span>${row.day}</span><span>${row.text}</span></li>`).join("");
    return `
  <article class="card status-${status.kind}" id="res-${r.id}" data-id="${r.id}" style="--cat:${CATEGORY_COLORS[r.category]}">
    <div class="card-media">
      <span class="card-emoji" aria-hidden="true">${r.icon}</span>
      <span class="cat-pill">${escapeHtml(r.category)}</span>
      <button class="star-btn" data-action="fav" data-id="${r.id}" aria-pressed="${fav}"
        aria-label="${fav ? "Remove" : "Save"} ${escapeHtml(r.name)} ${fav ? "from" : "to"} favorites">${fav ? "\u2605" : "\u2606"}</button>
    </div>
    <div class="card-body">
      <div class="card-top">
        <h3 class="name">${highlight(r.name, q)}</h3>
        <span class="js-badge">${badgeHTML(status)}</span>
      </div>
      <p class="status-detail js-detail">${status.detail}</p>
      <p class="desc">${highlight(r.desc, q)}</p>
      <p class="meta">\u{1F4CD} ${escapeHtml(r.location)}</p>
      <p class="meta">\u{1F552} ${hoursSummary(r.hours)}</p>
      ${flags ? `<p class="flag">\u26A0\uFE0F ${flags} student report${flags > 1 ? "s" : ""} \u2014 info under review</p>` : ""}
      <ul class="week" ${open ? "" : "hidden"} aria-label="Weekly hours">${week}</ul>
      <div class="card-actions">
        <button class="link-btn" data-action="details" data-id="${r.id}" aria-expanded="${open}">
          ${open ? "Hide hours \u25B4" : "Full week \u25BE"}
        </button>
        <button class="link-btn muted" data-action="report" data-id="${r.id}">Is this info wrong?</button>
      </div>
    </div>
  </article>`;
  }
  function render() {
    const focused = document.activeElement;
    const focusKey = focused?.dataset.action ? `[data-action="${focused.dataset.action}"][data-id="${focused.dataset.id}"]` : null;
    let list = search(RESOURCES, state.query).map((h) => h.resource);
    if (state.view === "favorites") list = list.filter((r) => isFavorite(r.id));
    grid.innerHTML = list.map(cardHTML).join("");
    if (list.length === 0) {
      emptyEl.hidden = false;
      countEl.textContent = "";
      const guess = state.query ? didYouMean(RESOURCES, state.query) : null;
      if (state.view === "favorites" && !state.query) {
        emptyEl.innerHTML = `<div class="empty-icon">\u2606</div><p>No favorites yet \u2014 tap the star on any resource to save it.</p>`;
      } else {
        emptyEl.innerHTML = `
        <div class="empty-icon">\u{1F50D}</div>
        <p>No resources found \u2014 try a different term.</p>
        ${guess ? `<button class="btn" data-suggest="${escapeHtml(guess)}">Did you mean \u201C${escapeHtml(guess)}\u201D?</button>` : ""}`;
      }
    } else {
      emptyEl.hidden = true;
      countEl.textContent = `${list.length} resource${list.length === 1 ? "" : "s"}`;
    }
    if (focusKey) document.querySelector(focusKey)?.focus();
  }
  function refreshStatuses() {
    const now = /* @__PURE__ */ new Date();
    grid.querySelectorAll(".card").forEach((card) => {
      const r = RESOURCES.find((x) => x.id === Number(card.dataset.id));
      if (!r) return;
      const s = getStatus(r.hours, now);
      card.className = `card status-${s.kind}`;
      card.querySelector(".js-badge").innerHTML = badgeHTML(s);
      card.querySelector(".js-detail").textContent = s.detail;
    });
  }
  function paintClock() {
    const t = /* @__PURE__ */ new Date();
    const time = t.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    $("#clock").textContent = `${DAY_LONG[t.getDay()]} \xB7 ${time}`;
  }
  function setView(view) {
    state.view = view;
    document.querySelectorAll(".tab").forEach(
      (t) => t.setAttribute("aria-pressed", String(t.dataset.view === view))
    );
    render();
  }
  function initEvents(searchBox) {
    grid.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-action]");
      if (!btn) return;
      const id = Number(btn.dataset.id);
      const r = RESOURCES.find((x) => x.id === id);
      if (!r) return;
      if (btn.dataset.action === "fav") {
        const nowFav = toggleFavorite(id);
        showToast(nowFav ? `\u2605 Saved ${r.name}` : `Removed ${r.name} from favorites`);
        render();
      } else if (btn.dataset.action === "details") {
        if (state.expanded.has(id)) state.expanded.delete(id);
        else state.expanded.add(id);
        render();
      } else if (btn.dataset.action === "report") {
        openReport(r);
      }
    });
    document.querySelectorAll(".tab").forEach(
      (t) => t.addEventListener("click", () => setView(t.dataset.view))
    );
    emptyEl.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-suggest]");
      if (btn?.dataset.suggest) searchBox.setQuery(btn.dataset.suggest);
    });
    document.querySelectorAll("[data-nav]").forEach(
      (link) => link.addEventListener("click", (e) => {
        const action = link.dataset.nav;
        if (action === "favorites") {
          e.preventDefault();
          setView("favorites");
          $("#results").scrollIntoView({ behavior: "smooth", block: "start" });
        }
        if (action === "log") {
          e.preventDefault();
          openLog();
        }
      })
    );
  }
  function start() {
    initTheme();
    initResponsive();
    initReports(render);
    const searchBox = initSearchBox({
      input: $("#searchInput"),
      list: $("#suggestions"),
      clearBtn: $("#clearSearch"),
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
      }
    });
    initEvents(searchBox);
    paintClock();
    render();
    window.setInterval(() => {
      paintClock();
      refreshStatuses();
    }, 3e4);
  }
  start();
})();
