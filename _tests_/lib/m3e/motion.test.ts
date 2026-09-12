import { describe, expect, it } from 'vitest';
import {
  cubicBezierCss,
  MOTION_DURATIONS,
  MOTION_EASINGS,
  MOTION_SPRINGS,
  solveSpring,
  springFor,
} from '@/lib/m3e/motion';

describe('durations (androidx MotionTokens v0_103)', () => {
  it('matches spec', () => {
    expect(MOTION_DURATIONS['very-short1']).toBe(20);
    expect(MOTION_DURATIONS.short3).toBe(150);
    expect(MOTION_DURATIONS.medium2).toBe(300);
    expect(MOTION_DURATIONS.long1).toBe(450);
    expect(MOTION_DURATIONS['extra-long4']).toBe(1000);
  });
});

describe('easings', () => {
  it('has the three emphasized curves', () => {
    expect(cubicBezierCss('emphasized')).toBe('cubic-bezier(0.2, 0, 0, 1)');
    expect(cubicBezierCss('emphasized-decelerate')).toBe('cubic-bezier(0.05, 0.7, 0.1, 1)');
    expect(cubicBezierCss('emphasized-accelerate')).toBe('cubic-bezier(0.3, 0, 0.8, 0.15)');
    expect(cubicBezierCss('linear')).toBe('cubic-bezier(0, 0, 1, 1)');
  });
  it('all curves have 4 points in 0..1 x-range', () => {
    for (const curve of Object.values(MOTION_EASINGS)) {
      expect(curve).toHaveLength(4);
      expect(curve[0]).toBeGreaterThanOrEqual(0);
      expect(curve[0]).toBeLessThanOrEqual(1);
      expect(curve[2]).toBeGreaterThanOrEqual(0);
      expect(curve[2]).toBeLessThanOrEqual(1);
    }
  });
});

describe('springs', () => {
  it('expressive defaults follow ExpressiveMotionTokens', () => {
    expect(springFor('expressive', 'default-spatial')).toEqual({ stiffness: 380, damping: 0.8 });
    expect(springFor('expressive', 'fast-spatial')).toEqual({ stiffness: 800, damping: 0.6 });
    expect(springFor('standard', 'default-spatial')).toEqual({ stiffness: 700, damping: 0.9 });
  });

  it('solver starts at 0, lands on 1', () => {
    for (const usage of Object.keys(
      MOTION_SPRINGS.expressive,
    ) as (keyof typeof MOTION_SPRINGS.expressive)[]) {
      const s = springFor('expressive', usage);
      const sample = solveSpring(s.stiffness, s.damping);
      expect(sample.values[0]).toBe(0);
      expect(sample.values[sample.values.length - 1]).toBe(1);
      expect(sample.durationMs).toBeGreaterThan(0);
      expect(sample.easingCss.startsWith('linear(')).toBe(true);
      expect(sample.easingCss.endsWith(')')).toBe(true);
    }
  });

  it('underdamped springs overshoot, critically damped do not', () => {
    const bouncy = solveSpring(MOTION_SPRINGS.expressive['fast-spatial'].stiffness, 0.6);
    expect(Math.max(...bouncy.values)).toBeGreaterThan(1.02);
    const calm = solveSpring(MOTION_SPRINGS.expressive['default-effects'].stiffness, 1.0);
    expect(Math.max(...calm.values)).toBeLessThanOrEqual(1.001);
  });

  it('stiffer springs settle faster', () => {
    const fast = solveSpring(MOTION_SPRINGS.expressive['fast-effects'].stiffness, 1.0);
    const slow = solveSpring(MOTION_SPRINGS.expressive['slow-effects'].stiffness, 1.0);
    expect(fast.durationMs).toBeLessThan(slow.durationMs);
  });

  it('easing css is a valid sample list (monotone times)', () => {
    const sample = solveSpring(380, 0.8, { sampleCount: 12 });
    const parts = sample.easingCss.slice(7, -1).split(', ');
    expect(parts.length).toBe(13); // 12 intervals + settle
    expect(parts[0]).toBe('0 0%');
    expect(parts[parts.length - 1]).toBe('1 100%');
    for (let i = 1; i < parts.length; i++) {
      const pct = Number(parts[i].split(' ')[1].slice(0, -1));
      expect(pct).toBeGreaterThan(Number(parts[i - 1].split(' ')[1]?.slice(0, -1) ?? -1) - 1e-6);
    }
  });
});
