import * as React from 'react';

import { cn } from '../lib/utils';

type DateRange = {
  from?: Date;
  to?: Date;
};

type CalendarSelectValue = Date | DateRange | undefined;

export interface CalendarProps extends Omit<React.ComponentProps<'div'>, 'onSelect'> {
  mode?: 'single' | 'range';
  selected?: Date | DateRange;
  onSelect?: (value: CalendarSelectValue) => void;
  defaultMonth?: Date;
  numberOfMonths?: number;
}

function toInputValue(date?: Date) {
  if (!date) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function fromInputValue(value: string) {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export function Calendar({
  mode = 'single',
  selected,
  onSelect,
  className,
  ...props
}: CalendarProps) {
  if (mode === 'range') {
    const range = (selected ?? {}) as DateRange;

    return (
      <div className={cn('grid gap-3 sm:grid-cols-2', className)} {...props}>
        <label className="grid gap-1 text-sm">
          <span className="text-muted-foreground">开始日期</span>
          <input
            type="date"
            className="touch-target rounded-lg border border-input bg-background px-3 text-sm"
            value={toInputValue(range.from)}
            onChange={(event) =>
              onSelect?.({
                from: fromInputValue(event.target.value),
                to: range.to,
              })
            }
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="text-muted-foreground">结束日期</span>
          <input
            type="date"
            className="touch-target rounded-lg border border-input bg-background px-3 text-sm"
            value={toInputValue(range.to)}
            onChange={(event) =>
              onSelect?.({
                from: range.from,
                to: fromInputValue(event.target.value),
              })
            }
          />
        </label>
      </div>
    );
  }

  const date = selected instanceof Date ? selected : undefined;

  return (
    <div className={cn('grid gap-1 text-sm', className)} {...props}>
      <span className="text-muted-foreground">日期</span>
      <input
        type="date"
        className="touch-target rounded-lg border border-input bg-background px-3 text-sm"
        value={toInputValue(date)}
        onChange={(event) => onSelect?.(fromInputValue(event.target.value))}
      />
    </div>
  );
}
