import type { M3EVariant } from './color';
import type { MotionScheme } from './motion';
import type { ShapeEmphasis } from './shape';
import type { TypeFamily } from './typography';

/** One knob set that fully determines every token + export. */
export interface M3EConfig {
  /** seed / source color `#rrggbb` */
  seed: string;
  variant: M3EVariant;
  /** contrast level, -1 .. 1 (0 = standard, 0.5..1 = high). */
  contrast: number;
  /** which corner variant components resolve to */
  shapeEmphasis: ShapeEmphasis;
  /** playground knob: extra px added to every uniform corner (-8 .. 24) */
  cornerBoost: number;
  /** use asymmetric M3E shapes (large-top, extra-large-bottom, …) where the spec does */
  asymmetry: boolean;
  /** spring character */
  motionScheme: MotionScheme;
  /** emit spring-derived `linear()` easings instead of cubic-bezier tweens */
  useSprings: boolean;
  typeFamily: TypeFamily;
  /** 0.85 .. 1.15 multiplicative scale applied to the whole type scale */
  typeScale: number;
  opticalSize: 'auto' | 'off';
  /** CSS custom property / export naming */
  naming: 'm3e' | 'md-sys';
}

export const DEFAULT_CONFIG: M3EConfig = {
  seed: '#6750A4',
  variant: 'expressive',
  contrast: 0,
  shapeEmphasis: 'standard',
  cornerBoost: 0,
  asymmetry: true,
  motionScheme: 'expressive',
  useSprings: true,
  typeFamily: 'roboto-flex',
  typeScale: 1,
  opticalSize: 'auto',
  naming: 'm3e',
};

export function clampConfig(c: M3EConfig): M3EConfig {
  return {
    ...c,
    contrast: Math.min(1, Math.max(-1, c.contrast)),
    cornerBoost: Math.min(24, Math.max(-8, c.cornerBoost)),
    typeScale: Math.min(1.15, Math.max(0.85, c.typeScale)),
  };
}

export function prefixFor(naming: M3EConfig['naming']): string {
  return naming === 'md-sys' ? 'md-sys' : 'm3e';
}
