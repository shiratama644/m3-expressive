// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Icon, M3Button, M3Fab, M3IconButton } from '@/components/m3e/actions';
import { M3FilterChip, M3Slider, M3Switch } from '@/components/m3e/inputs';
import { M3Card } from '@/components/m3e/surfaces';

afterEach(cleanup);

describe('m3e components', () => {
  it('M3Button emits clicks and renders content', () => {
    const onClick = vi.fn();
    render(<M3Button onClick={onClick}>Go</M3Button>);
    fireEvent.click(screen.getByText('Go').closest('button') as HTMLElement);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('Icon renders the ligature name', () => {
    render(<Icon name="check" />);
    expect(document.querySelector('.material-symbols-rounded')?.textContent).toBe('check');
  });

  it('M3Slider reports numeric changes', () => {
    const onChange = vi.fn();
    render(<M3Slider value={20} onChange={onChange} label="Progress" />);
    fireEvent.change(screen.getByRole('slider'), { target: { value: '65' } });
    expect(onChange).toHaveBeenCalledWith(65);
  });

  it('M3Switch toggles', () => {
    const onChange = vi.fn();
    render(<M3Switch checked={false} onChange={onChange} label="Wi-Fi" />);
    fireEvent.click(screen.getByRole('switch'));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('M3FilterChip toggles its pressed state (self-contained)', () => {
    render(<M3FilterChip label="Expressive" icon="auto_awesome" initial />);
    const chip = screen.getByText('Expressive').closest('button') as HTMLElement;
    expect(chip.getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(chip);
    expect(chip.getAttribute('aria-pressed')).toBe('false');
  });

  it('M3Card renders title/subtitle/body slots', () => {
    render(
      <M3Card title="Card" subtitle="sub">
        <p>body</p>
      </M3Card>,
    );
    expect(screen.getByText('Card')).toBeTruthy();
    expect(screen.getByText('body')).toBeTruthy();
  });

  it('M3Fab renders the extended label; M3IconButton toggle flips aria-pressed', () => {
    render(
      <div>
        <M3Fab extended icon="edit" label="Compose" />
        <M3IconButton icon="favorite" toggle label="Like" />
      </div>,
    );
    expect(screen.getByText('Compose')).toBeTruthy();
    const like = screen.getByRole('button', { name: /Like/ });
    expect(like.getAttribute('aria-pressed')).not.toBe('true');
    fireEvent.click(like);
    expect(like.getAttribute('aria-pressed')).toBe('true');
  });
});
