import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select, ThemeProvider } from '../src';
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

it('renders its menu in a themed portal and supports an empty option', async () => {
  const user = userEvent.setup();
  const onValueChange = vi.fn();
  const { container } = render(
    <ThemeProvider mode="dark">
      <Select
        label="Status"
        value="active"
        onValueChange={onValueChange}
        className="select-layout"
        triggerClassName="select-trigger"
        contentClassName="select-content"
        options={[
          { value: '', label: 'All' },
          { value: 'active', label: 'Active' },
        ]}
      />
    </ThemeProvider>,
  );

  const trigger = screen.getByRole('combobox', { name: 'Status' });
  expect(trigger).toHaveClass('select-trigger');
  expect(trigger.parentElement).toHaveClass('select-layout');
  await user.click(trigger);
  const content = screen.getByRole('listbox');
  expect(content).toHaveClass('select-content');
  expect(content.closest('.ec-theme-portal')).toHaveAttribute('data-ec-theme', 'dark');
  expect(container).not.toContainElement(content);
  await user.click(screen.getByRole('option', { name: 'All' }));
  expect(onValueChange).toHaveBeenCalledWith('');
});

it('keeps option descriptions out of the selected trigger value', () => {
  render(
    <Select
      label="Region"
      value="east"
      options={[{ value: 'east', label: 'East', description: 'Primary cluster' }]}
    />,
  );
  const trigger = screen.getByRole('combobox', { name: 'Region' });
  expect(trigger).toHaveTextContent('East');
  expect(trigger).not.toHaveTextContent('Primary cluster');
});

it('links labels by id and renders grouped options', async () => {
  const user = userEvent.setup();
  render(
    <>
      <label htmlFor="region">Region</label>
      <Select
        id="region"
        options={[
          { value: 'east', label: 'East', group: 'China' },
          { value: 'west', label: 'West', group: 'China' },
          { value: 'global', label: 'Global' },
        ]}
      />
    </>,
  );

  const trigger = screen.getByRole('combobox', { name: 'Region' });
  expect(trigger).toHaveAttribute('id', 'region');
  await user.click(trigger);
  expect(screen.getByText('China')).toBeInTheDocument();
  expect(screen.getAllByRole('option')).toHaveLength(3);
});
