import { describe, expect, it } from 'vitest';
import { fontDeps } from '@/lib/gen/common';

describe('fontDeps', () => {
  it('maps each family to its zero-dependency fontsource choice', () => {
    expect(fontDeps('roboto-flex')).toEqual({ runtime: ['@fontsource-variable/roboto-flex'] });
    expect(fontDeps('roboto')).toEqual({ runtime: ['@fontsource/roboto'] });
    expect(fontDeps('system')).toEqual({ runtime: [] });
  });
});
