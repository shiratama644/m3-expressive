---
name: m3e-pipelines
description: How the m3-expressive repo generates CSS/JSON from tokens, and how the code-generator package-manager helpers compose commands.
last_updated: 2026-09-12
---

# m3e generation pipelines

## 1. Overview

Two pure functions own every generated artifact. Nothing else may emit CSS or
package-manager command strings.

- `src/lib/m3e/css.ts` → `buildTheme(config)` / `renderThemeCss(bundle, opts)`
- `src/lib/gen/*` → `generateFiles(config, framework, pm)` (+ `src/lib/gen/pm.ts`)

## 2. Implementation notes

- `buildTheme` returns `ThemeBundle { shared, light, dark, tonal }` (hex maps).
  Everything else **derives from the bundle**: `tokensJson.ts` re-parses
  `renderThemeCss` output; do not re-derive colors separately or the two can drift.
- Color math delegates to `@material/material-color-utilities` (`DynamicScheme`,
  tonalSpot). The 2025-variant fixed tones are **78/77 (spot), 78/73 (expressive)**,
  on-fixed 20/16; 90/80/10/30 belongs to specVersion '2021' only. Contrast ±
  rescales palette chroma _and_ compresses fixed tones (0.5 → 49).
- Generated CSS targets the class dark strategy: selector is `.dark,
[data-m3e-theme="dark"]`, never a bare media query — tests assert on it.
- PM command strings (`lib/gen/pm.ts`) are the ONLY place that composes
  `bun|pnpm|npm|yarn` invocations. The studio UI imports the same table; never
  hard-code `$ pnpm …` in components.
- `highlight.ts` escapes first, then tokenizes once — any change risks nested-tag
  injection; keep the single-regex pass.

## 3. Pitfalls

- `pnpm typecheck` fails with TS2344 `PageProps<'/studio'>` unless `next build`
  ran first (Next 16 generates route types during build). Verify order:
  build → typecheck → lint → test.
- `react-hooks/set-state-in-effect` (enabled via Next 16 eslint): never bootstrap
  state from `window.location.search` in an effect. Read `searchParams`
  server-side in `page.tsx` and pass an `initialState` prop; effects may only
  WRITE the URL (`history.replaceState`).
- Generated output must stay dependency-free: fontsource imports are optional
  comments, not required runtime deps.
