import { describe, expect, it } from 'vitest';
import { DEFAULT_CONFIG } from '@/lib/m3e/config';
import { generateTokensJson } from '@/lib/m3e/tokensJson';

describe('tokens.json (W3C DTCG style)', () => {
  const json = JSON.parse(generateTokensJson(DEFAULT_CONFIG));

  it('carries color modes', () => {
    expect(json.color.light.primary.$value).toMatch(/^#[0-9a-f]{6}$/);
    expect(json.color.light.primary.$type).toBe('color');
    expect(json.color.dark.primary.$value).toMatch(/^#[0-9a-f]{6}$/);
  });

  it('carries shape corners and motion tables', () => {
    expect(json.shape.corner['extra-large'].$value).toBe('28px');
    expect(json.motion.duration.medium2.$value).toBe('300ms');
    expect(json.motion.easing.emphasized.$value).toEqual({ x1: 0.2, y1: 0, x2: 0, y2: 1 });
  });

  it('carries spring definitions for both schemes', () => {
    expect(json.motion.spring.expressive['default-spatial'].$value).toEqual({
      stiffness: 380,
      damping: 0.8,
      mass: 1,
    });
    expect(json.motion.spring.standard['default-spatial'].$value).toEqual({
      stiffness: 700,
      damping: 0.9,
      mass: 1,
    });
  });

  it('records studio config in $extensions', () => {
    expect(json.$extensions['io.material.studio'].seed).toBe(DEFAULT_CONFIG.seed);
    expect(json.$extensions['io.material.studio'].variant).toBe('expressive');
  });

  it('typography references css vars of the chosen prefix', () => {
    expect(json.typography['display-large'].$value.fontSize).toBe(
      'var(--m3e-typescale-display-large-size)',
    );
  });
});
