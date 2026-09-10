import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../src';
import { forwardRef } from 'react';
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

it('supports links and stable compact button sizes', () => {
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
});
