# M3E Studio

[Material 3 Expressive](https://m3.material.io/styles/m3e/overview) のデザイントークン（色・シェイプ・タイポ・モーション）を、ブラウザ上でビジュアルに設計して、**Next.js / React / Vue / Tailwind CSS** 用のコードとして書き出せるジェネレーターです。`bun` / `pnpm` / `npm` / `yarn` の 4 パッケージマネージャ対応のコマンド・README を同梱した ZIP もダウンロードできます。

- 本番: https://m3-expressive.vercel.app （未デプロイ / `/studio` から利用可能）
- 設計ドキュメント: [`docs/planning/M3E_STUDIO_PLAN.md`](docs/planning/M3E_STUDIO_PLAN.md)
- タスク状況: [`docs/task-list.md`](docs/task-list.md)

## できること

- **シード色 1 個から全テーマ生成** — Material 公式 HCT / Dynamic Color 実装（`@material/material-color-utilities`）で 55 カラーロール、2025 spec の expressive variant 対応
- **ライブプレビュー** — 再生プレイヤー、ボタン群、フォーム、カードなど M3E コンポーネント 20 種以上が即座に更新
- **コードタブ** — フレームワーク × PM の 16 組合せで生成ファイル（CSS / tokens.json / README 等）をハイライト表示、コピー、ZIP ダウンロード
- **URL 共有** — 設定は URL クエリにシリアライズされるので、リンクだけでテーマを再現できる
- **依存ゼロの成果物** — 生成物は静的な CSS / JSON のみ。フレームワークの `npm` 依存は増えない（Fontsource は任意）

## クイックスタート

Node.js **24 LTS** が必要です（`.nvmrc` / `engines` で固定）。リポジトリ自体は pnpm lock を 1 つだけ同梱していますが、4 つの PM すべてで install / build が通るよう CI で検証しています。

```bash
git clone https://github.com/shiratama644/m3-expressive && cd m3-expressive

# いずれか 1 つ
bun install && bun dev          # Bun
corepack enable && pnpm install && pnpm dev   # pnpm（lock 使用）
npm install && npm run dev      # npm
yarn install && yarn dev        # yarn

# ビルド / 検証
pnpm build && pnpm typecheck && pnpm lint && pnpm test:unit
```

### scripts/executer.ts（環境に応じた bundler 切り替え）

`dev` / `build` / `start` は `scripts/executer.ts` 経由で走る。起動環境を判定し、

- **Termux / PRoot-Distro** → `next build --webpack`（Turbopack が不安定なため）
- **それ以外** → Turbopack（Next 16 デフォルト、filesystem cache 有効）

に切り替え、`.next/cache` を `.cache/m3e-build/next-cache/{webpack,turbopack}`（`M3E_CACHE_ROOT` で変更可）へ
シンボリックリンクして **bundler 別にキャッシュを永続保存** する（2 回目以降のビルド高速化）。

```bash
pnpm build -- --webpack        # 明示的に webpack（判定より優先）
M3E_BUNDLER=webpack pnpm build # 環境変数で強制
node scripts/executer.ts info  # 判定結果とキャッシュ経路の確認
```

DropMod（shiratama644/DropMod）の実績スクリプトを移植（`scripts/buildEnv.ts`）。Next の設定は
webpack キャッシュ永続化のため `next.config.mjs`（`.ts` 不可 — 理由はこのファイル冒頭のコメント）。

## 構成

| パス                       | 役割                                                                                                                                                          |
| :------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `src/lib/m3e/`             | トークンエンジン。`config.ts`（設定型）→ `color/motion/typography/shape.ts`（生成）→ `css.ts`（`buildTheme` / `renderThemeCss`）→ `tokensJson.ts`（W3C DTCG） |
| `src/lib/gen/`             | コード生成。`generateFiles(config, framework, pm)` で 4FW × 4PM のファイル群を返す。`pm.ts` に PM コマンド表、`highlight.ts` に依存ゼロ構文ハイライト         |
| `src/components/m3e/`      | サイト自身も M3E で作っているデモ/共通コンポーネント（ボタン・スライダー・カード等）                                                                          |
| `src/components/studio/`   | Studio の状態（`state.ts`）、コントロール、プレビュー、コードパネル、ZIP                                                                                      |
| `src/app/`                 | `/`（ランディング）`/studio` `/docs` `/tokens`（リファレンス）`/presets`                                                                                                |
| `.github/workflows/ci.yml` | pnpm フル検証 + Node 24 × 4 PM の install+build マトリクス                                                                                                    |

## 技術メモ

- Next.js 16（Turbopack）/ React 19 / Tailwind CSS v4 / TypeScript 5.9 厳格モード
- 依存バージョンはすべて exact pin。`packageManager` フィールドは意図的に置かない（CI で corepack 使用）
- フォントは npm（Fontsource）自己ホスト。`Roboto Flex Variable` + `Material Symbols Rounded`
- `pnpm typecheck` は `next build` 後に実行すること（typed routes の生成型に依存）
- トークンの値は `androidx` 生成仕様が正。テストでロック済み（unit 175 + e2e 15・カバレッジ 90% ゲート付き）
