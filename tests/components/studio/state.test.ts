import { describe, expect, it } from 'vitest';
import { DEFAULT_STATE, paramsToState, stateToParams } from '@/components/studio/state';

describe('studio URL codec', () => {
  it('omits defaults', () => {
    expect(stateToParams(DEFAULT_STATE)).toBe('');
  });
  it('round-trips arbitrary configs', () => {
    const state = {
      config: {
        ...DEFAULT_STATE.config,
        seed: '#00ff88',
        contrast: -0.5,
        cornerBoost: 12,
        asymmetry: false,
        useSprings: false,
        typeScale: 0.9,
      },
      mode: 'dark' as const,
    };
    expect(paramsToState(stateToParams(state))).toEqual(state);
  });
  it('ignores unknown params', () => {
    expect(paramsToState('zzz=nope&s=abc123')).toEqual({
      ...DEFAULT_STATE,
      config: { ...DEFAULT_STATE.config, seed: '#abc123' },
    });
  });
});
