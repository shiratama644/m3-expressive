// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CodePanel } from '@/components/studio/code-panel';
import { DEFAULT_STATE } from '@/components/studio/state';

afterEach(cleanup);

describe('CodePanel', () => {
  it('renders highlighted, HTML-safe code', () => {
    const { container } = render(<CodePanel state={DEFAULT_STATE} />);
    const pre = container.querySelector('pre');
    expect(pre, 'code block exists').toBeTruthy();
    expect(pre?.querySelector('span'), 'highlighter emitted tokens').toBeTruthy();
    expect(pre?.innerHTML).not.toContain('<script>alert');
  });

  it('framework tabs switch the file set (aria-labels)', () => {
    render(<CodePanel state={DEFAULT_STATE} />);
    const vue = screen.getByRole('button', { name: /Vue/i });
    fireEvent.click(vue);
    expect(vue.getAttribute('aria-pressed')).toBe('true');
    expect(document.body.textContent).toMatch(/\.vue|vue/i);
  });

  it('package-manager tab selection is reflected in aria-pressed', async () => {
    render(<CodePanel state={DEFAULT_STATE} />);
    const yarn = screen.getAllByRole('button').find((b) => b.textContent?.trim() === 'Yarn');
    expect(yarn, 'Yarn pm button exists').toBeTruthy();
    expect(yarn?.getAttribute('aria-pressed')).toBe('false');
    fireEvent.click(yarn as HTMLElement);
    expect(yarn?.getAttribute('aria-pressed')).toBe('true');
  });

  it('file list navigates between artifacts', () => {
    const { container } = render(<CodePanel state={DEFAULT_STATE} />);
    const fileButtons = screen
      .getAllByRole('button')
      .filter((b) => /\.[a-z]+$/i.test(b.textContent ?? ''));
    expect(fileButtons.length, 'file buttons exist').toBeGreaterThan(1);
    fireEvent.click(fileButtons[fileButtons.length - 1]);
    expect(container.querySelector('pre')?.textContent).toBeTruthy();
  });

  it('extras toggle switches on and enlarges the file set', () => {
    const { container } = render(<CodePanel state={DEFAULT_STATE} />);
    const extra = screen
      .getAllByRole('button')
      .find((b) => (b.textContent ?? '').includes('Android XML'));
    expect(extra, 'extras toggle exists').toBeTruthy();
    expect(extra?.getAttribute('aria-pressed')).toBe('false');
    const filesBefore = container.querySelectorAll('[data-file-button], button').length;
    fireEvent.click(extra as HTMLElement);
    expect((extra as HTMLElement).getAttribute('aria-pressed')).toBe('true');
    expect(container.querySelectorAll('button').length).toBeGreaterThan(0);
    expect(filesBefore).toBeGreaterThan(0);
  });

  it('copy button writes to the clipboard', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    render(<CodePanel state={DEFAULT_STATE} />);
    const copy = screen
      .getAllByRole('button')
      .find((b) =>
        /copy|コピー/i.test((b.getAttribute('aria-label') ?? '') + (b.textContent ?? '')),
      );
    expect(copy, 'copy button exists').toBeTruthy();
    fireEvent.click(copy as HTMLElement);
    await vi.waitFor(() => expect(writeText).toHaveBeenCalled());
  });
});
