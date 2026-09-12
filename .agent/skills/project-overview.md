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
- Unit tests = vitest 5, **all under `_tests_/` mirroring `src/`** (`_tests_/**/*.test.ts`, import via `@/…`; 81 tests). E2E = Playwright (`@playwright/test`, exact) under `_tests_/e2e/app/**` matching `src/app/**` routes; config `playwright.config.ts` spawns `next start` on :3100 via `node_modules/.bin/` (PM-agnostic). CI `e2e` job runs it; sandbox cannot (browser CDN blocked) — use `playwright test --list` locally. Generated output has ZERO runtime npm deps.
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
- Lint/format = Biome 2 (`biome.json`, singleQuote+semi+lineWidth 100). Biome has no react-hooks rules: the effect discipline (read URL via server `searchParams`, only WRITE it in effects) and Tailwind class ordering (`t-*` first, no plugin sorting anymore) are review-enforced conventions.

## Build pipeline (scripts/executer.ts)

- `dev` / `build` / `start` npm scripts go through `scripts/executer.ts` (Node 24 native type-stripping, no build step). It detects Termux (`TERMUX_VERSION`/`PREFIX`) and PRoot-Distro (`uname -a` marker) and picks `next build --webpack` there, Turbopack elsewhere (`next` 16 default, `experimental.turbopackFileSystemCache*` on). Override: `M3E_BUNDLER=webpack|turbopack` or `pnpm build -- --webpack|--turbo`. `node scripts/executer.ts info` prints the resolution.
- Cache persistence: `.next/cache` is symlinked to `.cache/m3e-build/next-cache` (override via `M3E_CACHE_ROOT`), with `webpack/` and `turbopack/` stores kept separately; existing real `.next/cache` dirs are never touched. Verified here: cold turbopack 17.5s → warm 6.3s; webpack emits zero "Caching failed for pack".
- `next.config` must stay **.mjs**: Next 16 compiles `next.config.ts` to a temp `next.config.compiled.js` and deletes it, which breaks webpack's filesystem cache ("Caching failed for pack"). Do not add custom webpack cache overrides either (breaks mini-css-extract-plugin pack resolution under the pnpm layout). Both pitfalls come from DropMod (`scripts/buildEnv.ts` was ported from there).
- Pure logic lives in `scripts/buildEnv.ts` and is unit-tested under `_tests_/scripts/` (13 tests; suite is 94).
