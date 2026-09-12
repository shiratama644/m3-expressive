import { describe, expect, it } from 'vitest';
import {
  NAMED_SHAPES,
  SHAPE_FULL_PX,
  SHAPE_SIZES,
  namedShapeCss,
  radiusCss,
  shapeSizePx,
} from './shape';

describe('shape sizes (androidx ShapeTokens 14_1_0)', () => {
  it('matches spec values', () => {
    expect(SHAPE_SIZES).toMatchObject({
      none: 0,
      'extra-small': 4,
      small: 8,
      medium: 12,
      large: 16,
      'large-increased': 20,
      'extra-large': 28,
      'extra-large-increased': 32,
      'extra-extra-large': 48,
    });
  });

  it('emphasis resolves increased variants', () => {
    expect(shapeSizePx('large', 'standard')).toBe(16);
    expect(shapeSizePx('large', 'increased')).toBe(20);
    expect(shapeSizePx('extra-large', 'increased')).toBe(32);
  });
});

describe('named (asymmetric) shapes', () => {
  it('extra-large-top has square bottom corners', () => {
    expect(NAMED_SHAPES['extra-large-top']).toEqual([28, 28, 0, 0]);
    expect(namedShapeCss('extra-large-top')).toBe('28px 28px 0px 0px');
  });
  it('uniform shapes collapse to a single value', () => {
    expect(namedShapeCss('medium')).toBe('12px');
  });
  it('boost applies to corners but not to pill', () => {
    expect(namedShapeCss('medium', 4)).toBe('16px');
    expect(namedShapeCss('pill', 4)).toBe(`${SHAPE_FULL_PX}px`);
  });
  it('radiusCss handles explicit corner arrays', () => {
    expect(radiusCss([16, 16, 0, 0])).toBe('16px 16px 0px 0px');
    expect(radiusCss([8])).toBe('8px');
  });
});
