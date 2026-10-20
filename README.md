# Campus Resource Finder (CCNY) — Clickbait

## Campus Atlas UI

The current design is **HTML + native CSS + plain TypeScript**, compiled to a small browser script. There is **no React, frontend framework, UI library, icon package, animation library, backend, database, or API connection**. TypeScript and esbuild are development tools only.

The Campus Atlas design adapts the original visual brief with warm off-white surfaces, restrained purple accents, larger typography, a custom SVG architectural campus model, ambient CSS particles, and damped pointer perspective built with requestAnimationFrame. It includes keyboard-friendly category shortcuts, category/open-now filters, saved-resource counts, light/dark themes, and a responsive mobile menu. Resource cards enter with a brief stagger, discovery cards and controls respond to hover/press, and theme changes transition smoothly. Motion follows reduced-motion preferences. Native HTML dialogs handle reporting.

All resource details are sample data bundled in `src/data.ts`. The UI labels them as a classroom demonstration. Bookmarks, theme choices, and reports stay in localStorage on the current browser and origin. No report is sent to the college. Availability uses America/New_York; holidays and other exceptions are not included.

### Preview the redesigned project

```sh
npm ci
npm run build
python -m http.server 8080 --bind 127.0.0.1 --directory .
```

Open `http://127.0.0.1:8080/`. Python only serves the static files locally; it is not an application backend. You can also open `index.html` directly or use your editor's static preview server. After TypeScript changes, run `npm run build` and refresh; `npm run watch` rebuilds changes automatically. No packages need to be loaded from a CDN.

UI files: `index.html`, `css/styles.css`, `src/responsive.ts`, `src/icons.ts`, `src/visuals.ts`, `src/theme.ts`, and `assets/campus-model.svg`. Search, hours, favorites, and reporting retain the original feature modules. The model is an original illustration, not a geographical map.

Accessibility includes visible focus, semantic/native controls, a skip link, keyboard-operable search suggestions and dialogs, reduced-motion handling, and a simplified mobile scene. Animated elements pause offscreen and while the document is hidden. See `UI_UPDATE_REPORT.txt` for verification and limitations.

CSc 47300 midterm. Frontend only, written in **TypeScript**.

## Features & owners
| # | Feature | Owner | File |
|---|---------|-------|------|
| 1 | Search by Name or Type | Ferdosi Hossain | `src/search.ts` |
| 2 | Hours & Open-Now Status | Kazi Mehzabin | `src/hours.ts` |
| 3 | Report Outdated Info | Aung Latt | `src/report.ts` |
| 4 | Responsive Design | Rahat Hossain | `css/styles.css`, `src/responsive.ts` |

Shared: `src/main.ts` (connects everything), `src/data.ts` (resource list), `src/types.ts`, `src/utils.ts`, `src/favorites.ts` (star button), `src/theme.ts` (dark mode + color picker).

## Run it
Just double-click `index.html` (or use Live Server in VS Code). The compiled code is already in `dist/app.js`.

## Change the code
1. Install **Node.js** (nodejs.org, LTS).
2. Open this folder in VS Code → Terminal → New Terminal:
   ```
   npm install
   npm run build
   ```
   `npm run build` checks the TypeScript for errors and compiles everything into `dist/app.js`.
3. Refresh the page.

## Edit flow
Change `.ts` files in `src/` only → they compile into `dist/`. Never edit `dist/` by hand.
