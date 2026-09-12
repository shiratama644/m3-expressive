import { describe, expect, it } from 'vitest';
import { DEFAULT_CONFIG } from './config';
import { generateTokensJson } from './tokensJson';
import { parseStudioInput } from './importConfig';

describe('parseStudioInput', () => {
  it('rejects garbage without throwing', () => {
    expect(parseStudioInput('').kind).toBe('error');
    expect(parseStudioInput('not json').kind).toBe('error');
    expect(parseStudioInput('[1,2]').kind).toBe('error');
  });

  it('round-trips a full config through tokens.json export', () => {
    const config = {
      ...DEFAULT_CONFIG,
      seed: '#e8710a',
      variant: 'fidelity' as const,
      contrast: 0.5,
      cornerBoost: 16,
      asymmetry: false,
      motionScheme: 'standard' as const,
      useSprings: false,
      typeFamily: 'roboto' as const,
      typeScale: 1.1,
      opticalSize: 'off' as const,
      naming: 'md-sys' as const,
    };
    const json = generateTokensJson(config);
    const out = parseStudioInput(json);
    expect(out.kind).toBe('state');
    if (out.kind !== 'state') return;
    expect(out.config.seed).toBe('#e8710a');
    expect(out.config.variant).toBe('fidelity');
    expect(out.config.contrast).toBe(0.5);
    expect(out.config.cornerBoost).toBe(16);
    expect(out.config.asymmetry).toBe(false);
    expect(out.config.motionScheme).toBe('standard');
    expect(out.config.useSprings).toBe(false);
    expect(out.config.typeFamily).toBe('roboto');
    expect(out.config.typeScale).toBe(1.1);
    expect(out.config.opticalSize).toBe('off');
    expect(out.config.naming).toBe('md-sys');
    expect(out.notes).toEqual([]);
  });

  it('falls back to color.light.primary as approximate seed for foreign DTCG', () => {
    const out = parseStudioInput(
      JSON.stringify({ color: { light: { primary: { $value: '#123abc' } } } }),
    );
    expect(out.kind).toBe('state');
    if (out.kind !== 'state') return;
    expect(out.config.seed).toBe('#123abc');
    expect(out.notes.join()).toContain('近似');
  });

  it('detects share links / query strings', () => {
    const link = parseStudioInput('http://localhost:3000/studio?s=ff0000&d=dark');
    expect(link.kind).toBe('link');
    if (link.kind === 'link') expect(link.search).toBe('s=ff0000&d=dark');
    const bare = parseStudioInput('s=123456');
    expect(bare.kind).toBe('link');
  });
});
