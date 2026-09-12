import { describe, expect, it } from 'vitest';
import { DEFAULT_CONFIG } from '@/lib/m3e/config';
import { buildTheme, renderThemeCss, varBlock, varsAsReactInline } from '@/lib/m3e/css';
import { M3E_COLOR_ROLES } from '@/lib/m3e/roles';
import { TYPE_ROLES } from '@/lib/m3e/typography';

describe('buildTheme', () => {
  const bundle = buildTheme(DEFAULT_CONFIG);

  it('emits a color var for every role in light & dark', () => {
    for (const role of M3E_COLOR_ROLES) {
      expect(bundle.light[`--m3e-color-${role}`]).toMatch(/^#[0-9a-f]{6}$/);
      expect(bundle.dark[`--m3e-color-${role}`]).toMatch(/^#[0-9a-f]{6}$/);
    }
  });

  it('emits shape, motion and type vars in shared', () => {
    expect(bundle.shared['--m3e-shape-corner-extra-large']).toBe('28px');
    expect(bundle.shared['--m3e-shape-card']).toBe('28px');
    expect(bundle.shared['--m3e-shape-sheet']).toBe('28px 28px 0px 0px');
    expect(bundle.shared['--m3e-motion-duration-medium2']).toBe('300ms');
    expect(bundle.shared['--m3e-motion-easing-emphasized']).toContain('cubic-bezier');
    expect(bundle.shared['--m3e-motion-spring-fast-spatial-easing']).toContain('linear(');
    for (const role of TYPE_ROLES) {
      expect(bundle.shared[`--m3e-typescale-${role}-size`]).toMatch(/^[\d.]+px$/);
      expect(bundle.shared[`--m3e-typescale-${role}-weight`]).toBeTruthy();
    }
  });

  it('increased emphasis changes component shapes', () => {
    const inc = buildTheme({ ...DEFAULT_CONFIG, shapeEmphasis: 'increased' });
    expect(inc.shared['--m3e-shape-card']).toBe('32px');
  });

  it('asymmetry off falls back to symmetric sheet', () => {
    const sym = buildTheme({ ...DEFAULT_CONFIG, asymmetry: false });
    expect(sym.shared['--m3e-shape-sheet']).toBe('16px');
  });

  it('md-sys naming switches the prefix', () => {
    const md = buildTheme({ ...DEFAULT_CONFIG, naming: 'md-sys' });
    expect(md.light['--md-sys-color-primary']).toMatch(/^#/);
    expect(md.light['--m3e-color-primary']).toBeUndefined();
  });

  it('provides tonal palettes for swatches', () => {
    expect(bundle.tonal.map((t) => t.name)).toContain('primary');
    expect(bundle.tonal.find((t) => t.name === 'primary')?.tones).toHaveLength(13);
  });
});

describe('renderThemeCss', () => {
  const bundle = buildTheme(DEFAULT_CONFIG);
  const mediaCss = renderThemeCss(bundle, { darkMode: 'media' });
  const classCss = renderThemeCss(bundle, { darkMode: 'class' });

  it('contains :root block, dark block and reduced motion guard', () => {
    expect(mediaCss).toContain(':root {');
    expect(mediaCss).toContain('@media (prefers-color-scheme: dark)');
    expect(mediaCss).toContain('@media (prefers-reduced-motion: reduce)');
    expect(classCss).toContain('.dark, [data-m3e-theme="dark"]');
  });

  it('every var line is `name: value;`', () => {
    const bad = mediaCss
      .split('\n')
      .filter((l) => l.trim().startsWith('--m3e-'))
      .filter((l) => !/^\s+--m3e-[a-z0-9-]+: .+;$/.test(l));
    expect(bad).toEqual([]);
  });

  it('adds @theme inline mapping when tailwind is requested', () => {
    const tw = renderThemeCss(bundle, { darkMode: 'media', tailwindTheme: true });
    expect(tw).toContain('@theme inline {');
    expect(tw).toContain('--color-primary: var(--m3e-color-primary);');
  });

  it('varBlock indents and renders pairs', () => {
    expect(varBlock({ '--x': '1px' }, '.a')).toBe('.a {\n  --x: 1px;\n}');
  });
});

describe('varsAsReactInline', () => {
  it('parses back to an object', () => {
    const bundle = buildTheme(DEFAULT_CONFIG);
    const parsed = JSON.parse(varsAsReactInline(bundle, 'light'));
    expect(parsed['--m3e-color-primary']).toMatch(/^#/);
  });
});
