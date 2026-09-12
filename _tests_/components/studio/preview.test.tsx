// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { Preview } from '@/components/studio/preview';
import { DEFAULT_CONFIG } from '@/lib/m3e/config';
import { buildTheme } from '@/lib/m3e/css';

afterEach(cleanup);
const bundle = buildTheme(DEFAULT_CONFIG);

describe('Preview', () => {
  it('shows demo panels in light mode', () => {
    const { container } = render(<Preview bundle={bundle} mode="light" />);
    expect(screen.getByText('Buttons')).toBeTruthy();
    expect(screen.getByText('Inputs')).toBeTruthy();
    expect(container.textContent).toContain('Compose');
  });

  it('switching to dark renders without errors', () => {
    const { container } = render(<Preview bundle={bundle} mode="dark" />);
    expect(container.firstChild).toBeTruthy();
    expect(screen.getByText('Buttons')).toBeTruthy();
  });
});
