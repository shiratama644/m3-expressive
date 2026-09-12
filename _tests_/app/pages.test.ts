import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import DocsPage, { metadata as docsMeta } from '@/app/docs/page';
import Home from '@/app/page';
import PresetsPage, { metadata as presetsMeta } from '@/app/presets/page';
import StudioPage from '@/app/studio/page';
import TokensPage from '@/app/tokens/page';

const strip = (html: string) => html.replace(/<[^>]+>/g, ' ');

describe('server components (SSR render)', () => {
  it('landing hero mentions the product promise', () => {
    const html = renderToStaticMarkup(Home());
    expect(html).toMatch(/Material 3 Expressive/i);
    expect(html).toContain('/studio');
    expect(html).not.toContain('undefined');
  });

  it('docs page explains install and exports metadata', () => {
    const html = renderToStaticMarkup(DocsPage());
    expect(html).toMatch(/pnpm install|Install/i);
    expect(docsMeta.title).toBeTruthy();
  });

  it('tokens page renders role groups and shape tables', () => {
    const html = renderToStaticMarkup(TokensPage());
    expect(strip(html)).toContain('primary');
    expect(html).not.toContain('NaN');
  });

  it('presets page mounts the gallery', () => {
    const html = renderToStaticMarkup(PresetsPage());
    expect(html).toContain('/studio?s=');
    expect(presetsMeta.title).toMatch(/Presets/);
  });

  it('studio page decodes searchParams into the initial theme', async () => {
    const el = await StudioPage({
      searchParams: Promise.resolve({ s: 'aabbcc', d: 'dark' }),
    } as never);
    const html = renderToStaticMarkup(el);
    expect(html).toContain('Seed');
    // シードはハッシュ付きで復号され、HTML 生成時点でダークモードが効いている
    expect(html).toContain('#aabbcc');
  });
});
