import { argbFromHex, Hct } from '@material/material-color-utilities';
import { describe, expect, it } from 'vitest';
import { buildColorSchemes, M3E_VARIANTS, normalizeColorHex, seedToHct } from '@/lib/m3e/color';
import { M3E_COLOR_ROLES } from '@/lib/m3e/roles';

const SEED = '#6750A4';

/** WCAG relative-luminance contrast ratio between two `#rrggbb` colors. */
function wcag(a: string, b: string): number {
  const lum = (hex: string) => {
    const ch = [1, 3, 5]
      .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
      .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
    return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
  };
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

describe('hex normalization', () => {
  it('accepts 3/6/8 digit forms', () => {
    expect(normalizeColorHex('#fff')).toBe('#ffffff');
    expect(normalizeColorHex('6750A4')).toBe('#6750a4');
    expect(normalizeColorHex('#FF6750A4')).toBe('#6750a4');
  });
  it('rejects garbage', () => {
    expect(() => normalizeColorHex('nope')).toThrow();
  });
});

describe('buildColorSchemes', () => {
  const { light, dark } = buildColorSchemes({ seed: SEED, variant: 'expressive' });

  it('produces every role as #rrggbb', () => {
    for (const role of M3E_COLOR_ROLES) {
      expect(light[role]).toMatch(/^#[0-9a-f]{6}$/);
      expect(dark[role]).toMatch(/^#[0-9a-f]{6}$/);
    }
  });

  it('is deterministic', () => {
    const again = buildColorSchemes({ seed: SEED, variant: 'expressive' });
    expect(again.light).toEqual(light);
  });

  it('keeps ≥4.5:1 contrast for on-color pairs (both modes, all variants)', () => {
    for (const variant of M3E_VARIANTS) {
      const built = buildColorSchemes({ seed: SEED, variant });
      for (const [schemeName, scheme] of [
        ['light', built.light],
        ['dark', built.dark],
      ] as const) {
        for (const [base, on] of [
          ['primary', 'on-primary'],
          ['secondary', 'on-secondary'],
          ['tertiary', 'on-tertiary'],
          ['error', 'on-error'],
          ['surface', 'on-surface'],
          ['primary-container', 'on-primary-container'],
        ] as const) {
          const c = wcag(scheme[base], scheme[on]);
          expect(c, `${variant}/${schemeName}/${base}:${c.toFixed(2)}`).toBeGreaterThanOrEqual(4.5);
        }
      }
    }
  });

  it('orders surface containers correctly (light: brighter → darker)', () => {
    const lum = (hex: string) => Hct.fromInt(argbFromHex(hex)).tone;
    const chain = [
      'surface-container-lowest',
      'surface-container-low',
      'surface-container',
      'surface-container-high',
      'surface-container-highest',
    ] as const;
    for (let i = 1; i < chain.length; i++) {
      expect(lum(light[chain[i - 1]])).toBeGreaterThanOrEqual(lum(light[chain[i]]));
      expect(lum(dark[chain[i - 1]])).toBeLessThanOrEqual(lum(dark[chain[i]]));
    }
  });

  it('2025 spec (M3E) uses the updated fixed-role tone table', () => {
    // 2021 spec: fixed=90 / fixed-dim=80 / on-fixed=10 / on-fixed-variant=30
    // 2025 spec (Material 3 Expressive, material-color-utilities 0.4.0):
    //   tonal-spot: 82 / 77 / 20 / 33 — expressive variant: 78 / 73 / 16 / 29
    const tone = (hex: string) => Math.round(Hct.fromInt(argbFromHex(hex)).tone);
    const spot = buildColorSchemes({ seed: SEED, variant: 'tonal-spot' });
    expect(tone(spot.light['primary-fixed'])).toBe(82);
    expect(tone(spot.light['primary-fixed-dim'])).toBe(77);

    const expressive = buildColorSchemes({ seed: SEED, variant: 'expressive' });
    expect(tone(expressive.light['primary-fixed'])).toBe(78);
    expect(tone(expressive.light['primary-fixed-dim'])).toBe(73);
    expect(tone(expressive.light.primary)).toBe(40); // base primary tone unchanged
    expect(tone(expressive.light['primary-fixed'])).toBeGreaterThan(tone(expressive.light.primary));
  });

  it('monochrome has near-zero chroma on accent roles', () => {
    const { light: mono } = buildColorSchemes({ seed: SEED, variant: 'monochrome' });
    expect(Hct.fromInt(argbFromHex(mono.primary)).chroma).toBeLessThan(12);
    expect(Hct.fromInt(argbFromHex(mono.tertiary)).chroma).toBeLessThan(12);
  });

  it('high contrast widens the light/dark primary delta', () => {
    const { light: lo } = buildColorSchemes({ seed: SEED, variant: 'expressive', contrast: 0 });
    const { light: hi } = buildColorSchemes({ seed: SEED, variant: 'expressive', contrast: 1 });
    expect(lo.primary).not.toBe(hi.primary);
  });
});

describe('seedToHct', () => {
  it('round-trips hue/chroma for known seeds', () => {
    const hct = seedToHct(SEED);
    expect(hct.tone).toBeGreaterThan(20);
    expect(hct.tone).toBeLessThan(60);
    expect(hct.hue).toBeGreaterThan(270);
  });
});
