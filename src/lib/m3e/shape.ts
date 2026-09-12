/**
 * M3E shape tokens.
 * Source of truth: androidx.compose.material3.tokens.ShapeTokens (generator 14_1_0)
 * + Material 3 Expressive shape spec (m3.material.io).
 */

/** Uniform corner sizes (dp ≈ px at 1x), spec values. */
export const SHAPE_SIZES = {
  none: 0,
  'extra-small': 4,
  small: 8,
  medium: 12,
  large: 16,
  'large-increased': 20,
  'extra-large': 28,
  'extra-large-increased': 32,
  'extra-extra-large': 48,
} as const;

export type ShapeSizeName = keyof typeof SHAPE_SIZES;

/** Pill / circle. 9999px caps at the short side in CSS. */
export const SHAPE_FULL_PX = 9999;

export type ShapeEmphasis = 'standard' | 'increased';

/**
 * Emphasis = which radius a component role resolves to.
 * `increased` follows the M3E "*Increased" variants (large→20, extra-large→32);
 * smaller sizes step up proportionally (values from M3E exploratory shape scale).
 */
const EMPHASIS_SIZE: Record<ShapeSizeName, Record<ShapeEmphasis, number>> = {
  none: { standard: 0, increased: 0 },
  'extra-small': { standard: 4, increased: 6 },
  small: { standard: 8, increased: 10 },
  medium: { standard: 12, increased: 16 },
  large: { standard: 16, increased: 20 },
  'large-increased': { standard: 20, increased: 20 },
  'extra-large': { standard: 28, increased: 32 },
  'extra-large-increased': { standard: 32, increased: 32 },
  'extra-extra-large': { standard: 48, increased: 52 },
};

/** Resolve a uniform corner size with the given emphasis. */
export function shapeSizePx(name: ShapeSizeName, emphasis: ShapeEmphasis = 'standard'): number {
  return EMPHASIS_SIZE[name][emphasis];
}

/** [topStart, topEnd, bottomEnd, bottomStart] px — asymmetric "expressive" shapes (spec). */
export const NAMED_SHAPES = {
  none: [0, 0, 0, 0],
  'extra-small': [4, 4, 4, 4],
  small: [8, 8, 8, 8],
  medium: [12, 12, 12, 12],
  large: [16, 16, 16, 16],
  'extra-large': [28, 28, 28, 28],
  'extra-extra-large': [48, 48, 48, 48],
  'extra-small-top': [4, 4, 0, 0],
  'large-top': [16, 16, 0, 0],
  'extra-large-top': [28, 28, 0, 0],
  'large-start': [16, 0, 0, 16],
  'large-end': [0, 16, 16, 0],
  'extra-large-bottom': [0, 0, 28, 28],
  pill: [SHAPE_FULL_PX, SHAPE_FULL_PX, SHAPE_FULL_PX, SHAPE_FULL_PX],
  circle: [SHAPE_FULL_PX, SHAPE_FULL_PX, SHAPE_FULL_PX, SHAPE_FULL_PX],
} as const satisfies Record<string, readonly [number, number, number, number]>;

export type NamedShape = keyof typeof NAMED_SHAPES;

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function capCorner(v: number, boost: number): number {
  if (v >= SHAPE_FULL_PX) return SHAPE_FULL_PX;
  return Math.max(0, round2(v + boost));
}

/** CSS `border-radius` value for a uniform size. */
export function uniformRadiusCss(sizePx: number, boost = 0): string {
  return `${capCorner(sizePx, boost)}px`;
}

/** CSS `border-radius` value (TL TR BR BL) for a 4-corner shape with optional boost. */
export function radiusCss(
  corners: readonly [number, number, number, number] | readonly number[],
  boost = 0,
): string {
  const [ts = 0, te = ts, be = ts, bs = te] = corners;
  if (ts === te && te === be && be === bs) return `${capCorner(ts, boost)}px`;
  return `${capCorner(ts, boost)}px ${capCorner(te, boost)}px ${capCorner(be, boost)}px ${capCorner(bs, boost)}px`;
}

/** CSS value for a named shape. */
export function namedShapeCss(
  name: NamedShape,
  boost = 0,
  emphasis: ShapeEmphasis = 'standard',
): string {
  if (
    name === 'none' ||
    name === 'extra-small' ||
    name === 'small' ||
    name === 'medium' ||
    name === 'large' ||
    name === 'extra-large' ||
    name === 'extra-extra-large'
  ) {
    return uniformRadiusCss(shapeSizePx(name, emphasis), boost);
  }
  return radiusCss(NAMED_SHAPES[name], boost);
}
