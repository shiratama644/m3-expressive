'use client';

import type { ReactNode } from 'react';
import { Icon } from '@/components/m3e/actions';

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block select-none">
      <span className="t-label-large text-on-surface flex items-center justify-between">
        {label}
        {hint && <span className="t-label-small text-on-surface-variant">{hint}</span>}
      </span>
      <span className="mt-2 block">{children}</span>
    </label>
  );
}

export function SliderRow({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
}) {
  return (
    <Field label={label} hint={format ? format(value) : String(value)}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="m3e-slider h-8 w-full cursor-pointer"
        style={{ ['--m3e-slider-pct' as string]: `${((value - min) / (max - min)) * 100}%` }}
      />
    </Field>
  );
}

export function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label?: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  const control = (
    <div
      role="group"
      className="border-outline-variant flex min-h-9 w-full overflow-hidden rounded-(--m3e-shape-button) border"
    >
      {options.map((opt, i) => (
        <button
          key={opt.value}
          type="button"
          aria-pressed={opt.value === value}
          onClick={() => onChange(opt.value)}
          className={`m3e-press t-label-medium text-on-surface-variant flex flex-1 items-center justify-center gap-1 px-1.5 text-center ${
            i > 0 ? 'border-outline-variant border-l' : ''
          } ${opt.value === value ? 'bg-secondary-container text-on-secondary-container' : 'hover:bg-on-surface/8'}`}
        >
          {opt.value === value && <Icon name="check" className="text-[16px]" />}
          <span className="truncate">{opt.label}</span>
        </button>
      ))}
    </div>
  );
  return label ? <Field label={label}>{control}</Field> : control;
}

export function SwitchRow({
  label,
  checked,
  onChange,
  hint,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  hint?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-1">
      <span className="t-label-large text-on-surface">
        {label}
        {hint && <span className="t-label-small text-on-surface-variant block">{hint}</span>}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`m3e-press relative flex h-8 w-13 shrink-0 items-center rounded-(--m3e-shape-switch) border-2 ${
          checked ? 'border-primary bg-primary' : 'border-outline bg-surface-container-highest'
        }`}
      >
        <span
          className={`m3e-press flex items-center justify-center overflow-hidden rounded-(--m3e-shape-switch) ${
            checked
              ? 'bg-on-primary h-6 w-6 translate-x-[20px]'
              : 'bg-outline h-4 w-4 translate-x-[3px]'
          }`}
        >
          {checked && <Icon name="check" className="text-primary !text-[14px]" />}
        </span>
      </button>
    </div>
  );
}

export function ControlGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-outline-variant/50 flex flex-col gap-4 border-b px-4 py-5 last:border-b-0">
      <h3 className="t-label-large text-primary">{title}</h3>
      {children}
    </section>
  );
}
