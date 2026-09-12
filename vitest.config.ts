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
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    // @material/material-color-utilities の scheme_*.js は拡張子なしの相対 import を使うため、
    // Node の素の ESM 解決では動かない（Vite 経由で解決させる）
    server: {
      deps: {
        inline: [/@material\/material-color-utilities/],
      },
    },
  },
});
