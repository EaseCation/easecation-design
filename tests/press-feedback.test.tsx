import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import type { CSSProperties } from 'react';
import { Button, Card } from '../src';

const style = { '--ec-motion-fast': '180ms' } as CSSProperties;
afterEach(() => vi.useRealTimers());

it.each(['button', 'card'])('a quick %s tap is visible without delaying its action', (kind) => {
  vi.useFakeTimers();
  const action = vi.fn();
  render(
    kind === 'button' ? (
      <Button style={style} onClick={action}>
        Action
      </Button>
    ) : (
      <Card style={style} pressable onClick={action} data-testid="card">
        Action
      </Card>
    ),
  );
  const surface = kind === 'button' ? screen.getByRole('button') : screen.getByTestId('card');
  fireEvent.pointerDown(surface);
  fireEvent.pointerUp(surface);
  fireEvent.click(surface);
  expect(action).toHaveBeenCalledTimes(1);
  expect(surface).toHaveClass('is-pressing');
  // A completed touch releases implicit capture and emits pointerleave.
  fireEvent.lostPointerCapture(surface);
  fireEvent.pointerLeave(surface);
  act(() => vi.advanceTimersByTime(90));
  expect(surface).toHaveClass('is-pressing');
  act(() => vi.advanceTimersByTime(90));
  expect(surface).not.toHaveClass('is-pressing');
});

it('cancels an interrupted press immediately and cleans up a pending release on disable', () => {
  vi.useFakeTimers();
  const view = render(<Button style={style}>Action</Button>);
  const button = screen.getByRole('button');
  fireEvent.pointerDown(button);
  fireEvent.pointerCancel(button);
  expect(button).not.toHaveClass('is-pressing');
  fireEvent.pointerDown(button);
  fireEvent.pointerUp(button);
  view.rerender(
    <Button style={style} disabled>
      Action
    </Button>,
  );
  expect(button).not.toHaveClass('is-pressing');
  expect(vi.getTimerCount()).toBe(0);
  view.rerender(<Button style={style}>Action</Button>);
  expect(button).not.toHaveClass('is-pressing');
});

it('a new press replaces the previous release timer and unmount clears it', () => {
  vi.useFakeTimers();
  const view = render(<Button style={style}>Action</Button>);
  const button = screen.getByRole('button');
  fireEvent.pointerDown(button);
  fireEvent.pointerUp(button);
  act(() => vi.advanceTimersByTime(120));
  fireEvent.pointerDown(button);
  act(() => vi.advanceTimersByTime(120));
  expect(button).toHaveClass('is-pressing');
  fireEvent.pointerUp(button);
  expect(vi.getTimerCount()).toBe(1);
  view.unmount();
  expect(vi.getTimerCount()).toBe(0);
});

it('centers keyboard activation once and lets completed feedback survive focus transfer', () => {
  vi.useFakeTimers();
  const action = vi.fn();
  render(
    <Button style={style} onClick={action}>
      Action
    </Button>,
  );
  const button = screen.getByRole('button');
  fireEvent.click(button, { detail: 0 });
  expect(action).toHaveBeenCalledTimes(1);
  expect(button).toHaveClass('is-pressing');
  expect(button.style.getPropertyValue('--rotate-x')).toBe('0deg');
  expect(button.style.getPropertyValue('--rotate-y')).toBe('0deg');
  fireEvent.blur(button);
  expect(button).toHaveClass('is-pressing');
  act(() => vi.advanceTimersByTime(180));
  expect(button).not.toHaveClass('is-pressing');
  fireEvent.pointerDown(button);
  fireEvent.blur(button);
  expect(button).not.toHaveClass('is-pressing');
  expect(vi.getTimerCount()).toBe(0);
});

it('respects prevented keyboard activation and pressable opt-out', () => {
  const view = render(
    <Button style={style} onClick={(event) => event.preventDefault()}>
      Action
    </Button>,
  );
  fireEvent.click(screen.getByRole('button'), { detail: 0 });
  expect(screen.getByRole('button')).not.toHaveClass('is-pressing');
  view.rerender(
    <Button style={style} pressable={false}>
      Action
    </Button>,
  );
  fireEvent.click(screen.getByRole('button'), { detail: 0 });
  expect(screen.getByRole('button')).not.toHaveClass('is-pressing');
});
