import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'M3E Studio — Material 3 Expressive Design Generator',
    template: '%s | M3E Studio',
  },
  description:
    'Generate a complete Material 3 Expressive design system (color, shape, typography, motion) for React, Next.js, Vue and Tailwind CSS — with bun / pnpm / npm / yarn commands.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="ja" className="h-full antialiased">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
