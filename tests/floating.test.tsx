import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button, Popover, Tooltip } from '../src';
it('opens and closes popover accessibly', async () => {
  const user = userEvent.setup();
  render(
    <Popover trigger={<Button>筛选</Button>} title="筛选条件">
      内容
    </Popover>,
  );
  await user.click(screen.getByRole('button', { name: '筛选' }));
  expect(screen.getByRole('dialog')).toHaveTextContent('内容');
  await user.keyboard('{Escape}');
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});
it('shows tooltip on focus after delay', async () => {
  vi.useFakeTimers();
  render(
    <Tooltip content="刷新数据" delay={100}>
      <button>刷新</button>
    </Tooltip>,
  );
  screen.getByRole('button', { name: '刷新' }).focus();
  await act(async () => {
    await vi.advanceTimersByTimeAsync(100);
  });
  expect(screen.getByRole('tooltip')).toHaveTextContent('刷新数据');
  vi.useRealTimers();
});
