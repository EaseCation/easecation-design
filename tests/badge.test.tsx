import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Badge, BadgeButton } from '../src';

it('keeps display and interactive badge semantics distinct', async () => {
  const user = userEvent.setup();
  const onClick = vi.fn();
  render(
    <>
      <Badge>Active</Badge>
      <BadgeButton variant="outline" onClick={onClick}>
        View expiry
      </BadgeButton>
    </>,
  );

  expect(screen.queryByRole('button', { name: 'Active' })).not.toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'View expiry' }));
  expect(onClick).toHaveBeenCalledOnce();
});
