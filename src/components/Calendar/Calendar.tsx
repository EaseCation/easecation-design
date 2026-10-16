import { forwardRef, type ComponentProps } from 'react';
import { cn } from '../../utils/classNames';
import { useLocale } from '../../locale/LocaleProvider';
export type DateRange = { from?: Date; to?: Date };
export type CalendarSelectValue = Date | DateRange | undefined;
export interface CalendarProps extends Omit<ComponentProps<'div'>, 'onSelect'> {
  mode?: 'single' | 'range';
  selected?: Date | DateRange;
  onSelect?: (value: CalendarSelectValue) => void;
  showLabel?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  /** Inclusive local-calendar date bounds. Strings use YYYY-MM-DD. */
  min?: Date | string;
  max?: Date | string;
  /** Native date-input step in days. */
  step?: number;
  labels?: {
    single?: string;
    rangeStart?: string;
    rangeEnd?: string;
  };
}
const toValue = (date?: Date) =>
  date && !Number.isNaN(date.getTime())
    ? `${String(date.getFullYear()).padStart(4, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    : '';
const fromValue = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
  const [y, m, d] = value.split('-').map(Number);
  const date = new Date(0);
  date.setFullYear(y, m - 1, d);
  date.setHours(0, 0, 0, 0);
  return Number.isNaN(date.getTime()) ||
    date.getFullYear() !== y ||
    date.getMonth() !== m - 1 ||
    date.getDate() !== d
    ? undefined
    : date;
};
export const Calendar = forwardRef<HTMLDivElement, CalendarProps>(function Calendar(
  {
    mode = 'single',
    selected,
    onSelect,
    showLabel = true,
    labels,
    className,
    disabled,
    readOnly,
    required,
    min,
    max,
    step,
    ...props
  },
  ref,
) {
  const { messages } = useLocale();
  const bound = (value?: Date | string) =>
    typeof value === 'string' ? toValue(fromValue(value)) : toValue(value);
  const minValue = bound(min);
  const maxValue = bound(max);
  const inputProps = {
    disabled,
    readOnly,
    required,
    min: minValue || undefined,
    max: maxValue || undefined,
    step,
  };
  const accept = (input: HTMLInputElement) => !disabled && !readOnly && input.validity.valid;
  if (mode === 'range') {
    const range = (selected ?? {}) as DateRange;
    return (
      <div ref={ref} className={cn('ec-calendar', 'ec-calendar--range', className)} {...props}>
        <label>
          {showLabel ? <span>{labels?.rangeStart ?? messages.startDate}</span> : null}
          <input
            type="date"
            {...inputProps}
            aria-label={showLabel ? undefined : (labels?.rangeStart ?? messages.startDate)}
            value={toValue(range.from)}
            onChange={(e) => {
              if (accept(e.target)) onSelect?.({ from: fromValue(e.target.value), to: range.to });
            }}
          />
        </label>
        <label>
          {showLabel ? <span>{labels?.rangeEnd ?? messages.endDate}</span> : null}
          <input
            type="date"
            {...inputProps}
            aria-label={showLabel ? undefined : (labels?.rangeEnd ?? messages.endDate)}
            value={toValue(range.to)}
            onChange={(e) => {
              if (accept(e.target)) onSelect?.({ from: range.from, to: fromValue(e.target.value) });
            }}
          />
        </label>
      </div>
    );
  }
  const date = selected instanceof Date ? selected : undefined;
  return (
    <div ref={ref} className={cn('ec-calendar', className)} {...props}>
      <label>
        {showLabel ? <span>{labels?.single ?? messages.date}</span> : null}
        <input
          type="date"
          {...inputProps}
          aria-label={showLabel ? undefined : (labels?.single ?? messages.date)}
          value={toValue(date)}
          onChange={(e) => {
            if (accept(e.target)) onSelect?.(fromValue(e.target.value));
          }}
        />
      </label>
    </div>
  );
});
