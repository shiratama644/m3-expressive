// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { A11yPanel } from '@/components/studio/a11y-panel';
import { DEFAULT_CONFIG } from '@/lib/m3e/config';
import { buildTheme } from '@/lib/m3e/css';

afterEach(cleanup);

describe('A11yPanel', () => {
  it('passes (all good) state for default theme at AA', () => {
    render(<A11yPanel bundle={buildTheme(DEFAULT_CONFIG)} onFixContrast={vi.fn()} />);
    expect(screen.getByText(/基準以上/)).toBeTruthy();
  });

  it('AAA on a tough seed lists failures and offers the fix button', () => {
    const onFix = vi.fn();
    const bundle = buildTheme({ ...DEFAULT_CONFIG, seed: '44666f', contrast: 0 });
    render(<A11yPanel bundle={bundle} onFixContrast={onFix} />);
    fireEvent.click(screen.getByRole('button', { name: 'AAA text' }));
    expect(screen.getByText(/基準未達/)).toBeTruthy();
    const fix = screen
      .getAllByRole('button')
      .find((b) => /改善|自動修復/.test(b.textContent ?? ''));
    expect(fix, 'a fix/repair button is offered').toBeTruthy();
    fireEvent.click(fix as HTMLElement);
    expect(onFix).toHaveBeenCalledWith(expect.any(Number));
  });

  it('level switch + failures-only filter re-query rows', () => {
    const bundle = buildTheme({ ...DEFAULT_CONFIG, seed: '44666f', contrast: 0 });
    const { container } = render(<A11yPanel bundle={bundle} onFixContrast={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: 'AAA text' }));
    const before = container.querySelectorAll('tbody tr').length;
    expect(before).toBeGreaterThan(0);
    const filter = screen.getByRole('button', { name: /失敗のみ|失敗だけ|failures/i });
    fireEvent.click(filter);
    expect(container.querySelectorAll('tbody tr').length).toBeLessThan(before + 1);
    expect(screen.getByText(/基準未達/)).toBeTruthy();
  });
});
