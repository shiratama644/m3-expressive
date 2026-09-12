'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { buildTheme } from '@/lib/m3e/css';
import { DEFAULT_CONFIG, prefixFor } from '@/lib/m3e/config';
import { SEED_PRESETS } from '@/components/studio/state';
import { deleteTheme, listThemes, type StoredTheme } from '@/lib/presets/db';
import { Icon } from '@/components/m3e/actions';

function previewStrip(seed: string) {
  const bundle = buildTheme({ ...DEFAULT_CONFIG, seed });
  const p = prefixFor(bundle.config.naming);
  const pick = (role: string): string => bundle.light[`--${p}-color-${role}`] ?? 'transparent';
  return {
    light: ['primary', 'primary-container', 'secondary', 'tertiary-container', 'surface'].map(pick),
    dark: ['primary', 'primary-container', 'secondary', 'tertiary-container', 'surface'].map(pick),
  };
}

function SwatchStrip({ seed, mode }: { seed: string; mode: 'light' | 'dark' }) {
  const strip = useMemo(() => previewStrip(seed), [seed]);
  const colors = mode === 'light' ? strip.light : strip.dark;
  return (
    <div className="flex h-14 overflow-hidden rounded-(--m3e-shape-large)">
      {colors.map((c, i) => (
        <div
          key={i}
          className="flex-1 transition-[flex-grow] duration-(--m3e-motion-duration-medium2) ease-(--m3e-motion-easing-emphasized) hover:flex-[1.8]"
          style={{ background: c }}
          title={c}
        />
      ))}
    </div>
  );
}

function ThemeCard({
  name,
  sub,
  search,
  seed,
  onDelete,
}: {
  name: string;
  sub: string;
  search: string;
  seed: string;
  onDelete?: () => void;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="bg-surface-container-low flex flex-col gap-3 rounded-(--m3e-shape-extra-large) p-4">
      <SwatchStrip seed={seed} mode="light" />
      <SwatchStrip seed={seed} mode="dark" />
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="t-title-medium text-on-surface truncate">{name}</p>
          <p className="t-body-small text-on-surface-variant">{sub}</p>
        </div>
        <span
          className="ring-outline h-6 w-6 shrink-0 rounded-(--m3e-shape-extra-small) ring-1"
          style={{ background: seed }}
          aria-label={`Seed ${seed}`}
        />
      </div>
      <div className="flex items-center gap-1">
        <Link
          href={`/studio?${search}`}
          className="m3e-press bg-primary t-label-large text-on-primary flex items-center gap-1.5 rounded-(--m3e-shape-button) px-4 py-1.5 hover:brightness-110"
        >
          <Icon name="palette" className="text-[18px]" />
          Studio で開く
        </Link>
        <button
          type="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(`${location.origin}/studio?${search}`);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            } catch {
              /* ignore */
            }
          }}
          className="m3e-press t-label-medium text-on-surface-variant hover:bg-on-surface/8 flex items-center gap-1 rounded-(--m3e-shape-button) px-3 py-1.5"
        >
          <Icon name={copied ? 'check' : 'share'} className="text-[16px]" />
          {copied ? 'コピー済' : '共有'}
        </button>
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            aria-label={`${name} を削除`}
            className="m3e-press t-label-medium text-on-surface-variant hover:text-error ml-auto rounded-(--m3e-shape-button) px-2.5 py-1.5"
          >
            <Icon name="delete" className="text-[16px]" />
          </button>
        )}
      </div>
    </div>
  );
}

export function PresetGallery() {
  const [mine, setMine] = useState<StoredTheme[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    listThemes().then((rows) => {
      setMine(rows);
      setLoaded(true);
    });
  }, []);

  const builtins = useMemo(
    () =>
      SEED_PRESETS.map((p) => ({
        name: p.name,
        seed: p.hex,
        search: new URLSearchParams({ s: p.hex.slice(1).toLowerCase() }).toString(),
      })),
    [],
  );

  return (
    <div className="mx-auto flex w-full max-w-350 flex-col gap-12 px-4 py-12 sm:px-6">
      <section className="flex flex-col gap-4">
        <div>
          <p className="t-label-large text-primary">Built-in seeds</p>
          <h2 className="t-headline-small text-on-surface">
            スターター シード × {builtins.length}
          </h2>
          <p className="t-body-medium text-on-surface-variant mt-1 max-w-2xl">
            M3E の各カラーロールを横断する定番シード。カードの帯は生成直後の light / dark
            プレビューです。Studio 開き後はそのまま編集・保存できます。
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {builtins.map((b) => (
            <ThemeCard
              key={b.name}
              name={b.name}
              sub={`${b.seed} · expressive / contrast 0`}
              seed={b.seed}
              search={b.search}
            />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div>
          <p className="t-label-large text-primary">Saved by you</p>
          <h2 className="t-headline-small text-on-surface">マイテーマ</h2>
          <p className="t-body-medium text-on-surface-variant mt-1 max-w-2xl">
            Studio の Save ボタンで保存したテーマ（IndexedDB /
            Dexie、ブラウザローカルのみ・サーバー送信なし）。
          </p>
        </div>
        {!loaded && <p className="t-body-medium text-on-surface-variant">読み込み中…</p>}
        {loaded && mine.length === 0 && (
          <div className="border-outline-variant bg-surface-container-low flex flex-col items-start gap-3 rounded-(--m3e-shape-extra-large) border border-dashed p-8">
            <p className="t-title-medium text-on-surface">保存済みテーマはまだありません</p>
            <p className="t-body-medium text-on-surface-variant max-w-lg">
              Studio で設定を決めたら、上部の <b>Save</b>{' '}
              から名前を付けて保存。このページに一覧が並び、ワンクリックで読み込めます。
            </p>
            <Link
              href="/studio"
              className="m3e-press bg-primary t-label-large text-on-primary flex items-center gap-2 rounded-(--m3e-shape-button) px-5 py-2.5 hover:brightness-110"
            >
              <Icon name="tune" className="text-[18px]" />
              Studio で作る
            </Link>
          </div>
        )}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {mine.map((t) => (
            <ThemeCard
              key={t.id}
              name={t.name}
              sub={new Date(t.createdAt).toLocaleString('ja-JP', {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
              seed={t.seed}
              search={t.search}
              onDelete={async () => {
                if (t.id !== undefined) {
                  await deleteTheme(t.id);
                  setMine(await listThemes());
                }
              }}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
