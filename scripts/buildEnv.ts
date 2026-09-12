/**
 * 環境判定（Termux / PRoot-Distro）とビルドキャッシュ経路の解決。
 *
 * shiratama644/DropMod の `scripts/buildEnv.ts`（実機 Termux で検証済み）を
 * このリポジトリのプレフィックス（M3E_*）に移植したもの。
 * 純関数群のみ — 副作用は呼出側（scripts/executer.ts）と tests が担う。
 */
import { execFileSync } from 'node:child_process';
import { existsSync, lstatSync, mkdirSync, symlinkSync } from 'node:fs';
import { join, relative } from 'node:path';

export type BundlerKind = 'webpack' | 'turbopack';

export const PROOT_DISTRO_MARKER = 'PRoot-Distro';

export function readUnameA(): string {
  try {
    return execFileSync('uname', ['-a'], { encoding: 'utf8' }).trim();
  } catch {
    return '';
  }
}

export function isPRootDistro(uname: string): boolean {
  return uname.includes(PROOT_DISTRO_MARKER);
}

/**
 * Termux は uname -a だけでは判別できない機種があるため、
 * PREFIX (.../com.termux/files/usr) か TERMUX_VERSION の有無で判定する。
 */
export function isTermux(env: Record<string, string | undefined> = {}): boolean {
  if (env.TERMUX_VERSION) return true;
  const prefix = env.PREFIX ?? '';
  return prefix.includes('com.termux');
}

export interface ResolveBundlerInput {
  uname?: string;
  argv?: readonly string[];
  env?: Record<string, string | undefined>;
}

/**
 * PRoot-Distro または Termux では Turbopack が使えない（もしくは不安定な）ため Webpack。
 * それ以外は Turbopack（Next 16 のデフォルト、filesystem cache 有効）。
 * `--webpack` / `--turbo` と M3E_BUNDLER で環境判定より優先して上書きできる。
 */
export function resolveBundler(input: ResolveBundlerInput = {}): BundlerKind {
  const argv = input.argv ?? [];
  const env = input.env ?? process.env;
  const forced = (env.M3E_BUNDLER ?? '').toLowerCase();
  if (argv.includes('--webpack') || forced === 'webpack') return 'webpack';
  if (argv.includes('--turbo') || argv.includes('--turbopack') || forced === 'turbopack') {
    return 'turbopack';
  }
  const uname = input.uname ?? readUnameA();
  return isPRootDistro(uname) || isTermux(env) ? 'webpack' : 'turbopack';
}

/**
 * env を明示的に渡した場合はその値だけを使う（process.env にフォールバックしない）。
 * これによりテストが実行環境の実際の環境変数に左右されなくなる。
 */
export function defaultCacheRoot(cwd: string, env?: Record<string, string | undefined>): string {
  const source = env ?? process.env;
  const fromEnv = source.M3E_CACHE_ROOT;
  return fromEnv?.trim() || join(cwd, '.cache', 'm3e-build');
}

export interface BuildCachePaths {
  root: string;
  nextCache: string;
  webpackCache: string;
  turbopackCache: string;
  pnpmStore: string;
}

export function buildCachePaths(
  cwd: string,
  env?: Record<string, string | undefined>,
): BuildCachePaths {
  const source = env ?? process.env;
  const root = defaultCacheRoot(cwd, source);
  return {
    root,
    nextCache: join(root, 'next-cache'),
    webpackCache: join(root, 'next-cache', 'webpack'),
    turbopackCache: join(root, 'next-cache', 'turbopack'),
    pnpmStore: source.PNPM_STORE_DIR?.trim() || join(root, 'pnpm-store'),
  };
}

/** `.next/cache` を永続ディレクトリへつなぐ（2 回目以降の build を速くする） */
export function linkNextCache(cwd: string, persistentNextCache: string): string {
  mkdirSync(persistentNextCache, { recursive: true });
  const nextDir = join(cwd, '.next');
  const nextCache = join(nextDir, 'cache');
  mkdirSync(nextDir, { recursive: true });

  if (!existsSync(nextCache)) {
    symlinkSync(relative(nextDir, persistentNextCache) || persistentNextCache, nextCache);
    return nextCache;
  }

  try {
    if (lstatSync(nextCache).isSymbolicLink()) return nextCache;
  } catch {
    /* fall through */
  }

  // 既存の実ディレクトリは触らない（Next が既に書いている）
  return nextCache;
}

export function ensureDir(path: string): void {
  mkdirSync(path, { recursive: true });
}
