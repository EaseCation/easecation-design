import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select } from '../src';
it('selects an option with keyboard and emits its value', async () => {
  const user = userEvent.setup();
  let value = '';
  render(
    <Select
      label="区域"
      options={[
        { value: 'east', label: '华东' },
        { value: 'west', label: '华西' },
      ]}
      onValueChange={(next: string) => {
        value = next;
      }}
    />,
  );
  const trigger = screen.getByRole('combobox', { name: '区域' });
  trigger.focus();
  await user.keyboard(' ');
  await user.keyboard('{ArrowDown}{Enter}');
  expect(value).toBe('west');
  expect(trigger).toHaveTextContent('华西');
});
