import Link from 'next/link';
import { buildColorSchemes, palettesFor, paletteHex } from '@/lib/m3e/color';
import { DEFAULT_CONFIG } from '@/lib/m3e/config';
import { M3Toast } from '@/components/m3e/surfaces';
import { M3FilterChip } from '@/components/m3e/inputs';
import { HeroDemo } from '@/components/landing/hero-demo';

const STACKS = [
  { label: 'React', icon: '⚛' },
  { label: 'Next.js', icon: '▲' },
  { label: 'Vue', icon: '◆' },
  { label: 'Tailwind CSS v4', icon: '≈' },
] as const;

const PMS = ['Bun', 'pnpm', 'npm', 'yarn'] as const;

const FEATURES = [
  {
    icon: 'palette',
    title: 'Color — HCT, 2025 spec',
    body: 'シード 1 色から 55 のカラーロールを公式 HCT 実装で算出。primary-fixed / -dim など M3E の新ロールにも対応。',
  },
  {
    icon: 'draw',
    title: 'Shape — increased & asymmetric',
    body: 'extra-large 28dp、XXL 48dp、large-top・extra-large-bottom などの非対称シェイプ。press で角が morph する実演つき。',
  },
  {
    icon: 'sports_volleyball',
    title: 'Motion — real springs',
    body: 'expressive / standard のスプリング (stiffness・damping) を CSS linear() のサンプル列に変換。JS なしでバウンスする。',
  },
  {
    icon: 'text_fields',
    title: 'Type — Roboto Flex',
    body: '30 ロール（emphasized 含む）の正確なサイズ・トラッキング。opsz 可変軸、±15% スケール、Fontsource 自己ホスト。',
  },
] as const;

const STEPS = [
  {
    n: '01',
    t: 'シードを選ぶ',
    b: 'カラーピッカー、プリセット、ランダム、または自分のアプリの 1 色を貼る。',
  },
  {
    n: '02',
    t: 'スタジオで調整',
    b: 'variant・contrast・shape emphasis・spring・書体を、プレビューを見ながら直感的に。',
  },
  {
    n: '03',
    t: 'コードを持っていく',
    b: 'Next.js / React / Vue / Tailwind 別のファイル一式をコピー、または ZIP でダウンロード。',
  },
] as const;

export default function Home() {
  const { schemes } = buildColorSchemes({
    seed: DEFAULT_CONFIG.seed,
    variant: DEFAULT_CONFIG.variant,
  });
  const palettes = palettesFor(schemes.light);

  return (
    <div className="flex flex-col">
      {/* ---- hero ---- */}
      <section className="relative mx-auto grid w-full max-w-350 items-center gap-10 px-4 pt-14 pb-10 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:pt-20">
        <div className="flex flex-col items-start gap-6">
          <span className="t-label-large border-outline-variant text-on-surface-variant inline-flex items-center gap-2 rounded-(--m3e-shape-button) border px-3 py-1">
            <span className="bg-primary h-2 w-2 rounded-full" aria-hidden />
            Material 3 Expressive · 2025 spec
          </span>
          <h1
            className="t-display-medium-emphasized text-on-surface"
            style={{ fontSize: 'clamp(38px, 5.6vw, 62px)', lineHeight: 1.08 }}
          >
            デザインシステムを、
            <br />
            <span className="text-primary">1 色から生成</span>する。
          </h1>
          <p className="t-body-large text-on-surface-variant max-w-lg">
            M3E Studio は Material 3 Expressive
            のカラー・シェイプ・タイポグラフィ・モーショントークンを、あなたの
            フレームワークとパッケージマネージャ向けのコードに変換して渡します。ランタイム依存ゼロ、CSS
            変数だけ。
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/studio"
              className="m3e-press bg-primary t-label-large text-on-primary inline-flex h-12 items-center gap-2 rounded-(--m3e-shape-button) px-6 hover:brightness-110 active:scale-[0.96] active:rounded-(--m3e-shape-medium)"
            >
              <span className="material-symbols-rounded text-[22px]">auto_awesome</span>
              Studio を開く
            </Link>
            <Link
              href="/tokens"
              className="m3e-press border-outline t-label-large text-primary hover:bg-primary/8 inline-flex h-12 items-center gap-2 rounded-(--m3e-shape-button) border px-6 active:scale-[0.96]"
            >
              トークンをのぞく
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {STACKS.map((s) => (
              <span
                key={s.label}
                className="t-label-large bg-surface-container-high text-on-surface-variant inline-flex items-center gap-1.5 rounded-(--m3e-shape-extra-small) px-3 py-1.5"
              >
                <span aria-hidden className="font-mono text-[13px]">
                  {s.icon}
                </span>
                {s.label}
              </span>
            ))}
            <span className="t-label-small text-on-surface-variant/70">× {PMS.join(' / ')}</span>
          </div>
        </div>

        {/* live demo card */}
        <HeroDemo />
      </section>

      {/* ---- how it works ---- */}
      <section className="border-outline-variant/50 bg-surface-container-low border-y">
        <div className="mx-auto grid w-full max-w-350 gap-4 px-4 py-14 sm:px-6 md:grid-cols-3">
          {STEPS.map((step) => (
            <div
              key={step.n}
              className="hover:bg-surface-container rounded-(--m3e-shape-large) p-5 transition-colors"
            >
              <p className="t-display-small text-secondary-container">{step.n}</p>
              <h2 className="t-title-large text-on-surface mt-1">{step.t}</h2>
              <p className="t-body-medium text-on-surface-variant mt-2">{step.b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---- features ---- */}
      <section className="mx-auto w-full max-w-350 px-4 py-14 sm:px-6">
        <h2 className="t-headline-small text-on-surface">
          M3E の「らしさ」を、そのままトークンに。
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="m3e-spatial bg-surface-container flex flex-col gap-2 rounded-(--m3e-shape-extra-large) p-5 hover:rounded-(--m3e-shape-extra-large-increased)"
            >
              <span className="material-symbols-rounded text-primary text-[28px]">{f.icon}</span>
              <h3 className="t-title-medium text-on-surface">{f.title}</h3>
              <p className="t-body-small text-on-surface-variant">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---- tonal palettes ---- */}
      <section className="border-outline-variant/50 bg-surface-container-low border-t">
        <div className="mx-auto w-full max-w-350 px-4 py-14 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="t-headline-small text-on-surface">
              シード色{' '}
              <code className="bg-surface-container rounded px-2 py-0.5 font-mono text-[0.8em]">
                #6750A4
              </code>{' '}
              から生成されたトーナルパレット
            </h2>
            <div className="flex items-center gap-2">
              <M3FilterChip label="Expressive variant" initial />
              <M3Toast label="Tones are pure HCT" />
            </div>
          </div>
          <div className="mt-6 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {(Object.entries(palettes) as [string, (typeof palettes)[keyof typeof palettes]][]).map(
              ([name, palette]) => (
                <div key={name} className="overflow-hidden rounded-(--m3e-shape-large)">
                  <p className="t-label-large text-on-surface-variant mb-1.5">{name}</p>
                  <div className="flex h-10">
                    {[10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99].map((tone) => (
                      <span
                        key={tone}
                        title={`${name} ${tone}`}
                        className="m3e-press flex-1 hover:scale-y-125"
                        style={{ background: paletteHex(palette, tone) }}
                      />
                    ))}
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* ---- CTA ---- */}
      <section className="mx-auto w-full max-w-350 px-4 py-16 sm:px-6">
        <div className="bg-primary text-on-primary flex flex-col items-start gap-6 rounded-(--m3e-shape-extra-large) p-8 sm:flex-row sm:items-center sm:justify-between lg:p-12">
          <div>
            <h2 className="t-headline-medium">まずは 5 分。テーマをつくって、コードを持ち出す。</h2>
            <p className="t-body-medium mt-2 opacity-90">
              Next.js / React / Vue / Tailwind × Bun / pnpm / npm / yarn — 16
              パターンの導入手順を自動生成します。
            </p>
          </div>
          <Link
            href="/studio"
            className="m3e-press bg-on-primary t-title-medium text-primary inline-flex h-14 shrink-0 items-center gap-2 rounded-(--m3e-shape-button) px-7 hover:brightness-105 active:scale-95 active:rounded-(--m3e-shape-medium)"
          >
            <span className="material-symbols-rounded text-[24px]">rocket_launch</span>
            Studio を開く
          </Link>
        </div>
      </section>
    </div>
  );
}
