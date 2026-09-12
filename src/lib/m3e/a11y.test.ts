import { describe, expect, it } from 'vitest';
import {
  A11Y_PAIRS,
  A11Y_PAIRS_CONSISTENT,
  auditTheme,
  contrastRatio,
  minRatio,
  relativeLuminance,
} from './a11y';

describe('contrastRatio (WCAG 2.2)', () => {
  it('white on black is 21', () => {
    expect(contrastRatio('#ffffff', '#000000')).toBeCloseTo(21, 4);
  });
  it('same color is 1', () => {
    expect(contrastRatio('#123456', '#123456')).toBeCloseTo(1, 4);
  });
  it('matches the classic #767676-on-white boundary (≈4.54)', () => {
    expect(contrastRatio('#767676', '#ffffff')).toBeCloseTo(4.54, 2);
  });
  it('is symmetric', () => {
    const a = contrastRatio('#6750a4', '#ffffff');
    const b = contrastRatio('#ffffff', '#6750a4');
    expect(a).toBeCloseTo(b, 10);
  });
  it('accepts 3-digit hex', () => {
    expect(relativeLuminance('#fff')).toBeCloseTo(1, 10);
    expect(relativeLuminance('#000')).toBe(0);
  });
});

describe('minRatio', () => {
  it('AA: 4.5 text, 3 ui/large', () => {
    expect(minRatio('text', 'AA')).toBe(4.5);
    expect(minRatio('ui', 'AA')).toBe(3);
    expect(minRatio('large', 'AA')).toBe(3);
  });
  it('AA-large relaxes everything to 3', () => {
    for (const usage of ['text', 'ui', 'large'] as const)
      expect(minRatio(usage, 'AA-large')).toBe(3);
  });
  it('AAA: 7 text, 4.5 ui/large', () => {
    expect(minRatio('text', 'AAA')).toBe(7);
    expect(minRatio('ui', 'AAA')).toBe(4.5);
  });
});

describe('pair table', () => {
  it('roles referenced by pairs exist in the canonical list', () => {
    expect(A11Y_PAIRS_CONSISTENT).toBe(true);
  });
  it('covers at least 20 distinct pairs', () => {
    const uniq = new Set(A11Y_PAIRS.map((p) => `${p.fg}/${p.bg}`));
    expect(uniq.size).toBe(A11Y_PAIRS.length);
    expect(uniq.size).toBeGreaterThanOrEqual(20);
  });
});

describe('auditTheme', () => {
  it('all text pairs pass AA in the default expressive theme', async () => {
    const { DEFAULT_CONFIG } = await import('./config');
    const { buildTheme } = await import('./css');
    const bundle = buildTheme(DEFAULT_CONFIG);
    const report = auditTheme(bundle, 'AA');
    const textRows = report.rows.filter((r) => r.pair.usage === 'text');
    expect(textRows.length).toBeGreaterThan(10);
    for (const r of textRows) {
      expect(r.passLight).toBe(true);
      expect(r.passDark).toBe(true);
    }
  });
  it('every hex resolves (no NaN ratios)', async () => {
    const { DEFAULT_CONFIG } = await import('./config');
    const { buildTheme } = await import('./css');
    const report = auditTheme(buildTheme(DEFAULT_CONFIG), 'AAA');
    for (const r of report.rows) {
      expect(Number.isNaN(r.light)).toBe(false);
      expect(Number.isNaN(r.dark)).toBe(false);
      expect(r.light).toBeGreaterThanOrEqual(1);
      expect(r.light).toBeLessThanOrEqual(21);
    }
  });
});
