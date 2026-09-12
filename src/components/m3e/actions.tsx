'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';

/**
 * M3E preview widgets — used by the landing hero and the studio canvas.
 * They consume ONLY the `--m3e-*` CSS custom properties, so re-theming the
 * wrapping element re-themes everything inside.
 */

export function Icon({
  name,
  className = '',
  fill = false,
}: {
  name: string;
  className?: string;
  fill?: boolean;
}) {
  return (
    <span aria-hidden className={`material-symbols-rounded ${fill ? 'fill' : ''} ${className}`}>
      {name}
    </span>
  );
}

const BUTTON_VARIANTS = {
  filled: 'bg-primary text-on-primary',
  tonal: 'bg-secondary-container text-on-secondary-container',
  elevated: 'bg-surface-container-low text-primary shadow-sm',
  outlined: 'bg-transparent text-primary border border-outline',
  text: 'bg-transparent text-primary',
} as const;

export type ButtonVariant = keyof typeof BUTTON_VARIANTS;

export function M3Button({
  variant = 'filled',
  icon,
  trailingIcon,
  children,
  disabled,
  onClick,
  className = '',
}: {
  variant?: ButtonVariant;
  icon?: string;
  trailingIcon?: string;
  children: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`group m3e-press t-label-large relative inline-flex h-10 shrink-0 items-center justify-center gap-2 overflow-hidden rounded-(--m3e-shape-button) px-6 select-none active:scale-[0.95] active:rounded-(--m3e-shape-medium) disabled:pointer-events-none disabled:opacity-40 ${BUTTON_VARIANTS[variant]} ${className}`}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-current opacity-0 transition-opacity duration-(--m3e-motion-duration-short2) group-hover:opacity-8"
      />
      {icon && <Icon name={icon} className="h-5 w-5 text-[20px]" />}
      {trailingIcon && <Icon name={trailingIcon} className="h-5 w-5 text-[20px]" />}
      {!icon && !trailingIcon ? (
        <span className="t-label-large">{children}</span>
      ) : (
        <span className="text-[14px] font-medium tracking-[0.1px]">{children}</span>
      )}
    </button>
  );
}

export function M3IconButton({
  icon,
  variant = 'standard',
  toggle = false,
  size = 'medium',
  label,
  fill = false,
}: {
  icon: string;
  variant?: 'standard' | 'filled' | 'tonal' | 'outlined';
  toggle?: boolean;
  size?: 'small' | 'medium' | 'large';
  label?: string;
  fill?: boolean;
}) {
  const [on, setOn] = useState(false);
  const active = toggle ? on : false;
  const sizes = {
    small: 'h-8 w-8 text-[18px]',
    medium: 'h-10 w-10 text-[22px]',
    large: 'h-12 w-12 text-[26px]',
  };
  const variants = {
    standard: 'text-on-surface-variant hover:bg-on-surface/8',
    filled: 'bg-primary text-on-primary hover:brightness-95',
    tonal: active
      ? 'bg-secondary text-on-secondary'
      : 'bg-secondary-container text-on-secondary-container hover:brightness-95',
    outlined: 'border border-outline text-on-surface-variant hover:bg-on-surface/8',
  };
  return (
    <button
      type="button"
      aria-label={label ?? icon}
      aria-pressed={toggle ? active : undefined}
      onClick={() => toggle && setOn((v) => !v)}
      className={`group m3e-press relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-(--m3e-shape-icon-button) select-none active:scale-90 active:rounded-(--m3e-shape-medium) ${sizes[size]} ${variants[variant]}`}
    >
      <Icon name={icon} fill={active || fill} className={sizes[size].split(' ')[2]} />
    </button>
  );
}

/** Full-bleed expressive button group (M3E spec: shared pill, edge-to-edge icons) */
export function M3ButtonGroup() {
  const items = [
    { icon: 'pause', label: 'Pause', filled: true },
    { icon: 'favorite', label: 'Like', filled: false },
    { icon: 'timer', label: 'Sleep', filled: false },
    { icon: 'queue_music', label: 'Queue', filled: false },
  ];
  const [selected, setSelected] = useState(0);
  return (
    <div className="m3e-press border-outline-variant flex w-full overflow-hidden rounded-(--m3e-shape-button) border">
      {items.map((item, i) => (
        <button
          key={item.label}
          type="button"
          onClick={() => setSelected(i)}
          className={`group m3e-press border-outline-variant t-label-large flex h-12 flex-1 items-center justify-center active:scale-y-[0.92] ${
            i > 0 ? 'border-l' : ''
          } ${i === selected ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant hover:bg-on-surface/6'}`}
        >
          <span className="m3e-press flex items-center gap-1.5">
            <Icon name={item.icon} fill={item.filled && i === selected} className="text-[22px]" />
            <span className="hidden sm:inline">{item.label}</span>
          </span>
        </button>
      ))}
    </div>
  );
}

/** Split button: action + adjacent icon (M3E "split button" pattern) */
export function M3SplitButton() {
  return (
    <span className="m3e-press inline-flex items-stretch overflow-hidden rounded-(--m3e-shape-button)">
      <button
        type="button"
        className="group m3e-press bg-tertiary text-on-tertiary t-label-large relative flex items-center gap-2 rounded-l-(--m3e-shape-button) px-5 active:scale-y-[0.94]"
      >
        <Icon name="download" className="text-[20px]" />
        Download
      </button>
      <button
        type="button"
        aria-label="More download options"
        className="group m3e-press bg-tertiary-container text-on-tertiary-container relative flex w-12 items-center justify-center rounded-r-(--m3e-shape-button) hover:brightness-95 active:scale-y-[0.94]"
      >
        <Icon name="expand_more" className="text-[22px]" />
      </button>
    </span>
  );
}

export function M3Fab({
  size = 'large',
  extended = false,
  icon = 'edit',
  label,
}: {
  size?: 'small' | 'medium' | 'large';
  extended?: boolean;
  icon?: string;
  label?: string;
}) {
  const dims = { small: 'h-10 w-10', medium: 'h-12 w-12', large: 'h-20 w-20' }[size];
  const iconSize = { small: 'text-[20px]', medium: 'text-[24px]', large: 'text-[32px]' }[size];
  return (
    <button
      type="button"
      aria-label={label ?? 'Floating action button'}
      className={`group m3e-press bg-primary-container text-on-primary-container relative inline-flex shrink-0 items-center justify-center gap-2 overflow-hidden rounded-(--m3e-shape-fab) shadow-sm transition-shadow select-none hover:shadow-md active:scale-90 active:rounded-(--m3e-shape-extra-large) ${
        extended ? `h-14 px-5 ${dims.split(' ')[0]}` : dims
      }`}
    >
      <Icon name={icon} className={extended ? 'text-[24px]' : iconSize} />
      {extended && <span className="t-label-large">{label ?? 'Compose'}</span>}
    </button>
  );
}

export function M3SegmentedButtons({ options, value = 0 }: { options: string[]; value?: number }) {
  const [selected, setSelected] = useState(value);
  return (
    <div
      role="group"
      className="border-outline flex h-10 overflow-hidden rounded-(--m3e-shape-button) border"
    >
      {options.map((label, i) => (
        <button
          key={label}
          type="button"
          aria-pressed={i === selected}
          onClick={() => setSelected(i)}
          className={`m3e-press border-outline t-label-large text-on-surface-variant relative flex flex-1 items-center justify-center gap-1.5 px-4 ${
            i > 0 ? 'border-l' : ''
          } ${i === selected ? 'bg-secondary-container/70 text-on-surface' : 'hover:bg-on-surface/6'}`}
        >
          {i === selected && (
            <Icon name="check" className="text-on-secondary-container text-[18px]" />
          )}
          {label}
        </button>
      ))}
    </div>
  );
}
