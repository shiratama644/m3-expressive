import { describe, expect, it } from 'vitest';
import { getSiteThemeCss } from '@/lib/site-theme';

describe('getSiteThemeCss', () => {
  const css = getSiteThemeCss();
  it('emits the default expressive theme as CSS vars', () => {
    expect(css).toContain('--m3e-color-primary:');
    expect(css).toContain('#');
    expect(css).not.toContain('NaN');
    expect(css).not.toContain('undefined');
  });
  it('uses media-based dark mode', () => {
    expect(css).toContain('prefers-color-scheme: dark');
  });
});
