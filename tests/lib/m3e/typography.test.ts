import { describe, expect, it } from 'vitest';
import { FONT_STACKS, TYPE_ROLES, TYPE_SCALE, fontStack, resolveType } from '@/lib/m3e/typography';

describe('M3E type scale', () => {
  it('has 30 roles (15 base + 15 emphasized)', () => {
    expect(TYPE_ROLES).toHaveLength(30);
  });

  it('matches androidx TypeScaleTokens golden values', () => {
    expect(TYPE_SCALE['display-large']).toMatchObject({
      size: 57,
      lineHeight: 64,
      tracking: -0.2,
      weight: 400,
    });
    expect(TYPE_SCALE['headline-large']).toMatchObject({ size: 32, lineHeight: 40, weight: 400 });
    expect(TYPE_SCALE['title-large']).toMatchObject({ size: 22, lineHeight: 28, font: 'brand' });
    expect(TYPE_SCALE['label-large']).toMatchObject({ size: 14, lineHeight: 20, weight: 500 });
    expect(TYPE_SCALE['label-large-emphasized']).toMatchObject({ weight: 700 });
    expect(TYPE_SCALE['display-large-emphasized']).toMatchObject({ weight: 500, tracking: 0 });
    expect(TYPE_SCALE['body-medium']).toMatchObject({ size: 14, lineHeight: 20, tracking: 0.2 });
  });

  it('emphasized variants keep the same size as their base', () => {
    for (const role of TYPE_ROLES) {
      if (!role.endsWith('-emphasized')) continue;
      const base = role.replace(/-emphasized$/, '') as keyof typeof TYPE_SCALE;
      expect(TYPE_SCALE[base].size).toBe(TYPE_SCALE[role].size);
      expect(TYPE_SCALE[base].lineHeight).toBe(TYPE_SCALE[role].lineHeight);
    }
  });
});

describe('resolveType', () => {
  it('scales multiplicatively', () => {
    const big = resolveType('display-large', { scale: 1.1 });
    expect(big.sizePx).toBeCloseTo(62.7, 1);
    expect(big.lineHeightPx).toBeCloseTo(70.4, 1);
  });

  it('keeps proportional letter spacing in em', () => {
    const r = resolveType('display-large', { scale: 1.2 });
    expect(r.letterSpacingEm).toBeCloseTo(-0.2 / 57, 4);
  });

  it('adds optical size variation for roboto-flex only', () => {
    const flex = resolveType('body-large', { family: 'roboto-flex' });
    expect(flex.variation).toMatch(/'opsz' 16, 'wght' 400/);
    const system = resolveType('body-large', { family: 'system' });
    expect(system.variation).toBeUndefined();
  });
});

describe('fonts', () => {
  it('roboto-flex stacks reference the variable family', () => {
    expect(FONT_STACKS['roboto-flex'].brand).toContain('Roboto Flex');
    expect(fontStack('roboto', 'plain')).toContain('Roboto');
  });
});
