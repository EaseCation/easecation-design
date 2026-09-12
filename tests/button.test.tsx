import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button, IconButton } from '../src';
import { forwardRef } from 'react';
import { RefreshCwIcon } from 'lucide-react';
it('forwards interaction and blocks it while loading', async () => {
  const user = userEvent.setup();
  let count = 0;
  const { rerender } = render(<Button onClick={() => count++}>保存</Button>);
  await user.click(screen.getByRole('button', { name: '保存' }));
  expect(count).toBe(1);
  rerender(
    <Button loading onClick={() => count++}>
      保存
    </Button>,
  );
  expect(screen.getByRole('button', { name: '保存' })).toBeDisabled();
});

it('supports links and stable button sizes', () => {
  const Link = forwardRef<HTMLAnchorElement, React.ComponentProps<'a'>>((props, ref) => (
    <a ref={ref} {...props} />
  ));

  const { rerender } = render(
    <Button asChild variant="link">
      <Link href="/players">玩家</Link>
    </Button>,
  );

  expect(screen.getByRole('link', { name: '玩家' })).toHaveAttribute('href', '/players');
  expect(screen.getByRole('link', { name: '玩家' })).toHaveClass('ec-button--link');

  rerender(
    <Button size="icon-xs" aria-label="刷新">
      R
    </Button>,
  );
  expect(screen.getByRole('button', { name: '刷新' })).toHaveAttribute('data-size', 'icon-xs');

  rerender(<Button size="xl">继续</Button>);
  expect(screen.getByRole('button', { name: '继续' })).toHaveAttribute('data-size', 'xl');
  expect(screen.getByRole('button', { name: '继续' })).toHaveClass('ec-button--xl');
});

it('keeps icon and label as flex siblings', () => {
  render(
    <Button>
      <RefreshCwIcon data-testid="refresh-icon" />
      刷新
    </Button>,
  );

  const content = screen.getByRole('button', { name: '刷新' }).querySelector('.ec-button__content');
  expect(content?.childNodes).toHaveLength(2);
  expect(screen.getByTestId('refresh-icon').parentElement).toBe(content);
});

it('provides physical press feedback by default and supports opting out', () => {
  const { rerender } = render(<Button>保存</Button>);
  const button = screen.getByRole('button', { name: '保存' });
  expect(button).toHaveClass('ec-button--pressable');
  fireEvent.pointerDown(button, { clientX: 10, clientY: 10 });
  expect(button).toHaveClass('is-pressing');
  fireEvent.pointerUp(button);
  expect(button).not.toHaveClass('is-pressing');

  rerender(<Button pressable={false}>保存</Button>);
  expect(screen.getByRole('button', { name: '保存' })).not.toHaveClass('ec-button--pressable');

  rerender(<IconButton label="刷新" icon={<RefreshCwIcon />} />);
  const iconButton = screen.getByRole('button', { name: '刷新' });
  expect(iconButton).toHaveClass('ec-icon-button', 'ec-button--pressable');
  fireEvent.pointerDown(iconButton, { clientX: 10, clientY: 10 });
  expect(iconButton).toHaveClass('is-pressing');
});

it('provides semantic tones and inline actions without visual overrides', () => {
  const { rerender } = render(
    <Button variant="ghost" tone="danger">
      删除
    </Button>,
  );
  expect(screen.getByRole('button', { name: '删除' })).toHaveClass(
    'ec-button--ghost',
    'ec-button--tone-danger',
  );

  rerender(
    <Button variant="link" size="inline">
      查看详情
    </Button>,
  );
  expect(screen.getByRole('button', { name: '查看详情' })).toHaveClass('ec-button--inline');

  rerender(<IconButton label="移除" icon="X" size="xs" tone="danger" />);
  expect(screen.getByRole('button', { name: '移除' })).toHaveClass(
    'ec-icon-button',
    'ec-button--xs',
    'ec-button--tone-danger',
  );
});
