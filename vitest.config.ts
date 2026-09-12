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
      exclude: ['src/**/*.d.ts', 'src/app/icon.svg'],
      // 90% is the repo-wide goal — see docs/planning/COVERAGE_PLAN.md.
      // thresholds intentionally NOT enforced yet (plan tracks the ramp-up).
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
