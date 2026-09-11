import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Calendar,
  DateRangePicker,
  DateTimePicker,
  FilterBar,
  FilterField,
  FilterPicker,
  FilterSelect,
  Input,
  MultiSelect,
} from '../src';
it('emits single and range calendar values', () => {
  const select = vi.fn();
  const { rerender } = render(<Calendar selected={new Date(2026, 6, 28)} onSelect={select} />);
  fireEvent.change(screen.getByLabelText('Date'), { target: { value: '2026-07-29' } });
  expect(select).toHaveBeenCalled();
  rerender(
    <Calendar
      mode="range"
      selected={{}}
      onSelect={select}
      labels={{ rangeStart: '开始日期', rangeEnd: '结束日期' }}
    />,
  );
  expect(screen.getByLabelText('开始日期')).toBeInTheDocument();
  expect(screen.getByLabelText('结束日期')).toBeInTheDocument();
});
it('submits filter search and handles multiple picker', async () => {
  const user = userEvent.setup();
  const search = vi.fn();
  const change = vi.fn();
  render(
    <>
      <FilterBar onSearch={search}>
        <FilterField label="Keyword">
          <Input aria-label="Keyword" />
        </FilterField>
      </FilterBar>
      <FilterPicker
        mode="multiple"
        value={[]}
        onValueChange={change}
        options={[{ value: 'active', label: 'Active' }]}
      />
    </>,
  );
  await user.type(screen.getByLabelText('Keyword'), 'report{Enter}');
  expect(search).toHaveBeenCalledOnce();
  await user.click(screen.getByRole('button', { name: 'Select options' }));
  await user.click(screen.getByRole('menuitemcheckbox', { name: 'Active' }));
  expect(change).toHaveBeenCalledWith(['active']);
});
it('supports top-aligned fields and range-width filters', () => {
  const { container } = render(
    <FilterBar align="start">
      <FilterField label="Range" width="range">
        <Input aria-label="Range" />
      </FilterField>
    </FilterBar>,
  );

  expect(container.firstElementChild).toHaveClass('ec-filter-bar--start');
  expect(screen.getByLabelText('Range').closest('.ec-filter-field')).toHaveClass(
    'ec-filter-field--range',
  );
});
it('places multi-select controls on the filter bar sizing path', () => {
  const { container } = render(
    <FilterBar align="start">
      <FilterField label="Operators" width="wide">
        <MultiSelect label="Operators" options={[]} value={[]} onValueChange={vi.fn()} creatable />
      </FilterField>
      <FilterField label="Target">
        <Input aria-label="Target" />
      </FilterField>
    </FilterBar>,
  );

  expect(container.querySelector('.ec-multi-select')).toBeInTheDocument();
  expect(container.querySelector('.ec-multi-select__control')).toBeInTheDocument();
});
it('uses large toolbar controls by default and accepts trigger classes', () => {
  render(
    <>
      <FilterSelect
        value=""
        onValueChange={vi.fn()}
        options={[{ value: 'active', label: 'Active' }]}
        triggerClassName="custom-filter-trigger"
        aria-label="Status"
      />
      <FilterPicker
        mode="multiple"
        value={[]}
        onValueChange={vi.fn()}
        options={[{ value: 'active', label: 'Active' }]}
        aria-label="Teams"
      />
    </>,
  );
  expect(screen.getByRole('combobox', { name: 'Status' })).toHaveClass('custom-filter-trigger');
  expect(screen.getByRole('combobox', { name: 'Status' })).toHaveAttribute('data-state', 'closed');
  expect(screen.getByRole('combobox', { name: 'Status' })).toHaveClass('ec-select__trigger--lg');
  expect(screen.getByRole('button', { name: 'Teams' })).toHaveAttribute('data-size', 'lg');
});
it('combines date and time values', async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  render(<DateTimePicker value="2026-07-28T09:30" onChange={change} />);
  await user.click(screen.getByRole('button', { name: /2026-07-28/ }));
  fireEvent.change(screen.getByLabelText('Time'), { target: { value: '10:15' } });
  expect(change).toHaveBeenCalledWith('2026-07-28T10:15');
});
it('focuses the date field without scrolling when opened', async () => {
  const user = userEvent.setup();
  const focus = vi.spyOn(HTMLInputElement.prototype, 'focus');
  render(<DateTimePicker value="" onChange={vi.fn()} />);

  await user.click(screen.getByRole('button', { name: 'Select date and time' }));

  expect(screen.getByLabelText('Date')).toHaveFocus();
  expect(focus).toHaveBeenCalledWith({ preventScroll: true });
  focus.mockRestore();
});
it('keeps trigger focus when opened with a coarse pointer', async () => {
  const user = userEvent.setup();
  const matchMedia = vi.spyOn(window, 'matchMedia').mockReturnValue({
    matches: true,
  } as MediaQueryList);
  render(<DateTimePicker value="" onChange={vi.fn()} />);
  const trigger = screen.getByRole('button', { name: 'Select date and time' });

  await user.click(trigger);

  expect(trigger).toHaveFocus();
  expect(screen.getByLabelText('Date')).not.toHaveFocus();
  matchMedia.mockRestore();
});
it('keeps a disabled date time picker closed', async () => {
  const user = userEvent.setup();
  render(<DateTimePicker value="2026-07-28T09:30" onChange={vi.fn()} disabled />);
  const trigger = screen.getByRole('button', { name: /2026-07-28/ });
  expect(trigger).toBeDisabled();
  await user.click(trigger);
  expect(screen.queryByLabelText('Time')).not.toBeInTheDocument();
});

it('applies a complete date range without mutating the controlled value early', async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  render(
    <DateRangePicker
      value={{ start: '2026-07-01', end: '2026-07-07' }}
      onChange={change}
      startLabel="Start"
      endLabel="End"
    />,
  );

  const trigger = screen.getByRole('button', { name: '2026/07/01 - 2026/07/07' });
  await user.click(trigger);
  fireEvent.change(screen.getByLabelText('End'), { target: { value: '2026-07-09' } });
  expect(change).not.toHaveBeenCalled();
  await user.click(screen.getByRole('button', { name: 'Apply' }));

  expect(change).toHaveBeenCalledWith({ start: '2026-07-01', end: '2026-07-09' });
  expect(screen.queryByLabelText('End')).not.toBeInTheDocument();
});

it('preserves precise times in datetime mode', async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  render(
    <DateRangePicker
      mode="datetime"
      value={{ start: '2026-07-01T09:30', end: '2026-07-07T18:00' }}
      onChange={change}
      startTimeLabel="From time"
      endTimeLabel="To time"
    />,
  );

  await user.click(screen.getByRole('button', { name: /2026\/07\/01/ }));
  fireEvent.change(screen.getByLabelText('From time'), { target: { value: '10:15' } });
  fireEvent.change(screen.getByLabelText('To time'), { target: { value: '19:45' } });
  await user.click(screen.getByRole('button', { name: 'Apply' }));

  expect(change).toHaveBeenCalledWith({
    start: '2026-07-01T10:15',
    end: '2026-07-07T19:45',
  });
});

it.each([
  ['start', 'Start', '2026-07-01', { start: '2026-07-01', end: '' }],
  ['end', 'End', '2026-07-09', { start: '', end: '2026-07-09' }],
] as const)('applies an open range with only the %s value', async (_, label, input, expected) => {
  const user = userEvent.setup();
  const change = vi.fn();
  render(
    <DateRangePicker
      value={{ start: '', end: '' }}
      onChange={change}
      startLabel="Start"
      endLabel="End"
      allowOpenRange
    />,
  );

  await user.click(screen.getByRole('button', { name: 'Select date range' }));
  fireEvent.change(screen.getByLabelText(label), { target: { value: input } });
  await user.click(screen.getByRole('button', { name: 'Apply' }));

  expect(change).toHaveBeenCalledWith(expected);
});

it('still requires both values unless open ranges are enabled', async () => {
  const user = userEvent.setup();
  render(
    <DateRangePicker
      value={{ start: '', end: '' }}
      onChange={vi.fn()}
      startLabel="Start"
      endLabel="End"
    />,
  );

  await user.click(screen.getByRole('button', { name: 'Select date range' }));
  fireEvent.change(screen.getByLabelText('Start'), { target: { value: '2026-07-01' } });

  expect(screen.getByRole('button', { name: 'Apply' })).toBeDisabled();
});

it('commits presets immediately and rejects an inverted range', async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  const { rerender } = render(
    <DateRangePicker
      value={{ start: '', end: '' }}
      onChange={change}
      presets={[{ label: 'Last 7 days', value: { start: '2026-07-01', end: '2026-07-07' } }]}
    />,
  );

  await user.click(screen.getByRole('button', { name: 'Select date range' }));
  await user.click(screen.getByRole('button', { name: 'Last 7 days' }));
  expect(change).toHaveBeenCalledWith({ start: '2026-07-01', end: '2026-07-07' });

  rerender(
    <DateRangePicker
      value={{ start: '2026-07-07', end: '2026-07-01' }}
      onChange={change}
      invalidRangeMessage="Invalid range"
    />,
  );
  await user.click(screen.getByRole('button', { name: /2026\/07\/07/ }));
  expect(screen.getByRole('alert')).toHaveTextContent('Invalid range');
  expect(screen.getByRole('button', { name: 'Apply' })).toBeDisabled();
});

it('keeps a disabled date range picker closed', async () => {
  const user = userEvent.setup();
  render(
    <DateRangePicker
      value={{ start: '2026-07-01', end: '2026-07-07' }}
      onChange={vi.fn()}
      disabled
    />,
  );
  const trigger = screen.getByRole('button', { name: /2026\/07\/01/ });
  expect(trigger).toBeDisabled();
  await user.click(trigger);
  expect(screen.queryByText('Apply')).not.toBeInTheDocument();
});

it('focuses the range start on desktop and keeps trigger focus on coarse pointers', async () => {
  const user = userEvent.setup();
  const { unmount } = render(
    <DateRangePicker value={{ start: '', end: '' }} onChange={vi.fn()} startLabel="Range start" />,
  );
  await user.click(screen.getByRole('button', { name: 'Select date range' }));
  expect(screen.getByLabelText('Range start')).toHaveFocus();
  unmount();

  const matchMedia = vi.spyOn(window, 'matchMedia').mockReturnValue({
    matches: true,
  } as MediaQueryList);
  render(
    <DateRangePicker value={{ start: '', end: '' }} onChange={vi.fn()} startLabel="Range start" />,
  );
  const trigger = screen.getByRole('button', { name: 'Select date range' });
  await user.click(trigger);
  expect(trigger).toHaveFocus();
  expect(screen.getByLabelText('Range start')).not.toHaveFocus();
  matchMedia.mockRestore();
});
