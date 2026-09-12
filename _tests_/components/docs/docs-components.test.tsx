// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SetupExplorer } from '@/components/docs/setup-explorer';
import { HeroDemo } from '@/components/landing/hero-demo';

afterEach(cleanup);

describe('SetupExplorer', () => {
  it('renders install commands and reacts to framework/pm buttons', () => {
    const { container } = render(<SetupExplorer />);
    const text = () => container.textContent ?? '';
    expect(text()).toContain('pnpm');
    // フレームワーク切替（React を選択）→ create-next-app 等の文言が変わる
    const react = screen.getAllByRole('button').find((b) => /React/.test(b.textContent ?? ''));
    expect(react, 'React tab exists').toBeTruthy();
    const before = text();
    fireEvent.click(react as HTMLElement);
    expect(text()).not.toBe(before);
    const bun = screen.getAllByRole('button').find((b) => b.textContent?.trim() === 'Bun');
    if (bun) {
      fireEvent.click(bun);
      expect(text()).toContain('bun');
    }
  });
});

describe('SetupExplorer copy buttons', () => {
  it('clicking a command copy flips the icon to check', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    render(<SetupExplorer />);
    const copyBtn = screen
      .getAllByRole('button')
      .find((b) => b.textContent?.trim() === 'content_copy');
    expect(copyBtn, 'copy icon button exists').toBeTruthy();
    fireEvent.click(copyBtn as HTMLElement);
    await waitFor(() => expect(writeText).toHaveBeenCalled());
    expect((copyBtn as HTMLElement).textContent).toBe('check');
  });
});

describe('HeroDemo', () => {
  it('renders interactive seed controls without crashing', () => {
    const { container } = render(<HeroDemo />);
    expect(container.textContent && container.textContent.length > 10).toBe(true);
    const slider = screen.queryByRole('slider');
    if (slider) {
      fireEvent.change(slider, { target: { value: (slider as HTMLInputElement).value } });
      expect(slider).toBeTruthy();
    }
  });
});
