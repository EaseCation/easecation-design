import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { Button, Calendar, Card, FilterBar, Input, Toaster, toast, LocaleProvider } from '../src';

afterEach(() => vi.restoreAllMocks());

it.each(['disabled', 'loading'] as const)(
  'blocks slotted child and parent activation while %s',
  (state) => {
    const action = vi.fn();
    render(
      <Button asChild {...{ [state]: true }} onClick={action} onClickCapture={action}>
        <a href="#destination" onClick={action} onClickCapture={action} onKeyDown={action}>
          Continue
        </a>
      </Button>,
    );
    const link = screen.getByRole('link');
    expect(fireEvent.click(link)).toBe(false);
    expect(fireEvent.keyDown(link, { key: 'Enter' })).toBe(false);
    expect(fireEvent.keyDown(link, { key: ' ' })).toBe(false);
    expect(fireEvent.keyDown(link, { key: 'Tab' })).toBe(true);
    expect(action).not.toHaveBeenCalled();
    expect(link).toHaveAttribute('tabindex', '-1');
  },
);

it('respects child click cancellation without suppressing enabled child actions', () => {
  const action = vi.fn();
  render(
    <Button asChild onClick={action}>
      <a href="#" onClick={(event) => event.preventDefault()}>
        Continue
      </a>
    </Button>,
  );
  fireEvent.click(screen.getByRole('link'));
  expect(action).not.toHaveBeenCalled();
});

it('clears press feedback on cancellation, lost capture and disable', () => {
  const { rerender } = render(<Button>Action</Button>);
  const button = screen.getByRole('button');
  fireEvent.pointerDown(button);
  expect(button).toHaveClass('is-pressing');
  fireEvent.pointerCancel(button);
  expect(button).not.toHaveClass('is-pressing');
  fireEvent.pointerDown(button);
  fireEvent.lostPointerCapture(button);
  expect(button).not.toHaveClass('is-pressing');
  fireEvent.pointerDown(button);
  rerender(<Button disabled>Action</Button>);
  expect(button).not.toHaveClass('is-pressing');
  rerender(<Button>Action</Button>);
  expect(button).not.toHaveClass('is-pressing');
});

it('respects cancelled card presses and clears live motion preference changes', () => {
  let reduced = false;
  const listeners = new Set<() => void>();
  vi.spyOn(window, 'matchMedia').mockImplementation((query) => ({
    get matches() {
      return reduced;
    },
    media: query,
    onchange: null,
    addEventListener: (_event: string, listener: EventListenerOrEventListenerObject) =>
      listeners.add(listener as () => void),
    removeEventListener: (_event: string, listener: EventListenerOrEventListenerObject) =>
      listeners.delete(listener as () => void),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
  const { rerender } = render(
    <Card pressable data-testid="card" onPointerDown={(event) => event.preventDefault()}>
      Card
    </Card>,
  );
  const card = screen.getByTestId('card');
  fireEvent.pointerDown(card);
  expect(card).not.toHaveClass('is-pressing');
  rerender(
    <Card pressable data-testid="card">
      Card
    </Card>,
  );
  fireEvent.pointerDown(card);
  expect(card).toHaveClass('is-pressing');
  act(() => {
    reduced = true;
    listeners.forEach((listener) => listener());
  });
  expect(card).not.toHaveClass('is-pressing');
  fireEvent.pointerDown(card);
  expect(card).not.toHaveClass('is-pressing');
  act(() => {
    reduced = false;
    listeners.forEach((listener) => listener());
  });
  expect(card).not.toHaveClass('is-pressing');
  fireEvent.pointerDown(card);
  expect(card).toHaveClass('is-pressing');
});

it('does not submit an IME composition and composes caller key handlers', () => {
  const search = vi.fn();
  const key = vi.fn();
  render(
    <FilterBar onSearch={search} onKeyDown={key}>
      <Input aria-label="Search" />
    </FilterBar>,
  );
  const input = screen.getByRole('textbox');
  fireEvent.keyDown(input, { key: 'Enter', isComposing: true });
  fireEvent.keyDown(input, { key: 'Enter', keyCode: 229 });
  expect(search).not.toHaveBeenCalled();
  fireEvent.keyDown(input, { key: 'Enter' });
  expect(search).toHaveBeenCalledTimes(1);
  expect(key).toHaveBeenCalledTimes(3);
});

it('enforces local date bounds and disabled/readOnly on calendar inputs', () => {
  const select = vi.fn();
  const { rerender } = render(
    <Calendar min={new Date(2026, 0, 10)} max="2026-01-20" onSelect={select} />,
  );
  const input = screen.getByLabelText('Date');
  fireEvent.change(input, { target: { value: '2026-01-09' } });
  expect(select).not.toHaveBeenCalled();
  fireEvent.change(input, { target: { value: '2026-01-15' } });
  expect(select).toHaveBeenLastCalledWith(new Date(2026, 0, 15));
  rerender(<Calendar disabled onSelect={select} />);
  expect(input).toBeDisabled();
  fireEvent.change(input, { target: { value: '2026-01-16' } });
  rerender(<Calendar readOnly onSelect={select} />);
  fireEvent.change(input, { target: { value: '2026-01-17' } });
  expect(select).toHaveBeenCalledTimes(1);
});

it('preserves base toast class alongside custom options', async () => {
  render(<Toaster toastOptions={{ duration: Infinity, classNames: { toast: 'custom-toast' } }} />);
  act(() => {
    toast.success('Merged options');
  });
  const title = await screen.findByText('Merged options');
  expect(title.closest('[data-sonner-toast]')).toHaveClass('cn-toast', 'custom-toast');
  act(() => {
    toast.dismiss();
  });
});

it('localizes calendar labels while preserving explicit labels', () => {
  const { rerender } = render(
    <LocaleProvider locale="zh-CN">
      <Calendar mode="range" />
    </LocaleProvider>,
  );
  expect(screen.getByLabelText('开始日期')).toBeInTheDocument();
  expect(screen.getByLabelText('结束日期')).toBeInTheDocument();
  rerender(
    <LocaleProvider locale="zh-CN">
      <Calendar labels={{ single: 'Birthday' }} />
    </LocaleProvider>,
  );
  expect(screen.getByLabelText('Birthday')).toBeInTheDocument();
});
