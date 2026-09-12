# Vitest カバレッジ 90% 達成プラン

> 作成: 2026-09-12 / 状態: **計画のみ**（このコミットでテストは増やさない）
> 目標: **Statements / Lines / Functions / Branches の repo 横断 90%**（vitest カバレッジ目標）
> 測定: `pnpm test:coverage`（provider: v8、reporter: text + html）

## 1. 現状ベースライン（実測 2026-09-12, 81 tests）

| 領域 | Stmts | 備考 |
| :--- | ----: | :--- |
| **All files** | **55.0%** | ここから +35pt |
| `src/lib/m3e/**` | 95.7% | ほぼ達成。残は `a11y.ts` 74.5%（fixer 境界）と `index.ts` バレル |
| `src/lib/gen/**` | 80.9% | `highlight.ts` 0%・`pm.ts` 86.7% |
| `src/components/studio`（純ロジック） | 91–100% | `state.ts` 91.3% / `families.ts` 100% |
| `src/components/studio`（UI） | 0% | `controls` `preview` `code-panel` `a11y-panel` `theme-actions` `primitives` `zip` |
| `src/app/**`（route/page） | 0% | サーバー側 page 関数・metadata |
| `src/components/m3e,site,docs,landing` | 0% | デモ/共通 UI |
| `src/lib/presets/db.ts` | 0% | Dexie（ブラウザ専用） |

## 2. 原則 — 「意味のあるカバレッジ」Only

1. **挙動を固定するテストだけを書く**。カバレッジ数は結果であり目的にしない。`expect(x).toBeDefined()` 型の水増しを禁止する。
2. **変異思考**: その行の定数・境界・分岐を壊したら、追加するテストは失敗するか？ 失敗しないなら書く価値がない（既存の `color.test.ts` / `shape.test.ts` の仕様ロックが模範）。
3. **ロジックは UI から引き剥がしてテストする**: DOM が必要な操作はイベントハンドラを純関数（reducer 化）に寄せて unit、表示は component test の 2 層。
4. **テスト不能なものは計測対象から外す**（正直な % のため）: 型だけ・定数だけのモジュール、`*.d.ts`、アイコン svg。除外は `vitest.config.ts` の `coverage.exclude` に**理由付きで列挙**し、暗黙の無計測を作らない。
5. e2e と unit の重複を避ける: クリック→URL 変化のような結合は e2e が持つ。unit は入出力契約に集中。

## 3. マイルストーン

### M1 — 純関数の穴を潰す（55% → ~68% 見込み・依存追加なし）★費用対効果最大

| 対象 | 追加テスト内容 |
| :--- | :--- |
| `lib/gen/highlight.ts` | escape-first 性（`<script>` が注入されない）、トークン境界（複合クォート・コメント内の `{`）、未知拡張の素通し。HTML 出力の文字列一致ではなく「エスケープ＋span 構造」で検証 |
| `lib/m3e/a11y.ts` | `findFixContrast` の null 分岐（修復不能）／`advisoryNotes`／3桁 hex・`#rgb` 入力。`minRatio` は済 → 境界追加 |
| `lib/gen/pm.ts` | `exec`（`bunx/pnpm dlx/npx/yarn dlx` 分岐）、`run` の bun/yarn 直呼び分岐（49–50, 58, 66 行） |
| `lib/m3e/importConfig.ts` | `#rgb` 短縮 seed 拒否、型違い（number でない contrast）無視、URL の `#fragment` 除去後パース |
| `components/studio/state.ts` | 72・92 行（不正 `v=`・`d=` の無視経路） |
| `components/studio/zip.ts` | fflate をモックせず、zip builder 部分（パス→Uint8Array 変換）を純関数に抽出して内容バイト列を検証 |

### M2 — reducer 化で Studio UI ロジックに届く（~68% → 78%）

- `code-panel` のタブ/選択状態・extras トグルを `useReducer`＋純 `codePanelReducer` に抽出 → 遷移表テスト。
- `theme-actions` の Import 結果→state パイプライン（`parseStudioInput` 適用規則: link か state か error かで setState か feedback か）を純関数 `applyImportResult` に抽出。
- `controls` の SliderRow 範囲クランプ（-8..24 等の入力は `clampConfig` 経由）を unit でロック。

### M3 — コンポーネント/SSR テスト（78% → 90%）★依存追加はこの段だけ

- `@testing-library/react` + `@testing-library/user-event` + `jsdom` を devDep 追加（exact pin）。
- 対象: `a11y-panel`（レベル切替で minimum 列が変わる／失敗のみフィルタで行数）、`gallery`（カードの link href 生成）、`Field/Segmented/SwitchRow`（label↔control 関連付け = a11y 回帰ガード）、`Preview`（mode でコンテナ背景 var が差し替わる）。
- サーバー page（`/`・`/docs`・`/tokens`）は `renderToStaticMarkup` の smoke を `test.environment: 'jsdom' プロジェクト分離` で（Next 依存をモックしないよう、page は純粋な JSX 構築に保つ制約を skills 側に追記）。

### M4 — ゲート化

- `vitest.config.ts` の `coverage.thresholds` を `{ lines: 90, functions: 90, branches: 85, statements: 90 }` で有効化。
- CI quality ジョブに `pnpm test:coverage` を追加（ gates ）。**M3 完了まで閾値は上げない**（段階的に 60→75→90）。

## 4. やらないこと（明示的除外）

- `src/components/m3e/**` の見た目のみ（class 出力）の包括テスト → e2e の描画確認と tokens テストで代替し、unit ではスモークのみ。
- `layout.tsx` / `globals.css` / `icon.svg` → 対象外（config exclude + 理由コメント）。
- Dexie 実体の統合テスト（IndexedDB）→ jsdom だと fake-indexeddb 追加が必要になるため、行わず DB 呼び出し境界（`getDb` の遅延生成・SSR ガード）だけを unit で見る。

## 5. 進め方

1. M1 から着手し、マージごとに `pnpm test:coverage` の数値を task-list の証拠欄へ記録。
2. 各 milestone の完了条件は「新規テストが少なくとも 1 つの変異（定数変更・境界反転）を検出できること」の目視確認。
3. 方針変更（例: UI テストを e2e 寄りに寄せる）は本書を更新して反映する。
