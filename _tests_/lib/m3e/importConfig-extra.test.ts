import { describe, expect, it } from 'vitest';
import { DEFAULT_CONFIG } from '@/lib/m3e/config';
import { parseStudioInput } from '@/lib/m3e/importConfig';

describe('parseStudioInput extras', () => {
  it('errors: empty input', () => {
    expect(parseStudioInput('   ')).toMatchObject({ kind: 'error' });
  });

  it('errors: JSON root that is not an object', () => {
    const r = parseStudioInput('42');
    expect(r).toMatchObject({
      kind: 'error',
      message: 'JSON のルートがオブジェクトではありません。',
    });
  });

  it('errors: arrays pass typeof-object but carry no seed', () => {
    expect(parseStudioInput('[1,2,3]')).toMatchObject({ kind: 'error' });
  });

  it('unknown variant degrades to default with a note (never throws)', () => {
    const text = JSON.stringify({
      $extensions: {
        'io.material.studio': {
          seed: 'aabbcc',
          variant: 'vibrant2',
          contrast: '2',
          cornerBoost: {},
        },
      },
    });
    const r = parseStudioInput(text);
    expect(r.kind).toBe('state');
    if (r.kind !== 'state') return;
    expect(r.config.seed).toBe('#aabbcc');
    expect(r.config.variant).toBe(DEFAULT_CONFIG.variant); // 不明値は既定
    expect(r.config.contrast).toBe(DEFAULT_CONFIG.contrast); // 数値でないものは無視
    expect(r.config.cornerBoost).toBe(DEFAULT_CONFIG.cornerBoost);
    expect(r.notes.join()).toContain('variant');
  });

  it('share link strips URL fragments before decoding', () => {
    const r = parseStudioInput('https://example.com/studio?s=aabbcc&m=dark#frag');
    expect(r).toMatchObject({ kind: 'link', search: 's=aabbcc&m=dark' });
  });
});
