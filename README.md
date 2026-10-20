# Campus Resource Finder (CCNY) — Clickbait

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
