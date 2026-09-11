import { forwardRef, type ComponentProps } from 'react';
import { cn } from '../../utils/classNames';
export type DateRange = { from?: Date; to?: Date };
export type CalendarSelectValue = Date | DateRange | undefined;
export interface CalendarProps extends Omit<ComponentProps<'div'>, 'onSelect'> {
  mode?: 'single' | 'range';
  selected?: Date | DateRange;
  onSelect?: (value: CalendarSelectValue) => void;
  showLabel?: boolean;
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
  { mode = 'single', selected, onSelect, showLabel = true, labels, className, ...props },
  ref,
) {
  if (mode === 'range') {
    const range = (selected ?? {}) as DateRange;
    return (
      <div ref={ref} className={cn('ec-calendar', 'ec-calendar--range', className)} {...props}>
        <label>
          {showLabel ? <span>{labels?.rangeStart ?? 'Start date'}</span> : null}
          <input
            type="date"
            aria-label={showLabel ? undefined : (labels?.rangeStart ?? 'Start date')}
            value={toValue(range.from)}
            onChange={(e) => onSelect?.({ from: fromValue(e.target.value), to: range.to })}
          />
        </label>
        <label>
          {showLabel ? <span>{labels?.rangeEnd ?? 'End date'}</span> : null}
          <input
            type="date"
            aria-label={showLabel ? undefined : (labels?.rangeEnd ?? 'End date')}
            value={toValue(range.to)}
            onChange={(e) => onSelect?.({ from: range.from, to: fromValue(e.target.value) })}
          />
        </label>
      </div>
    );
  }
  const date = selected instanceof Date ? selected : undefined;
  return (
    <div ref={ref} className={cn('ec-calendar', className)} {...props}>
      <label>
        {showLabel ? <span>{labels?.single ?? 'Date'}</span> : null}
        <input
          type="date"
          aria-label={showLabel ? undefined : (labels?.single ?? 'Date')}
          value={toValue(date)}
          onChange={(e) => onSelect?.(fromValue(e.target.value))}
        />
      </label>
    </div>
  );
});
