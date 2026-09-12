'use client';

import { useMemo, useState } from 'react';
import { FRAMEWORKS, FRAMEWORK_META, generateFiles, type Framework } from '@/lib/gen';
import { PACKAGE_MANAGERS, PM_LABELS, type PackageManager } from '@/lib/gen/pm';
import { highlight } from '@/lib/gen/highlight';
import { downloadProjectZip } from './zip';
import type { StudioState } from './state';
import { stateToParams } from './state';
import { Icon } from '@/components/m3e/actions';

const LANG_BADGE: Record<string, string> = {
  css: 'CSS',
  ts: 'TS',
  tsx: 'TSX',
  vue: 'Vue',
  html: 'HTML',
  md: 'MD',
  json: 'JSON',
  js: 'JS',
};

export function CodePanel({ state }: { state: StudioState }) {
  const [framework, setFramework] = useState<Framework>('next');
  const [pm, setPm] = useState<PackageManager>('pnpm');
  const [copied, setCopied] = useState<string | null>(null);
  const [zipping, setZipping] = useState(false);

  const files = useMemo(
    () => generateFiles(state.config, framework, pm),
    [state.config, framework, pm],
  );
  const [selected, setSelected] = useState<string>(files[0]?.path ?? '');
  const current = files.find((f) => f.path === selected) ?? files[0];

  const copy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied((c) => (c === key ? null : c)), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  const shareLink = async () => {
    const url = `${location.origin}/studio?${stateToParams(state)}`;
    await copy(url, 'share');
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="border-outline-variant/60 flex flex-wrap items-center gap-3 border-b px-4 py-3">
        <div className="border-outline-variant flex overflow-hidden rounded-(--m3e-shape-button) border">
          {FRAMEWORKS.map((fw, i) => (
            <button
              key={fw}
              type="button"
              aria-pressed={fw === framework}
              onClick={() => {
                setFramework(fw);
                const next = generateFiles(state.config, fw, pm);
                setSelected(next[0]?.path ?? '');
              }}
              className={`m3e-press t-label-medium px-3 py-1.5 ${i > 0 ? 'border-outline-variant border-l' : ''} ${
                fw === framework
                  ? 'bg-secondary-container text-on-secondary-container'
                  : 'text-on-surface-variant hover:bg-on-surface/8'
              }`}
            >
              {FRAMEWORK_META[fw].label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <span className="t-label-small text-on-surface-variant mr-1">PM</span>
          {PACKAGE_MANAGERS.map((p) => (
            <button
              key={p}
              type="button"
              aria-pressed={p === pm}
              onClick={() => setPm(p)}
              className={`m3e-press t-label-medium rounded-(--m3e-shape-button) px-2.5 py-1 ${
                p === pm
                  ? 'bg-primary text-on-primary'
                  : 'text-on-surface-variant hover:bg-on-surface/8'
              }`}
            >
              {PM_LABELS[p]}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={shareLink}
            className="m3e-press t-label-medium text-on-surface-variant hover:bg-on-surface/8 flex items-center gap-1 rounded-(--m3e-shape-button) px-3 py-1.5"
          >
            <Icon name={copied === 'share' ? 'link' : 'link'} className="text-[18px]" />
            {copied === 'share' ? 'Copied!' : 'Share link'}
          </button>
          <button
            type="button"
            disabled={zipping}
            onClick={async () => {
              setZipping(true);
              try {
                await downloadProjectZip(files, `m3e-${framework}`);
              } finally {
                setZipping(false);
              }
            }}
            className="m3e-press bg-primary t-label-medium text-on-primary flex items-center gap-1 rounded-(--m3e-shape-button) px-3 py-1.5 hover:brightness-110 disabled:opacity-60"
          >
            <Icon name={zipping ? 'hourglass_top' : 'folder_zip'} className="text-[18px]" />
            {zipping ? 'Zipping…' : 'Download ZIP'}
          </button>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-[220px_1fr]">
        <nav className="thin-scroll border-outline-variant/60 bg-surface-container-low max-h-40 overflow-y-auto border-b p-2 md:max-h-none md:border-r md:border-b-0">
          {files.map((f) => (
            <button
              key={f.path}
              type="button"
              onClick={() => setSelected(f.path)}
              className={`m3e-press t-label-medium mb-1 flex w-full items-center gap-2 rounded-(--m3e-shape-extra-small) px-2.5 py-2 text-left ${
                f.path === current?.path
                  ? 'bg-secondary-container text-on-secondary-container'
                  : 'text-on-surface-variant hover:bg-on-surface/8'
              }`}
            >
              <span className="bg-on-surface/8 rounded px-1 font-mono text-[10px]">
                {LANG_BADGE[f.lang] ?? f.lang}
              </span>
              <span className="truncate">{f.path}</span>
            </button>
          ))}
        </nav>
        <div className="relative flex min-h-0 flex-col">
          <div className="border-outline-variant/60 flex items-center justify-between gap-2 border-b px-4 py-1.5">
            <span className="text-on-surface-variant truncate font-mono text-xs">
              {current?.path}
            </span>
            <button
              type="button"
              onClick={() => current && copy(current.content, `file:${current.path}`)}
              className="m3e-press t-label-medium text-on-surface-variant hover:bg-on-surface/8 flex items-center gap-1 rounded-(--m3e-shape-button) px-2 py-1"
            >
              <Icon
                name={copied === `file:${current?.path}` ? 'check' : 'content_copy'}
                className="text-[16px]"
              />
              {copied === `file:${current?.path}` ? 'Copied' : 'Copy'}
            </button>
          </div>
          <pre
            className="thin-scroll m3e-fade flex-1 overflow-auto p-4 font-mono text-[12.5px] leading-5.5"
            key={current?.path}
          >
            <code dangerouslySetInnerHTML={{ __html: highlight(current?.content ?? '') }} />
          </pre>
        </div>
      </div>
    </div>
  );
}
