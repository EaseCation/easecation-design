import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ActionCard } from '../src';

it('activates with native pointer and keyboard interaction', async () => {
  const user = userEvent.setup();
  const onClick = vi.fn();
  render(<ActionCard onClick={onClick}>Open player</ActionCard>);

  const card = screen.getByRole('button', { name: 'Open player' });
  await user.click(card);
  card.focus();
  await user.keyboard('{Enter}');

  expect(onClick).toHaveBeenCalledTimes(2);
});

it('exposes selected state and honors disabled state', async () => {
  const user = userEvent.setup();
  const onClick = vi.fn();
  render(
    <ActionCard selected disabled onClick={onClick}>
      Selected player
    </ActionCard>,
  );

  const card = screen.getByRole('button', { name: 'Selected player' });
  expect(card).toHaveAttribute('data-selected', 'true');
  expect(card).toHaveAttribute('aria-pressed', 'true');
  await user.click(card);
  expect(onClick).not.toHaveBeenCalled();
});
