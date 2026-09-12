import type { DynamicScheme, Platform } from '@material/material-color-utilities';
import {
  argbFromHex,
  Hct,
  hexFromArgb,
  SchemeContent,
  SchemeExpressive,
  SchemeFidelity,
  SchemeFruitSalad,
  SchemeMonochrome,
  SchemeNeutral,
  SchemeRainbow,
  SchemeTonalSpot,
  SchemeVibrant,
  TonalPalette,
} from '@material/material-color-utilities';

/** Color spec revision (material-color-utilities 0.4.0; the type is not re-exported from the root). */
export type SpecVersion = '2021' | '2025';

import { M3E_COLOR_ROLES, type M3EColorRole, roleToGetter } from './roles';

/**
 * Dynamic color variants exposed by the studio.
 * Values match `@material/material-color-utilities`'s `Variant` enum.
 */
export const M3E_VARIANTS = [
  'expressive',
  'tonal-spot',
  'vibrant',
  'neutral',
  'monochrome',
  'fidelity',
  'content',
  'rainbow',
  'fruit-salad',
] as const;

export type M3EVariant = (typeof M3E_VARIANTS)[number];

export const VARIANT_LABELS: Record<M3EVariant, string> = {
  expressive: 'Expressive（推奨・M3E 基準）',
  'tonal-spot': 'Tonal Spot（M3 既定）',
  vibrant: 'Vibrant',
  neutral: 'Neutral',
  monochrome: 'Monochrome',
  fidelity: 'Fidelity',
  content: 'Content',
  rainbow: 'Rainbow',
  'fruit-salad': 'Fruit Salad',
};

const SCHEME_CTORS: Record<
  M3EVariant,
  new (
    hct: Hct,
    dark: boolean,
    contrast: number,
    spec?: SpecVersion,
    platform?: Platform,
  ) => DynamicScheme
> = {
  expressive: SchemeExpressive,
  'tonal-spot': SchemeTonalSpot,
  vibrant: SchemeVibrant,
  neutral: SchemeNeutral,
  monochrome: SchemeMonochrome,
  fidelity: SchemeFidelity,
  content: SchemeContent,
  rainbow: SchemeRainbow,
  'fruit-salad': SchemeFruitSalad,
};

export interface ColorInput {
  /** seed / source color, `#rrggbb` or `#aarrggbb` */
  seed: string;
  variant: M3EVariant;
  /** -1 .. 1 (Material 3 contrast levels; 0 = standard, 1 = high) */
  contrast?: number;
  /** spec revision — '2025' adds the M3 Expressive fixed/dim roles */
  specVersion?: SpecVersion;
  platform?: Platform;
}

export type ColorSchemeHex = Record<M3EColorRole, string>;

export interface ColorSchemes {
  light: ColorSchemeHex;
  dark: ColorSchemeHex;
  /** raw DynamicScheme objects (for component-level math like state layers) */
  schemes: { light: DynamicScheme; dark: DynamicScheme };
}

function normalizeHex(hex: string): string {
  const h = hex.trim().replace(/^#/, '');
  if (/^[0-9a-fA-F]{6}$/.test(h)) return `#${h.toLowerCase()}`;
  if (/^[0-9a-fA-F]{3}$/.test(h)) {
    return `#${h
      .split('')
      .map((c) => (c + c).toLowerCase())
      .join('')}`;
  }
  if (/^[0-9a-fA-F]{8}$/.test(h)) return `#${h.slice(2).toLowerCase()}`;
  throw new Error(`invalid hex color: ${hex}`);
}

export function seedToHct(seed: string): Hct {
  const hex = normalizeHex(seed);
  return Hct.fromInt(argbFromHex(hex));
}

/** Build both light and dark schemes for one seed. Pure function. */
export function buildColorSchemes(input: ColorInput): ColorSchemes {
  const { variant, contrast = 0, specVersion = '2025', platform = 'phone' } = input;
  const hct = seedToHct(input.seed);
  const Ctor = SCHEME_CTORS[variant] ?? SchemeExpressive;

  const build = (isDark: boolean): { scheme: DynamicScheme; colors: ColorSchemeHex } => {
    const scheme = new Ctor(hct, isDark, contrast, specVersion, platform);
    const colors = {} as ColorSchemeHex;
    for (const role of M3E_COLOR_ROLES) {
      const getter = roleToGetter(role) as keyof DynamicScheme;
      const value = scheme[getter];
      colors[role] = hexFromArgb(typeof value === 'number' ? value : 0xff000000).toLowerCase();
    }
    return { scheme, colors };
  };

  const light = build(false);
  const dark = build(true);
  return {
    light: light.colors,
    dark: dark.colors,
    schemes: { light: light.scheme, dark: dark.scheme },
  };
}

export const TONAL_STOPS = [
  0, 4, 6, 10, 12, 17, 20, 22, 24, 30, 40, 50, 60, 70, 80, 87, 90, 92, 94, 95, 96, 98, 99, 100,
] as const;

/** Tonal palette (HCT) for swatch strips — derived from the scheme key colors. */
export function palettesFor(
  scheme: DynamicScheme,
): Record<
  'primary' | 'secondary' | 'tertiary' | 'neutral' | 'neutral-variant' | 'error',
  TonalPalette
> {
  // TonalPalette.fromInt はキーカラーの ARGB から HCT 経由でパレットを再構成する（公式実装）
  const toPalette = (argb: number) => TonalPalette.fromInt(argb);
  return {
    primary: toPalette(scheme.primaryPaletteKeyColor),
    secondary: toPalette(scheme.secondaryPaletteKeyColor),
    tertiary: toPalette(scheme.tertiaryPaletteKeyColor),
    neutral: toPalette(scheme.neutralPaletteKeyColor),
    'neutral-variant': toPalette(scheme.neutralVariantPaletteKeyColor),
    error: toPalette(scheme.errorPaletteKeyColor),
  };
}

export function paletteHex(palette: TonalPalette, tone: number): string {
  // 0.4.x の API: palette.tone(t) -> ARGB int
  return hexFromArgb(palette.tone(tone)).toLowerCase();
}

export { normalizeHex as normalizeColorHex };
