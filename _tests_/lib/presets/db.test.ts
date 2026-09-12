import { describe, expect, it } from 'vitest';
import { getDb, listThemes } from '@/lib/presets/db';

describe('presets db guards (SSR side)', () => {
  it('getDb throws outside the browser', () => {
    expect(() => getDb()).toThrow(/browser-only/);
  });

  it('listThemes degrades to [] on the server', async () => {
    await expect(listThemes()).resolves.toEqual([]);
  });
});
