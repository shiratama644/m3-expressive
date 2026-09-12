'use client';

import { useState } from 'react';
import {
  M3Button,
  M3ButtonGroup,
  M3Fab,
  M3IconButton,
  M3SplitButton,
} from '@/components/m3e/actions';
import { M3LoadingIndicator, M3LinearProgress, M3MiniPlayer } from '@/components/m3e/surfaces';
import { M3Badge } from '@/components/m3e/surfaces';
import { M3Switch } from '@/components/m3e/inputs';

export function HeroDemo() {
  const [hifi, setHifi] = useState(true);

  return (
    <div className="m3e-pop relative">
      <div
        aria-hidden
        className="absolute -top-8 -right-6 h-40 w-40 opacity-90"
        style={{
          background:
            'conic-gradient(from 210deg, var(--m3e-color-primary), var(--m3e-color-tertiary), var(--m3e-color-secondary), var(--m3e-color-primary))',
          borderRadius: '42% 58% 63% 37% / 47% 42% 58% 53%',
          animation: 'm3e-shape-morph 9s var(--m3e-motion-easing-emphasized) infinite',
          filter: 'blur(0.5px)',
        }}
      />
      <div className="bg-surface-container relative flex flex-col gap-4 rounded-(--m3e-shape-extra-large) p-5 shadow-lg">
        <div className="flex items-center justify-between">
          <p className="t-title-medium">Expressive preview</p>
          <M3Badge>
            <M3IconButton icon="tune" label="settings" />
          </M3Badge>
        </div>
        <div className="flex items-center gap-4">
          <div
            className="h-20 w-20 shrink-0 rounded-(--m3e-shape-large) transition-[border-radius] duration-(--m3e-motion-duration-medium1)"
            style={{
              background:
                'radial-gradient(130% 130% at 20% 10%, var(--m3e-color-primary) 0%, color-mix(in srgb, var(--m3e-color-primary) 55%, black) 60%, var(--m3e-color-tertiary) 130%)',
            }}
          />
          <div className="min-w-0 flex-1">
            <p className="t-title-large truncate">Sunflower Drift</p>
            <p className="t-body-small text-on-surface-variant">The Tidal Garden — Vivid Nights</p>
            <div className="mt-3">
              <M3LinearProgress value={62} />
            </div>
          </div>
          <M3Fab size="medium" icon="play_arrow" />
        </div>
        <M3ButtonGroup />
        <div className="flex items-center justify-between gap-3">
          <div className="flex gap-2">
            <M3Button variant="tonal" icon="library_add">
              Save
            </M3Button>
            <M3SplitButton />
          </div>
          <div className="flex items-center gap-3">
            <M3LoadingIndicator size={28} />
            <M3Switch checked={hifi} label="Hi-Fi" onChange={setHifi} />
          </div>
        </div>
        <div className="hidden sm:block">
          <M3MiniPlayer />
        </div>
      </div>
    </div>
  );
}
