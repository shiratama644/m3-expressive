'use client';

import { useState } from 'react';
import { Icon } from './actions';

export function M3Slider({
  value,
  onChange,
  label,
  showHandleIcon = true,
  min = 0,
  max = 100,
}: {
  value: number;
  onChange?: (v: number) => void;
  label?: string;
  showHandleIcon?: boolean;
  min?: number;
  max?: number;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <label className="block w-full select-none">
      {label && (
        <span className="t-label-large text-on-surface-variant mb-1 flex items-center justify-between">
          {label}
          <span className="t-label-medium text-on-surface">{Math.round(pct)}%</span>
        </span>
      )}
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange?.(Number(e.target.value))}
        className={`m3e-slider h-10 w-full cursor-pointer appearance-none bg-transparent ${showHandleIcon ? '' : 'm3e-slider-flat'}`}
        style={{
          // filled track + flat remainder (M3E slider "center" style with icon handle)
          // @ts-expect-error custom property
          '--m3e-slider-pct': `${pct}%`,
        }}
        aria-label={label}
      />
    </label>
  );
}

export function M3Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange?: (v: boolean) => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange?.(!checked)}
      className="group inline-flex items-center gap-3"
    >
      <span
        className={`m3e-press relative flex h-8 w-13 items-center justify-start rounded-(--m3e-shape-switch) border-2 px-0.5 ${
          checked ? 'border-primary bg-primary' : 'border-outline bg-surface-container-highest'
        } group-hover:shadow-sm`}
      >
        <span
          className={`m3e-press flex items-center justify-center rounded-(--m3e-shape-switch) transition-transform ${
            checked
              ? 'bg-on-primary text-primary translate-x-5'
              : 'bg-outline text-on-surface-variant h-4 w-4 translate-x-0'
          } ${checked ? 'h-6 w-6' : ''}`}
        >
          {checked && <Icon name="check" className="text-[14px]" />}
        </span>
      </span>
      {label && <span className="t-label-large text-on-surface">{label}</span>}
    </button>
  );
}

export function M3FilterChip({
  label,
  icon,
  initial = false,
}: {
  label: string;
  icon?: string;
  initial?: boolean;
}) {
  const [on, setOn] = useState(initial);
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={() => setOn((v) => !v)}
      className={`m3e-press t-label-large inline-flex h-8 items-center gap-1.5 overflow-hidden rounded-(--m3e-shape-chip) border px-3 active:scale-95 ${
        on
          ? 'border-outline-variant bg-secondary-container text-on-secondary-container'
          : 'border-outline-variant bg-surface text-on-surface-variant hover:bg-on-surface/8'
      }`}
    >
      <span
        className={`m3e-press overflow-hidden transition-all ${on ? 'w-[18px] opacity-100' : 'w-0 opacity-0'}`}
      >
        <Icon name="check" className="text-[18px]" />
      </span>
      {!on && icon && <Icon name={icon} className="text-[18px]" />}
      {label}
    </button>
  );
}

export function M3SearchBar() {
  return (
    <div className="m3e-press bg-surface-container-high focus-within:ring-primary flex h-14 items-center gap-3 rounded-(--m3e-shape-search-bar) px-4 focus-within:ring-2">
      <Icon name="search" className="text-on-surface-variant" />
      <input
        placeholder="Search artists, songs, podcasts"
        className="t-body-large text-on-surface placeholder:text-on-surface-variant/70 w-full bg-transparent focus:outline-none"
      />
      <Icon name="mic" className="text-on-surface-variant" />
    </div>
  );
}
