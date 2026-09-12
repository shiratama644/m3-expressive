import { describe, expect, it } from 'vitest';
import { buildColorSchemes, type M3EVariant } from '@/lib/m3e/color';
import { M3E_COLOR_ROLES } from '@/lib/m3e/roles';

const HEX = /^#[0-9a-f]{6}$/;

describe('buildColorSchemes option matrix', () => {
  it('every role is a lowercase #rrggbb for all spec/platform combos', () => {
    for (const specVersion of ['2021', '2025'] as const) {
      for (const platform of ['phone', 'watch'] as const) {
        const s = buildColorSchemes({
          seed: '#6750a4',
          variant: 'expressive',
          specVersion,
          platform,
        });
        for (const role of M3E_COLOR_ROLES) {
          expect(s.light[role], `${specVersion}/${platform}/${role}`).toMatch(HEX);
          expect(s.dark[role], `${specVersion}/${platform}/${role}`).toMatch(HEX);
        }
      }
    }
  });

  it('omitted options default to 2025/phone', () => {
    const bare = buildColorSchemes({ seed: '#6750a4', variant: 'expressive' });
    const explicit = buildColorSchemes({
      seed: '#6750a4',
      variant: 'expressive',
      specVersion: '2025',
      platform: 'phone',
    });
    expect({ light: bare.light, dark: bare.dark }).toEqual({
      light: explicit.light,
      dark: explicit.dark,
    });
  });

  it('unknown variant falls back to SchemeExpressive (never throws)', () => {
    const bogus = buildColorSchemes({ seed: '#00e676', variant: 'bogus' as M3EVariant });
    const expressive = buildColorSchemes({ seed: '#00e676', variant: 'expressive' });
    expect({ light: bogus.light, dark: bogus.dark }).toEqual({
      light: expressive.light,
      dark: expressive.dark,
    });
  });

  it('specVersion changes tone tables for expressive-class schemes but not fixed-tone ones', () => {
    const mk = (specVersion: '2021' | '2025', variant: string) =>
      buildColorSchemes({
        seed: '#6750a4',
        variant: variant as M3EVariant,
        specVersion,
        platform: 'phone',
      });
    // expressive: 2021/2025 で primary 系トーンが動く
    expect(mk('2021', 'expressive').light).not.toEqual(mk('2025', 'expressive').light);
    // fidelity/monochrome/content はトーン固定 — spec で不変
    for (const v of ['fidelity', 'monochrome', 'content']) {
      expect(mk('2021', v).light, v).toEqual(mk('2025', v).light);
      expect(mk('2021', v).dark, v).toEqual(mk('2025', v).dark);
    }
  });
});
