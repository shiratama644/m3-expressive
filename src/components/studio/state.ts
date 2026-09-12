import { M3E_VARIANTS, type M3EVariant } from '@/lib/m3e/color';
import { DEFAULT_CONFIG, type M3EConfig } from '@/lib/m3e/config';
import { M3E_FAMILIES, type StudioFamily } from './families';

export interface StudioState {
  config: M3EConfig;
  mode: 'light' | 'dark';
}

export type StudioPatch = Partial<M3EConfig> & { mode?: 'light' | 'dark' };

export const DEFAULT_STATE: StudioState = { config: { ...DEFAULT_CONFIG }, mode: 'light' };

/** Compact URL param mapping (defaults are omitted). Pure + total. */
const KEYS = {
  seed: 's',
  variant: 'v',
  contrast: 'c',
  shapeEmphasis: 'e',
  cornerBoost: 'b',
  asymmetry: 'a',
  motionScheme: 'm',
  useSprings: 'p',
  typeFamily: 'f',
  typeScale: 't',
  opticalSize: 'o',
  naming: 'n',
  mode: 'd',
} as const;

export function stateToParams(state: StudioState): string {
  const { config, mode } = state;
  const sp = new URLSearchParams();
  const set = (
    key: keyof typeof KEYS,
    value: string | number | boolean,
    dflt: string | number | boolean,
  ) => {
    if (value !== dflt) sp.set(KEYS[key], String(value));
  };
  set(
    'seed',
    config.seed.replace('#', '').toLowerCase(),
    DEFAULT_CONFIG.seed.replace('#', '').toLowerCase(),
  );
  set('variant', config.variant, DEFAULT_CONFIG.variant);
  set('contrast', config.contrast, DEFAULT_CONFIG.contrast);
  set('shapeEmphasis', config.shapeEmphasis, DEFAULT_CONFIG.shapeEmphasis);
  set('cornerBoost', config.cornerBoost, DEFAULT_CONFIG.cornerBoost);
  set('asymmetry', config.asymmetry, DEFAULT_CONFIG.asymmetry);
  set('motionScheme', config.motionScheme, DEFAULT_CONFIG.motionScheme);
  set('useSprings', config.useSprings, DEFAULT_CONFIG.useSprings);
  set('typeFamily', config.typeFamily, DEFAULT_CONFIG.typeFamily);
  set('typeScale', config.typeScale, DEFAULT_CONFIG.typeScale);
  set('opticalSize', config.opticalSize, DEFAULT_CONFIG.opticalSize);
  set('naming', config.naming, DEFAULT_CONFIG.naming);
  set('mode', mode, DEFAULT_STATE.mode);
  return sp.toString();
}

export function paramsToState(search: string): StudioState {
  const sp = new URLSearchParams(search);
  const config: M3EConfig = { ...DEFAULT_CONFIG };
  const mode = sp.get(KEYS.mode) === 'dark' ? 'dark' : 'light';
  const get = (k: keyof typeof KEYS) => sp.get(KEYS[k]);

  const seed = get('seed');
  if (seed && /^#?[0-9a-fA-F]{6}$/.test(seed))
    config.seed = seed.startsWith('#') ? seed : `#${seed}`;
  const variant = get('variant');
  if (variant && (M3E_VARIANTS as readonly string[]).includes(variant))
    config.variant = variant as M3EVariant;
  const num = (v: string | null): number | undefined => {
    if (v === null) return undefined;
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
  };
  const contrast = num(get('contrast'));
  if (contrast !== undefined) config.contrast = contrast;
  const emph = get('shapeEmphasis');
  if (emph === 'increased' || emph === 'standard') config.shapeEmphasis = emph;
  const boost = num(get('cornerBoost'));
  if (boost !== undefined) config.cornerBoost = boost;
  const asym = get('asymmetry');
  if (asym !== null) config.asymmetry = asym === 'true';
  const motion = get('motionScheme');
  if (motion === 'expressive' || motion === 'standard') config.motionScheme = motion;
  const springs = get('useSprings');
  if (springs !== null) config.useSprings = springs === 'true';
  const family = get('typeFamily');
  if (family && (M3E_FAMILIES as readonly string[]).includes(family))
    config.typeFamily = family as StudioFamily;
  const scale = num(get('typeScale'));
  if (scale !== undefined) config.typeScale = scale;
  const opsz = get('opticalSize');
  if (opsz === 'auto' || opsz === 'off') config.opticalSize = opsz;
  const naming = get('naming');
  if (naming === 'm3e' || naming === 'md-sys') config.naming = naming;

  return { config, mode };
}

/** A handful of pleasant seed colors for one-click starts. */
export const SEED_PRESETS: { name: string; hex: string }[] = [
  { name: 'Purple 40 (M3 baseline)', hex: '#6750A4' },
  { name: 'Sunset', hex: '#B3261E' },
  { name: 'Tangerine', hex: '#E8710A' },
  { name: 'Citrus', hex: '#8C6D1F' },
  { name: 'Moss', hex: '#386A21' },
  { name: 'Lagoon', hex: '#00696E' },
  { name: 'Sea', hex: '#0061A4' },
  { name: 'Iris', hex: '#4F5BD8' },
  { name: 'Fuchsia', hex: '#984061' },
  { name: 'Graphite', hex: '#49454F' },
];
