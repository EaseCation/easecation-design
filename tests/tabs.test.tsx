import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tabs } from '../src';
it('changes tab with keyboard', async () => {
  const user = userEvent.setup();
  render(
    <Tabs
      items={[
        { value: 'a', label: '概览', content: 'A' },
        { value: 'b', label: '设置', content: 'B' },
      ]}
    />,
  );
  const first = screen.getByRole('tab', { name: '概览' });
  first.focus();
  await user.keyboard('{ArrowRight}');
  expect(screen.getByRole('tab', { name: '设置' })).toHaveAttribute('aria-selected', 'true');
  expect(screen.getByRole('tabpanel')).toHaveTextContent('B');
});
