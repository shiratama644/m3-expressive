import { describe, expect, it } from 'vitest';
import { DEFAULT_CONFIG } from '@/lib/m3e/config';
import { FRAMEWORKS, generateFiles } from '@/lib/gen';
import { PACKAGE_MANAGERS, PM, PM_LABELS } from '@/lib/gen/pm';

const ALL_COMBOS = FRAMEWORKS.flatMap((f) => PACKAGE_MANAGERS.map((pm) => [f, pm] as const));

describe('generateFiles', () => {
  it('produces files for all 4 frameworks × 4 package managers (16 combos)', () => {
    expect(ALL_COMBOS).toHaveLength(16);
    for (const [framework, pm] of ALL_COMBOS) {
      const files = generateFiles(DEFAULT_CONFIG, framework, pm);
      expect(files.length, `${framework}/${pm}`).toBeGreaterThanOrEqual(5);
      for (const file of files) {
        expect(file.path, `${framework}/${pm} path`).toMatch(/^[A-Za-z0-9_\-./]+$/);
        expect(file.content.length, `${framework}/${pm}/${file.path} is empty`).toBeGreaterThan(20);
        expect(file.content, `${file.path} has unresolved value`).not.toContain('undefined');
        expect(file.content, `${file.path} has NaN`).not.toContain('NaN');
      }
    }
  });

  it('every README mentions all four package managers', () => {
    for (const framework of FRAMEWORKS) {
      const files = generateFiles(DEFAULT_CONFIG, framework, 'bun');
      const readme = files.find((f) => f.path === 'README.md');
      expect(readme, framework).toBeTruthy();
      for (const pm of PACKAGE_MANAGERS) {
        expect(readme!.content, `${framework} missing ${pm}`).toContain(
          PM_LABELS[pm].toLowerCase(),
        );
      }
      expect(readme!.content).toContain('bun add');
      expect(readme!.content).toContain('pnpm add');
      expect(readme!.content).toContain('npm install');
      expect(readme!.content).toContain('yarn add');
    }
  });

  it('tokens css carries the engine vars + tailwind theme mapping', () => {
    const files = generateFiles(DEFAULT_CONFIG, 'next', 'pnpm');
    const css = files.find((f) => f.path.endsWith('globals.css'))!;
    expect(css.content).toContain('@import "tailwindcss";'.replace(/"/g, "'"));
    expect(css.content).toContain('@theme inline {');
    expect(css.content).toContain('--color-primary: var(--m3e-color-primary);');
    expect(css.content).toContain('--radius-button:');
    expect(css.content).toContain('--text-title-large:');
    expect(css.content).toContain(':root {');
    expect(css.content).toContain('.dark, [data-m3e-theme="dark"]');
    expect(css.content).toContain('@media (prefers-reduced-motion: reduce)');
  });

  it('tokens.json is embedded in every framework', () => {
    for (const framework of FRAMEWORKS) {
      const files = generateFiles(DEFAULT_CONFIG, framework, 'npm');
      const json = files.find((f) => f.path === 'tokens.json');
      expect(() => JSON.parse(json!.content), framework).not.toThrow();
    }
  });

  it('respects md-sys naming and dark mode class strategy', () => {
    const files = generateFiles({ ...DEFAULT_CONFIG, naming: 'md-sys' }, 'tailwind', 'yarn');
    const css = files.find((f) => f.lang === 'css')!;
    expect(css.content).toContain('--md-sys-color-primary');
    const configTs = files.find((f) => f.path === 'tailwind.config.ts')!;
    expect(configTs.content).toContain("'var(--md-sys-color-primary)'");
  });

  it('v3 config covers all color roles', () => {
    const files = generateFiles(DEFAULT_CONFIG, 'tailwind', 'bun');
    const configTs = files.find((f) => f.path === 'tailwind.config.ts')!;
    expect(configTs.content).toContain(
      "'on-primary-fixed-variant': 'var(--m3e-color-on-primary-fixed-variant)'",
    );
    expect(configTs.content).toContain("'extra-large-increased'");
  });

  it('PM command templates are shell-plausible', () => {
    expect(PM.bun.add(['a', 'b'])).toBe('bun add a b');
    expect(PM.pnpm.addDev(['x'])).toBe('pnpm add -D x');
    expect(PM.npm.run('build')).toBe('npm run build');
    expect(PM.yarn.create('vite my-app -- --template vue-ts')).toBe(
      'yarn create vite my-app -- --template vue-ts',
    );
    expect(PM.pnpm.exec('tailwindcss', '-v')).toBe('pnpm dlx tailwindcss -v');
    expect(PM.bun.install()).toBe('bun install');
  });
});
