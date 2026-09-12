---
name: project-overview
description: What m3-expressive is, its stack, repo conventions, and progress — first read for a new session.
last_updated: 2026-09-12
---

# Project overview

## 1. Product

M3E Studio — a Next.js site that generates Material 3 Expressive themes (color/shape/typography/motion) from one seed color, with live preview and export for **Next.js / React / Vue / Tailwind CSS** × **bun / pnpm / npm / yarn** (16 combos). Routes: `/` landing, `/studio` (controls + preview + Code tab), `/docs`, `/tokens`.

## 2. Stack & hard constraints

- Next 16 + React 19 + Tailwind v4 + TS strict + Dexie 4 (IndexedDB presets). Node **24 LTS** only (`.nvmrc`, `engines >=24`).
- Deps **exact-pinned**, single `pnpm-lock.yaml`, **no `packageManager` field** (intentional). CI matrix runs install+build on all 4 PMs (Node 24).
- Fonts self-hosted via Fontsource npm (sandbox egress blocks Google Fonts CDN — keep it that way).
- Unit tests = vitest 5, **all under `tests/` mirroring `src/`** (`tests/**/*.test.ts`, import via `@/…`; 80 tests). E2E = Playwright (`@playwright/test`, exact) under `tests/e2e/app/**` matching `src/app/**` routes; config `playwright.config.ts` spawns `next start` on :3100 via `node_modules/.bin/` (PM-agnostic). CI `e2e` job runs it; sandbox cannot (browser CDN blocked) — use `playwright test --list` locally. Generated output has ZERO runtime npm deps.
- No material-web library — M3E components are hand-rolled (upstream doesn't support M3E).

## 3. Data flow (single source of truth!)

`M3EConfig` (lib/m3e/config.ts) → `buildTheme` → `ThemeBundle` → `renderThemeCss` / `tokensFromBundle` / `generateFiles`. Studio state (`components/studio/state.ts`) is a superset (mode/tab + config) serialized to URL params by `stateToParams`. Never render colors outside this chain.

## 4. Progress

GEN-1..GEN-11 done: token engine, studio (preview/code/a11y tabs), pages, CI matrix, preset gallery (Dexie), tokens.json import round-trip, Style-Dictionary/Compose/Android-XML export targets. PR #1 open (merge on hold by user).

## 5. Environment quirks (sandbox)

- Egress: only registry.npmjs.org + github.com + api.github.com. `registry.yarnpkg.com` unreachable → test yarn with `--registry https://registry.npmjs.org`.
- Local Node is 22 (24 unobtainable) → `yarn run` refuses (engines). CI on 24 is unaffected.
- Playwright browser download (`cdn.playwright.dev`) is blocked; browsers exist only in CI.
- pnpm/bun may be missing from PATH after a sandbox rebuild; use
  `COREPACK_NPM_REGISTRY=https://registry.npmjs.org corepack pnpm@12.4.1 <cmd>` (registry.npmjs.org is the only reachable npm mirror).
- `pnpm typecheck` needs `pnpm build` first (typed routes).
- ESLint (Next 16) enables `react-hooks/set-state-in-effect`: read URL via server `searchParams`, only WRITE it in effects.
