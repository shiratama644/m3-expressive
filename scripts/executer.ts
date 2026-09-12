#!/usr/bin/env node
/**
 * M3E executer — 環境を見て bundler を切り替え、キャッシュをバンドラ別に永続化して
 * build / dev / start を実行する単一エントリ。
 *
 *   node scripts/executer.ts <build|dev|start|info> [next への追加引数...]
 *
 * - PRoot-Distro（`uname -a` に "PRoot-Distro"）または Termux
 *     → `next build --webpack`（Turbopack は使えない／不安定なため）
 * - それ以外 → Turbopack（Next 16 デフォルト + experimental の filesystem cache）
 * - `.next/cache` を M3E_CACHE_ROOT（デフォルト `.cache/m3e-build/`）へ
 *   シンボリックリンクし、webpack / turbopack のストアを分けて保持する。
 * - 上書き: `M3E_BUNDLER=webpack|turbopack`、または `pnpm build -- --webpack|--turbo`
 * - `start` は現ビルド成果物をそのまま起動するだけ（bundler 切替なし）。
 *
 * Node 24 のネイティブ type stripping で直接実行する（package.json の
 * dev/build/start スクリプトがここを経由する）。Bun 等からも `node` 経由で動く。
 */
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  type BundlerKind,
  buildCachePaths,
  ensureDir,
  linkNextCache,
  readUnameA,
  resolveBundler,
} from './buildEnv.ts';

export const COMMANDS = ['build', 'dev', 'start', 'info'] as const;
export type Command = (typeof COMMANDS)[number];

const BUNDLER_FLAGS = ['--webpack', '--turbo', '--turbopack'];

/** executer が消費する bundler フラグを next へ渡さないように除く（純関数・テスト対象） */
export function stripBundlerFlags(argv: readonly string[]): string[] {
  return argv.filter((a) => !BUNDLER_FLAGS.includes(a));
}

/** next CLI へ渡す引数を組み立てる（純関数・テスト対象） */
export function buildNextArgs(
  command: Command,
  bundler: BundlerKind,
  argv: readonly string[],
): string[] {
  const passthrough = stripBundlerFlags(argv);
  if (command === 'start') return ['start', ...passthrough];
  const bundlerFlag = command !== 'info' && bundler === 'webpack' ? ['--webpack'] : [];
  return [command, ...bundlerFlag, ...passthrough];
}

function usage(): number {
  console.error(
    '[M3E executer] usage: node scripts/executer.ts <build|dev|start|info> [next args...]',
  );
  return 2;
}

function main(): number {
  const cwd = process.cwd();
  const argv = process.argv.slice(2);
  const command = (argv[0] ?? 'build') as Command;
  if (!COMMANDS.includes(command)) return usage();

  const uname = readUnameA();
  const bundler = resolveBundler({ uname, argv, env: process.env });
  const caches = buildCachePaths(cwd, process.env);

  const banner = {
    uname: uname || '(unavailable)',
    bundler,
    cacheRoot: caches.root,
    persist: caches.nextCache,
    webpackCache: caches.webpackCache,
    turbopackCache: caches.turbopackCache,
    pnpmStore: caches.pnpmStore,
    nextArgs: buildNextArgs(command, bundler, argv.slice(1)),
  };
  if (command === 'info') {
    console.log(JSON.stringify(banner, null, 2));
    return 0;
  }

  if (command === 'build' || command === 'dev') {
    ensureDir(caches.root);
    ensureDir(caches.nextCache);
    ensureDir(caches.webpackCache);
    ensureDir(caches.turbopackCache);
    ensureDir(caches.pnpmStore);
    linkNextCache(cwd, caches.nextCache);
  }

  const nextBin = join(cwd, 'node_modules', 'next', 'dist', 'bin', 'next');
  if (!existsSync(nextBin)) {
    console.error('[M3E executer] next is not installed. Run `pnpm install` first.');
    return 1;
  }

  console.log(
    `[M3E executer] ${command}: bundler=${bundler} (${bundler === 'webpack' ? '--webpack' : 'turbopack, fs-cache'}) cache=${caches.root}`,
  );

  const env: NodeJS.ProcessEnv = {
    ...process.env,
    PNPM_STORE_DIR: process.env.PNPM_STORE_DIR?.trim() || caches.pnpmStore,
  };
  const result = spawnSync(process.execPath, [nextBin, ...banner.nextArgs], {
    cwd,
    env,
    stdio: 'inherit',
  });
  return result.status === null ? 1 : result.status;
}

// `vitest` などからの import 時は実行しない（このファイル自身が起動された時のみ main）
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exit(main());
}
