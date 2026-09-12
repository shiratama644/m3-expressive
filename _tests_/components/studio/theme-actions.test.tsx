// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const db = vi.hoisted(() => ({
  listThemes: vi.fn(),
  saveTheme: vi.fn().mockResolvedValue(undefined),
  deleteTheme: vi.fn().mockResolvedValue(undefined),
}));
vi.mock('@/lib/presets/db', () => db);

import { DEFAULT_STATE } from '@/components/studio/state';
import { ThemeActions } from '@/components/studio/theme-actions';

beforeEach(() =>
  db.listThemes.mockResolvedValue([
    { id: 1, name: 'My saved', search: 's=abcdef', seed: '#abcdef', createdAt: 1 },
  ]),
);
afterEach(cleanup);

describe('ThemeActions', () => {
  it('import flow: invalid JSON feeds back a message, valid tokens.json applies', async () => {
    const onApply = vi.fn();
    render(<ThemeActions state={DEFAULT_STATE} onApply={onApply} />);
    // ボタン順は固定: [0]=Import [1]=Save [2]=My themes（Icon のみ表示のため位置で特定）
    const importBtn = screen.getAllByRole('button')[0];
    fireEvent.click(importBtn);
    expect(importBtn.getAttribute('aria-expanded')).toBe('true');
    const box = await screen.findByRole('textbox');
    fireEvent.change(box, { target: { value: 'not json' } });
    fireEvent.click(screen.getByRole('button', { name: '適用' }));
    expect(screen.getByText(/JSON として解析できませんでした/)).toBeTruthy();
    expect(onApply).not.toHaveBeenCalled();

    fireEvent.change(box, {
      target: {
        value: JSON.stringify({
          $extensions: { 'io.material.studio': { seed: 'aabbcc', variant: 'fidelity' } },
        }),
      },
    });
    fireEvent.click(screen.getByRole('button', { name: '適用' }));
    expect(onApply).toHaveBeenCalledWith(
      expect.objectContaining({ config: expect.objectContaining({ seed: '#aabbcc' }) }),
    );
  });

  it('save writes to Dexie-backed db and lib lists saved themes with delete', async () => {
    render(<ThemeActions state={DEFAULT_STATE} onApply={vi.fn()} />);
    fireEvent.click(screen.getAllByRole('button')[1]); // Save ポップアップを開く
    const name = screen.getByRole('textbox');
    fireEvent.change(name, { target: { value: 'Alpha' } });
    fireEvent.click(screen.getByRole('button', { name: '保存' }));
    await waitFor(() =>
      expect(db.saveTheme).toHaveBeenCalledWith('Alpha', expect.any(String), expect.any(String)),
    );

    const libBtn = screen.getAllByRole('button')[2];
    fireEvent.click(libBtn);
    expect(await screen.findByText('My saved')).toBeTruthy();
    const del = screen.getAllByRole('button').find((b) => /削除|delete/i.test(b.textContent ?? ''));
    if (del) {
      fireEvent.click(del);
      await waitFor(() => expect(db.deleteTheme).toHaveBeenCalledWith(1));
    }
  });
});
