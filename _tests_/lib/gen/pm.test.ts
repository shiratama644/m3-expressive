import { describe, expect, it } from 'vitest';
import { PACKAGE_MANAGERS, PM, PM_LABELS } from '@/lib/gen/pm';

describe('PM command templates', () => {
  it('exposes all four managers with display labels', () => {
    expect(PACKAGE_MANAGERS).toEqual(['bun', 'pnpm', 'npm', 'yarn']);
    expect(PM_LABELS).toEqual({ bun: 'Bun', pnpm: 'pnpm', npm: 'npm', yarn: 'Yarn' });
  });

  it('add / addDev join multiple deps', () => {
    expect(PM.bun.add(['a', 'b'])).toBe('bun add a b');
    expect(PM.pnpm.addDev(['x'])).toBe('pnpm add -D x');
    expect(PM.npm.add(['x'])).toBe('npm install x');
    expect(PM.yarn.addDev(['x', 'y'])).toBe('yarn add -D x y');
  });

  it('exec uses the per-PM runner, with and without args', () => {
    expect(PM.bun.exec('create-next-app')).toBe('bunx create-next-app');
    expect(PM.pnpm.exec('create-next-app', 'my-app')).toBe('pnpm dlx create-next-app my-app');
    expect(PM.npm.exec('create-next-app')).toBe('npx create-next-app');
    expect(PM.yarn.exec('some', '--flag')).toBe('yarn dlx some --flag');
    expect(PM.npm.exec('create-next-app', 'app --yes')).toBe('npx create-next-app app --yes');
    // args なし時に末尾スペースを残さない
    for (const pm of PACKAGE_MANAGERS) expect(PM[pm].exec('pkg')).toBe(PM[pm].exec('pkg').trim());
  });

  it('create / run / install shapes differ per PM (pnpm and yarn skip `run`)', () => {
    expect(PM.bun.run('dev')).toBe('bun run dev');
    expect(PM.pnpm.run('dev')).toBe('pnpm dev');
    expect(PM.npm.run('dev')).toBe('npm run dev');
    expect(PM.yarn.run('dev')).toBe('yarn dev');
    expect(PM.pnpm.create('next')).toBe('pnpm create next');
    expect(PM.bun.install()).toBe('bun install');
    expect(PM.pnpm.install()).toBe('pnpm install');
    expect(PM.npm.install()).toBe('npm install');
    expect(PM.npm.create('x')).toBe('npm create x');
    expect(PM.bun.create('n')).toBe('bun create n');
    expect(PM.yarn.install()).toBe('yarn install');
  });

  it('only pnpm needs a build-scripts approval step', () => {
    expect(PM.pnpm.approveBuilds?.()).toBe('pnpm approve-builds');
    expect(PM.bun.approveBuilds).toBeUndefined();
    expect(PM.npm.approveBuilds).toBeUndefined();
    expect(PM.yarn.approveBuilds).toBeUndefined();
  });
});
