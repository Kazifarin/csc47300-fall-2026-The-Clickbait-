# Campus Atlas

**Campus Resource Finder for CCNY** · Team Clickbait

CSc 47300 — Website Design · Professor Isiah Garrow · Fall 2026

A frontend campus companion for finding study support, student essentials, and a little direction. Built with React, strict TypeScript, Vite, Tailwind CSS v4, Lucide, Motion, shadcn/ui component patterns, and a selective adaptation of Aceternity UI’s 3D card effect.

## Run locally

Use Node.js **22.18 or newer** and npm. No API keys, accounts, environment variables, database, or backend are needed.

```sh
npm ci
npm run dev
```

Open the localhost URL printed by Vite. Default: `http://127.0.0.1:5173`. If the port is busy, Vite prints another available port. Always use the same origin/port to retain the same browser-local reviews and bookmarks.

```sh
npm run typecheck   # strict TypeScript validation
npm test            # operating-hours and search/filter regression tests
npm run build       # typecheck + production assets in dist/
npm run preview     # serve the production build locally
npm run format      # format source and documentation
npm run format:check
```

Deploy the generated `dist/` folder to a static host. Use the domain root; configure Vite’s `base` if deploying under a repository subpath. The app uses anchor navigation, so no SPA route rewrites are required.

## What works

- Live, case-insensitive search across names, categories, buildings, descriptions, and service tags. Whitespace normalization, suggestions, matched-text highlighting, category filters, open-now filtering, sorting, empty states, and reset controls.
- Eight typed example resource records across six categories, shared by cards, map, details, and bookmarks.
- Interactive offline SVG campus schematic, category icon markers, map/card selection and hover synchronization, resource previews, zoom/reset controls, and scroll/keyboard panning when enlarged.
- Resource detail sheet with focus trapping, Escape dismissal, focus restoration, location notes, service tags, weekly schedules, external directions search, ratings distribution, and reviews.
- Eastern Time open/closed/closing-soon status, refreshed every 30 seconds. Split daily intervals, overnight intervals, unknown hours, next openings, and daylight-saving timezone conversion.
- Accessible native radio star selection, review validation, optional anonymous name, written reviews, derived averages, and localStorage persistence.
- Save/unsave controls, dedicated saved-resource mode, count, empty state, and persistent bookmarks.
- Responsive desktop explorer, tablet layout, mobile navigation, mobile list/map switch, and full-width mobile detail sheet.
- Original SVG architectural campus model with gentle animation and spring-damped pointer perspective, plus ambient particles. Reduced-motion support, reduced mobile particle density, stable mobile model, and offscreen/hidden-document animation pausing.

## Honest demo data

This is a **classroom frontend demonstration**, not an official CCNY directory.

- Resource names represent campus support examples. Building associations, rooms, locations, and schedules have **not been verified**. They are explicitly labeled as examples in the UI.
- The pantry deliberately demonstrates unknown hours. Unknown hours are never considered open by the filter.
- Map positions are **schematic percentages**, not latitude/longitude. The campus model and map are illustrative and not to scale.
- No phone numbers or exact room numbers have been invented. Directions open a Google Maps place **search**, not an asserted verified destination.
- Two fictional reviews are labeled **Demo review**. User-submitted reviews are stored only in the current browser, separately from the sample data.
- Status reflects the **example schedule**, not confirmed real-world availability. Holidays, academic breaks, appointment availability, and exceptional closures are not modeled.
- Core functionality requires no remote requests after the app has loaded. There is no service worker: offline-ready means bundled data, drawings, and controls, not guaranteed offline installation or caching.
- Fonts use an offline system stack. All visual artwork is original SVG/CSS; there are no external image or font dependencies.

Before real student use, replace the demo dataset with verified details and real holiday exceptions. The app itself needs no backend for the midterm.

## Files to know

```text
src/
  App.tsx                           Shared state, navigation, discovery and explorer
  types.ts                          Resource, category, schedule, review and filter types
  data/resources.ts                 Single demo resource source and fictional reviews
  components/
    hero/CampusScene.tsx            Original model and visibility-aware particles
    map/CampusMap.tsx               Interactive offline schematic and category icons
    resources/ResourceCard.tsx      Results, highlighting, bookmark and status controls
    resources/ResourceDetail.tsx    Accessible detail sheet, hours, reviews and form
    ui/button.tsx                  Adapted shadcn/ui Button / Slot / CVA pattern
    ui/3d-card.tsx                  Adapted Aceternity perspective-card pattern
  hooks/useLocalStorage.ts          Validated reads and graceful persistence failures
  lib/hours.ts                     America/New_York scheduling logic
  lib/search.ts                    Search and combined-filter logic
  lib/*.test.ts                    Meaningful regression tests
  styles.css                       Tokens, composition, breakpoints and motion
```

Storage keys: `campus-atlas:saved:v1` and `campus-atlas:reviews:v1`. Corrupt or invalid records fall back to empty state. If writes are blocked or storage is full, the UI warns that changes will only last for the current session. Tabs do not synchronize state live; refresh to read changes from another tab.

## Team demonstration (10–20 minutes)

1. **Rahat — responsive experience:** introduce the landing page, original campus model, category layout, mobile menu and list/map views.
2. **Ferdosi — search:** search `writing center`, combine categories, try an empty result, reset, and sort.
3. **Mehzabin — hours:** open a detail sheet, explain Eastern Time, the highlighted current day, split hours, and the pantry’s unknown status. After-hours open-now results may correctly be empty.
4. **Aung — reviews:** submit an invalid review to show validation; choose a rating and write a comment; see the average update; refresh and reopen to show persistence. Identify the fictional demo labels.
5. Show marker selection, preview/details, zoom and reset, then bookmark a resource and open **Saved**.

## Design/component references

- [Apple](https://www.apple.com/): restrained type, page rhythm and product storytelling.
- [shadcn/ui Vite setup](https://ui.shadcn.com/docs/installation/vite): source-owned component conventions, CSS tokens, Slot and class-variance-authority Button pattern. `components.json` configures aliases and Tailwind v4 support.
- [Aceternity UI 3D Card](https://ui.aceternity.com/components/3d-card-effect): a custom, reduced-motion-aware adaptation for one featured category card. This is a source component, not a package requiring a global Aceternity runtime. The official registry is configured in `components.json`.
- [21st.dev](https://21st.dev/): reviewed as a component/design discovery reference; no specific third-party template was copied.
- [Radix Dialog](https://www.radix-ui.com/primitives/docs/components/dialog): accessible dialog behavior beneath the custom sheet styling.

## Verification and limitations

See `COMPLETED_TASKS.txt` for the implementation record and actual verification results. Browser verification used desktop, 768px tablet, 390px mobile, and 320px narrow-phone viewports. A complete WCAG audit, real-device/Safari testing, real campus data verification, and production deployment are outside the completed checks.

Team: Kazi Farin Mehzabin · Ferdosi Hossain · ATM Rahat Hossain · Aung Latt
