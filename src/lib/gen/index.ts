import type { M3EConfig } from '@/lib/m3e/config';
import { type GenFile, makeContext } from './common';
import { type ExportTarget, extraFiles } from './native';
import { nextFiles } from './next';
import type { PackageManager } from './pm';
import { reactFiles } from './react';
import { tailwindFiles } from './tailwind';
import { vueFiles } from './vue';

export type { GenContext, GenFile } from './common';
export { fontDeps, generateReadme, generateTokensCss, makeContext } from './common';
export * from './native';
export * from './pm';

export const FRAMEWORKS = ['next', 'react', 'vue', 'tailwind'] as const;
export type Framework = (typeof FRAMEWORKS)[number];

export const FRAMEWORK_META: Record<Framework, { label: string; tagline: string }> = {
  next: { label: 'Next.js', tagline: 'App Router + Tailwind v4' },
  react: { label: 'React', tagline: 'Vite + Tailwind v4' },
  vue: { label: 'Vue', tagline: 'Vue 3 + Vite + Tailwind v4' },
  tailwind: { label: 'Tailwind CSS', tagline: 'any stack / no framework' },
};

export function generateFiles(
  config: M3EConfig,
  framework: Framework,
  pm: PackageManager,
  extras: readonly ExportTarget[] = [],
): GenFile[] {
  const ctx = makeContext(config, pm);
  const base =
    framework === 'next'
      ? nextFiles(ctx)
      : framework === 'react'
        ? reactFiles(ctx)
        : framework === 'vue'
          ? vueFiles(ctx)
          : tailwindFiles(ctx);
  return [...base, ...extraFiles(config, extras)];
}
