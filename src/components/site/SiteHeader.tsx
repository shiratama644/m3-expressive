'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/studio', label: 'Studio' },
  { href: '/presets', label: 'Presets' },
  { href: '/tokens', label: 'Tokens' },
  { href: '/docs', label: 'Docs' },
];

export function SiteHeader() {
  const pathname = usePathname();
  return (
    <header className="border-outline-variant/60 bg-surface/85 sticky top-0 z-40 border-b backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-350 items-center gap-6 px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-3">
          <Logo />
          <span className="t-title-large text-on-surface">
            M3E <span className="text-primary">Studio</span>
          </span>
        </Link>
        <nav className="ml-auto flex items-center gap-1">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 transition-colors duration-(--m3e-motion-duration-short2) ${
                  active
                    ? 'bg-secondary-container text-on-secondary-container'
                    : 'text-on-surface-variant hover:bg-on-surface/8'
                }`}
              >
                <span className="t-label-large">{item.label}</span>
              </Link>
            );
          })}
          <a
            href="https://github.com/shiratama644/m3-expressive"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub repository"
            className="text-on-surface-variant hover:bg-on-surface/8 ml-1 hidden rounded-full p-2 transition-colors duration-(--m3e-motion-duration-short2) sm:block"
          >
            <span className="material-symbols-rounded block">code</span>
          </a>
        </nav>
      </div>
    </header>
  );
}

function Logo() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      aria-hidden
      className="transition-transform duration-(--m3e-motion-duration-medium2) group-hover:rotate-[24deg]"
    >
      <defs>
        <linearGradient id="m3e-logo-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--m3e-color-primary)" />
          <stop offset="100%" stopColor="var(--m3e-color-tertiary)" />
        </linearGradient>
      </defs>
      <path
        d="M6 10C6 6 8 4 12 4h8c4 0 6 2 6 6v6c0 4-2 6-6 6h-2l-4 6-4-6h-2c-4 0-6-2-6-6z"
        fill="url(#m3e-logo-g)"
      />
      <circle cx="22" cy="10" r="3" fill="var(--m3e-color-on-primary)" />
    </svg>
  );
}
