// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  ControlGroup,
  Field,
  Segmented,
  SliderRow,
  SwitchRow,
} from '@/components/studio/primitives';

afterEach(cleanup);

describe('primitives', () => {
  it('Field renders label + hint + children', () => {
    render(
      <Field label="Seed" hint="hex">
        <input data-testid="ctl" />
      </Field>,
    );
    expect(screen.getByText('Seed')).toBeTruthy();
    expect(screen.getByText('hex')).toBeTruthy();
    expect(screen.getByTestId('ctl')).toBeTruthy();
  });

  it('Segmented marks the active option and reports changes', () => {
    const onChange = vi.fn();
    render(
      <Segmented
        value="b"
        options={[
          { value: 'a', label: 'Aye' },
          { value: 'b', label: 'Bee' },
        ]}
        onChange={onChange}
      />,
    );
    const [a, b] = screen.getAllByRole('button');
    expect(b.getAttribute('aria-pressed')).toBe('true');
    expect(a.getAttribute('aria-pressed')).toBe('false');
    fireEvent.click(a);
    expect(onChange).toHaveBeenCalledWith('a');
  });

  it('SliderRow emits numbers on input', () => {
    const onChange = vi.fn();
    render(
      <SliderRow label="Contrast" value={0.5} min={0} max={1} step={0.05} onChange={onChange} />,
    );
    const input = screen.getByRole('slider');
    fireEvent.change(input, { target: { value: '0.8' } });
    expect(onChange).toHaveBeenCalledWith(0.8);
  });

  it('SwitchRow toggles via checkbox semantics', () => {
    const onChange = vi.fn();
    render(<SwitchRow label="Springs" checked={false} onChange={onChange} />);
    const box = screen.getByRole('switch');
    expect(box.getAttribute('aria-checked')).toBe('false');
    fireEvent.click(box);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('ControlGroup shows title', () => {
    render(
      <ControlGroup title="Typography">
        <span>x</span>
      </ControlGroup>,
    );
    expect(screen.getByText('Typography')).toBeTruthy();
  });
});
