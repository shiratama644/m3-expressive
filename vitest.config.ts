import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.d.ts',
        'src/app/icon.svg',
        // layout.tsx: next/font/local は Next のビルド時変換产物 (.next) を import するため、
        // vitest から読み込めない（ビルド済み CI の e2e が描画を保証する）。
        'src/app/layout.tsx',
      ],
      // 90% repo-wide goal is LIVE since 2026-09-12 (M1+M3 landed; measured
      // 95.5/90.6/93.3/96.3 for stmts/branch/funcs/lines). See docs/planning/COVERAGE_PLAN.md.
      thresholds: { lines: 90, functions: 90, branches: 90, statements: 90 },
      reporter: ['text', 'html'],
    },
    include: ['_tests_/**/*.test.ts', '_tests_/**/*.test.tsx'],
    // @material/material-color-utilities の scheme_*.js は拡張子なしの相対 import を使うため、
    // Node の素の ESM 解決では動かない（Vite 経由で解決させる）
    server: {
      deps: {
        inline: [/@material\/material-color-utilities/],
      },
    },
  },
});
