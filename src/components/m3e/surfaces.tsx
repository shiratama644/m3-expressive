'use client';

import type { ReactNode } from 'react';
import { Icon } from './actions';

export function M3Card({
  variant = 'filled',
  title,
  subtitle,
  children,
  media,
}: {
  variant?: 'elevated' | 'filled' | 'outlined';
  title: string;
  subtitle?: string;
  children?: ReactNode;
  media?: ReactNode;
}) {
  const looks = {
    elevated: 'bg-surface-container-low shadow-sm hover:shadow-md',
    filled: 'bg-surface-container',
    outlined: 'bg-surface border border-outline-variant',
  } as const;
  return (
    <div
      className={`m3e-spatial group flex w-56 shrink-0 flex-col overflow-hidden rounded-(--m3e-shape-card) ${looks[variant]}`}
    >
      {media}
      <div className="flex flex-1 flex-col gap-1 p-4">
        {subtitle && <p className="t-label-medium text-on-surface-variant">{subtitle}</p>}
        <p className="t-title-medium text-on-surface">{title}</p>
        {children && <div className="mt-2">{children}</div>}
      </div>
    </div>
  );
}

/** M3E card-carousel — floating cards, asymmetric shape on the centered item */
export function M3CardCarousel() {
  const items = [
    { title: 'Vivid Nights', tone: 'var(--m3e-color-primary)' },
    { title: 'Glass Bloom', tone: 'var(--m3e-color-tertiary)' },
    { title: 'Paper Sun', tone: 'var(--m3e-color-secondary)' },
    { title: 'Echo Bay', tone: 'var(--m3e-color-error)' },
  ];
  return (
    <div className="thin-scroll flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth p-1">
      {items.map((item) => (
        <div
          key={item.title}
          className="m3e-spatial bg-surface-container-low w-40 shrink-0 snap-center overflow-hidden rounded-(--m3e-shape-carousel-item) shadow-sm transition-transform hover:-translate-y-1"
        >
          <div
            className="h-28 w-full"
            style={{
              background: `radial-gradient(120% 140% at 20% 10%, color-mix(in srgb, ${item.tone} 90%, white) 0%, ${item.tone} 55%, color-mix(in srgb, ${item.tone} 55%, black) 100%)`,
            }}
          />
          <div className="p-3">
            <p className="t-title-small text-on-surface">{item.title}</p>
            <p className="t-body-small text-on-surface-variant">Playlist</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/** Expressive loading indicator: shape-morphing blob (spec: loading indicator morph) */
export function M3LoadingIndicator({ size = 48 }: { size?: number }) {
  return (
    <span
      role="progressbar"
      aria-label="Loading"
      className="bg-primary block"
      style={{
        width: size,
        height: size,
        animation: `m3e-shape-morph 2.4s var(--m3e-motion-easing-emphasized) infinite`,
      }}
    />
  );
}

/** Linear wavy progress (indeterminate) */
export function M3LinearProgress({ value }: { value?: number }) {
  if (value !== undefined) {
    return (
      <div className="bg-surface-container-highest h-1 w-full overflow-hidden rounded-(--m3e-shape-progress)">
        <div className="bg-primary h-full rounded-r-full" style={{ width: `${value}%` }} />
      </div>
    );
  }
  return (
    <div
      className="h-1 w-full rounded-(--m3e-shape-progress)"
      role="progressbar"
      aria-label="Loading"
      style={{
        background:
          'linear-gradient(90deg, var(--m3e-color-surface-container-highest) 0%, var(--m3e-color-primary) 25%, var(--m3e-color-surface-container-highest) 50%, var(--m3e-color-primary) 75%, var(--m3e-color-surface-container-highest) 100%)',
        backgroundSize: '200% 100%',
        animation: 'm3e-wave 1.6s linear infinite',
      }}
    />
  );
}

export function M3Toast({ label, action }: { label: string; action?: string }) {
  return (
    <div className="m3e-pop bg-inverse-surface text-inverse-on-surface inline-flex h-12 items-center gap-4 rounded-(--m3e-shape-snackbar) pr-2 pl-4 shadow-md">
      <span className="t-label-large">{label}</span>
      {action && (
        <button
          type="button"
          className="t-label-large text-inverse-primary hover:bg-inverse-primary/10 rounded-(--m3e-shape-button) px-2 py-1"
        >
          {action}
        </button>
      )}
    </div>
  );
}

export function M3Badge({ children, value = 3 }: { children: ReactNode; value?: number }) {
  return (
    <span className="relative inline-flex">
      {children}
      <span className="bg-error text-on-error absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-(--m3e-shape-badge) px-1 text-[10px] font-bold">
        {value}
      </span>
    </span>
  );
}

export function M3MiniPlayer() {
  return (
    <div className="bg-secondary-container text-on-secondary-container flex items-center gap-3 rounded-(--m3e-shape-sheet) p-3">
      <div className="from-primary to-tertiary h-11 w-11 rounded-(--m3e-shape-extra-small) bg-gradient-to-br" />
      <div className="min-w-0 flex-1">
        <p className="t-title-small truncate">Coral Dust — Slow Motion</p>
        <p className="t-body-small opacity-70">Kanae &amp; The Tides</p>
      </div>
      <Icon name="play_arrow" fill className="text-[28px]" />
      <Icon name="close" className="text-[24px]" />
    </div>
  );
}
