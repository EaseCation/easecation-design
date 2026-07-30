import { forwardRef, type ComponentProps } from 'react';
export type DateRange = { from?: Date; to?: Date };
export type CalendarSelectValue = Date | DateRange | undefined;
export interface CalendarProps extends Omit<ComponentProps<'div'>, 'onSelect'> {
  mode?: 'single' | 'range';
  selected?: Date | DateRange;
  onSelect?: (value: CalendarSelectValue) => void;
  labels?: {
    single?: string;
    rangeStart?: string;
    rangeEnd?: string;
  };
}
const toValue = (date?: Date) =>
  date
    ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    : '';
const fromValue = (value: string) => {
  if (!value) return undefined;
  const [y, m, d] = value.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return Number.isNaN(date.getTime()) ? undefined : date;
};
export const Calendar = forwardRef<HTMLDivElement, CalendarProps>(function Calendar(
  { mode = 'single', selected, onSelect, labels, className, ...props },
  ref,
) {
  if (mode === 'range') {
    const range = (selected ?? {}) as DateRange;
    return (
      <div
        ref={ref}
        className={['ec-calendar', 'ec-calendar--range', className].filter(Boolean).join(' ')}
        {...props}
      >
        <label>
          <span>{labels?.rangeStart ?? 'Start date'}</span>
          <input
            type="date"
            value={toValue(range.from)}
            onChange={(e) => onSelect?.({ from: fromValue(e.target.value), to: range.to })}
          />
        </label>
        <label>
          <span>{labels?.rangeEnd ?? 'End date'}</span>
          <input
            type="date"
            value={toValue(range.to)}
            onChange={(e) => onSelect?.({ from: range.from, to: fromValue(e.target.value) })}
          />
        </label>
      </div>
    );
  }
  const date = selected instanceof Date ? selected : undefined;
  return (
    <div ref={ref} className={['ec-calendar', className].filter(Boolean).join(' ')} {...props}>
      <label>
        <span>{labels?.single ?? 'Date'}</span>
        <input
          type="date"
          value={toValue(date)}
          onChange={(e) => onSelect?.(fromValue(e.target.value))}
        />
      </label>
    </div>
  );
});
