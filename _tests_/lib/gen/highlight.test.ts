import { describe, expect, it } from 'vitest';
import { highlight } from '@/lib/gen/highlight';

const unesc = (html: string) =>
  html.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

describe('highlight', () => {
  it('escapes HTML BEFORE tokenizing (no raw injection)', () => {
    const out = highlight('<script>alert("x")</script>');
    expect(out).not.toContain('<script>');
    expect(out).toContain('&lt;script&gt;');
  });

  it('wraps each token class by kind', () => {
    expect(highlight('// go')).toContain(
      '<span class="text-on-surface-variant italic">// go</span>',
    );
    expect(highlight('/* a\nb */')).toContain('italic">/* a\nb */</span>');
    expect(highlight('<!--x-->')).toContain('italic">&lt;!--x--&gt;</span>'); // HTML 注释も token 化
    expect(highlight('const x = 1')).toContain('<span class="text-primary-container">const</span>');
    expect(highlight('color: var(--m3e-color-primary)')).toContain(
      '<span class="text-primary">var(--m3e-color-primary)</span>',
    );
    expect(highlight('bg: #123456;')).toContain('<span class="text-secondary">#123456</span>');
    expect(highlight('w: 24px;')).toContain('<span class="text-error">24px</span>');
    expect(highlight(`s = "hi"`)).toContain('<span class="text-tertiary">"hi"</span>');
  });

  it('keeps non-token text and round-trips to the escaped source', () => {
    const src = 'a { color: #fff3; /* c */ }\nfont-size: 1.5em;';
    // span タグを外して逆エスケープすると元のソースに完全復元（欠落・重複なし）
    expect(unesc(highlight(src).replace(/<\/?span[^>]*>/g, ''))).toBe(src);
  });

  it('is stateless across calls (global regex lastIndex reset)', () => {
    const src = 'import x from "y"; // ok';
    expect(highlight(src)).toBe(highlight(src));
    expect(highlight(src)).toBe(highlight(src));
  });

  it('leaves token-free input untouched', () => {
    expect(highlight('plain words only')).toBe('plain words only');
  });
});
