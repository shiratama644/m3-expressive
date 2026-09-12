'use client';

import { useMemo, useState } from 'react';
import {
  auditTheme,
  A11Y_LEVELS,
  A11Y_LEVEL_LABELS,
  advisoryNotes,
  findFixContrast,
  type A11yLevel,
} from '@/lib/m3e/a11y';
import type { ThemeBundle } from '@/lib/m3e/css';
import { prefixFor } from '@/lib/m3e/config';
import { Icon } from '@/components/m3e/actions';

const fmt = (r: number): string => `${r >= 20.5 ? '21' : r.toFixed(2)}:1`;

function RatioCell({ ratio, min, bg, fg }: { ratio: number; min: number; bg: string; fg: string }) {
  const pass = ratio >= min;
  return (
    <div
      className={`flex items-center justify-between gap-2 rounded-(--m3e-shape-extra-small) px-2.5 py-1.5 ${
        pass ? 'bg-surface-container' : 'bg-error-container'
      }`}
    >
      <span
        className="border-outline-variant/60 flex h-5 w-9 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold"
        style={{ background: bg, color: fg }}
        aria-hidden
      >
        Aa
      </span>
      <span
        className={`font-mono text-[12.5px] ${pass ? 'text-on-surface' : 'text-on-error-container'}`}
      >
        {fmt(ratio)}
      </span>
      <Icon
        name={pass ? 'check_circle' : 'error'}
        className={`text-[16px] ${pass ? 'text-tertiary' : 'text-error'}`}
      />
    </div>
  );
}

export function A11yPanel({
  bundle,
  onFixContrast,
}: {
  bundle: ThemeBundle;
  onFixContrast: (contrast: number) => void;
}) {
  const [level, setLevel] = useState<A11yLevel>('AA');
  const [onlyFailures, setOnlyFailures] = useState(false);
  const p = prefixFor(bundle.config.naming);
  const report = useMemo(() => auditTheme(bundle, level), [bundle, level]);
  const fix = useMemo(
    () => (report.failures > 0 ? findFixContrast(bundle.config, level) : null),
    [report.failures, bundle.config, level],
  );
  const advisories = useMemo(() => advisoryNotes(bundle, level), [bundle, level]);
  const rows = onlyFailures ? report.rows.filter((r) => !r.passLight || !r.passDark) : report.rows;

  return (
    <div className="m3e-fade flex flex-col gap-4 p-4 sm:p-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="border-outline-variant flex overflow-hidden rounded-(--m3e-shape-button) border">
          {A11Y_LEVELS.map((lv, i) => (
            <button
              key={lv}
              type="button"
              aria-pressed={lv === level}
              onClick={() => setLevel(lv)}
              className={`m3e-press t-label-medium px-3 py-1.5 ${i > 0 ? 'border-outline-variant border-l' : ''} ${
                lv === level
                  ? 'bg-primary text-on-primary'
                  : 'text-on-surface-variant hover:bg-on-surface/8'
              }`}
            >
              {A11Y_LEVEL_LABELS[lv]}
            </button>
          ))}
        </div>
        <button
          type="button"
          aria-pressed={onlyFailures}
          onClick={() => setOnlyFailures((v) => !v)}
          className={`m3e-press t-label-medium flex items-center gap-1.5 rounded-(--m3e-shape-button) px-3 py-1.5 ${
            onlyFailures
              ? 'bg-secondary-container text-on-secondary-container'
              : 'border-outline-variant text-on-surface-variant hover:bg-on-surface/8 border'
          }`}
        >
          <Icon name="filter_alt" className="text-[16px]" />
          失敗のみ
        </button>
        <div
          className={`t-label-large ml-auto flex items-center gap-2 rounded-(--m3e-shape-button) px-3 py-1.5 ${
            report.failures === 0
              ? 'bg-tertiary-container text-on-tertiary-container'
              : 'bg-error-container text-on-error-container'
          }`}
        >
          <Icon name={report.failures === 0 ? 'verified' : 'report'} className="text-[18px]" />
          {report.failures === 0
            ? `${report.total} ペアすべて基準以上${advisories > 0 ? ` · 参考 ${advisories}` : ''}`
            : `${report.total} ペア中 ${report.failures} ペアが基準未達`}
        </div>
        {report.failures > 0 && (
          <button
            type="button"
            disabled={fix === null}
            title={
              fix === null
                ? 'コントラストを上げても normative な未達数は減りませんでした（設定上の限界です）'
                : fix.clearsAll
                  ? `contrast を ${fix.contrast} に引き上げて全ペアをクリアします`
                  : `contrast ${fix.contrast} で未達を ${report.failures} → ${fix.remaining} に削減（残りは設定上の限界の可能性があります）`
            }
            onClick={() => fix !== null && onFixContrast(fix.contrast)}
            className="m3e-press bg-tertiary t-label-large text-on-tertiary flex items-center gap-1.5 rounded-(--m3e-shape-button) px-4 py-1.5 hover:brightness-110 disabled:opacity-50"
          >
            <Icon name={fix === null ? 'block' : 'auto_fix_high'} className="text-[18px]" />
            {fix === null
              ? '自動修復不可'
              : fix.clearsAll
                ? `自動修復 → contrast ${fix.contrast}`
                : `改善 → contrast ${fix.contrast}（残り ${fix.remaining}）`}
          </button>
        )}
      </div>

      <p className="t-body-small text-on-surface-variant max-w-3xl">
        WCAG 2.2 に基づき、実テーマの fg/bg ロールペアのコントラスト比を light / dark
        双方で検査しています。text ≥ 4.5:1（拡大・太字は 3:1）、アイコン/枠線などの非テキストは
        3:1（SC 1.4.11）。contrast を上げるとほとんどのペアが改善します。
      </p>

      <div className="border-outline-variant/60 overflow-x-auto rounded-(--m3e-shape-large) border">
        <table className="w-full min-w-160 border-collapse text-left">
          <thead>
            <tr className="t-label-large border-outline-variant bg-surface-container-low text-on-surface-variant border-b">
              <th className="px-3 py-2 font-medium">ペア</th>
              <th className="px-3 py-2 font-medium">用途</th>
              <th className="px-3 py-2 font-medium">min</th>
              <th className="px-3 py-2 font-medium">Light</th>
              <th className="px-3 py-2 font-medium">Dark</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={`${r.pair.fg}/${r.pair.bg}`}
                className="border-outline-variant/40 border-b last:border-b-0"
              >
                <td className="px-3 py-2 align-top">
                  <code className="text-on-surface font-mono text-[12px]">
                    {r.pair.fg}
                    <span className="text-on-surface-variant"> on </span>
                    {r.pair.bg}
                  </code>
                  <p className="t-body-small text-on-surface-variant mt-0.5">{r.pair.note}</p>
                </td>
                <td className="px-3 py-2 align-top">
                  <span
                    className={`t-label-small rounded-full px-2 py-0.5 ${
                      r.pair.usage === 'text'
                        ? 'bg-surface-container-highest text-on-surface-variant'
                        : r.pair.usage === 'ui'
                          ? 'bg-secondary-container text-on-secondary-container'
                          : 'bg-tertiary-container text-on-tertiary-container'
                    }`}
                  >
                    {r.pair.usage}
                    {r.pair.advisory && ' · 参考'}
                  </span>
                </td>
                <td className="text-on-surface-variant px-3 py-2 align-top font-mono text-[12px]">
                  {r.min.toFixed(1)}
                </td>
                <td className="px-3 py-2 align-top">
                  <RatioCell
                    ratio={r.light}
                    min={r.min}
                    fg={bundle.light[`--${p}-color-${r.pair.fg}`]}
                    bg={bundle.light[`--${p}-color-${r.pair.bg}`]}
                  />
                </td>
                <td className="px-3 py-2 align-top">
                  <RatioCell
                    ratio={r.dark}
                    min={r.min}
                    fg={bundle.dark[`--${p}-color-${r.pair.fg}`]}
                    bg={bundle.dark[`--${p}-color-${r.pair.bg}`]}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
