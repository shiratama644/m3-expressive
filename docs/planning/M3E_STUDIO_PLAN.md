# M3E Studio: Material 3 Expressive デザイン生成サイトの立ち上げ

> 対応 task-list ID: `GEN-1`〜`GEN-8` (docs/task-list.md)
> 計画書テンプレート: docs/planning/_TEMPLATE.md 準拠

## 1. 開始前確認

- ブランチはセッション固定ブランチ（`git branch --show-current` で確認）であること
- `docs/task-list.md` の依存タスク完了を確認
- 関連仕様: AGENTS.md §6 / `node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md`
- 作業ツリーが clean であること

## 2. 目的 (Why)

ユーザーの要望「**Material 3 Expressive のデザインを簡単に生成できるサイト**」を満たす。
対象フォーク = React / Next.js / Vue / Tailwind CSS、対象 PM = Bun / pnpm / npm / yarn。
サイト自体は Next.js + 自作 M3 Expressive デザインシステムで実装する。

M3E は 2025-05 に Google が発表した Material Design 3 の大型アップデート（新モーショントークン、
スペーシャル形状モーフ、非対称シェイプ、新しいタイプスケール、新コンポーネント集）。
Web 向け公式コンポーネント実装（material-web）は本計画時点でも未対応のため、
**トークン仕様を正確に移植した自作生成器**が最短・最安定ルートである。

## 3. 変更範囲 (Scope)

変更対象:

- `src/lib/m3e/` — トークンエンジン（色 HCT / シェイプ / タイポ / モーション）
- `src/lib/gen/` — フレームワーク × PM 別のコード生成テンプレート
- `src/app/` — ランディング / スタジオ / トークンリファレンス / ドキュメント
- `src/components/` — M3E プレビューコンポーネント & サイト UI シェル
- `package.json` / 各種設定 / CI（Node 24 × 4 PM マトリクス）
- `docs/`（task-list・本計画書・完了レポート）、`README.md`、`.agent/`

変更しない (境界外):

- `LICENSE`、テンプレート由来の汎用規約（AGENTS.md §1〜5 / §7 / §8）
- ユーザープロジェクト側の実行（当サイトは**コードを生成して渡す**だけで、外部リポジトリには触れない）

## 4. 禁止事項

- 推測で仕様を補完しない（M3E のトークン値は一次ソース準拠、迷えば Web 検索で m3.material.io / Compose 実装を確認）
- 色計算（HCT・tonal palette）の再実装禁止 — `@material/material-color-utilities` を使う
- テストを通すためだけの期待値改変禁止
- `next/font/google`・CDN フォント禁止（§6.2）
- 生成コードテンプレート内に当サイトの依存（Next / React）を持ち込まない

## 5. 完了条件 (DoD)

- [ ] `/`, `/studio`, `/docs` が実装され、dev server で HTTP 200（ライブプレビューで確認可能）
- [ ] シード色 1 色から M3E 2025 スペックのカラーロール一式（light/dark、fixed/Dim 含む）が HCT で生成される
- [ ] スタジオで色・シェイプ・モーション・タイポをいじるとプレビュー（ボタン/FAB/カード/スライダー等）に即時反映される
- [ ] React / Next.js / Vue / Tailwind CSS 向けコードが、それぞれファイル単位でコピー & zip ダウンロードできる
- [ ] 4 PM（bun/pnpm/npm/yarn）のセットアップ手順が全生成コードにタブで用意されている
- [ ] プロジェクト検証 — `typecheck` / `lint` / `format:check` / `test:unit` / `build` — 全 pass
- [ ] CI（GitHub Actions, Node 24 マトリクス × 4 PM）が緑
- [ ] `docs/task-list.md` の状態・進捗・証拠を更新

## 6. テスト方法

| 層        | 実施       | 確認内容                                                                                                   |
| --------- | ---------- | ---------------------------------------------------------------------------------------------------------- |
| Unit      | 実施       | トークンエンジン（色変換精度・生成する CSS 変数/クラス名の整合・テンプレート出力の健全性）                 |
| Component | 実施しない | 基盤なし（Vitest node 環境のみ）。レンダリング確認は dev server で行う                                     |
| E2E       | 実施しない | Sandbox にブラウザバイナリ不可（§6.2）。CI でも当面行わない                                                |
| 実環境    | 部分       | dev server 起動 + curl で主要ページ 200/コンテンツ確認。実ブラウザ確認は Arena ライブプレビュー / ユーザー |

## 7. 停止条件

次の場合は作業を停止し、変更せず報告する:

- 仕様書同士（本計画書・AGENTS.md・ユーザー指示）の矛盾
- task-list.md 記載の変更範囲を超える変更が必要
- 破壊的変更（生成物の出力形式の互換性破壊など）が必要
- 未確認の作業ツリー変更

## 8. 完了時に行うこと

1. 差分を自己レビュー
2. プロジェクト検証（typecheck / lint / format:check / test:unit / build）
3. `docs/task-list.md` の状態・進捗・証拠を更新
4. タスク ID 込みコミット（`feat(GEN-2): …`）
5. 証拠中心の完了報告

## 9. サブタスク分割

| ID    | テーマ                      | 主要成果物                                                                                    | 依存         |
| ----- | --------------------------- | --------------------------------------------------------------------------------------------- | ------------ |
| GEN-1 | 土台                        | TEMPLATE_REPO 導入手順の移植 + create-next-app 16 スキャフォールド + 4 PM 環境 + 検証脚本     | —            |
| GEN-2 | トークンエンジン            | `src/lib/m3e/*` + Vitest 単体テスト                                                           | GEN-1        |
| GEN-3 | シェル & グローバルスタイル | layout / fonts(Fontsource) / globals.css / M3E サイトテーマ                                   | GEN-1        |
| GEN-4 | Studio: 操作系 + プレビュー | カラー/シェイプ/モーション/タイポ操作 + プレビューコンポーネント集                            | GEN-2, GEN-3 |
| GEN-5 | コード生成 + エクスポート   | React/Next.js/Vue/Tailwind 別ファイル生成、PM タブ、zip / copy                                | GEN-4        |
| GEN-6 | ランディング / docs         | 説得ある LP、トークンリファレンス、フレームワーク別導入手順                                   | GEN-5        |
| GEN-7 | CI + 4 PM 検証              | `.github/workflows/ci.yml`（Node 24 × bun/pnpm/npm/yarn）、ローカルで 4 PM install+build 確認 | GEN-1        |
| GEN-8 | 仕上げ                      | README、skill 更新、ログ、最終検証、push・PR                                                  | GEN-2〜7     |

## 10. 設計詳細・仕様

### 10.1 データフロー（単方向・純関数）

```text
StudioState(UI 設定)
  → buildThemeConfig(state)        … M3EThemeConfig（シード・variant・contrast・shape・motion・type）
  → color: DynamicScheme/ColorScheme → CSS variables (light/dark)
  → shape/typography/motion        → CSS variables
  → generateCss / generateTokensJson / generateTailwindTheme
  → [プレビュー] style={{cssVars}} でコンテナに注入
  → [エクスポート] gen/* が文字列テンプレートへ
```

### 10.2 M3E トークン仕様（実装基準値）

- 色: `@material/material-color-utilities@0.4.0` の `DynamicScheme`（variant: TONAL_SPOT / VIBRANT / EXPRESSIVE / NEUTRAL / MONOCHROME / FIDELITY / RAINBOW / FRUIT_SALAD / CONTENT）、`specVersion: '2025'` で M3E の新ロール（`primary_fixed` / `primary_fixed_dim` / `*_dim` / `surface_container_*`）まで。ロールは約 40 種 + `on_surface_variant` 等。
- シェイプ: M3 標準 none0/xs4/s8/m12/l16/xl28/full + M3E 拡張 increased（xs 8? ではなく Compose 準拠: small10 / medium16 / large24 / extraLarge32）+ 非対称（corner-specific: `no_top` / `no_bottom` / `de_emphasized_*` / M3E の「角だけ丸める」系）。形状モーフは `transition: border-radius` で近似し、トークン JSON には spec の spring 値を含める。
- タイポ: Roboto Flex（可変フォント、`font-variation-settings` で optical size/weight 制御）。display/headline/title/body/label × L/M/S + M3E の emphasized 系（例 displayLargeEmphasized 57/64, headlineMediumEmphasized 28/36 …）。サイズスケール ± ステップ対応。
- モーション: 公式 duration トークン（very short 20/25/35/50 … extra long 800/1200/1600/2000ms）+ easing（emphasized cubic-bezier(.2,0,0,1) / emphasized-decelerate(.05,.7,.1,1) / emphasized-accelerate(.3,0,.8,.15) 等）+ expressive spring（stiffness/damping を JSON に持たせ、CSS では keyframe 近似「bounce-out」で表現）。パターン: spatial expansion, slide & fade, fade through, container transform, icon morph, crossfade, shape morph, loading。

### 10.3 生成物（Export）の形

| 対象                 | 成果物                                                                                       |
| -------------------- | -------------------------------------------------------------------------------------------- |
| Tailwind CSS v4      | `globals.css`（`@theme inline` + light/dark 変数）、v3 系 `tailwind.config.{js,ts}` も選択可 |
| React (Vite)         | `src/theme/tokens.css` + `tokens.ts` + `<M3E>` コンポーネント最小例                          |
| Next.js (App Router) | `app/globals.css` + `app/layout.tsx` 差し替え + `lib/theme.ts`                               |
| Vue 3 (Vite)         | `src/styles/tokens.css` + `composables/useM3ETheme.ts` + `App.vue` 例                        |
| 共通                 | `tokens.json`（W3C Design Tokens 形式）・README 生成（PM 別コマンド表込み）                  |

PM タブ: `bun add` / `pnpm add` / `npm install` / `yarn add`、setup: `bunx create-vite` … を各 PM 相当で提示。

### 10.4 页面

- `/` ランディング: ヒーロー（動くプレビュー）、特徴、使い方 3 ステップ、スタック対応バッジ（React/Next/Vue/Tailwind + bun/pnpm/npm/yarn）。
- `/studio`: 左=コントロール（シード色・variant・コントラスト・ダーク・シェイプ・モーション・タイポ・コンポーネントトグル）、上=プレビューキャンバス、下タブ=Code（フレームワークタブ × ファイルツリー × コピー/ダウンロード）。
- `/docs`: 導入手順（フレームワーク × PM）、M3E 仕様リファレンス（色ロール表・シェイプ表・モーショントークン表・タイプ表）。

## 11. リスク・Gotchas

- `@material/material-color-utilities` は ESM のみ（`"type": "module"`）。Next/Vitest のトランスパイル設定に注意（vitest は natives、Next は Turbopack で問題なしの見込み — 発生時は都度調査）。
- Tailwind v4 の `@theme` は静的に解決されるため、**実行時可変な色は `@theme inline` + `:root` 変数参照**で間接化する。
- Fontsource の material-symbols は CSS の `@import` 後に class を当てる必要。Next のグローバル CSS で import する。
- prettier-plugin-tailwindcss が生成テンプレート文字列内のクラスを並び替えない（文字列なので問題ないが、テンプレ内の class 順は spec 基準で手で整える）。
- Next 16 build は `output` 設定なし・`next start` 前提。`/studio` は `'use client'` 完結（SSR で window を触らない）。

## 12. 実績と証拠 (実装後に記入)

| ID    | コミット | テスト | 実測値・備考 |
| ----- | -------- | ------ | ------------ |
| GEN-1 | （記入） | —      |              |
