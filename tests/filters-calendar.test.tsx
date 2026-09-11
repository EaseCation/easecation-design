import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Calendar, DateTimePicker, FilterBar, FilterField, FilterPicker, Input } from '../src';
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
it('keeps a disabled date time picker closed', async () => {
  const user = userEvent.setup();
  render(<DateTimePicker value="2026-07-28T09:30" onChange={vi.fn()} disabled />);
  const trigger = screen.getByRole('button', { name: /2026-07-28/ });
  expect(trigger).toBeDisabled();
  await user.click(trigger);
  expect(screen.queryByLabelText('Time')).not.toBeInTheDocument();
});
