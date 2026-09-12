import { buildColorSchemes, paletteHex, palettesFor, VARIANT_LABELS } from '@/lib/m3e/color';
import { DEFAULT_CONFIG } from '@/lib/m3e/config';
import {
  MOTION_DURATIONS,
  MOTION_EASINGS,
  MOTION_PATTERNS,
  MOTION_SPRINGS,
} from '@/lib/m3e/motion';
import { COLOR_ROLE_GROUPS } from '@/lib/m3e/roles';
import { NAMED_SHAPES, SHAPE_SIZES } from '@/lib/m3e/shape';
import { TYPE_ROLES, TYPE_SCALE } from '@/lib/m3e/typography';

export const metadata = {
  title: 'Token reference',
  description:
    'The complete Material 3 Expressive token tables this site generates with: 55 color roles, shape scales, the 30-style type scale and motion durations/easings/springs.',
};

export default function TokensPage() {
  const { light, dark, schemes } = buildColorSchemes({
    seed: DEFAULT_CONFIG.seed,
    variant: DEFAULT_CONFIG.variant,
  });
  const palettes = palettesFor(schemes.light);

  return (
    <div className="mx-auto flex w-full max-w-350 flex-col gap-16 px-4 py-12 sm:px-6">
      <header className="max-w-2xl">
        <p className="t-label-large text-primary">Token reference</p>
        <h1 className="t-display-small text-on-surface mt-1">M3E トークン一覧</h1>
        <p className="t-body-medium text-on-surface-variant mt-3">
          基準シード{' '}
          <code className="bg-surface-container-high rounded px-1.5 font-mono text-[0.9em]">
            {DEFAULT_CONFIG.seed}
          </code>{' '}
          ・ variant{' '}
          <code className="bg-surface-container-high rounded px-1.5 font-mono text-[0.9em]">
            {VARIANT_LABELS.expressive}
          </code>{' '}
          で生成した実値。 Studio で設定を変えるとこの値すべてが連動します。出典: m3.material.io /
          androidx.compose.material3.tokens (生成トークン v0_103 / 14_1_0 / v31.0.11 / v0_14_0)。
        </p>
      </header>

      {/* ---------- COLOR ---------- */}
      <section className="flex flex-col gap-6" id="color">
        <h2 className="t-headline-small text-on-surface">
          Color — {Object.keys(light).length} roles
        </h2>
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {Object.entries(palettes).map(([name, palette]) => (
            <div key={name} className="bg-surface-container-low rounded-(--m3e-shape-large) p-4">
              <p className="t-title-small text-on-surface-variant mb-2">tonal: {name}</p>
              <div className="flex h-8 overflow-hidden rounded-(--m3e-shape-small)">
                {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99, 100].map((tone) => (
                  <span
                    key={tone}
                    title={`tone ${tone}`}
                    className="m3e-press flex-1 hover:scale-y-125"
                    style={{ background: paletteHex(palette, tone) }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {COLOR_ROLE_GROUPS.map((group) => (
          <div key={group.name}>
            <h3 className="t-title-medium text-on-surface mb-2">{group.name}</h3>
            <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {group.roles.map((role) => (
                <div
                  key={role}
                  className="bg-surface-container-low flex items-center gap-3 rounded-(--m3e-shape-small) px-3 py-2"
                >
                  <span className="flex">
                    <span
                      className="border-outline-variant h-7 w-7 rounded-l-(--m3e-shape-small) border"
                      style={{ background: light[role] }}
                    />
                    <span
                      className="border-outline-variant h-7 w-7 rounded-r-(--m3e-shape-small) border border-l-0"
                      style={{ background: dark[role] }}
                    />
                  </span>
                  <span className="min-w-0">
                    <code className="t-label-medium text-on-surface block truncate font-mono text-[12px]">
                      --m3e-color-{role}
                    </code>
                    <span className="t-label-small text-on-surface-variant font-mono">
                      {light[role]} / {dark[role]}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* ---------- SHAPE ---------- */}
      <section className="flex flex-col gap-6" id="shape">
        <h2 className="t-headline-small text-on-surface">
          Shape — corner scale & expressive corners
        </h2>
        <div className="flex flex-wrap gap-4">
          {(Object.keys(SHAPE_SIZES) as (keyof typeof SHAPE_SIZES)[]).map((name) => {
            const px = SHAPE_SIZES[name];
            return (
              <div key={name} className="flex w-28 flex-col items-center gap-2">
                <div className="bg-primary h-16 w-16" style={{ borderRadius: px }} />
                <code className="t-label-medium text-on-surface font-mono">{name}</code>
                <code className="t-label-small text-on-surface-variant font-mono">{px}px</code>
              </div>
            );
          })}
        </div>
        <div className="flex flex-wrap gap-4">
          {Object.entries(NAMED_SHAPES).map(([name, corners]) => {
            if (name === 'pill' || name === 'circle') return null;
            return (
              <div key={name} className="flex w-28 flex-col items-center gap-2">
                <div
                  className="bg-tertiary h-16 w-16"
                  style={{ borderRadius: corners.map((c) => `${c}px`).join(' ') }}
                />
                <code className="t-label-medium text-on-surface font-mono">{name}</code>
                <code className="t-label-small text-on-surface-variant font-mono">
                  [{corners.join(', ')}]
                </code>
              </div>
            );
          })}
        </div>
        <p className="t-body-small text-on-surface-variant max-w-2xl">
          M3E では press / hover / 展開時にこれらがスプリングで補間されます（shape morphing /
          spatial expansion）。Studio の <code className="font-mono">increased</code>{' '}
          エミュレーションは large→20px、extra-large→32px など「+成長版」に差し替わります。
        </p>
      </section>

      {/* ---------- TYPOGRAPHY ---------- */}
      <section className="flex flex-col gap-6" id="typography">
        <h2 className="t-headline-small text-on-surface">
          Typography — 30 roles（15 base + 15 emphasized）
        </h2>
        <div className="border-outline-variant flex flex-col overflow-hidden rounded-(--m3e-shape-large) border">
          {TYPE_ROLES.map((role) => {
            const t = TYPE_SCALE[role];
            return (
              <div
                key={role}
                className="border-outline-variant/50 hover:bg-surface-container-low flex flex-col gap-1 border-b px-4 py-3 last:border-b-0 sm:flex-row sm:items-baseline sm:justify-between"
              >
                <p className={`t-${role} text-on-surface truncate`}>
                  The quick brown fox — 速い茶色のキツネ
                </p>
                <code className="text-on-surface-variant shrink-0 font-mono text-[11px]">
                  {role} · {t.size}/{t.lineHeight} · {t.tracking}px · {t.weight}
                </code>
              </div>
            );
          })}
        </div>
      </section>

      {/* ---------- MOTION ---------- */}
      <section className="flex flex-col gap-6" id="motion">
        <h2 className="t-headline-small text-on-surface">Motion — durations · easings · springs</h2>
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h3 className="t-title-medium mb-3">Durations (ms)</h3>
            <div className="flex flex-col gap-1">
              {Object.entries(MOTION_DURATIONS)
                .filter(([k]) => k !== 'none')
                .map(([name, ms]) => (
                  <div key={name} className="flex items-center gap-3">
                    <code className="t-label-medium text-on-surface w-28 shrink-0 font-mono">
                      {name}
                    </code>
                    <div className="bg-surface-container-high h-3 flex-1 overflow-hidden rounded-(--m3e-shape-extra-small)">
                      <div
                        className="bg-primary h-full"
                        style={{ width: `${(ms / 1000) * 100}%` }}
                      />
                    </div>
                    <code className="t-label-small text-on-surface-variant w-14 shrink-0 text-right font-mono">
                      {ms}ms
                    </code>
                  </div>
                ))}
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="t-title-medium mb-3">Easing curves</h3>
              <div className="flex flex-col gap-1.5">
                {Object.entries(MOTION_EASINGS).map(([name, c]) => (
                  <div
                    key={name}
                    className="bg-surface-container-low flex items-center justify-between gap-3 rounded-(--m3e-shape-extra-small) px-3 py-1.5"
                  >
                    <code className="t-label-medium text-on-surface font-mono">{name}</code>
                    <code className="t-label-small text-tertiary font-mono">
                      cubic-bezier({c.join(', ')})
                    </code>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="t-title-medium mb-3">Springs (M3E physical model)</h3>
              <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                {(['expressive', 'standard'] as const).map((scheme) =>
                  Object.entries(MOTION_SPRINGS[scheme]).map(([usage, s]) => (
                    <div
                      key={scheme + usage}
                      className="bg-surface-container-low rounded-(--m3e-shape-extra-small) px-3 py-1.5"
                    >
                      <p className="t-label-medium text-on-surface">
                        {scheme} · {usage}
                      </p>
                      <code className="t-label-small text-on-surface-variant font-mono">
                        stiffness {s.stiffness} · damping {s.damping}
                      </code>
                    </div>
                  )),
                )}
              </div>
              <p className="t-body-small text-on-surface-variant mt-2">
                Studio はこのスプリングを数値積分し、CSS{' '}
                <code className="font-mono">linear(…)</code> イージング（+ settling
                時間）に変換して生成物に埋め込みます。
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="t-title-medium mb-3">Expressive motion patterns</h3>
          <div className="grid gap-1.5 sm:grid-cols-2 xl:grid-cols-3">
            {Object.entries(MOTION_PATTERNS).map(([name, p]) => (
              <div key={name} className="bg-surface-container rounded-(--m3e-shape-large) p-3">
                <p className="t-title-small text-on-surface">{name}</p>
                <code className="t-label-small text-on-surface-variant font-mono">
                  {p.duration} · {p.easing} · {p.spatial ? 'spatial' : 'effects'}
                </code>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
