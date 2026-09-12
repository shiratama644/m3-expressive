'use client';

import { useEffect, useMemo, useState } from 'react';
import { buildTheme } from '@/lib/m3e/css';
import { Controls } from '@/components/studio/controls';
import { Preview } from '@/components/studio/preview';
import { CodePanel } from '@/components/studio/code-panel';
import { stateToParams, type StudioPatch, type StudioState } from '@/components/studio/state';
import { VARIANT_LABELS } from '@/lib/m3e/color';
import { Icon } from '@/components/m3e/actions';

type Tab = 'preview' | 'code';

export function Studio({ initialState }: { initialState: StudioState }) {
  const [state, setState] = useState<StudioState>(initialState);
  const [tab, setTab] = useState<Tab>('preview');

  // URL is an OUTPUT of state (share links are parsed server-side in page.tsx)
  useEffect(() => {
    const params = stateToParams(state);
    window.history.replaceState(null, '', params ? `/studio?${params}` : '/studio');
  }, [state]);

  const update = (patch: StudioPatch) =>
    setState((s) => {
      const { mode, ...configPatch } = patch;
      return { config: { ...s.config, ...configPatch }, mode: mode ?? s.mode };
    });

  const bundle = useMemo(() => buildTheme(state.config), [state.config]);

  return (
    <div className="mx-auto flex w-full max-w-350 flex-1 flex-col lg:flex-row">
      <aside className="border-outline-variant/60 bg-surface-container-lowest z-10 shrink-0 border-b lg:sticky lg:top-16 lg:h-[calc(100dvh-4rem)] lg:max-h-[calc(100dvh-4rem)] lg:w-88 lg:border-r lg:border-b-0">
        <Controls state={state} update={update} />
      </aside>

      <section className="flex min-h-[60dvh] min-w-0 flex-1 flex-col lg:h-[calc(100dvh-4rem)]">
        <div className="border-outline-variant/60 bg-surface-container-low flex items-center gap-2 border-b px-3 py-2">
          {(
            [
              ['preview', 'visibility', 'Preview'],
              ['code', 'code', 'Code'],
            ] as const
          ).map(([id, icon, label]) => (
            <button
              key={id}
              type="button"
              aria-pressed={tab === id}
              onClick={() => setTab(id)}
              className={`m3e-press t-label-large flex items-center gap-1.5 rounded-(--m3e-shape-button) px-4 py-1.5 ${
                tab === id
                  ? 'bg-primary text-on-primary'
                  : 'text-on-surface-variant hover:bg-on-surface/8'
              }`}
            >
              <Icon name={icon} className="text-[18px]" />
              {label}
            </button>
          ))}
          <div className="text-on-surface-variant ml-auto flex min-w-0 items-center gap-2">
            <span className="t-label-small hidden truncate sm:inline">
              {VARIANT_LABELS[state.config.variant].split('（')[0]} · contrast{' '}
              {state.config.contrast} · {state.mode}
            </span>
            <span
              aria-label="Seed color"
              title={`Seed ${state.config.seed}`}
              className="ring-outline h-5 w-5 shrink-0 rounded-(--m3e-shape-extra-small) ring-1"
              style={{ background: state.config.seed }}
            />
          </div>
        </div>

        <div className="bg-surface-dim min-h-0 flex-1 overflow-auto">
          {tab === 'preview' ? (
            <Preview bundle={bundle} mode={state.mode} />
          ) : (
            <div className="bg-surface-container-lowest h-full">
              <CodePanel state={state} />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
