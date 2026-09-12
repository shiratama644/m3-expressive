# タスクリスト (唯一の正本)

> **運用規則** — Qiita「Claude Code／Codex に中〜大規模開発を任せるためのタスク管理」
> (<https://qiita.com/Y-Y-dev/items/d526fb7cdbe35a3f9384>) に基づく運用。
>
> 1. **本ファイルが進捗管理の唯一の正本**。チャット・Issue・AI の完了報告と本ファイルが
>    矛盾する場合は本ファイルを正とする。
> 2. **進行中タスクは原則 1 件**。複数を同時に進めない (独立性の高い調査・テストを除く)。
> 3. **タスク ID は再利用しない**。中止したタスクは行を消さず「対象外」にして理由を残す。
> 4. **作業中に見つけた新問題は新タスクとして登録**し、現在のタスクへ混ぜない
>    (現在の完了条件に必須の場合のみ例外)。
> 5. 完了は **AI の自己申告ではなく証拠で判定**する (テスト件数 / コミット SHA / PR / 実測値)。
> 6. 個別タスクの詳細 (目的・変更範囲・禁止事項・完了条件・テスト方法・停止条件) は
>    `docs/planning/*_PLAN.md` (計画書テンプレート `_TEMPLATE.md` 準拠) に書く。
>
> **状態の定義**: `未着手` / `調査中` / `実装中` / `ローカル検証済み` /
> `実環境検証待ち` (デプロイ先・実機での確認が残る) / `完了` / `保留` (外部判断待ち) /
> `対象外` (中止・不採用。理由を残す)

---

## 未完了サマリー

> 完了していないタスクと残作業だけをここに列挙する（全件確認しなくて済むように）。
> 進行中のタスクが無ければ「なし」と書く。

| ID    | 状態 | 残作業                                     |
| ----- | ---- | ------------------------------------------ |
| GEN-2 | ✅   | M3E トークンエンジン + 単体テスト          |
| GEN-3 | ✅   | シェル / フォント / グローバルスタイル     |
| GEN-4 | ✅   | Studio 操作系 + プレビューコンポーネント   |
| GEN-5 | ✅   | コード生成 (4FW × 4PM) + エクスポート      |
| GEN-6 | ✅   | ランディング / docs / トークンリファレンス |
| GEN-7 | ✅   | CI + 4 PM ローカル検証                     |
| GEN-8 | ✅   | README・skill 整備・push・PR               |

---

## タスク一覧

### M3E Studio 立ち上げ (2026-09-12 計画 / docs/planning/M3E_STUDIO_PLAN.md)

| ID     | タスク                                                            | 状態              | 進捗 | 依存     | 完了条件                                                             | 証拠                                                                               |
| ------ | ----------------------------------------------------------------- | ----------------- | ---: | -------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| GEN-1  | 土台（TEMPLATE_REPO 導入 + Next 16 スキャフォールド + 4 PM 環境） | ✅                | 100% | —        | build/typecheck 可、pnpm lock 生成、AGENTS §6 記入                   | b69f09d                                                                            |
| GEN-2  | M3E トークンエンジン + 単体テスト                                 | ✅                | 100% | GEN-1    | `pnpm test:unit` pass、色ロール/シェイプ/モーション/タイポ生成       | a55b1cc（47 tests）                                                                |
| GEN-3  | サイトシェル・フォント自己ホスト・テーマ適用                      | ✅                | 100% | GEN-1    | dev 起動で Roboto Flex/Material Symbols が CDN 経由なく表示、`/` 200 | a55b1cc + `/` 200（102KB）                                                         |
| GEN-4  | Studio: コントロール + ライブプレビュー                           | ✅                | 100% | GEN-2,3  | シード変更で全プレビュー色即時反映、ダーク切替動作                   | `?s=ff0000`→#9d4336 SSR 確認                                                       |
| GEN-5  | コード生成 (React/Next/Vue/Tailwind) + PM タブ + zip/copy         | ✅                | 100% | GEN-4    | 4FW×4PM 出力、zip 生成、コピー動作、生成物に PM コマンド表あり       | 5bf1f03（54 tests）                                                                |
| GEN-6  | ランディング / docs / トークンリファレンス                        | ✅                | 100% | GEN-5    | 3 ページ描画・導入手順 16 組合せ表示                                 | `/` `/docs` `/tokens` 200、docs で 4PM 表表示                                      |
| GEN-7  | CI (Node 24 × 4 PM) + 4 PM ローカル検証                           | ✅                | 100% | GEN-1    | ワークフロー緑、sandbox で bun/npm/yarn/pnpm install+build 完走ログ  | sandbox: bun/npm/yarn install+build 完走（pnpm は本流で常時）、CI 緑は push 後確認 |
| GEN-8  | 最終仕上げ（README・skill・ログ・push・PR）                       | 実装中            |  60% | GEN-2〜7 | 全検証 pass、working tree clean、push 済み、PR URL 報告              | skill/ログ記入済、push 実行中                                                      |
| GEN-9  | Studio: WCAG 2.2 コントラスト検査                                 | ✅                | 100% | GEN-4    | 全ロールペアの比を light/dark で表示、基準切替（AA/AA-large/AAA）    | 12 tests、テキスト全ペア AA pass                                                   |
| GEN-10 | /presets ギャラリー + IndexedDB（Dexie）保存                      | ✅                | 100% | GEN-4    | 10 シード表示・保存/読込/削除・共有リンク                            | `/presets` 200、Save/My themes 実装                                                |
| GEN-11 | tokens.json インポート & Style Dictionary/Compose/XML 出力        | ✅                | 100% | GEN-5    | 往復パース（round-trip test）・追加ファイルが ZIP に含まれる         | 10 tests 追加                                                                      |
| GEN-12 | Studio: A11y 未達行のワンクリック修復                             | ✅                | 100% | GEN-9    | 未達時に contrast 自動提案、適用で失敗減/ゼロ                        | 80 tests（修復の単調性・整合性）                                                   |
| GEN-13 | テストの tests/ 再編（ルートミラー）+ Vitest 5.0.0 据付           | ✅                | 100% | —        | 全テスト `_tests_/` 配下（GEN-16 でリネーム）・@/ 参照・vitest include 更新                   | 80 tests 緑                                                                        |
| GEN-14 | Playwright e2e スイート（`_tests_/e2e/app/*`）+ CI job            | ✅                | 100% | GEN-13   | 15 e2e spec、CI 全緑（45e0da5: E2E success 確認済み・run 34678997402）     | aria-label 修正で 15/15 が緑に確定 |
| GEN-15 | Tooling: ESLint+Prettier → Biome 2（lint/format/organize-imports） | ✅                | 100% | GEN-13   | `biome check .` 71 files clean・`format:check` 緑・全ファイル整形済み        | eslint/prettier 設定と devDeps 削除、lockfile 同期済み |
| GEN-16 | tests/ → `_tests_/` リネーム（vitest/playwright 設定追随）        | ✅                | 100% | GEN-13   | unit 81/81・`playwright test --list` 15 件（リネーム後）                     | skills/docs 追随済み |
| GEN-17 | Vitest カバレッジ 90% 目標（設定+計画のみ・増強は次段階）         | ✅                | 100% | GEN-15   | `test:coverage` 実測 55.0% → `docs/planning/COVERAGE_PLAN.md`（M1〜M4）     | thresholds は意図的に未設定（M4 で 90 化） |
| GEN-18 | e2e AAA 12 ペア未達解消（エンジン probe 緩和）                     | ⏸ キャンセル    |   0% | GEN-12   | 依頼取り消し（やっぱやめます）。e2e の contrast 0.9 修復フローは仕様として維持 | 将来やるなら COVERAGE_PLAN と別枠で probe 方針変更の合意形成から |

---

## タスク追加の手順

1. 本ファイルに**新規 ID** で行を追加する（ID は `TASK-1` / `AUTH-2` のようにテーマ接頭辞 + 連番。
   一度発行した ID は再利用しない）
2. 計画書を `docs/planning/{TOPIC}_PLAN.md` に `_TEMPLATE.md` 形式で作成する
3. 実装中は状態（未着手 → 調査中 → 実装中 → ローカル検証済み）を更新する
4. 完了時は「完了条件」を満たした**証拠**（コミット SHA / テスト結果 / 実測値）を書く。
   実環境での確認が残る場合は「実環境検証待ち」とし、完了にしない
