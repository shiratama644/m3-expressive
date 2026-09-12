import {
  banner,
  generateReadme,
  generateThemeTs,
  generateTokensCss,
  generateTokensJsonFile,
  type GenContext,
  type GenFile,
} from './common';

export function reactFiles(ctx: GenContext): GenFile[] {
  const tokens = generateTokensCss(ctx, { withTailwind: true });

  const app = `${banner(ctx, 'App — M3E demo')}
import { Button } from './components/Button';
import { useM3eMode } from './theme';

export default function App() {
  const { dark, toggle } = useM3eMode();
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-background p-6 text-on-background">
      <section className="w-full max-w-md rounded-card bg-surface-container p-6">
        <p className="t-label-large text-primary">Material 3 Expressive</p>
        <h1 className="t-display-small">Hello, tones.</h1>
        <p className="t-body-medium mt-2 text-on-surface-variant">
          One seed color → a full expressive theme. Shape, motion and type are tokens, not code.
        </p>
        <div className="mt-6 flex items-center gap-3">
          <Button onClick={toggle}>{dark ? 'Light mode' : 'Dark mode'}</Button>
        </div>
      </section>
    </main>
  );
}
`;

  const button = `import type { CSSProperties, ReactNode } from 'react';

export function Button({ children, onClick, style }: { children: ReactNode; onClick?: () => void; style?: CSSProperties }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={style}
      className={
        'm3e-press inline-flex h-10 items-center gap-2 rounded-button bg-primary px-6 ' +
        'text-label-large text-on-primary active:scale-[0.95] active:rounded-medium'
      }
    >
      {children}
    </button>
  );
}
`;

  const hook = `// theme.ts already exports setM3eMode / getStoredM3eMode — this hook wires them up.
import { useEffect, useState } from 'react';
import { getStoredM3eMode, setM3eMode } from './theme';

export function useM3eMode() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const initial = getStoredM3eMode() === 'dark';
    setDark(initial);
    setM3eMode(initial ? 'dark' : 'light');
  }, []);
  const toggle = () =>
    setDark((d) => {
      const next = d ? 'light' : 'dark';
      setM3eMode(next);
      return !d;
    });
  return { dark, toggle };
}
`;

  const main = `import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './theme.css';
import '@fontsource-variable/material-symbols-rounded/full.css';
import { setM3eMode, getStoredM3eMode } from './theme';

setM3eMode(getStoredM3eMode()); // apply persisted mode before first paint

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
`;

  return [
    { path: 'src/theme.css', lang: 'css', content: tokens },
    { path: 'src/main.tsx', lang: 'tsx', content: main },
    { path: 'src/App.tsx', lang: 'tsx', content: app },
    { path: 'src/components/Button.tsx', lang: 'tsx', content: button },
    { path: 'src/useM3eMode.ts', lang: 'ts', content: hook },
    generateThemeTs(ctx, 'src/theme.ts'),
    generateTokensJsonFile(ctx),
    generateReadme(ctx, {
      framework: 'React (Vite) + Tailwind v4',
      steps: [
        'Scaffold: `npm create vite@latest my-app -- --template react-ts` (swap for bunx/pnpm/yarn per table)',
        '`npm install tailwindcss @tailwindcss/vite` — add the tailwind vite plugin to `vite.config.ts`',
        'Replace `src/index.css` with the generated `src/theme.css` (imported from `main.tsx`)',
        'Copy App.tsx / Button / theme.ts / useM3eMode.ts and run `npm run dev`',
      ],
      files: [
        { path: 'src/theme.css', purpose: 'Tailwind entry + all M3E tokens' },
        { path: 'src/theme.ts', purpose: 'mode helpers + raw vars' },
        { path: 'src/useM3eMode.ts', purpose: 'React hook for light/dark' },
        { path: 'src/components/Button.tsx', purpose: 'expressive button reference' },
        { path: 'tokens.json', purpose: 'W3C DTCG tokens' },
      ],
    }),
  ];
}
