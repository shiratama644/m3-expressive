// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const db = vi.hoisted(() => ({
  listThemes: vi
    .fn()
    .mockResolvedValue([
      { id: 1, name: 'My saved', search: 's=aabbcc', seed: '#aabbcc', createdAt: 1 },
    ]),
  deleteTheme: vi.fn().mockResolvedValue(undefined),
}));
vi.mock('@/lib/presets/db', () => db);

import { PresetGallery } from '@/components/presets/gallery';

afterEach(cleanup);

describe('PresetGallery', () => {
  it('lists builtin seeds as studio links and shows saved themes', async () => {
    render(<PresetGallery />);
    await waitFor(() => expect(db.listThemes).toHaveBeenCalled());
    const links = screen.getAllByRole('link');
    const studioLinks = links.filter((a) => (a.getAttribute('href') ?? '').startsWith('/studio?'));
    expect(studioLinks.length, 'every builtin links into the studio').toBeGreaterThanOrEqual(10);
    expect(await screen.findByText('My saved')).toBeTruthy();
  });

  it('copy button on a builtin card writes the share URL', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    render(<PresetGallery />);
    await waitFor(() => expect(db.listThemes).toHaveBeenCalled());
    const copy = screen.getAllByRole('button').find((b) => (b.textContent ?? '').includes('共有'));
    if (copy) {
      fireEvent.click(copy);
      await waitFor(() => expect(writeText).toHaveBeenCalled());
    } else {
      // icon-only buttons: aria-label で拾う
      const iconBtn = screen
        .getAllByRole('button')
        .find((b) => /copy/i.test(b.getAttribute('aria-label') ?? ''));
      expect(iconBtn, 'a copy control exists on cards').toBeTruthy();
      fireEvent.click(iconBtn as HTMLElement);
      await waitFor(() => expect(writeText).toHaveBeenCalled());
    }
  });

  it('deleting a saved theme removes it from the list', async () => {
    db.listThemes
      .mockResolvedValueOnce([
        { id: 7, name: 'Old', search: 's=ffffff', seed: '#ffffff', createdAt: 2 },
      ])
      .mockResolvedValueOnce([]);
    render(<PresetGallery />);
    expect(await screen.findByText('Old')).toBeTruthy();
    const del = screen.getAllByRole('button').find((b) => /削除|Delete/i.test(b.textContent ?? ''));
    expect(del, 'delete button on saved card').toBeTruthy();
    fireEvent.click(del as HTMLElement);
    await waitFor(() => expect(db.deleteTheme).toHaveBeenCalledWith(7));
    await waitFor(() => expect(screen.queryByText('Old')).toBeNull());
  });
});
