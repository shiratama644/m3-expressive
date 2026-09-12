'use client';

import { useMemo, useState } from 'react';
import { DEFAULT_CONFIG } from '@/lib/m3e/config';
import { FRAMEWORKS, FRAMEWORK_META, generateFiles, fontDeps, type Framework } from '@/lib/gen';
import { PACKAGE_MANAGERS, PM, PM_LABELS, type PackageManager } from '@/lib/gen/pm';
import { highlight } from '@/lib/gen/highlight';

export function SetupExplorer() {
  const [framework, setFramework] = useState<Framework>('next');
  const [pm, setPm] = useState<PackageManager>('pnpm');
  const [copied, setCopied] = useState<string | null>(null);

  const files = useMemo(() => generateFiles(DEFAULT_CONFIG, framework, pm), [framework, pm]);
  const readme = files.find((f) => f.path === 'README.md');
  const scaffoldCmd =
    framework === 'next'
      ? PM[pm].exec('create-next-app@latest', 'my-app')
      : PM[pm].create('vite my-app');

  const copy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied((c) => (c === key ? null : c)), 1500);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="bg-surface-container-low flex flex-col gap-6 rounded-(--m3e-shape-extra-large) p-5 sm:p-6">
      {/* framework selector */}
      <div className="flex flex-wrap gap-1.5">
        {FRAMEWORKS.map((fw) => (
          <button
            key={fw}
            type="button"
            aria-pressed={fw === framework}
            onClick={() => setFramework(fw)}
            className={`m3e-press t-label-large flex items-center gap-2 rounded-(--m3e-shape-button) px-4 py-2 ${
              fw === framework
                ? 'bg-primary text-on-primary'
                : 'border-outline-variant text-on-surface-variant hover:bg-on-surface/8 border'
            }`}
          >
            {FRAMEWORK_META[fw].label}
            <span
              className={`t-label-small ${fw === framework ? 'text-on-primary/70' : 'text-on-surface-variant'}`}
            >
              {FRAMEWORK_META[fw].tagline}
            </span>
          </button>
        ))}
      </div>

      {/* PM selector */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="t-label-large text-on-surface-variant">Package manager:</span>
        <div className="border-outline-variant flex overflow-hidden rounded-(--m3e-shape-button) border">
          {PACKAGE_MANAGERS.map((p, i) => (
            <button
              key={p}
              type="button"
              aria-pressed={p === pm}
              onClick={() => setPm(p)}
              className={`m3e-press t-label-medium px-3 py-1.5 ${i > 0 ? 'border-outline-variant border-l' : ''} ${
                p === pm
                  ? 'bg-secondary-container text-on-secondary-container'
                  : 'text-on-surface-variant hover:bg-on-surface/8'
              }`}
            >
              {PM_LABELS[p]}
            </button>
          ))}
        </div>
      </div>

      {/* command ladder */}
      <div className="flex flex-col gap-2">
        {[
          ['1 · プロジェクト作成', scaffoldCmd],
          [
            '2 · Tailwind + フォント導入',
            PM[pm].add([
              'tailwindcss',
              '@tailwindcss/vite',
              ...fontDeps(DEFAULT_CONFIG.typeFamily).runtime,
            ]),
          ],
          ['3 · 開発サーバー', PM[pm].run('dev')],
          ['4 · 本番ビルド', PM[pm].run('build')],
        ].map(([label, cmd]) => (
          <div key={cmd} className="flex flex-col gap-1 sm:flex-row sm:items-center">
            <span className="t-label-medium text-on-surface-variant w-44 shrink-0">{label}</span>
            <code className="bg-surface-container-highest text-on-surface flex min-w-0 flex-1 items-center justify-between gap-2 rounded-(--m3e-shape-extra-small) px-3 py-2 font-mono text-[13px]">
              <span className="truncate">$ {cmd}</span>
              <button
                type="button"
                onClick={() => copy(cmd, cmd)}
                className="text-on-surface-variant hover:text-primary shrink-0"
                aria-label={`Copy: ${cmd}`}
              >
                <span className="material-symbols-rounded block text-[18px]">
                  {copied === cmd ? 'check' : 'content_copy'}
                </span>
              </button>
            </code>
          </div>
        ))}
      </div>

      {/* generated files */}
      <div>
        <p className="t-title-medium text-on-surface mb-2">
          生成されるファイル（ZIP に含まれる一式）
        </p>
        <div className="grid gap-1.5 sm:grid-cols-2">
          {files.map((f) => (
            <div
              key={f.path}
              className="bg-surface-container flex items-center gap-2 rounded-(--m3e-shape-small) px-3 py-1.5"
            >
              <span className="material-symbols-rounded text-primary text-[18px]">
                {f.lang === 'json'
                  ? 'data_object'
                  : f.lang === 'md'
                    ? 'description'
                    : f.lang === 'css'
                      ? 'palette'
                      : 'code'}
              </span>
              <code className="t-label-medium text-on-surface truncate font-mono">{f.path}</code>
              <span className="text-on-surface-variant ml-auto text-[10px]">
                {Math.round(f.content.length / 102.4) / 10} KB
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* README preview */}
      {readme && (
        <details className="group bg-surface-container rounded-(--m3e-shape-large)" open>
          <summary className="t-title-medium text-on-surface flex cursor-pointer items-center gap-2 p-4 select-none">
            <span className="material-symbols-rounded text-[18px] transition-transform group-open:rotate-90">
              chevron_right
            </span>
            README.md（この内容がそのまま ZIP に入ります）
          </summary>
          <pre className="thin-scroll border-outline-variant/50 max-h-105 overflow-auto border-t p-4 font-mono text-[12px] leading-5">
            <code dangerouslySetInnerHTML={{ __html: highlight(readme.content) }} />
          </pre>
        </details>
      )}
    </div>
  );
}
