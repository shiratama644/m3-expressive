// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const nav = vi.hoisted(() => ({ pathname: '/studio' }));
vi.mock('next/navigation', () => ({ usePathname: () => nav.pathname }));

import { SiteFooter } from '@/components/site/SiteFooter';
import { SiteHeader } from '@/components/site/SiteHeader';

afterEach(cleanup);

describe('site chrome', () => {
  it('header exposes navigation to all routes', () => {
    render(<SiteHeader />);
    const links = screen.getAllByRole('link');
    const hrefs = links.map((a) => a.getAttribute('href'));
    for (const route of ['/studio', '/docs', '/tokens', '/presets']) {
      expect(hrefs, `nav link to ${route}`).toContain(route);
    }
    // pathname に一致する項目がアクティブスタイル（aria ではなく class で表現）
    const studioLink = links.find((a) => a.getAttribute('href') === '/studio');
    expect(studioLink?.className).toContain('bg-secondary-container');
    // 子パス（/tokens/...）では startsWith 側でアクティブ化する
    nav.pathname = '/tokens/detail';
    cleanup();
    render(<SiteHeader />);
    const tokensLink = screen
      .getAllByRole('link')
      .find((a) => a.getAttribute('href') === '/tokens');
    expect(tokensLink?.className).toContain('bg-secondary-container');
  });

  it('footer renders the project blurb', () => {
    render(<SiteFooter />);
    expect(document.body.textContent).toMatch(/Material 3 Expressive|MIT|©/);
  });
});
