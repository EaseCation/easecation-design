import { useState } from 'react';
import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Accordion, Button, Combobox, Modal, MultiSelect } from '../src';

const regions = [
  { value: 'east', label: 'East region', keywords: ['primary'] },
  { value: 'west', label: 'West region' },
  { value: 'legacy', label: 'Legacy region', disabled: true },
];

it('filters and selects a combobox option with the keyboard', async () => {
  const user = userEvent.setup();
  let value = '';
  render(
    <Combobox
      label="Region"
      options={regions}
      onValueChange={(next) => {
        value = next;
      }}
    />,
  );

  const input = screen.getByRole('combobox', { name: 'Region' });
  await user.click(input);
  await user.type(input, 'west');
  await user.keyboard('{Enter}');

  expect(value).toBe('west');
  expect(input).toHaveValue('West region');
  expect(input).toHaveAttribute('aria-expanded', 'false');
});

it('shows the complete option list when reopening an existing selection', async () => {
  const user = userEvent.setup();
  render(<Combobox label="Region" options={regions} defaultValue="east" />);

  const input = screen.getByRole('combobox', { name: 'Region' });
  expect(input).toHaveValue('East region');
  expect(input).toHaveAttribute('aria-haspopup', 'listbox');

  await user.click(input);
  expect(screen.getByRole('option', { name: 'West region' })).toBeInTheDocument();
  expect(screen.getByRole('option', { name: 'Legacy region' })).toBeDisabled();

  await user.keyboard('{ArrowDown}{Enter}');
  expect(input).toHaveValue('West region');
});

it('supports keywords, Home/End navigation, disabled options, and clearing', async () => {
  const user = userEvent.setup();
  const options = [
    { value: 'north-cn', label: '华北节点', keywords: ['北京', 'beijing'] },
    { value: 'south-cn', label: '华南节点', keywords: ['广州'] },
    { value: 'retired', label: '已退役节点', disabled: true },
  ];
  render(<Combobox label="节点" options={options} defaultValue="north-cn" clearable />);

  const input = screen.getByRole('combobox', { name: '节点' });
  await user.click(input);
  await user.type(input, '广州');
  expect(screen.getByRole('option', { name: '华南节点' })).toBeInTheDocument();

  await user.clear(input);
  await user.type(input, 'north-cn');
  expect(screen.getByRole('option', { name: '华北节点' })).toBeInTheDocument();

  await user.clear(input);
  await user.keyboard('{End}{Enter}');
  expect(input).toHaveValue('华南节点');

  await user.click(screen.getByRole('button', { name: 'Clear selection' }));
  expect(input).toHaveValue('');
});

it('keeps a custom combobox value editable while retaining option selection', async () => {
  const user = userEvent.setup();
  let value = 'external-id';
  function Harness() {
    const [current, setCurrent] = useState(value);
    return (
      <Combobox
        label="Integration ID"
        options={regions}
        value={current}
        allowCustomValue
        onValueChange={(next) => {
          value = next;
          setCurrent(next);
        }}
      />
    );
  }
  render(<Harness />);

  const input = screen.getByRole('combobox', { name: 'Integration ID' });
  expect(input).toHaveValue('external-id');

  await user.click(input);
  await user.clear(input);
  await user.type(input, 'eas');
  await user.keyboard('{Enter}');
  expect(value).toBe('eas');
  expect(input).toHaveValue('eas');

  await user.click(input);
  await user.clear(input);
  await user.type(input, 'custom-id');
  expect(value).toBe('custom-id');

  await user.clear(input);
  await user.type(input, 'west');
  await user.keyboard('{Enter}');
  expect(value).toBe('west');
  expect(input).toHaveValue('West region');
});

it('preserves multiple values and accepts creatable comma-delimited tags', async () => {
  const user = userEvent.setup();
  let values: string[] = [];
  const { rerender } = render(
    <MultiSelect
      label="Notification channels"
      options={regions}
      value={values}
      creatable
      onValueChange={(next) => {
        values = next;
      }}
    />,
  );

  const input = screen.getByRole('combobox', { name: 'Notification channels' });
  await user.click(input);
  await user.click(screen.getByRole('option', { name: 'East region' }));
  rerender(
    <MultiSelect
      label="Notification channels"
      options={regions}
      value={values}
      creatable
      onValueChange={(next) => {
        values = next;
      }}
    />,
  );
  await user.type(input, 'partner,');

  expect(values).toEqual(['east', 'partner']);
  rerender(
    <MultiSelect
      label="Notification channels"
      options={regions}
      value={values}
      creatable
      onValueChange={(next) => {
        values = next;
      }}
    />,
  );
  expect(screen.getByRole('button', { name: 'Remove east' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Remove partner' })).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: 'Remove east' }));
  expect(values).toEqual(['partner']);
});

it('removes the last tag by keyboard and skips disabled options', async () => {
  const user = userEvent.setup();
  let values: string[] = [];
  render(
    <MultiSelect
      label="Regions"
      options={regions}
      defaultValue={['east', 'partner']}
      creatable
      onValueChange={(next) => {
        values = next;
      }}
    />,
  );

  const input = screen.getByRole('combobox', { name: 'Regions' });
  expect(input).toHaveAttribute('aria-haspopup', 'listbox');
  await user.click(input);
  await user.keyboard('{Backspace}');
  expect(values).toEqual(['east']);

  await user.keyboard('{End}{Enter}');
  expect(values).toEqual(['east', 'west']);
  expect(screen.getByRole('option', { name: 'Legacy region' })).toBeDisabled();
});

it('keeps an accordion header action independent from its trigger', async () => {
  const user = userEvent.setup();
  let actionCount = 0;
  render(
    <Accordion
      ariaLabel="Sections"
      items={[
        {
          value: 'details',
          title: 'Details',
          action: (
            <button type="button" onClick={() => (actionCount += 1)}>
              Remove
            </button>
          ),
          content: <p>Section content</p>,
        },
      ]}
    />,
  );

  const trigger = screen.getByRole('button', { name: 'Details' });
  await user.click(screen.getByRole('button', { name: 'Remove' }));
  expect(actionCount).toBe(1);
  expect(trigger).toHaveAttribute('data-state', 'closed');

  trigger.focus();
  await user.keyboard('{Enter}');
  expect(trigger).toHaveAttribute('data-state', 'open');
  expect(within(screen.getByLabelText('Sections')).getByText('Section content')).toBeVisible();
});

it('supports controlled multiple expansion and disabled items', async () => {
  const user = userEvent.setup();
  let expanded: string[] = [];
  const items = [
    { value: 'one', title: 'One', content: <p>First panel</p> },
    { value: 'two', title: 'Two', content: <p>Second panel</p>, disabled: true },
  ];
  const { rerender } = render(
    <Accordion
      type="multiple"
      value={expanded}
      onValueChange={(next) => {
        expanded = next;
      }}
      items={items}
    />,
  );

  const first = screen.getByRole('button', { name: 'One' });
  const second = screen.getByRole('button', { name: 'Two' });
  await user.click(first);
  expect(expanded).toEqual(['one']);
  expect(first).toHaveAttribute('data-state', 'closed');
  expect(second).toBeDisabled();

  rerender(
    <Accordion
      type="multiple"
      value={expanded}
      onValueChange={(next) => {
        expanded = next;
      }}
      items={items}
    />,
  );
  expect(first).toHaveAttribute('data-state', 'open');
  expect(screen.getByText('First panel')).toBeVisible();
});

it('preserves a controlled selection when a cancelled confirmation restores combobox focus', async () => {
  const user = userEvent.setup();
  const focus = vi.fn();
  function Harness() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Combobox
          label="Confirmed region"
          options={regions}
          value="east"
          onFocus={focus}
          onValueChange={() => setOpen(true)}
        />
        <Modal open={open} onOpenChange={setOpen} title="Confirm region">
          <Button onClick={() => setOpen(false)}>Cancel change</Button>
        </Modal>
      </>
    );
  }
  render(<Harness />);
  const input = screen.getByRole('combobox', { name: 'Confirmed region' });
  await user.click(input);
  await user.click(screen.getByRole('option', { name: 'West region' }));
  expect(screen.getByRole('dialog', { name: 'Confirm region' })).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Cancel change' }));
  await waitFor(() => expect(input).toHaveFocus());
  expect(input).toHaveValue('East region');
  expect(input).toHaveAttribute('aria-expanded', 'false');
  expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  expect(focus.mock.calls.length).toBeGreaterThanOrEqual(2);
  await user.keyboard('{ArrowDown}');
  expect(input).toHaveAttribute('aria-expanded', 'true');
  expect(screen.getByRole('option', { name: 'West region' })).toBeInTheDocument();
});

it('keeps keyboard focus passive and still opens options when typing', async () => {
  const user = userEvent.setup();
  const focus = vi.fn();
  render(<Combobox label="Passive focus" options={regions} defaultValue="east" onFocus={focus} />);
  const input = screen.getByRole('combobox', { name: 'Passive focus' });
  await user.tab();
  expect(input).toHaveFocus();
  expect(input).toHaveValue('East region');
  expect(input).toHaveAttribute('aria-expanded', 'false');
  expect(focus).toHaveBeenCalledTimes(1);
  await user.keyboard('{Control>}a{/Control}west');
  expect(input).toHaveAttribute('aria-expanded', 'true');
  expect(screen.getByRole('option', { name: 'West region' })).toBeInTheDocument();
});

it('does not reopen a multi-select when a dialog restores focus', async () => {
  const user = userEvent.setup();
  const focus = vi.fn();
  function Harness() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <MultiSelect
          label="Restored tags"
          options={regions}
          onFocus={focus}
          onKeyDown={(event) => {
            if (event.key === 'F2') setOpen(true);
          }}
        />
        <Modal open={open} onOpenChange={setOpen} title="Review tags">
          <Button onClick={() => setOpen(false)}>Cancel review</Button>
        </Modal>
      </>
    );
  }
  render(<Harness />);
  const input = screen.getByRole('combobox', { name: 'Restored tags' });
  await user.tab();
  expect(input).toHaveFocus();
  expect(input).toHaveAttribute('aria-expanded', 'false');
  await user.keyboard('{F2}');
  await user.click(screen.getByRole('button', { name: 'Cancel review' }));
  await waitFor(() => expect(input).toHaveFocus());
  expect(input).toHaveAttribute('aria-expanded', 'false');
  expect(focus.mock.calls.length).toBeGreaterThanOrEqual(2);
  await user.click(input);
  expect(input).toHaveAttribute('aria-expanded', 'true');
  expect(screen.getByRole('option', { name: 'East region' })).toBeInTheDocument();
});
