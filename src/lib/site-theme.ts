import { DEFAULT_CONFIG } from '@/lib/m3e/config';
import { buildTheme, renderThemeCss } from '@/lib/m3e/css';

/**
 * The site's own chrome theme — computed from the M3E engine with the default
 * config (Expressive baseline purple), rendered as a CSS string at build time.
 * Keeping it in the engine means the site always demonstrates exactly what
 * the generator outputs.
 */
export function getSiteThemeCss(): string {
  const bundle = buildTheme({ ...DEFAULT_CONFIG, naming: 'm3e' });
  return renderThemeCss(bundle, { darkMode: 'media' });
}
