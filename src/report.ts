// FEATURE 3 — Report Outdated Info (Aung Latt)
// Anonymous, no-login reports. Saved in the browser for now (frontend only);
// in the final project this can POST to a backend instead.

import type { IssueReport, ReportReason, Resource } from "./types.js";
import { $, escapeHtml, load, save, showToast } from "./utils.js";

const KEY = "crf_reports";
const NOTE_MAX = 300;

export const REASONS: ReportReason[] = [
  "Hours are wrong",
  "Contact info is wrong",
  "Location changed",
  "Resource no longer exists",
  "Other",
];

let reports: IssueReport[] = load<IssueReport[]>(KEY, []);
let target: Resource | null = null;
let onChange: () => void = () => {};

export function getReports(): IssueReport[] {
  return reports;
}

export function reportCountFor(resourceId: number): number {
  return reports.filter((r) => r.resourceId === resourceId).length;
}

function timeAgo(iso: string): string {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  return `${Math.round(hrs / 24)} days ago`;
}

export function openReport(resource: Resource): void {
  target = resource;
  const dialog = $<HTMLDialogElement>("#reportDialog");
  $<HTMLElement>("#reportResource").textContent = `${resource.icon} ${resource.name}`;
  $<HTMLFormElement>("#reportForm").reset();
  $<HTMLFormElement>("#reportForm").hidden = false;
  $<HTMLElement>("#reportThanks").hidden = true;
  $<HTMLButtonElement>("#reportSubmit").disabled = true;
  $<HTMLElement>("#noteCount").textContent = `0/${NOTE_MAX}`;
  dialog.showModal();
}

function renderLog(): void {
  const list = $<HTMLUListElement>("#logList");
  $<HTMLElement>("#logEmpty").hidden = reports.length > 0;
  list.innerHTML = [...reports]
    .reverse()
    .map(
      (r) => `
      <li class="log-item">
        <div class="log-top"><strong>${escapeHtml(r.resourceName)}</strong><span>${timeAgo(r.createdAt)}</span></div>
        <span class="log-reason">${escapeHtml(r.reason)}</span>
        ${r.note ? `<p>${escapeHtml(r.note)}</p>` : ""}
      </li>`
    )
    .join("");
  document.querySelectorAll<HTMLElement>("[data-report-count]").forEach((el) => {
    el.textContent = String(reports.length);
    el.hidden = reports.length === 0;
  });
}

export function openLog(): void {
  renderLog();
  $<HTMLDialogElement>("#logDialog").showModal();
}

export function initReports(changed: () => void): void {
  onChange = changed;

  const dialog = $<HTMLDialogElement>("#reportDialog");
  const form = $<HTMLFormElement>("#reportForm");
  const reasons = $<HTMLDivElement>("#reasonChips");
  const note = $<HTMLTextAreaElement>("#reportNote");
  const submit = $<HTMLButtonElement>("#reportSubmit");

  reasons.innerHTML = REASONS.map(
    (r, i) => `
    <label class="chip-radio">
      <input type="radio" name="reason" value="${r}" ${i === 0 ? "required" : ""}>
      <span>${r}</span>
    </label>`
  ).join("");

  note.maxLength = NOTE_MAX;
  note.addEventListener("input", () => {
    $<HTMLElement>("#noteCount").textContent = `${note.value.length}/${NOTE_MAX}`;
  });

  // Submit is disabled until a reason is picked
  form.addEventListener("change", () => {
    submit.disabled = !form.querySelector<HTMLInputElement>('input[name="reason"]:checked');
  });

  form.addEventListener("submit", (e: SubmitEvent) => {
    e.preventDefault();
    const checked = form.querySelector<HTMLInputElement>('input[name="reason"]:checked');
    if (!checked || !target) return;
    reports.push({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      resourceId: target.id,
      resourceName: target.name,
      reason: checked.value as ReportReason,
      note: note.value.trim(),
      createdAt: new Date().toISOString(),
    });
    save(KEY, reports);
    form.hidden = true;
    $<HTMLElement>("#reportThanks").hidden = false;
    renderLog();
    onChange();
  });

  document.querySelectorAll<HTMLButtonElement>("[data-close]").forEach((btn) =>
    btn.addEventListener("click", () => btn.closest("dialog")?.close())
  );

  // Click on the dark backdrop closes any dialog
  document.querySelectorAll<HTMLDialogElement>("dialog").forEach((d) =>
    d.addEventListener("click", (e) => {
      if (e.target === d) d.close();
    })
  );

  $<HTMLButtonElement>("#logCopy").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(reports, null, 2));
      showToast("Reports copied as JSON");
    } catch {
      showToast("Couldn't copy — your browser blocked it");
    }
  });

  $<HTMLButtonElement>("#logClear").addEventListener("click", () => {
    if (!reports.length) return;
    reports = [];
    save(KEY, reports);
    renderLog();
    onChange();
    showToast("All reports marked as reviewed");
  });

  dialog.addEventListener("close", () => (target = null));
  renderLog();
}
