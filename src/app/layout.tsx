import type { Metadata, Viewport } from 'next';
import '@fontsource-variable/roboto-flex/full.css';
import '@fontsource-variable/material-symbols-rounded/full.css';
import './globals.css';
import { getSiteThemeCss } from '@/lib/site-theme';
import { SiteHeader } from '@/components/site/SiteHeader';
import { SiteFooter } from '@/components/site/SiteFooter';

export const metadata: Metadata = {
  title: {
    default: 'M3E Studio — Material 3 Expressive Design Generator',
    template: '%s | M3E Studio',
  },
  description:
    'Generate a complete Material 3 Expressive design system (color, shape, typography, motion) for React, Next.js, Vue and Tailwind CSS — with ready-to-run bun / pnpm / npm / yarn commands.',
  keywords: [
    'Material 3 Expressive',
    'M3E',
    'design tokens',
    'Tailwind CSS',
    'React',
    'Next.js',
    'Vue',
    'dynamic color',
    'Material Design',
  ],
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FEF7FF' },
    { media: '(prefers-color-scheme: dark)', color: '#141218' },
  ],
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="ja" className="h-full antialiased">
      <head>
        {/* Site chrome theme = the engine's default theme, computed at build time */}
        <style id="m3e-site-theme" dangerouslySetInnerHTML={{ __html: getSiteThemeCss() }} />
      </head>
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        <main className="flex flex-1 flex-col">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
