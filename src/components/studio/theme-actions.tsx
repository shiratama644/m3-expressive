'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { Icon } from '@/components/m3e/actions';
import { parseStudioInput } from '@/lib/m3e/importConfig';
import { deleteTheme, listThemes, type StoredTheme, saveTheme } from '@/lib/presets/db';
import { paramsToState, type StudioState, stateToParams } from './state';

/**
 * Header actions: save the current theme into the local (IndexedDB) preset
 * library, and restore one — or import a tokens.json / share link.
 */
export function ThemeActions({
  state,
  onApply,
}: {
  state: StudioState;
  onApply: (next: StudioState) => void;
}) {
  const [pop, setPop] = useState<'save' | 'import' | 'lib' | null>(null);
  const [name, setName] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [saved, setSaved] = useState<StoredTheme[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const doSave = async () => {
    const label = name.trim() || `Theme ${new Date().toLocaleDateString('ja-JP')}`;
    await saveTheme(label, stateToParams(state), state.config.seed);
    setName('');
    setFeedback('IndexedDB に保存しました');
    setTimeout(() => setFeedback(null), 2000);
  };

  const openLib = async () => {
    if (pop === 'lib') return setPop(null);
    setSaved(await listThemes());
    setPop('lib');
  };

  const applyImport = (text: string) => {
    const result = parseStudioInput(text);
    if (result.kind === 'error') {
      setFeedback(result.message);
      return;
    }
    if (result.kind === 'link') {
      onApply(paramsToState(result.search));
    } else {
      onApply({ config: result.config, mode: 'light' });
    }
    setFeedback(
      result.notes.length ? `読込済: ${result.notes.join(' ')}` : 'テーマを読み込みました',
    );
    setInput('');
    setPop(null);
    setTimeout(() => setFeedback(null), 2500);
  };

  const btn = (active: boolean) =>
    `m3e-press t-label-medium flex items-center gap-1 rounded-(--m3e-shape-button) px-2.5 py-1.5 ${
      active
        ? 'bg-secondary-container text-on-secondary-container'
        : 'text-on-surface-variant hover:bg-on-surface/8'
    }`;

  return (
    <div className="relative flex shrink-0 items-center gap-1">
      <button
        type="button"
        className={btn(pop === 'import')}
        onClick={() => setPop(pop === 'import' ? null : 'import')}
        aria-expanded={pop === 'import'}
      >
        <Icon name="input" className="text-[16px]" />
        <span className="hidden sm:inline">Import</span>
      </button>
      <button
        type="button"
        className={btn(pop === 'save')}
        onClick={() => setPop(pop === 'save' ? null : 'save')}
        aria-expanded={pop === 'save'}
      >
        <Icon name="bookmark_add" className="text-[16px]" />
        <span className="hidden sm:inline">Save</span>
      </button>
      <button
        type="button"
        className={btn(pop === 'lib')}
        onClick={openLib}
        aria-expanded={pop === 'lib'}
      >
        <Icon name="library_books" className="text-[16px]" />
        <span className="hidden sm:inline">My themes</span>
      </button>
      {feedback && (
        <span className="bg-tertiary-container t-label-small text-on-tertiary-container absolute right-0 -bottom-9 z-20 rounded-(--m3e-shape-button) px-3 py-1 whitespace-nowrap">
          {feedback}
        </span>
      )}

      {pop === 'save' && (
        <div className="bg-surface-container-high border-outline-variant absolute top-full right-0 z-30 mt-2 flex w-72 flex-col gap-2 rounded-(--m3e-shape-large) border p-3 shadow-lg">
          <label className="t-label-medium text-on-surface" htmlFor="preset-name">
            プリセット名
          </label>
          <input
            id="preset-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={state.config.seed}
            className="t-body-medium border-outline-variant bg-surface text-on-surface placeholder:text-on-surface-variant/60 focus:border-primary rounded-(--m3e-shape-extra-small) border px-3 py-2 outline-none"
          />
          <div className="flex items-center justify-between">
            <Link href="/presets" className="t-label-medium text-primary hover:underline">
              /presets で管理
            </Link>
            <button
              type="button"
              onClick={doSave}
              className="m3e-press bg-primary t-label-large text-on-primary rounded-(--m3e-shape-button) px-4 py-1.5"
            >
              保存
            </button>
          </div>
        </div>
      )}

      {pop === 'import' && (
        <div className="bg-surface-container-high border-outline-variant absolute top-full right-0 z-30 mt-2 flex w-96 max-w-[90vw] flex-col gap-2 rounded-(--m3e-shape-large) border p-3 shadow-lg">
          <p className="t-label-medium text-on-surface">tokens.json / 共有リンクを貼付</p>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={5}
            spellCheck={false}
            placeholder={'{"$extensions":…} または /studio?s=… の URL'}
            className="t-body-small border-outline-variant bg-surface text-on-surface placeholder:text-on-surface-variant/60 focus:border-primary resize-y rounded-(--m3e-shape-extra-small) border p-2 font-mono outline-none"
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="m3e-press t-label-medium border-outline-variant text-on-surface-variant hover:bg-on-surface/8 rounded-(--m3e-shape-button) border px-3 py-1.5"
            >
              .json を選択…
            </button>
            <input
              ref={fileRef}
              type="file"
              accept=".json,application/json"
              className="hidden"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                setInput(await f.text());
                e.target.value = '';
              }}
            />
            <button
              type="button"
              disabled={!input.trim()}
              onClick={() => applyImport(input)}
              className="m3e-press bg-primary t-label-large text-on-primary ml-auto rounded-(--m3e-shape-button) px-4 py-1.5 disabled:opacity-50"
            >
              適用
            </button>
          </div>
        </div>
      )}

      {pop === 'lib' && (
        <div className="bg-surface-container-high border-outline-variant absolute top-full right-0 z-30 mt-2 flex max-h-80 w-80 flex-col gap-1 overflow-y-auto rounded-(--m3e-shape-large) border p-2 shadow-lg">
          <p className="t-label-large text-on-surface px-1 py-1">保存済みテーマ</p>
          {saved.length === 0 && (
            <p className="t-body-small text-on-surface-variant px-1 pb-2">
              まだ保存されていません。Save ボタンから登録できます。
            </p>
          )}
          {saved.map((t) => (
            <div
              key={t.id}
              className="hover:bg-surface-container group flex items-center gap-2 rounded-(--m3e-shape-small) px-2 py-1.5"
            >
              <span
                className="ring-outline h-4 w-4 shrink-0 rounded-full ring-1"
                style={{ background: t.seed }}
              />
              <button
                type="button"
                className="t-label-medium text-on-surface hover:text-primary min-w-0 flex-1 truncate text-left"
                onClick={() => {
                  onApply(paramsToState(t.search));
                  setPop(null);
                }}
              >
                {t.name}
              </button>
              <button
                type="button"
                aria-label={`Delete ${t.name}`}
                className="t-label-medium text-on-surface-variant hover:text-error opacity-0 group-hover:opacity-100"
                onClick={async () => {
                  if (t.id !== undefined) await deleteTheme(t.id);
                  setSaved(await listThemes());
                }}
              >
                <Icon name="delete" className="text-[16px]" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
