import {
  existsSync,
  mkdtempSync,
  readlinkSync,
  realpathSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  buildCachePaths,
  defaultCacheRoot,
  ensureDir,
  isPRootDistro,
  isTermux,
  linkNextCache,
  resolveBundler,
} from '../../scripts/buildEnv.ts';

describe('environment detection', () => {
  it('flags PRoot-Distro via uname marker only', () => {
    expect(isPRootDistro('Linux localhost 6.6.66 #1 SMP PRoot-Distro')).toBe(true);
    expect(isPRootDistro('Linux arena 6.8.0 #1 SMP x86_64')).toBe(false);
  });

  it('flags Termux via TERMUX_VERSION or com.termux PREFIX', () => {
    expect(isTermux({ TERMUX_VERSION: '0.118.1' })).toBe(true);
    expect(isTermux({ PREFIX: '/data/data/com.termux/files/usr' })).toBe(true);
    expect(isTermux({ PREFIX: '/usr/local' })).toBe(false);
    expect(isTermux({})).toBe(false);
  });
});

describe('resolveBundler', () => {
  const clean = { uname: 'Linux arena 6.8.0 x86_64', env: {} };

  it('defaults to turbopack off-mobile', () => {
    expect(resolveBundler(clean)).toBe('turbopack');
  });

  it('falls back to webpack on PRoot-Distro and Termux', () => {
    expect(resolveBundler({ ...clean, uname: 'Linux localhost 6.6 PRoot-Distro' })).toBe('webpack');
    expect(resolveBundler({ ...clean, env: { TERMUX_VERSION: '0.118' } })).toBe('webpack');
  });

  it('explicit flags/env override detection in both directions', () => {
    expect(resolveBundler({ uname: 'x PRoot-Distro', argv: ['--turbo'], env: {} })).toBe(
      'turbopack',
    );
    expect(resolveBundler({ ...clean, argv: ['--webpack'] })).toBe('webpack');
    expect(resolveBundler({ ...clean, env: { M3E_BUNDLER: 'webpack' } })).toBe('webpack');
    expect(resolveBundler({ uname: 'x PRoot-Distro', env: { M3E_BUNDLER: 'TURBOPACK' } })).toBe(
      'turbopack',
    );
  });
});

describe('cache paths', () => {
  it('uses M3E_CACHE_ROOT over the repo default', () => {
    const viaEnv = buildCachePaths('/repo', { M3E_CACHE_ROOT: '/mnt/fast/m3e' });
    expect(viaEnv.root).toBe('/mnt/fast/m3e');
    expect(viaEnv.webpackCache).toBe(join('/mnt/fast/m3e', 'next-cache', 'webpack'));
    expect(viaEnv.turbopackCache).toBe(join('/mnt/fast/m3e', 'next-cache', 'turbopack'));
    const fallback = buildCachePaths('/repo', {});
    expect(defaultCacheRoot('/repo', {})).toBe(join('/repo', '.cache', 'm3e-build'));
    expect(fallback.pnpmStore).toBe(join('/repo', '.cache', 'm3e-build', 'pnpm-store'));
  });

  it('respects an existing PNPM_STORE_DIR', () => {
    expect(buildCachePaths('/repo', { PNPM_STORE_DIR: '/store' }).pnpmStore).toBe('/store');
  });
});

describe('linkNextCache', () => {
  let cwd = '';
  let persist = '';

  beforeEach(() => {
    cwd = mkdtempSync(join(tmpdir(), 'm3e-link-'));
    persist = join(cwd, 'store', 'next-cache');
  });
  afterEach(() => rmSync(cwd, { recursive: true, force: true }));

  it('creates the persistent dir and symlinks .next/cache to it', () => {
    const linked = linkNextCache(cwd, persist);
    expect(existsSync(persist)).toBe(true);
    expect(readlinkSync(linked)).toBeTruthy();
    expect(realpathSync(linked)).toBe(realpathSync(persist));
    // 2 回目の呼び出しも幂等（同じリンクを返す）
    expect(linkNextCache(cwd, persist)).toBe(linked);
  });

  it('leaves an existing real cache directory untouched', () => {
    ensureDir(join(cwd, '.next', 'cache'));
    writeFileSync(join(cwd, '.next', 'cache', 'marker'), 'x');
    const out = linkNextCache(cwd, persist);
    expect(out).toBe(join(cwd, '.next', 'cache'));
    expect(statSync(out).isDirectory()).toBe(true);
    expect(existsSync(join(out, 'marker'))).toBe(true);
  });
});
