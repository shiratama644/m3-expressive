import { describe, expect, it } from 'vitest';
import { generateFiles } from '@/lib/gen';
import { extraFiles } from '@/lib/gen/native';
import { DEFAULT_CONFIG } from '@/lib/m3e/config';

describe('export targets', () => {
  it('adds nothing when no target is selected', () => {
    const base = generateFiles(DEFAULT_CONFIG, 'next', 'pnpm');
    const withEmpty = generateFiles(DEFAULT_CONFIG, 'next', 'pnpm', []);
    expect(withEmpty).toEqual(base);
    expect(extraFiles(DEFAULT_CONFIG, [])).toEqual([]);
  });

  it('style-dictionary config references tokens.json', () => {
    const files = extraFiles(DEFAULT_CONFIG, ['style-dictionary']);
    const sd = files.find((f) => f.path === 'style-dictionary.config.mjs');
    expect(sd).toBeDefined();
    expect(sd?.content).toContain("source: ['tokens.json']");
    expect(sd?.content).toContain("format: 'css/variables'");
  });

  it('compose colors use uppercase 0xFFRRGGBB literals', () => {
    const files = extraFiles(DEFAULT_CONFIG, ['compose', 'android-xml']);
    const color = files.find((f) => f.path === 'compose/Color.kt');
    expect(color?.content).toMatch(/Color\(0xFF[0-9A-F]{6}\)/);
    expect(color?.content).toContain('internal val m3e_light_primary = Color(0xFF');
    expect(color?.content).toContain('internal val m3e_dark_on_primary_container = Color(0xFF');
    const theme = files.find((f) => f.path === 'compose/Theme.kt');
    expect(theme?.content).toContain('lightColorScheme(');
    expect(theme?.content).toContain('onSurfaceVariant = m3e_light_on_surface_variant');
  });

  it('android xml provides values + values-night with all roles', () => {
    const files = extraFiles(DEFAULT_CONFIG, ['android-xml']);
    const light = files.find((f) => f.path === 'android/res/values/colors_m3e.xml');
    const night = files.find((f) => f.path === 'android/res/values-night/colors_m3e.xml');
    expect(light?.content).toMatch(/<color name="m3e_primary">#FF[0-9A-F]{6}<\/color>/);
    expect(night?.content).toContain('m3e_primary');
    const count = (s?: string) => (s?.match(/<color /g) ?? []).length;
    expect(count(light?.content)).toBe(count(night?.content));
    expect(count(light?.content)).toBeGreaterThan(50);
  });

  it('extras extend every framework bundle without touching web files', () => {
    for (const fw of ['next', 'react', 'vue', 'tailwind'] as const) {
      const base = generateFiles(DEFAULT_CONFIG, fw, 'bun');
      const withCompose = generateFiles(DEFAULT_CONFIG, fw, 'bun', ['compose']);
      expect(withCompose.length).toBe(base.length + 2);
      expect(withCompose.slice(0, base.length)).toEqual(base);
    }
  });
});
