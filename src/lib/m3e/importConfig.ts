import { DEFAULT_CONFIG, clampConfig, type M3EConfig } from './config';
import { M3E_VARIANTS, type M3EVariant } from './color';
import type { MotionScheme } from './motion';
import type { TypeFamily } from './typography';
import type { ShapeEmphasis } from './shape';

/**
 * Parse a Studio **tokens.json** (exported by this site) or a Studio share
 * link back into a config. Anything unrecognized falls back to the default
 * with a note — never throws on malformed input.
 */

export type ImportResult =
  | { kind: 'state'; config: M3EConfig; notes: string[] }
  | { kind: 'link'; search: string; notes: string[] }
  | { kind: 'error'; message: string };

const HEX = /^#?[0-9a-fA-F]{6}$/;
const isVariant = (v: unknown): v is M3EVariant =>
  typeof v === 'string' && (M3E_VARIANTS as readonly string[]).includes(v);

export function parseStudioInput(text: string): ImportResult {
  const raw = text.trim();
  if (!raw) return { kind: 'error', message: '貼り付け欄が空です。' };

  // share link or bare query string → delegate to the URL decoder
  if (raw.includes('/studio?') || /^[a-z]{1,2}=/.test(raw)) {
    const q = raw.includes('?') ? raw.slice(raw.indexOf('?') + 1).split('#')[0] : raw;
    return { kind: 'link', search: q, notes: ['共有リンクのクエリを復号しました。'] };
  }

  let obj: unknown;
  try {
    obj = JSON.parse(raw);
  } catch {
    return {
      kind: 'error',
      message:
        'JSON として解析できませんでした（tokens.json または Studio リンクを貼ってください）。',
    };
  }
  if (typeof obj !== 'object' || obj === null)
    return { kind: 'error', message: 'JSON のルートがオブジェクトではありません。' };

  const notes: string[] = [];
  const config: M3EConfig = { ...DEFAULT_CONFIG };
  const meta = (obj as { $extensions?: Record<string, Record<string, unknown> | undefined> })
    .$extensions?.['io.material.studio'];
  const used: Partial<Record<keyof M3EConfig, unknown>> = meta ?? {};

  const seed = used.seed;
  if (typeof seed === 'string' && HEX.test(seed))
    config.seed = seed.startsWith('#') ? seed : `#${seed}`;
  else {
    // fallback: approximate the seed from the exported primary color
    const primary = (obj as { color?: { light?: { primary?: { $value?: unknown } } } }).color?.light
      ?.primary?.$value;
    if (typeof primary === 'string' && HEX.test(primary)) {
      config.seed = primary.startsWith('#') ? primary : `#${primary}`;
      notes.push('メタ情報がないため、color.light.primary をシードの近似として使用しました。');
    } else {
      return {
        kind: 'error',
        message:
          'M3E Studio の tokens.json ではありません（seed / color.light.primary が見つかりません）。',
      };
    }
  }

  if (isVariant(used.variant)) config.variant = used.variant;
  else if (used.variant !== undefined)
    notes.push(`variant "${String(used.variant)}" は不明なので既定値を使用。`);

  const num = (v: unknown): number | undefined =>
    typeof v === 'number' && Number.isFinite(v) ? v : undefined;
  const c = num(used.contrast);
  if (c !== undefined) config.contrast = c;
  const e = num(used.cornerBoost);
  if (e !== undefined) config.cornerBoost = e;
  const t = num(used.typeScale);
  if (t !== undefined) config.typeScale = t;

  if (used.shapeEmphasis === 'standard' || used.shapeEmphasis === 'increased')
    config.shapeEmphasis = used.shapeEmphasis as ShapeEmphasis;
  if (used.motionScheme === 'expressive' || used.motionScheme === 'standard')
    config.motionScheme = used.motionScheme as MotionScheme;
  if (
    used.typeFamily === 'roboto-flex' ||
    used.typeFamily === 'roboto' ||
    used.typeFamily === 'system'
  )
    config.typeFamily = used.typeFamily as TypeFamily;
  if (typeof used.asymmetry === 'boolean') config.asymmetry = used.asymmetry;
  if (typeof used.useSprings === 'boolean') config.useSprings = used.useSprings;
  if (used.opticalSize === 'auto' || used.opticalSize === 'off')
    config.opticalSize = used.opticalSize;
  if (used.naming === 'm3e' || used.naming === 'md-sys') config.naming = used.naming;

  if (!meta) notes.push('シェイプ・モーション等のメタがないため、色以外は既定設定です。');
  return { kind: 'state', config: clampConfig(config), notes };
}
