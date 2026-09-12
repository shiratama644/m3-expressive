'use client';

import { type CSSProperties, useState } from 'react';
import {
  Icon,
  M3Button,
  M3ButtonGroup,
  M3Fab,
  M3IconButton,
  M3SegmentedButtons,
  M3SplitButton,
} from '@/components/m3e/actions';
import { M3FilterChip, M3SearchBar, M3Slider, M3Switch } from '@/components/m3e/inputs';
import {
  M3Badge,
  M3Card,
  M3CardCarousel,
  M3LinearProgress,
  M3LoadingIndicator,
  M3MiniPlayer,
  M3Toast,
} from '@/components/m3e/surfaces';
import type { ThemeBundle } from '@/lib/m3e/css';

export function Preview({ bundle, mode }: { bundle: ThemeBundle; mode: 'light' | 'dark' }) {
  const vars = { ...bundle.shared, ...bundle[mode] } as CSSProperties;
  const [progress, setProgress] = useState(38);
  const [switchOn, setSwitchOn] = useState(true);
  const [flatSearch] = useState(true);

  return (
    <div
      style={{
        ...vars,
        fontFamily: 'var(--m3e-font-plain)',
        background: 'var(--m3e-color-background)',
        color: 'var(--m3e-color-on-background)',
      }}
      className="m3e-fade min-h-full p-4 sm:p-6"
    >
      <div className="mx-auto flex w-full max-w-160 flex-col gap-4">
        {/* Now playing hero */}
        <section className="m3e-spatial bg-surface-container overflow-hidden rounded-(--m3e-shape-sheet)">
          <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-6">
            <div
              className="m3e-press h-32 w-32 shrink-0 rounded-(--m3e-shape-card) active:rounded-(--m3e-shape-medium)"
              style={{
                background:
                  'radial-gradient(130% 130% at 15% 10%, color-mix(in srgb, var(--m3e-color-primary) 85%, white) 0%, var(--m3e-color-primary) 45%, color-mix(in srgb, var(--m3e-color-tertiary) 70%, black) 100%)',
              }}
            />
            <div className="min-w-0 flex-1">
              <p className="t-label-large text-primary">Now playing · Expressive demo</p>
              <h2
                className="t-display-small text-on-surface mt-0.5 truncate"
                style={{ fontSize: 'clamp(22px, 5vw, 36px)' }}
              >
                Shape Morph
              </h2>
              <p className="t-body-medium text-on-surface-variant mt-1">
                Kanae &amp; The Tides — Vivid Nights
              </p>
              <div className="mt-4">
                <M3Slider value={progress} onChange={setProgress} label="Progress" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <M3IconButton icon="favorite" toggle label="Like" />
              <M3IconButton icon="share" label="Share" />
              <M3Fab size="large" icon="play_arrow" />
            </div>
          </div>
          <div className="px-0">
            <M3ButtonGroup />
          </div>
        </section>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Buttons */}
          <Panel title="Buttons">
            <div className="flex flex-wrap items-center gap-2">
              <M3Button variant="filled" icon="rocket_launch">
                Filled
              </M3Button>
              <M3Button variant="tonal" icon="bookmark">
                Tonal
              </M3Button>
              <M3Button variant="elevated">Elevated</M3Button>
              <M3Button variant="outlined">Outlined</M3Button>
              <M3Button variant="text">Text</M3Button>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <M3SplitButton />
              <M3Button variant="filled" disabled>
                Disabled
              </M3Button>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <M3Fab size="small" icon="add" />
              <M3Fab size="medium" icon="compose" />
              <M3Fab extended icon="edit" label="Compose" />
            </div>
          </Panel>

          {/* Inputs */}
          <Panel title="Inputs">
            <div className="flex flex-wrap gap-2">
              <M3FilterChip label="Expressive" icon="auto_awesome" initial />
              <M3FilterChip label="Motion" icon="animation" />
              <M3FilterChip label="Tokens" icon="deployed_code" initial />
            </div>
            <div className="mt-3">
              <M3SegmentedButtons options={['Day', 'Week', 'Month']} />
            </div>
            <div className="mt-4 flex items-center justify-between gap-4">
              <M3Switch checked={switchOn} onChange={setSwitchOn} label="Haptics" />
              <M3Badge>
                <M3IconButton icon="notifications" label="Notifications" />
              </M3Badge>
            </div>
            {flatSearch && (
              <div className="mt-3">
                <M3SearchBar />
              </div>
            )}
          </Panel>
        </div>

        {/* Surfaces */}
        <Panel title="Surfaces & shapes">
          <div className="thin-scroll flex gap-3 overflow-x-auto pb-2">
            <M3Card variant="elevated" title="Elevated card" subtitle="surface-container-low">
              <div className="flex gap-2">
                <M3Button variant="text">Action</M3Button>
                <M3Button variant="text">Cancel</M3Button>
              </div>
            </M3Card>
            <M3Card variant="filled" title="Filled card" subtitle="28dp M3E corner" />
            <M3Card
              variant="outlined"
              title="Card carousel"
              subtitle="asymmetric focus shape below"
            />
          </div>
          <div className="mt-2">
            <M3CardCarousel />
          </div>
        </Panel>

        {/* Status */}
        <div className="grid items-stretch gap-4 md:grid-cols-2">
          <Panel title="Loading (shape morph)">
            <div className="flex items-center gap-6">
              <M3LoadingIndicator />
              <div className="flex-1">
                <M3LinearProgress />
                <p className="t-body-small text-on-surface-variant mt-3">Indeterminate — wavy</p>
                <div className="mt-3">
                  <M3LinearProgress value={progress} />
                </div>
                <p className="t-body-small text-on-surface-variant mt-3">
                  Determinate — {progress}%
                </p>
              </div>
            </div>
          </Panel>
          <Panel title="Feedback">
            <div className="flex flex-wrap items-center gap-3">
              <M3Toast label="Theme exported" action="Share link" />
            </div>
            <div className="mt-3">
              <M3MiniPlayer />
            </div>
          </Panel>
        </div>

        <p className="t-body-small text-on-surface-variant flex items-center justify-center gap-1 text-center">
          <Icon name="touch_app" className="text-[16px]" />
          Press any control — shape morphing and springs react live to this theme.
        </p>
      </div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-surface-container-low flex flex-col gap-3 rounded-(--m3e-shape-large) p-4">
      <h3 className="t-title-small text-on-surface-variant">{title}</h3>
      {children}
    </section>
  );
}
