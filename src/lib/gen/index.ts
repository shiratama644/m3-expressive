import type { M3EConfig } from '@/lib/m3e/config';
import { makeContext, type GenFile } from './common';
import type { PackageManager } from './pm';
import { nextFiles } from './next';
import { reactFiles } from './react';
import { vueFiles } from './vue';
import { tailwindFiles } from './tailwind';

export * from './pm';
export type { GenFile, GenContext } from './common';
export { makeContext, generateTokensCss, generateReadme, fontDeps } from './common';

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
): GenFile[] {
  const ctx = makeContext(config, pm);
  switch (framework) {
    case 'next':
      return nextFiles(ctx);
    case 'react':
      return reactFiles(ctx);
    case 'vue':
      return vueFiles(ctx);
    case 'tailwind':
      return tailwindFiles(ctx);
  }
}
