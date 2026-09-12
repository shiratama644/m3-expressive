import { buildColorSchemes, palettesFor, paletteHex } from './color';
import { clampConfig, prefixFor, type M3EConfig } from './config';
import { M3E_COLOR_ROLES } from './roles';
import {
  MOTION_DURATIONS,
  MOTION_EASINGS,
  MOTION_PATTERNS,
  SPRING_USAGES,
  cubicBezierCss,
  solveSpring,
  springFor,
} from './motion';
import { NAMED_SHAPES, SHAPE_SIZES, namedShapeCss, shapeSizePx } from './shape';
import { TYPE_ROLES, TYPE_SCALE, fontStack, resolveType } from './typography';

export type VarMap = Record<string, string>;

export interface ThemeBundle {
  config: M3EConfig;
  /** theme-independent vars (shape, motion, type sizes) */
  shared: VarMap;
  light: VarMap;
  dark: VarMap;
  /** per-variant tonal palettes, for swatch strips (light scheme) */
  tonal: { name: string; tones: { tone: number; hex: string }[] }[];
}

const ELEVATION_TO_SURFACE: Record<number, string> = {
  0: 'surface',
  1: 'surface-container-low',
  2: 'surface-container',
  3: 'surface-container-high',
  4: 'surface-container-highest',
  5: 'surface-bright',
};

export function buildTheme(input: M3EConfig): ThemeBundle {
  const config = clampConfig(input);
  const p = prefixFor(config.naming);
  const { light, dark, schemes } = buildColorSchemes({
    seed: config.seed,
    variant: config.variant,
    contrast: config.contrast,
  });

  // ---- shared vars -------------------------------------------------------
  const shared: VarMap = {};

  // shape: corner sizes + named shapes (with emphasis & boost applied)
  for (const name of Object.keys(SHAPE_SIZES)) {
    shared[`--${p}-shape-corner-${name}`] =
      `${shapeSizePx(name as keyof typeof SHAPE_SIZES, config.shapeEmphasis)}px`;
  }
  shared[`--${p}-shape-corner-full`] = '9999px';
  for (const name of Object.keys(NAMED_SHAPES)) {
    shared[`--${p}-shape-${name}`] = namedShapeCss(
      name as keyof typeof NAMED_SHAPES,
      config.cornerBoost,
      config.shapeEmphasis,
    );
  }
  // component shape aliases (M3E component defaults)
  const as = config.asymmetry;
  const componentShapes: Record<string, string> = {
    button: 'pill',
    'icon-button': 'circle',
    fab: 'circle',
    'extended-fab': 'pill',
    'small-fab': 'circle',
    chip: 'pill',
    card: 'extra-large',
    'carousel-item': as ? 'extra-large-bottom' : 'extra-large',
    dialog: 'extra-large',
    sheet: as ? 'extra-large-top' : 'large',
    'bottom-sheet': as ? 'extra-large-top' : 'extra-large',
    'search-bar': 'pill',
    menu: 'extra-small',
    snackbar: 'extra-small',
    'top-app-bar': 'none',
    badge: 'pill',
    switch: 'pill',
    slider: 'pill',
    textfield: 'extra-small-top',
    progress: 'pill',
  };
  for (const [comp, shape] of Object.entries(componentShapes)) {
    shared[`--${p}-shape-${comp}`] = namedShapeCss(
      shape as keyof typeof NAMED_SHAPES,
      config.cornerBoost,
      config.shapeEmphasis,
    );
  }

  // motion: durations, easings, springs
  for (const [name, ms] of Object.entries(MOTION_DURATIONS)) {
    shared[`--${p}-motion-duration-${name}`] = `${ms}ms`;
  }
  for (const name of Object.keys(MOTION_EASINGS)) {
    shared[`--${p}-motion-easing-${name}`] = cubicBezierCss(name as keyof typeof MOTION_EASINGS);
  }
  for (const usage of SPRING_USAGES) {
    const { stiffness, damping } = springFor(config.motionScheme, usage);
    shared[`--${p}-motion-spring-${usage}-stiffness`] = String(stiffness);
    shared[`--${p}-motion-spring-${usage}-damping`] = String(damping);
    const spring = solveSpring(stiffness, damping);
    shared[`--${p}-motion-spring-${usage}-duration`] = `${spring.durationMs}ms`;
    shared[`--${p}-motion-spring-${usage}-easing`] = config.useSprings
      ? spring.easingCss
      : `var(--${p}-motion-easing-emphasized)`;
    const dur = config.useSprings
      ? `var(--${p}-motion-spring-${usage}-duration)`
      : `var(--${p}-motion-duration-${usage.includes('effects') ? 'medium1' : 'medium2'})`;
    const ease = `var(--${p}-motion-spring-${usage}-easing)`;
    shared[`--${p}-motion-transition-${usage}`] = `${dur} ${ease}`;
  }
  for (const [pattern, spec] of Object.entries(MOTION_PATTERNS)) {
    const spatial = spec.spatial;
    const usage = spatial
      ? pattern.includes('shape') || pattern.includes('icon')
        ? 'fast-spatial'
        : 'default-spatial'
      : 'default-effects';
    shared[`--${p}-motion-pattern-${pattern}-duration`] = config.useSprings
      ? `var(--${p}-motion-spring-${usage}-duration)`
      : `var(--${p}-motion-duration-${spec.duration})`;
    shared[`--${p}-motion-pattern-${pattern}-easing`] = config.useSprings
      ? `var(--${p}-motion-spring-${usage}-easing)`
      : `var(--${p}-motion-easing-${spec.easing})`;
  }

  // typography
  const family = config.typeFamily;
  shared[`--${p}-font-brand`] = fontStack(family, 'brand');
  shared[`--${p}-font-plain`] = fontStack(family, 'plain');
  for (const role of TYPE_ROLES) {
    const r = resolveType(role, {
      scale: config.typeScale,
      family,
      opticalSize: config.opticalSize,
    });
    shared[`--${p}-typescale-${role}-size`] = `${r.sizePx}px`;
    shared[`--${p}-typescale-${role}-line-height`] = `${r.lineHeightPx}px`;
    shared[`--${p}-typescale-${role}-letter-spacing`] = `${r.letterSpacingEm}em`;
    shared[`--${p}-typescale-${role}-weight`] = String(r.weight);
    shared[`--${p}-typescale-${role}-font`] = `var(--${p}-font-${TYPE_SCALE[role].font})`;
  }

  // elevation → surface container mapping (M3 2024+)
  for (const [elev, role] of Object.entries(ELEVATION_TO_SURFACE)) {
    shared[`--${p}-elevation-${elev}`] = `var(--${p}-color-${role})`;
  }

  // ---- light / dark color vars ------------------------------------------
  const colorsFor = (scheme: typeof light): VarMap => {
    const out: VarMap = {};
    for (const role of M3E_COLOR_ROLES) {
      out[`--${p}-color-${role}`] = scheme[role];
    }
    return out;
  };

  const core = palettesFor(schemes.light);
  const tones = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99, 100];
  const tonal = Object.entries(core).map(([name, palette]) => ({
    name,
    tones: tones.map((tone) => ({ tone, hex: paletteHex(palette, tone) })),
  }));

  return { config, shared, light: colorsFor(light), dark: colorsFor(dark), tonal };
}

// ---- CSS text -------------------------------------------------------------

export function varBlock(vars: VarMap, selector: string, indent = '  '): string {
  const body = Object.entries(vars)
    .filter(([, v]) => v !== '')
    .map(([k, v]) => `${indent}${k}: ${v};`)
    .join('\n');
  return `${selector} {\n${body}\n}`;
}

export interface CssOptions {
  darkMode: 'media' | 'class';
  /** wrap with Tailwind v4 `@theme inline` block for tailwind integration */
  tailwindTheme?: boolean;
}

export function renderThemeCss(bundle: ThemeBundle, opts: CssOptions): string {
  const lines: string[] = [];
  lines.push(varBlock({ ...bundle.shared, ...bundle.light }, ':root'));
  if (opts.darkMode === 'class') {
    lines.push(varBlock(bundle.dark, `.dark, [data-m3e-theme="dark"]`));
  } else {
    lines.push(
      `@media (prefers-color-scheme: dark) {\n${indent(varBlock(bundle.dark, ':root'))}\n}`,
    );
  }
  lines.push(
    '@media (prefers-reduced-motion: reduce) {\n' +
      '  *, *::before, *::after {\n' +
      '    animation-duration: 0.01ms !important;\n' +
      '    transition-duration: 0.01ms !important;\n' +
      '  }\n' +
      '}',
  );
  let css = lines.join('\n\n') + '\n';
  if (opts.tailwindTheme) {
    css = renderTailwindThemeBlock(bundle) + '\n' + css;
  }
  return css;
}

/** Tailwind v4 `@theme inline` mapping: colors, radii, fonts, text styles → utilities */
export function renderTailwindThemeBlock(bundle: ThemeBundle): string {
  const p = prefixFor(bundle.config.naming);
  const colorVarPrefix = `--${p}-color-`;
  const out: string[] = [];
  const colors = Object.keys({ ...bundle.shared, ...bundle.light })
    .filter((k) => k.startsWith(colorVarPrefix))
    .map((k) => `  --color-${k.slice(colorVarPrefix.length)}: var(${k});`)
    .join('\n');
  out.push(colors);

  const radii = Object.keys(bundle.shared)
    .filter((k) => k.startsWith(`--${p}-shape-corner-`))
    .map((k) => `  --radius-${k.slice(`--${p}-shape-corner-`.length)}: var(${k});`)
    .join('\n');
  out.push(radii);

  // component + named shapes (button, card, sheet, pill, …) as rounded-* utilities
  const shapePrefix = `--${p}-shape-`;
  const cornerPrefix = `--${p}-shape-corner-`;
  const extras = Object.keys(bundle.shared)
    .filter((k) => k.startsWith(shapePrefix) && !k.startsWith(cornerPrefix))
    .map((k) => `  --radius-${k.slice(shapePrefix.length)}: var(${k});`)
    .join('\n');
  out.push(extras);

  const fonts = `  --font-sans: var(--${p}-font-plain);\n  --font-brand: var(--${p}-font-brand);`;
  out.push(fonts);

  const text = TYPE_ROLES.map((role) => {
    return [
      `  --text-${role}: var(--${p}-typescale-${role}-size);`,
      `  --text-${role}--line-height: var(--${p}-typescale-${role}-line-height);`,
      `  --text-${role}--letter-spacing: var(--${p}-typescale-${role}-letter-spacing);`,
      `  --text-${role}--font-weight: var(--${p}-typescale-${role}-weight);`,
    ].join('\n');
  }).join('\n');
  out.push(text);

  return `@theme inline {\n${out.filter(Boolean).join('\n\n')}\n}`;
}

export function varsAsReactInline(bundle: ThemeBundle, mode: 'light' | 'dark'): string {
  const vars = { ...bundle.shared, ...bundle[mode] };
  return JSON.stringify(vars, null, 2);
}

function indent(s: string): string {
  return s
    .split('\n')
    .map((l) => '  ' + l)
    .join('\n');
}
