import { MOTION_DURATIONS, MOTION_EASINGS } from '@/lib/m3e/motion';
import { M3E_COLOR_ROLES } from '@/lib/m3e/roles';
import { SHAPE_SIZES } from '@/lib/m3e/shape';
import { TYPE_ROLES } from '@/lib/m3e/typography';
import {
  banner,
  type GenContext,
  type GenFile,
  generateReadme,
  generateTokensCss,
  generateTokensJsonFile,
} from './common';
import { PM } from './pm';

export function tailwindFiles(ctx: GenContext): GenFile[] {
  const { prefix } = ctx;
  // input.css keeps Tailwind OUT (v3-compatible core stylesheet)
  const inputCss = generateTokensCss(ctx, { withTailwind: false });

  const colors = M3E_COLOR_ROLES.map((r) => `    '${r}': 'var(--${prefix}-color-${r})',`).join(
    '\n',
  );
  const radii = Object.keys(SHAPE_SIZES)
    .map((n) => `    '${n}': 'var(--${prefix}-shape-corner-${n})',`)
    .join('\n');
  const shapes = Object.keys(ctx.bundle.shared)
    .filter((k) => k.startsWith(`--${prefix}-shape-`) && !k.includes('-corner-'))
    .map((k) => `    '${k.slice(prefix.length + 7)}': 'var(${k})',`)
    .join('\n');
  const durations = Object.keys(MOTION_DURATIONS)
    .map((d) => `    '${d}': 'var(--${prefix}-motion-duration-${d})',`)
    .join('\n');
  const easings = Object.keys(MOTION_EASINGS)
    .map((e) => `    '${e}': 'var(--${prefix}-motion-easing-${e})',`)
    .join('\n');
  const fontSize = TYPE_ROLES.map(
    (r) =>
      `    '${r}': [\n      'var(--${prefix}-typescale-${r}-size)',\n      {\n        lineHeight: 'var(--${prefix}-typescale-${r}-line-height)',\n        letterSpacing: 'var(--${prefix}-typescale-${r}-letter-spacing)',\n        fontWeight: 'var(--${prefix}-typescale-${r}-weight)',\n      },\n    ],`,
  ).join('\n');

  const config = `${banner(ctx, 'Tailwind v3 config mapping M3E tokens (skip this file on v4 — the CSS @theme does it)')}
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{html,js,ts,jsx,tsx,vue}'],
  theme: {
    extend: {
      colors: {
${colors}
      },
      borderRadius: {
${radii}
${shapes}
      },
      fontSize: {
${fontSize}
      },
      fontFamily: {
        sans: ['var(--${prefix}-font-plain)'],
        brand: ['var(--${prefix}-font-brand)'],
      },
      transitionDuration: {
${durations}
      },
      transitionTimingFunction: {
${easings}
      },
      keyframes: {
        'm3e-spin': { to: { transform: 'rotate(360deg)' } },
      },
      animation: {
        'm3e-spin': 'm3e-spin 1.4s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
`;

  const html = `${banner(ctx, 'Static demo — works with the compiled output of input.css')}
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Material 3 Expressive — plain Tailwind demo</title>
    <link rel="stylesheet" href="./dist/output.css" />
  </head>
  <body class="bg-background font-sans text-on-background">
    <main class="mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-4 p-6">
      <h1 class="t-display-small text-on-surface">Expressive, from CSS.</h1>
      <p class="t-body-medium text-on-surface-variant">
        No build-time JS, no component library — just custom properties.
      </p>
      <div class="flex gap-3">
        <button
          class="m3e-press inline-flex h-10 items-center rounded-button bg-primary px-6 t-label-large text-on-primary active:scale-[0.95]"
          onclick="document.documentElement.classList.toggle('dark')"
        >
          Toggle dark
        </button>
        <button
          class="m3e-press inline-flex h-10 items-center rounded-button border border-outline px-6 t-label-large text-primary active:scale-[0.95]"
        >
          Outlined
        </button>
      </div>
      <div class="rounded-card bg-surface-container p-5">
        <p class="t-title-medium text-on-surface">Filled card</p>
        <p class="t-body-small text-on-surface-variant">Shape, color and type all come from tokens.</p>
        <div class="mt-4 h-1 w-full rounded-progress bg-surface-container-highest overflow-hidden">
          <div class="h-1 w-2/3 rounded-r-full bg-primary"></div>
        </div>
      </div>
    </main>
  </body>
</html>
`;

  return [
    { path: 'src/input.css', lang: 'css', content: inputCss },
    { path: 'tailwind.config.ts', lang: 'ts', content: config },
    { path: 'index.html', lang: 'html', content: html },
    generateTokensJsonFile(ctx),
    generateReadme(ctx, {
      framework: 'Tailwind CSS (any stack)',
      steps: [
        `Install the Tailwind CLI (v4): \`${PM[ctx.pm].addDev(['tailwindcss', '@tailwindcss/cli'])}\``,
        'Place `src/input.css` (tokens + Tailwind) and build it:',
        `\`${PM[ctx.pm].exec('@tailwindcss/cli', '-i src/input.css -o dist/output.css --watch')}\``,
        'Open `index.html` next to `dist/output.css`',
        '(`tailwind.config.ts` is only needed for Tailwind v3 — v4 reads the CSS)',
      ],
      files: [
        { path: 'src/input.css', purpose: 'all M3E tokens + utilities + @theme' },
        { path: 'tailwind.config.ts', purpose: 'v3 mapping (optional)' },
        { path: 'index.html', purpose: 'framework-free demo' },
        { path: 'tokens.json', purpose: 'W3C DTCG tokens' },
      ],
    }),
  ];
}
