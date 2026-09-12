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
        <span className="t-label-large mb-1 flex items-center justify-between text-on-surface-variant">
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
        className="m3e-slider h-10 w-full cursor-pointer appearance-none bg-transparent"
        style={{
          // filled track + flat remainder (M3E slider "center" style with icon handle)
          // @ts-expect-error custom property
          '--m3e-slider-pct': `${pct}%`,
        }}
        aria-label={label}
      />
      {showHandleIcon && (
        <style>{`
          .m3e-slider::-webkit-slider-runnable-track { height: 16px; border-radius: 9999px; background: linear-gradient(to right, var(--m3e-color-primary) var(--m3e-slider-pct), var(--m3e-color-surface-container-highest) var(--m3e-slider-pct)); }
          .m3e-slider::-webkit-slider-thumb { appearance: none; width: 26px; height: 26px; margin-top: -5px; border-radius: 9999px; background: var(--m3e-color-primary); border: 3px solid var(--m3e-color-on-primary); box-shadow: 0 1px 3px rgb(0 0 0 / .28); transition: transform var(--m3e-motion-spring-fast-spatial-duration) var(--m3e-motion-spring-fast-spatial-easing); }
          .m3e-slider:active::-webkit-slider-thumb { transform: scale(1.35); }
          .m3e-slider::-moz-range-track { height: 16px; border-radius: 9999px; background: var(--m3e-color-surface-container-highest); }
          .m3e-slider::-moz-range-progress { height: 16px; border-radius: 9999px; background: var(--m3e-color-primary); }
          .m3e-slider::-moz-range-thumb { width: 22px; height: 22px; border-radius: 9999px; background: var(--m3e-color-primary); border: 3px solid var(--m3e-color-on-primary); }
        `}</style>
      )}
    </label>
  );
}

export function M3Switch({ checked, onChange, label }: { checked: boolean; onChange?: (v: boolean) => void; label?: string }) {
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
          checked
            ? 'border-primary bg-primary'
            : 'border-outline bg-surface-container-highest'
        } group-hover:shadow-sm`}
      >
        <span
          className={`m3e-press flex items-center justify-center rounded-(--m3e-shape-switch) transition-transform ${
            checked
              ? 'translate-x-5 bg-on-primary text-primary'
              : 'translate-x-0 bg-outline text-on-surface-variant h-4 w-4'
          } ${checked ? 'h-6 w-6' : ''}`}
        >
          {checked && <Icon name="check" className="text-[14px]" />}
        </span>
      </span>
      {label && <span className="t-label-large text-on-surface">{label}</span>}
    </button>
  );
}

export function M3FilterChip({ label, icon, initial = false }: { label: string; icon?: string; initial?: boolean }) {
  const [on, setOn] = useState(initial);
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={() => setOn((v) => !v)}
      className={`m3e-press inline-flex h-8 items-center gap-1.5 overflow-hidden rounded-(--m3e-shape-chip) border px-3 t-label-large active:scale-95 ${
        on
          ? 'border-outline-variant bg-secondary-container text-on-secondary-container'
          : 'border-outline-variant bg-surface text-on-surface-variant hover:bg-on-surface/8'
      }`}
    >
      <span className={`m3e-press overflow-hidden transition-all ${on ? 'w-[18px] opacity-100' : 'w-0 opacity-0'}`}>
        <Icon name="check" className="text-[18px]" />
      </span>
      {!on && icon && <Icon name={icon} className="text-[18px]" />}
      {label}
    </button>
  );
}

export function M3SearchBar() {
  return (
    <div className="m3e-press flex h-14 items-center gap-3 rounded-(--m3e-shape-search-bar) bg-surface-container-high px-4 focus-within:ring-2 focus-within:ring-primary">
      <Icon name="search" className="text-on-surface-variant" />
      <input
        placeholder="Search artists, songs, podcasts"
        className="t-body-large w-full bg-transparent text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none"
      />
      <Icon name="mic" className="text-on-surface-variant" />
    </div>
  );
}
