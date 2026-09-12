import Link from 'next/link';
import type { ReactNode } from 'react';
import { SetupExplorer } from '@/components/docs/setup-explorer';

export const metadata = {
  title: 'Docs',
  description:
    'How to install the generated Material 3 Expressive theme in Next.js, React (Vite), Vue 3 or plain Tailwind CSS — with bun / pnpm / npm / yarn commands.',
};

function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="flex scroll-mt-24 flex-col gap-4">
      <p className="t-label-large text-primary">{eyebrow}</p>
      <h2 className="t-headline-small text-on-surface">{title}</h2>
      {children}
    </section>
  );
}

export default function DocsPage() {
  return (
    <div className="mx-auto grid w-full max-w-350 gap-12 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_220px]">
      <div className="flex min-w-0 flex-col gap-14">
        <header>
          <h1 className="t-display-small text-on-surface">Docs</h1>
          <p className="t-body-large text-on-surface-variant mt-2 max-w-2xl">
            生成されたテーマの導入手順、トークンの読み方、カスタマイズの勘所。すべての手順は 4
            パッケージマネージャ対応です。
          </p>
        </header>

        <Section id="quick-start" eyebrow="Quick start" title="1. フレームワークを選ぶ">
          <p className="t-body-medium text-on-surface-variant max-w-2xl">
            Studio の Code タブと同じ中身をここでは静的プレビューできます。ZIP
            をダウンロードすれば、選ばれた PM のコマンドが書かれた README.md も含まれます。
          </p>
          <SetupExplorer />
        </Section>

        <Section id="naming" eyebrow="Concepts" title="2. トークンの名前と仕組み">
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              [
                'CSS 変数プリフィックス',
                '既定は --m3e-*。Studio の Output で --md-sys-* に切り替えると、Material Web などの md-sys 慣習に倣った名前になります。',
              ],
              [
                'ライト / ダーク',
                ':root に light 値、.dark（または [data-m3e-theme="dark"]）に dark 値。クラスを 1 つ付け替えるだけで全色が入れ替わります。',
              ],
              [
                '色 = HCT で計算',
                'シード色 1 個から Material 公式の HCT / Dynamic Color 実装（@material/material-color-utilities）で 55 ロールを算出。生成物は静的な値なので実行時 JS 不要です。',
              ],
              [
                'スプリング = linear()',
                'expressive なバウンスはスプリングパラメータを数値積分して linear() サンプルに変換。JS や WAAPI なしで CSS transition だけで動きます。',
              ],
            ].map(([t, b]) => (
              <div key={t} className="bg-surface-container-low rounded-(--m3e-shape-large) p-4">
                <p className="t-title-medium text-on-surface">{t}</p>
                <p className="t-body-small text-on-surface-variant mt-1">{b}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section id="usage" eyebrow="Concepts" title="3. 使い方の例">
          <div className="flex flex-col gap-3">
            {[
              [
                '色を使う',
                'className="bg-primary text-on-primary hover:bg-primary-container"',
                'Tailwind v4 の @theme inline が 55 ロール全部をユーティリティ化しています。',
              ],
              [
                'シェイプを使う',
                'className="rounded-card active:rounded-medium"',
                '角モーフもトランジション対象。press で 28px → 12px に“潰れる”動きが M3E 流。',
              ],
              [
                'タイポを使う',
                'className="t-title-large text-on-surface"',
                'text-title-large（Tailwind ユーティリティ）でも、.t-* クラスでも同じ。',
              ],
              [
                '動きを使う',
                'style={{ transition: "transform var(--m3e-motion-spring-fast-spatial-duration) var(--m3e-motion-spring-fast-spatial-easing)" }}',
                'durations / easings / spring がそのまま変数化されています。',
              ],
            ].map(([t, code, note]) => (
              <div
                key={t}
                className="border-outline-variant/60 flex flex-col gap-1 rounded-(--m3e-shape-large) border p-4"
              >
                <p className="t-title-medium text-on-surface">{t}</p>
                <code className="bg-surface-container-highest text-on-surface overflow-x-auto rounded-(--m3e-shape-extra-small) px-3 py-2 font-mono text-[12.5px]">
                  {code}
                </code>
                <p className="t-body-small text-on-surface-variant">{note}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section id="packages" eyebrow="Package managers" title="4. 4 つの PM、全部対応">
          <div className="overflow-x-auto">
            <table className="w-full min-w-140 border-collapse text-left">
              <thead>
                <tr className="t-label-large border-outline-variant text-on-surface-variant border-b">
                  <th className="py-2 pr-4">タスク</th>
                  <th className="py-2 pr-4">Bun</th>
                  <th className="py-2 pr-4">pnpm</th>
                  <th className="py-2 pr-4">npm</th>
                  <th className="py-2">yarn</th>
                </tr>
              </thead>
              <tbody className="font-mono text-[12.5px]">
                {[
                  ['依存追加', 'bun add', 'pnpm add', 'npm install', 'yarn add'],
                  ['開発依存', 'bun add -d', 'pnpm add -D', 'npm install -D', 'yarn add -D'],
                  ['ワンショット 実行', 'bunx pkg', 'pnpm dlx pkg', 'npx pkg', 'yarn dlx pkg'],
                  [
                    'スキャフォールド',
                    'bun create vite',
                    'pnpm create vite',
                    'npm create vite',
                    'yarn create vite',
                  ],
                  ['スクリプト', 'bun run dev', 'pnpm dev', 'npm run dev', 'yarn dev'],
                ].map(([task, ...cmds]) => (
                  <tr key={task} className="border-outline-variant/40 border-b">
                    <td className="t-label-large text-on-surface py-2 pr-4 font-sans">{task}</td>
                    {cmds.map((c, i) => (
                      <td key={i} className="text-on-surface-variant py-2 pr-4">
                        {c}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="t-body-small text-on-surface-variant">
            ※ M3E Studio の生成物に npm 依存はありません（CSS と JSON
            だけ）。上の表はセットアップ手順用です。 Fontsource を入れる場合の依存:{' '}
            <code className="font-mono">@fontsource-variable/roboto-flex</code>{' '}
            <code className="font-mono">@fontsource-variable/material-symbols-rounded</code>
          </p>
        </Section>

        <Section id="tokens-json" eyebrow="Interop" title="5. tokens.json（W3C DTCG）">
          <p className="t-body-medium text-on-surface-variant max-w-2xl">
            すべてのエクスポートには <code className="font-mono text-[13px]">tokens.json</code>{' '}
            が含まれます。 color（light / dark）・shape・typography・motion（duration / cubicBezier
            / spring）を DTCG フォーマットで提供。 Figma Tokens / Style Dictionary /
            各種変換ツールにそのまま投入できます。
          </p>
          <Link
            href="/tokens"
            className="m3e-press bg-secondary-container t-label-large text-on-secondary-container inline-flex h-11 w-fit items-center gap-2 rounded-(--m3e-shape-button) px-5 hover:brightness-95"
          >
            <span className="material-symbols-rounded text-[20px]">table_of_contents</span>
            全トークン表を見る
          </Link>
        </Section>
      </div>

      <nav className="order-first flex gap-3 overflow-x-auto lg:sticky lg:top-24 lg:order-last lg:h-fit lg:flex-col lg:overflow-visible">
        <p className="t-label-large text-on-surface-variant hidden lg:block">On this page</p>
        {[
          ['quick-start', 'フレームワークを選ぶ'],
          ['naming', 'トークンの名前と仕組み'],
          ['usage', '使い方の例'],
          ['packages', '4 つの PM 対応'],
          ['tokens-json', 'tokens.json'],
        ].map(([href, label]) => (
          <a
            key={href}
            href={`#${href}`}
            className="t-label-medium m3e-press text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface shrink-0 rounded-(--m3e-shape-button) px-3 py-1.5"
          >
            {label}
          </a>
        ))}
      </nav>
    </div>
  );
}
