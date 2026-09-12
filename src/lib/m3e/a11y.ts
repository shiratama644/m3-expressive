import { prefixFor, type M3EConfig } from './config';
import { buildTheme } from './css';
import type { ThemeBundle } from './css';
import { M3E_COLOR_ROLES, type M3EColorRole } from './roles';

/**
 * WCAG 2.2 contrast auditing over the generated color roles.
 * Pure + dependency-free (same spirit as the rest of lib/m3e).
 */

export type A11yUsage = 'text' | 'large' | 'ui';

export interface A11yPair {
  /** foreground role */
  fg: M3EColorRole;
  /** background role */
  bg: M3EColorRole;
  usage: A11yUsage;
  /** human note shown in the report */
  note: string;
  /**
   * Informational only: M3's tonal system intentionally keeps some pairs low
   * (containers vs background). Advisory rows never count as failures and
   * never block the auto-fix.
   */
  advisory?: boolean;
}

/** fg on bg pairs, per WCAG 2.2 (SC 1.4.3 / 1.4.6 text, 1.4.11 non-text). */
export const A11Y_PAIRS: readonly A11yPair[] = [
  { fg: 'on-primary', bg: 'primary', usage: 'text', note: 'Filled button label' },
  {
    fg: 'on-primary-container',
    bg: 'primary-container',
    usage: 'text',
    note: 'Tonal button label',
  },
  { fg: 'on-secondary', bg: 'secondary', usage: 'text', note: 'Filled button label' },
  {
    fg: 'on-secondary-container',
    bg: 'secondary-container',
    usage: 'text',
    note: 'Tonal button label',
  },
  { fg: 'on-tertiary', bg: 'tertiary', usage: 'text', note: 'Tonal accents' },
  {
    fg: 'on-tertiary-container',
    bg: 'tertiary-container',
    usage: 'text',
    note: 'Tonal accents',
  },
  { fg: 'on-error', bg: 'error', usage: 'text', note: 'Error button label' },
  {
    fg: 'on-error-container',
    bg: 'error-container',
    usage: 'text',
    note: 'Error banner text',
  },
  { fg: 'on-surface', bg: 'surface', usage: 'text', note: 'Body text on cards' },
  {
    fg: 'on-surface',
    bg: 'surface-container-low',
    usage: 'text',
    note: 'Body text (layer 1)',
  },
  { fg: 'on-surface', bg: 'surface-container', usage: 'text', note: 'Body text (layer 2)' },
  { fg: 'on-surface', bg: 'surface-container-high', usage: 'text', note: 'Body text (layer 3)' },
  {
    fg: 'on-surface',
    bg: 'surface-container-highest',
    usage: 'text',
    note: 'Body text (layer 4)',
  },
  {
    fg: 'on-surface-variant',
    bg: 'surface',
    usage: 'text',
    note: 'Secondary text — large or UI contexts',
  },
  {
    fg: 'on-surface-variant',
    bg: 'surface-container-high',
    usage: 'text',
    note: 'Secondary text on raised cards',
  },
  { fg: 'on-background', bg: 'background', usage: 'text', note: 'Legacy background pair' },
  {
    fg: 'inverse-on-surface',
    bg: 'inverse-surface',
    usage: 'text',
    note: 'Toast / tooltip label',
  },
  { fg: 'on-primary-fixed', bg: 'primary-fixed', usage: 'text', note: 'Fixed roles (light)' },
  {
    fg: 'on-primary-fixed-variant',
    bg: 'primary-fixed-dim',
    usage: 'text',
    note: 'Fixed-dim pair',
  },
  { fg: 'on-secondary-fixed', bg: 'secondary-fixed', usage: 'text', note: 'Fixed roles' },
  { fg: 'on-tertiary-fixed', bg: 'tertiary-fixed', usage: 'text', note: 'Fixed roles' },
  {
    fg: 'primary',
    bg: 'surface',
    usage: 'ui',
    note: 'Icon / link on surface (non-text)',
  },
  {
    fg: 'primary',
    bg: 'primary-container',
    usage: 'ui',
    note: 'Icon inside tonal button — M3 uses on-primary-container icons here, so this is advisory',
    advisory: true,
  },
  {
    fg: 'outline',
    bg: 'surface',
    usage: 'ui',
    note: 'Outlined control border',
  },
  {
    fg: 'primary-container',
    bg: 'surface',
    usage: 'ui',
    note: 'Tonal surface on background — intentionally soft in M3 (advisory)',
    advisory: true,
  },
  {
    fg: 'inverse-primary',
    bg: 'inverse-surface',
    usage: 'ui',
    note: 'Snackbar action (non-text)',
  },
  {
    fg: 'on-surface-variant',
    bg: 'surface-container-highest',
    usage: 'large',
    note: 'Large secondary text (≥24px / ≥18.7px bold)',
  },
];

export function relativeLuminance(hex: string): number {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.replace(/(.)/g, '$1$1') : h;
  const channel = (i: number) => {
    const v = parseInt(full.slice(i * 2, i * 2 + 2), 16) / 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(0) + 0.7152 * channel(1) + 0.0722 * channel(2);
}

/** WCAG contrast ratio, 1..21. */
export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [hi, lo] = la >= lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

export type A11yLevel = 'AA' | 'AA-large' | 'AAA';

export const A11Y_LEVELS: readonly A11yLevel[] = ['AA', 'AA-large', 'AAA'];

export const A11Y_LEVEL_LABELS: Record<A11yLevel, string> = {
  AA: 'AA text',
  'AA-large': 'AA large / UI',
  AAA: 'AAA text',
};

/** Minimum ratio for a usage at a given strictness level. */
export function minRatio(usage: A11yUsage, level: A11yLevel): number {
  switch (level) {
    case 'AA':
      return usage === 'text' ? 4.5 : 3;
    case 'AA-large':
      return 3;
    case 'AAA':
      return usage === 'text' ? 7 : 4.5;
  }
}

export interface A11yRow {
  pair: A11yPair;
  light: number;
  dark: number;
  min: number;
  passLight: boolean;
  passDark: boolean;
}

export interface A11yReport {
  rows: A11yRow[];
  failures: number;
  total: number;
}

export function auditTheme(bundle: ThemeBundle, level: A11yLevel = 'AA'): A11yReport {
  const p = prefixFor(bundle.config.naming);
  const hex = (vars: ThemeBundle['light'], role: M3EColorRole) =>
    vars[`--${p}-color-${role}`] ?? '';
  const rows = A11Y_PAIRS.map((pair) => {
    const light = contrastRatio(hex(bundle.light, pair.fg), hex(bundle.light, pair.bg));
    const dark = contrastRatio(hex(bundle.dark, pair.fg), hex(bundle.dark, pair.bg));
    const min = minRatio(pair.usage, level);
    return { pair, light, dark, min, passLight: light >= min, passDark: dark >= min };
  });
  const normative = rows.filter((r) => !r.pair.advisory);
  const failures = normative.filter((r) => !r.passLight || !r.passDark).length;
  return { rows, failures, total: normative.length };
}

/** Count of failing advisory rows (shown separately; not a norm violation). */
export function advisoryNotes(bundle: ThemeBundle, level: A11yLevel = 'AA'): number {
  return auditTheme(bundle, level).rows.filter(
    (r) => r.pair.advisory && (!r.passLight || !r.passDark),
  ).length;
}

/** Guard used by tests: every role in A11Y_PAIRS is a real, exported role. */
export const A11Y_PAIRS_CONSISTENT: boolean = (() => {
  const all = new Set<string>(M3E_COLOR_ROLES as readonly string[]);
  return A11Y_PAIRS.every((p) => all.has(p.fg) && all.has(p.bg));
})();

const round2 = (n: number): number => Math.round(n * 100) / 100;

export interface ContrastFix {
  /** contrast value to apply */
  contrast: number;
  /** true when the proposal makes every normative pair pass */
  clearsAll: boolean;
  /** remaining normative failures after applying */
  remaining: number;
}

/**
 * Best-effort one-click fix: sweep contrast upward (+0.05 up to 1.0) and pick
 * the smallest value with the fewest normative failures. Null when already
 * passing or when no contrast value improves the situation.
 */
export function findFixContrast(
  config: M3EConfig,
  level: A11yLevel = 'AA',
  step = 0.05,
): ContrastFix | null {
  const baseline = auditTheme(buildTheme(config), level).failures;
  if (baseline === 0) return null;
  let best: ContrastFix | null = null;
  for (let c = round2(Math.max(0, config.contrast)) + step; c <= 1 + 1e-9; c += step) {
    const contrast = round2(c);
    const f = auditTheme(buildTheme({ ...config, contrast }), level).failures;
    if (f < (best?.remaining ?? baseline)) {
      best = { contrast, clearsAll: f === 0, remaining: f };
      if (f === 0) break;
    }
  }
  return best;
}
