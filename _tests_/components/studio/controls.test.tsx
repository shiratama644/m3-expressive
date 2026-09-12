// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Controls } from '@/components/studio/controls';
import { DEFAULT_STATE, SEED_PRESETS } from '@/components/studio/state';

afterEach(cleanup);

describe('Controls', () => {
  it('renders and patches via segmented/slider interactions', () => {
    const update = vi.fn();
    render(<Controls state={DEFAULT_STATE} update={update} />);
    // seed プリセットボタン（title=preset.name）押下 → seed パッチ
    const preset = screen.getByRole('button', { name: SEED_PRESETS[0].name });
    fireEvent.click(preset);
    const patch = update.mock.calls.at(-1)?.[0] as Record<string, unknown>;
    expect(patch.seed).toMatch(/^#[0-9a-fA-F]{6}$/);
    // 未押下の Segmented ボタン（variant 等）が update を呼ぶ
    const unpressed = screen
      .getAllByRole('button')
      .filter((b) => b.getAttribute('aria-pressed') === 'false');
    expect(unpressed.length).toBeGreaterThan(0);
    fireEvent.click(unpressed[0]);
    expect(update).toHaveBeenCalled();
  });

  it('every control family emits the right patch shape', () => {
    const update = vi.fn();
    render(<Controls state={DEFAULT_STATE} update={update} />);
    fireEvent.click(screen.getByRole('button', { name: 'Random seed' }));
    const last = update.mock.calls.at(-1);
    expect(last).toBeDefined();
    expect((last![0] as { seed: string }).seed).toMatch(/^#[0-9a-f]{6}$/);

    fireEvent.click(screen.getByRole('button', { name: 'Increased (M3E)' }));
    expect(update.mock.calls.at(-1)?.[0]).toEqual({ shapeEmphasis: 'increased' });

    const sw = screen.getAllByRole('switch')[0];
    fireEvent.click(sw);
    expect(Object.keys(update.mock.calls.at(-1)?.[0] as object)).toHaveLength(1);

    const [variantSel, familySel] = screen.getAllByRole('combobox');
    fireEvent.change(variantSel as HTMLElement, { target: { value: 'monochrome' } });
    expect(update.mock.calls.at(-1)?.[0]).toEqual({ variant: 'monochrome' });
    fireEvent.change(familySel as HTMLElement, { target: { value: 'system' } });
    expect(update.mock.calls.at(-1)?.[0]).toEqual({ typeFamily: 'system' });
  });

  it('sliders fire numeric patches', () => {
    const update = vi.fn();
    render(<Controls state={DEFAULT_STATE} update={update} />);
    const slider = screen.getAllByRole('slider')[0];
    fireEvent.change(slider, { target: { value: '0.42' } });
    const arg = update.mock.calls.at(-1)?.[0] as Record<string, unknown>;
    expect(typeof Object.values(arg)[0]).toBe('number');
  });
});
