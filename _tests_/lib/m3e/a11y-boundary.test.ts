import { describe, expect, it } from 'vitest';
import { A11Y_PAIRS_CONSISTENT, advisoryNotes, auditTheme, findFixContrast } from '@/lib/m3e/a11y';
import { DEFAULT_CONFIG } from '@/lib/m3e/config';
import { buildTheme } from '@/lib/m3e/css';

describe('a11y boundaries', () => {
  it('pair-role consistency guard holds', () => {
    expect(A11Y_PAIRS_CONSISTENT).toBe(true);
  });

  it('advisoryNotes counts exactly the advisory failing rows (not normative)', () => {
    const bundle = buildTheme({ ...DEFAULT_CONFIG, contrast: 0.2 });
    for (const level of ['AA', 'AAA'] as const) {
      const audit = auditTheme(bundle, level);
      const advisoryFails = audit.rows.filter(
        (r) => r.pair.advisory && (!r.passLight || !r.passDark),
      ).length;
      expect(advisoryNotes(bundle, level)).toBe(advisoryFails);
      expect(advisoryNotes(bundle, level)).toBeLessThanOrEqual(audit.rows.length);
    }
  });

  it('findFixContrast returns null when the theme already passes at AAA (high contrast)', () => {
    const config = { ...DEFAULT_CONFIG, seed: '44666f', contrast: 0.95 };
    expect(auditTheme(buildTheme(config), 'AAA').failures).toBe(0);
    expect(findFixContrast(config, 'AAA', 0.05)).toBeNull();
  });

  it('findFixContrast returns null when step leaves no sweep candidates', () => {
    // baseline は失敗あり、かつ 0+step > 1 でループ本体が一度も回らない → null
    const config = { ...DEFAULT_CONFIG, seed: '44666f', contrast: 0 };
    expect(auditTheme(buildTheme(config), 'AAA').failures).toBeGreaterThan(0);
    expect(findFixContrast(config, 'AAA', 2)).toBeNull();
  });

  it('findFixContrast proposals are strictly fewer-failure and finite', () => {
    const config = { ...DEFAULT_CONFIG, seed: '44666f' };
    const base = auditTheme(buildTheme(config), 'AAA').failures;
    const fix = findFixContrast(config, 'AAA', 0.05);
    if (fix) {
      expect(fix.contrast).toBeGreaterThan(0);
      expect(fix.contrast).toBeLessThanOrEqual(1);
      expect(fix.remaining).toBeLessThan(base);
      expect(auditTheme(buildTheme({ ...config, contrast: fix.contrast }), 'AAA').failures).toBe(
        fix.remaining,
      );
    } else {
      expect(base).toBe(0);
    }
  });
});
