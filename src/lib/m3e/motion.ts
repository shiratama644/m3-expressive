/**
 * M3E motion tokens.
 * Source of truth:
 *  - androidx.compose.material3.tokens.MotionTokens (v0_103)  → durations + easings
 *  - androidx.compose.material3.tokens.ExpressiveMotionTokens / StandardMotionTokens (v0_14_0) → springs
 * Springs are converted to CSS `linear()` easings (sampled) so the expressive
 * bounce works without JS in generated artifacts.
 */

/** Durations in ms — exact spec values. */
export const MOTION_DURATIONS = {
  none: 0,
  'very-short1': 20,
  'very-short2': 25,
  'very-short3': 35,
  'very-short4': 50,
  short1: 50,
  short2: 100,
  short3: 150,
  short4: 200,
  medium1: 250,
  medium2: 300,
  medium3: 350,
  medium4: 400,
  long1: 450,
  long2: 500,
  long3: 550,
  long4: 600,
  'extra-long1': 700,
  'extra-long2': 800,
  'extra-long3': 900,
  'extra-long4': 1000,
} as const;

export type MotionDurationName = keyof typeof MOTION_DURATIONS;

/** Easing curves — cubic-bezier parameters, exact spec values. */
export const MOTION_EASINGS = {
  standard: [0.2, 0, 0, 1],
  'standard-decelerate': [0, 0, 0, 1],
  'standard-accelerate': [0.3, 0, 1, 1],
  emphasized: [0.2, 0, 0, 1],
  'emphasized-decelerate': [0.05, 0.7, 0.1, 1],
  'emphasized-accelerate': [0.3, 0, 0.8, 0.15],
  linear: [0, 0, 1, 1],
  legacy: [0.4, 0, 0.2, 1],
  'legacy-decelerate': [0, 0, 0.2, 1],
  'legacy-accelerate': [0.4, 0, 1, 1],
} as const satisfies Record<string, readonly [number, number, number, number]>;

export type MotionEasingName = keyof typeof MOTION_EASINGS;

export function cubicBezierCss(name: MotionEasingName): string {
  const [a, b, c, d] = MOTION_EASINGS[name];
  return `cubic-bezier(${a}, ${b}, ${c}, ${d})`;
}

/** Spring specs: stiffness (dp/s^2-like) & dampingRatio, mass = 1. */
export const MOTION_SPRINGS = {
  expressive: {
    'fast-spatial': { stiffness: 800, damping: 0.6 },
    'default-spatial': { stiffness: 380, damping: 0.8 },
    'slow-spatial': { stiffness: 200, damping: 0.8 },
    'fast-effects': { stiffness: 3800, damping: 1.0 },
    'default-effects': { stiffness: 1600, damping: 1.0 },
    'slow-effects': { stiffness: 800, damping: 1.0 },
  },
  standard: {
    'fast-spatial': { stiffness: 1400, damping: 0.9 },
    'default-spatial': { stiffness: 700, damping: 0.9 },
    'slow-spatial': { stiffness: 300, damping: 0.9 },
    'fast-effects': { stiffness: 3800, damping: 1.0 },
    'default-effects': { stiffness: 1600, damping: 1.0 },
    'slow-effects': { stiffness: 800, damping: 1.0 },
  },
} as const;

export type MotionScheme = 'expressive' | 'standard';
export type SpringUsage = keyof (typeof MOTION_SPRINGS)['expressive'];

export const SPRING_USAGES = Object.keys(MOTION_SPRINGS.expressive) as SpringUsage[];

/**
 * Expressive motion patterns (m3.material.io) with their reference tokens.
 * `duration` is the tween-equivalent (used when springs are disabled).
 */
export const MOTION_PATTERNS = {
  'spatial-expansion': { duration: 'short1', easing: 'emphasized-accelerate', spatial: true },
  'spatial-shrink': { duration: 'short1', easing: 'emphasized-decelerate', spatial: true },
  'slide-and-fade': { duration: 'short4', easing: 'emphasized-decelerate', spatial: true },
  'fade-through': { duration: 'medium2', easing: 'emphasized', spatial: false },
  'cross-fade': { duration: 'short2', easing: 'linear', spatial: false },
  'container-transform': { duration: 'medium1', easing: 'emphasized', spatial: true },
  'icon-morph': { duration: 'short4', easing: 'emphasized-decelerate', spatial: true },
  'shape-morph': { duration: 'short1', easing: 'emphasized', spatial: true },
  loading: { duration: 'extra-long4', easing: 'linear', spatial: false },
} as const satisfies Record<
  string,
  { duration: MotionDurationName; easing: MotionEasingName; spatial: boolean }
>;

export type MotionPatternName = keyof typeof MOTION_PATTERNS;

export interface SpringSample {
  /** settling duration in ms (rounded to 10ms) */
  durationMs: number;
  /** CSS `linear(...)` easing reproducing the spring shape */
  easingCss: string;
  /** normalized samples [0..1 time] → value (may overshoot beyond 1) */
  values: number[];
}

/**
 * Semi-implicit Euler spring solver (mass = 1): a = -k(x-1) - 2ζ√k·v.
 * Returns samples of the normalized progress until settled (eps = 0.4%).
 */
export function solveSpring(
  stiffness: number,
  dampingRatio: number,
  opts: { sampleCount?: number; maxMs?: number } = {},
): SpringSample {
  const sampleCount = opts.sampleCount ?? 24;
  const maxMs = opts.maxMs ?? 3000;
  const dt = 1 / 240; // physics step (s)
  const c = 2 * dampingRatio * Math.sqrt(stiffness);
  let x = 0;
  let v = 0;
  const times: number[] = [0];
  const values: number[] = [0];
  let t = 0;
  const eps = 0.004;
  while (t * 1000 < maxMs) {
    const a = -stiffness * (x - 1) - c * v;
    v += a * dt;
    x += v * dt;
    t += dt;
    times.push(t);
    values.push(x);
    if (Math.abs(1 - x) < eps && Math.abs(v) < 0.05) break;
  }
  const totalT = times[times.length - 1];
  // resample to fixed count
  const out: number[] = [];
  for (let i = 0; i <= sampleCount; i++) {
    const want = (i / sampleCount) * totalT;
    let idx = 0;
    while (idx < times.length - 1 && times[idx + 1] < want) idx++;
    const t0 = times[idx];
    const t1 = times[Math.min(idx + 1, times.length - 1)];
    const f = t1 === t0 ? 0 : (want - t0) / (t1 - t0);
    out.push(values[idx] * (1 - f) + values[Math.min(idx + 1, values.length - 1)] * f);
  }
  out[0] = 0;
  out[out.length - 1] = 1;

  const easingParts = ['0 0%'];
  for (let i = 1; i < out.length - 1; i++) {
    const pct = round2((i / sampleCount) * 100);
    easingParts.push(`${round3(out[i])} ${pct}%`);
  }
  easingParts.push('1 100%');
  return {
    durationMs: Math.max(50, Math.round((totalT * 1000) / 10) * 10),
    easingCss: `linear(${easingParts.join(', ')})`,
    values: out.map(round3),
  };
}

export function springFor(
  scheme: MotionScheme,
  usage: SpringUsage,
): { stiffness: number; damping: number } {
  return MOTION_SPRINGS[scheme][usage];
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
function round3(n: number): number {
  return Math.round(n * 1000) / 1000;
}
