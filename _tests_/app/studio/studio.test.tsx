// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { Studio } from '@/app/studio/studio';
import { DEFAULT_STATE } from '@/components/studio/state';

beforeAll(() => {
  Object.defineProperty(URL, 'createObjectURL', { value: () => 'blob:unit', configurable: true });
  Object.defineProperty(URL, 'revokeObjectURL', { value: () => {}, configurable: true });
  const writeText = vi.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
});
afterEach(cleanup);

describe('Studio (client shell)', () => {
  it('tabs swap panels', () => {
    const { container } = render(<Studio initialState={DEFAULT_STATE} />);
    expect(screen.getByText('Buttons')).toBeTruthy(); // preview 初期
    fireEvent.click(screen.getByRole('button', { name: /Code/ }));
    expect(container.querySelector('pre'), 'code panel rendered').toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /A11y/ }));
    expect(screen.getByText(/ペアすべて基準以上/)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /Preview/ }));
    expect(screen.getByText('Buttons')).toBeTruthy();
  });

  it('dark mode + random seed flow patches state and the URL', () => {
    render(<Studio initialState={DEFAULT_STATE} />);
    fireEvent.click(screen.getByRole('button', { name: 'Dark' }));
    expect(window.location.search).toContain('d=dark');
    fireEvent.click(screen.getByRole('button', { name: 'Random seed' }));
    expect(window.location.search).toMatch(/[?&]s=[0-9a-f]{6}/);
    expect(screen.getByText(/· dark/)).toBeTruthy();
  });

  it('code tab: share-link copy and zip download run without errors', async () => {
    render(<Studio initialState={DEFAULT_STATE} />);
    fireEvent.click(screen.getByRole('button', { name: /Code/ }));
    const share = await screen.findByRole('button', { name: /Share link/ });
    fireEvent.click(share);
    await waitFor(() => expect(navigator.clipboard?.writeText).toHaveBeenCalled());
    expect(await screen.findByText('Copied!')).toBeTruthy();
    const dl = screen.getByRole('button', { name: /Download|\.zip/i });
    fireEvent.click(dl);
    // ボタンが zipping → 完了で再有効化されるまで待つ
    await waitFor(() => expect((dl as HTMLButtonElement).disabled).toBe(false), { timeout: 4000 });
  });

  it('A11y tab fix button flows into the contrast state', async () => {
    const tough = {
      config: { ...DEFAULT_STATE.config, seed: '44666f', contrast: 0 },
      mode: 'light' as const,
    };
    render(<Studio initialState={tough} />);
    fireEvent.click(screen.getByRole('button', { name: /A11y/ }));
    fireEvent.click(screen.getByRole('button', { name: 'AAA text' }));
    const fix = screen
      .getAllByRole('button')
      .find((b) => /改善|自動修復/.test(b.textContent ?? ''));
    expect(fix, 'a fix suggestion is offered').toBeTruthy();
    fireEvent.click(fix as HTMLElement);
    await waitFor(() => expect(window.location.search).toMatch(/c=0?\.\d+/));
  });
});
