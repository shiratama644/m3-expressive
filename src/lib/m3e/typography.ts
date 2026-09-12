/**
 * M3E typography tokens.
 * Source of truth: androidx.compose.material3.tokens.TypeScaleTokens (generator v31.0.11)
 * — 30 roles: 15 base + 15 `*Emphasized` (M3 Expressive). size / line-height / letter-spacing
 * in sp, weight: Regular 400 / Medium 500 / Bold 700. "Brand" font → Roboto Flex (expressive),
 * "Plain" → Roboto (fallback stack).
 */

export type TypeRole =
  | 'display-large'
  | 'display-medium'
  | 'display-small'
  | 'headline-large'
  | 'headline-medium'
  | 'headline-small'
  | 'title-large'
  | 'title-medium'
  | 'title-small'
  | 'body-large'
  | 'body-medium'
  | 'body-small'
  | 'label-large'
  | 'label-medium'
  | 'label-small'
  | 'display-large-emphasized'
  | 'display-medium-emphasized'
  | 'display-small-emphasized'
  | 'headline-large-emphasized'
  | 'headline-medium-emphasized'
  | 'headline-small-emphasized'
  | 'title-large-emphasized'
  | 'title-medium-emphasized'
  | 'title-small-emphasized'
  | 'body-large-emphasized'
  | 'body-medium-emphasized'
  | 'body-small-emphasized'
  | 'label-large-emphasized'
  | 'label-medium-emphasized'
  | 'label-small-emphasized';

export interface TypeStyle {
  size: number;
  lineHeight: number;
  tracking: number;
  weight: 400 | 500 | 700;
  /** Brand = expressive (Roboto Flex), Plain = body/label (Roboto) */
  font: 'brand' | 'plain';
}

const R = 400 as const;
const M = 500 as const;
const B = 700 as const;
type Weight = typeof R | typeof M | typeof B;

function role(
  size: number,
  lineHeight: number,
  tracking: number,
  weight: Weight,
  font: 'brand' | 'plain',
): TypeStyle {
  return { size, lineHeight, tracking, weight, font };
}

/** Exact spec table (sp values; px at 1x). */
export const TYPE_SCALE: Record<TypeRole, TypeStyle> = {
  'display-large': role(57, 64, -0.2, R, 'brand'),
  'display-medium': role(45, 52, 0, R, 'brand'),
  'display-small': role(36, 44, 0, R, 'brand'),
  'headline-large': role(32, 40, 0, R, 'brand'),
  'headline-medium': role(28, 36, 0, R, 'brand'),
  'headline-small': role(24, 32, 0, R, 'brand'),
  'title-large': role(22, 28, 0, R, 'brand'),
  'title-medium': role(16, 24, 0.2, M, 'plain'),
  'title-small': role(14, 20, 0.1, M, 'plain'),
  'body-large': role(16, 24, 0.5, R, 'plain'),
  'body-medium': role(14, 20, 0.2, R, 'plain'),
  'body-small': role(12, 16, 0.4, R, 'plain'),
  'label-large': role(14, 20, 0.1, M, 'plain'),
  'label-medium': role(12, 16, 0.5, M, 'plain'),
  'label-small': role(11, 16, 0.5, M, 'plain'),
  'display-large-emphasized': role(57, 64, 0, M, 'brand'),
  'display-medium-emphasized': role(45, 52, 0, M, 'brand'),
  'display-small-emphasized': role(36, 44, 0, M, 'brand'),
  'headline-large-emphasized': role(32, 40, 0, M, 'brand'),
  'headline-medium-emphasized': role(28, 36, 0, M, 'brand'),
  'headline-small-emphasized': role(24, 32, 0, M, 'brand'),
  'title-large-emphasized': role(22, 28, 0, M, 'brand'),
  'title-medium-emphasized': role(16, 24, 0.15, B, 'plain'),
  'title-small-emphasized': role(14, 20, 0.1, B, 'plain'),
  'body-large-emphasized': role(16, 24, 0.15, M, 'plain'),
  'body-medium-emphasized': role(14, 20, 0.25, M, 'plain'),
  'body-small-emphasized': role(12, 16, 0.4, M, 'plain'),
  'label-large-emphasized': role(14, 20, 0.1, B, 'plain'),
  'label-medium-emphasized': role(12, 16, 0.5, B, 'plain'),
  'label-small-emphasized': role(11, 16, 0.5, B, 'plain'),
};

export const TYPE_ROLES = Object.keys(TYPE_SCALE) as TypeRole[];

export type TypeFamily = 'roboto-flex' | 'roboto' | 'system';

export const FONT_STACKS: Record<TypeFamily, { brand: string; plain: string; cssImport?: string }> =
  {
    'roboto-flex': {
      brand: `'Roboto Flex', 'Roboto', system-ui, sans-serif`,
      plain: `'Roboto Flex', 'Roboto', system-ui, sans-serif`,
      cssImport: `@import '@fontsource-variable/roboto-flex';`,
    },
    roboto: {
      brand: `'Roboto', system-ui, sans-serif`,
      plain: `'Roboto', system-ui, sans-serif`,
      cssImport: `@import '@fontsource/roboto/400.css';
@import '@fontsource/roboto/500.css';
@import '@fontsource/roboto/700.css';`,
    },
    system: {
      brand: `system-ui, -apple-system, 'Segoe UI', sans-serif`,
      plain: `system-ui, -apple-system, 'Segoe UI', sans-serif`,
    },
  };

export interface TypographyOptions {
  /** multiplicative scale (0.85–1.15, default 1) */
  scale?: number;
  family?: TypeFamily;
  /** optical size axis for variable fonts (Roboto Flex: 8–144; auto = font size) */
  opticalSize?: 'auto' | 'off';
}

export interface ResolvedTypeStyle {
  role: TypeRole;
  sizePx: number;
  lineHeightPx: number;
  letterSpacingEm: number; // relative em (tracking px / size)
  weight: number;
  font: 'brand' | 'plain';
  /** font-variation-settings for Roboto Flex, else undefined */
  variation?: string;
}

export function resolveType(role: TypeRole, opts: TypographyOptions = {}): ResolvedTypeStyle {
  const base = TYPE_SCALE[role];
  const scale = opts.scale ?? 1;
  const size = round2(base.size * scale);
  const lineHeight = round2(base.lineHeight * scale);
  const trackingEm = round4(base.tracking / base.size); // keep proportional tracking
  const family = opts.family ?? 'roboto-flex';
  const variation =
    family === 'roboto-flex' && opts.opticalSize !== 'off'
      ? `'opsz' ${Math.min(144, Math.max(8, Math.round(size)))}, 'wght' ${base.weight}`
      : undefined;
  return {
    role,
    sizePx: size,
    lineHeightPx: lineHeight,
    letterSpacingEm: trackingEm,
    weight: base.weight,
    font: base.font,
    variation,
  };
}

export function fontStack(family: TypeFamily, slot: 'brand' | 'plain'): string {
  return FONT_STACKS[family][slot];
}

function round2(n: number): number {
  return Math.round(n * 1000) / 1000;
}
function round4(n: number): number {
  return Math.round(n * 10000) / 10000;
}
