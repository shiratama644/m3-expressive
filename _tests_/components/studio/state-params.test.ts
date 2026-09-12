import { describe, expect, it } from 'vitest';
import { DEFAULT_STATE, paramsToState } from '@/components/studio/state';
import { DEFAULT_CONFIG } from '@/lib/m3e/config';

describe('paramsToState robustness', () => {
  it('ignores garbage values on every key (defaults survive)', () => {
    const { config, mode } = paramsToState(
      'd=bogus&s=zzzzzz&v=nope&c=abc&e=&b=y&t=x&o=auto3&n=weird&f=nope&m=zzz',
    );
    expect(mode).toBe('light');
    expect(config).toEqual(DEFAULT_STATE.config);
    expect(config.seed).toBe(DEFAULT_CONFIG.seed);
  });

  it('accepts explicit false booleans (a/p keys)', () => {
    const { config } = paramsToState('a=false&p=false');
    expect(config.asymmetry).toBe(false);
    expect(config.useSprings).toBe(false);
    // 真偽キーは「存在すれば true/false のみ解釈」（それ以外の値は false 扱い）
    expect(paramsToState('a=2').config.asymmetry).toBe(false);
    expect(paramsToState('a=true').config.asymmetry).toBe(true);
  });

  it('accepts explicit true for motionScheme/typeFamily/opticalSize keys', () => {
    const { config } = paramsToState('m=standard&f=roboto&o=off&e=increased&d=dark');
    expect(config.motionScheme).toBe('standard');
    expect(config.typeFamily).toBe('roboto');
    expect(config.opticalSize).toBe('off');
    expect(config.shapeEmphasis).toBe('increased');
  });

  it('normalizes 6-digit seeds with or without #', () => {
    expect(paramsToState('s=%23AbCdEf').config.seed).toBe('#AbCdEf');
    expect(paramsToState('s=ffffff').config.seed).toBe('#ffffff');
  });

  it('applies a valid variant', () => {
    expect(paramsToState('v=monochrome').config.variant).toBe('monochrome');
  });

  it('mode key is d (dark only); m is motionScheme', () => {
    expect(paramsToState('d=dark').mode).toBe('dark');
    expect(paramsToState('d=DARK').mode).toBe('light');
    expect(paramsToState('m=dark').mode).toBe('light');
  });
});
