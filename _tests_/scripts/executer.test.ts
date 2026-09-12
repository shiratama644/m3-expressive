import { describe, expect, it } from 'vitest';
import { buildNextArgs, stripBundlerFlags } from '../../scripts/executer.ts';

describe('executer argv shaping', () => {
  it('strips bundler flags from passthrough args', () => {
    expect(stripBundlerFlags(['--webpack', 'extra', '--turbo', '--turbopack'])).toEqual(['extra']);
  });

  it('adds --webpack only for webpack bundler on build/dev', () => {
    expect(buildNextArgs('build', 'webpack', [])).toEqual(['build', '--webpack']);
    expect(buildNextArgs('dev', 'webpack', ['-H', '0.0.0.0'])).toEqual([
      'dev',
      '--webpack',
      '-H',
      '0.0.0.0',
    ]);
    expect(buildNextArgs('build', 'turbopack', [])).toEqual(['build']);
  });

  it('consumes explicit flags instead of forwarding them twice', () => {
    expect(buildNextArgs('build', 'webpack', ['--webpack'])).toEqual(['build', '--webpack']);
    expect(buildNextArgs('build', 'turbopack', ['--turbo'])).toEqual(['build']);
  });

  it('start never carries a bundler flag', () => {
    expect(buildNextArgs('start', 'webpack', ['-p', '3100'])).toEqual(['start', '-p', '3100']);
  });
});
