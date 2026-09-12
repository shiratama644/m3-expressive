'use client';

import { VARIANT_LABELS, type M3EVariant } from '@/lib/m3e/color';
import { M3E_VARIANTS } from '@/lib/m3e/color';
import type { StudioPatch, StudioState } from './state';
import { SEED_PRESETS } from './state';
import { ControlGroup, Field, Segmented, SliderRow, SwitchRow } from './primitives';
import { Icon } from '@/components/m3e/actions';

function randomSeed(): string {
  const h = Math.floor(Math.random() * 360);
  const s = 60 + Math.floor(Math.random() * 30);
  const l = 45 + Math.floor(Math.random() * 15);
  return hslToHex(h, s, l);
}

function hslToHex(h: number, s: number, l: number): string {
  const a = (s / 100) * Math.min(l / 100, 1 - l / 100);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const c = l / 100 - a * Math.max(-1, Math.min(k - 3, Math.min(9 - k, 1)));
    return Math.round(255 * c)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

export function Controls({
  state,
  update,
}: {
  state: StudioState;
  update: (patch: StudioPatch) => void;
}) {
  const { config } = state;
  return (
    <div className="thin-scroll flex h-full flex-col overflow-y-auto">
      <ControlGroup title="Color">
        <Field label="Seed color">
          <div className="flex items-center gap-2">
            <span className="border-outline-variant relative h-12 w-12 shrink-0 overflow-hidden rounded-(--m3e-shape-medium) border">
              <input
                type="color"
                value={config.seed}
                onChange={(e) => update({ seed: e.target.value })}
                aria-label="Pick seed color"
                className="absolute -inset-2 h-16 w-16 cursor-pointer border-0 bg-transparent p-0"
              />
            </span>
            <input
              value={config.seed.toUpperCase()}
              onChange={(e) => {
                const v = e.target.value.trim();
                if (/^#?[0-9a-fA-F]{6}$/.test(v)) update({ seed: v.startsWith('#') ? v : `#${v}` });
                else if (/^#?[0-9a-fA-F]{3}$/.test(v)) {
                  const h = v.replace('#', '');
                  update({
                    seed: `#${h
                      .split('')
                      .map((c) => c + c)
                      .join('')}`,
                  });
                }
              }}
              spellCheck={false}
              className="t-body-medium text-on-surface ring-outline h-12 w-full min-w-0 rounded-(--m3e-shape-extra-small) bg-transparent px-3 font-mono outline-none focus:ring-2"
            />
            <button
              type="button"
              onClick={() => update({ seed: randomSeed() })}
              aria-label="Random seed"
              title="Random seed"
              className="m3e-press text-on-surface-variant hover:bg-on-surface/8 flex h-12 w-12 shrink-0 items-center justify-center rounded-(--m3e-shape-extra-small) active:scale-90"
            >
              <Icon name="casino" />
            </button>
          </div>
        </Field>
        <div className="flex flex-wrap gap-1.5">
          {SEED_PRESETS.map((preset) => (
            <button
              key={preset.hex}
              type="button"
              title={preset.name}
              aria-label={preset.name}
              onClick={() => update({ seed: preset.hex })}
              className={`ring-offset-surface h-7 w-7 rounded-(--m3e-shape-small) ring-offset-2 transition-all duration-(--m3e-motion-duration-short2) hover:scale-110 ${
                config.seed.toLowerCase() === preset.hex.toLowerCase()
                  ? 'ring-primary ring-2'
                  : 'ring-outline-variant ring-1'
              }`}
              style={{ background: preset.hex }}
            />
          ))}
        </div>
        <Field label="Variant">
          <select
            value={config.variant}
            onChange={(e) => update({ variant: e.target.value as M3EVariant })}
            className="t-body-medium text-on-surface ring-outline h-11 w-full cursor-pointer rounded-(--m3e-shape-extra-small) bg-transparent px-3 transition-shadow outline-none focus:ring-2"
          >
            {M3E_VARIANTS.map((v) => (
              <option key={v} value={v} className="bg-surface text-on-surface">
                {VARIANT_LABELS[v]}
              </option>
            ))}
          </select>
        </Field>
        <SliderRow
          label="Contrast"
          value={config.contrast}
          min={-1}
          max={1}
          step={0.25}
          onChange={(v) => update({ contrast: v })}
          format={(v) => (v === 0 ? 'standard' : v === 1 ? 'high' : v.toFixed(2))}
        />
        <Segmented
          label="Dark preview"
          options={[
            { value: 'light', label: 'Light' },
            { value: 'dark', label: 'Dark' },
          ]}
          value={state.mode}
          onChange={(mode) => update({ mode })}
        />
      </ControlGroup>

      <ControlGroup title="Shape">
        <Segmented
          label="Emphasis"
          options={[
            { value: 'standard', label: 'Standard' },
            { value: 'increased', label: 'Increased (M3E)' },
          ]}
          value={config.shapeEmphasis}
          onChange={(shapeEmphasis) => update({ shapeEmphasis })}
        />
        <SliderRow
          label="Corner boost"
          value={config.cornerBoost}
          min={-8}
          max={24}
          step={1}
          onChange={(cornerBoost) => update({ cornerBoost })}
          format={(v) => `${v > 0 ? '+' : ''}${v}px`}
        />
        <SwitchRow
          label="Asymmetric shapes"
          hint="large-top / extra-large-bottom…"
          checked={config.asymmetry}
          onChange={(asymmetry) => update({ asymmetry })}
        />
      </ControlGroup>

      <ControlGroup title="Motion">
        <Segmented
          label="Scheme"
          options={[
            { value: 'expressive', label: 'Expressive' },
            { value: 'standard', label: 'Standard' },
          ]}
          value={config.motionScheme}
          onChange={(motionScheme) => update({ motionScheme })}
        />
        <SwitchRow
          label="Spring → CSS linear()"
          hint="physics-derived easing samples, no JS"
          checked={config.useSprings}
          onChange={(useSprings) => update({ useSprings })}
        />
      </ControlGroup>

      <ControlGroup title="Typography">
        <Field label="Family">
          <select
            value={config.typeFamily}
            onChange={(e) =>
              update({ typeFamily: e.target.value as 'roboto-flex' | 'roboto' | 'system' })
            }
            className="t-body-medium text-on-surface ring-outline h-11 w-full cursor-pointer rounded-(--m3e-shape-extra-small) bg-transparent px-3 transition-shadow outline-none focus:ring-2"
          >
            <option value="roboto-flex" className="bg-surface">
              Roboto Flex (variable)
            </option>
            <option value="roboto" className="bg-surface">
              Roboto
            </option>
            <option value="system" className="bg-surface">
              System UI
            </option>
          </select>
        </Field>
        <SliderRow
          label="Scale"
          value={config.typeScale}
          min={0.85}
          max={1.15}
          step={0.01}
          onChange={(typeScale) => update({ typeScale })}
          format={(v) => `×${v.toFixed(2)}`}
        />
        <SwitchRow
          label="Optical sizing"
          hint="opsz axis (Roboto Flex)"
          checked={config.opticalSize === 'auto'}
          onChange={(v) => update({ opticalSize: v ? 'auto' : 'off' })}
        />
      </ControlGroup>

      <ControlGroup title="Output">
        <Segmented
          label="Token naming"
          options={[
            { value: 'm3e', label: '--m3e-*' },
            { value: 'md-sys', label: '--md-sys-*' },
          ]}
          value={config.naming}
          onChange={(naming) => update({ naming })}
        />
      </ControlGroup>
    </div>
  );
}
