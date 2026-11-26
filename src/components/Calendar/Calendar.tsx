import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import {
  forwardRef,
  useEffect,
  useId,
  useMemo,
  useState,
  type ComponentProps,
  type KeyboardEvent,
} from 'react';
import { IconButton } from '../Button';
import { useLocale } from '../../locale/LocaleProvider';
import { cn } from '../../utils/classNames';
import {
  addMonths,
  boundValue,
  buildMonthMatrix,
  compareDay,
  isDateDisabled,
  isSameDay,
  startOfDay,
  type CalendarSelectValue,
  type DateRange,
} from './dateMath';

export type { CalendarSelectValue, DateRange };

export interface CalendarProps extends Omit<ComponentProps<'div'>, 'onSelect'> {
  mode?: 'single' | 'range';
  selected?: Date | DateRange;
  onSelect?: (value: CalendarSelectValue) => void;
  /** Visible month under control. Defaults to the selected date or today. */
  month?: Date;
  defaultMonth?: Date;
  onMonthChange?: (month: Date) => void;
  showLabel?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  /** Inclusive local-calendar date bounds. Strings use YYYY-MM-DD. */
  min?: Date | string;
  max?: Date | string;
  /** Disable days that are not an integer multiple of this day step from min. */
  step?: number;
  labels?: {
    single?: string;
    rangeStart?: string;
    rangeEnd?: string;
    previousMonth?: string;
    nextMonth?: string;
  };
}

function resolveWeekStartsOn(locale: string): 0 | 1 {
  try {
    const info = (new Intl.Locale(locale) as Intl.Locale & { weekInfo?: { firstDay?: number } })
      .weekInfo;
    if (info?.firstDay === 1) return 1;
    if (info?.firstDay === 7 || info?.firstDay === 0) return 0;
  } catch {
    /* Intl.Locale.weekInfo is not available in every runtime. */
  }
  return locale.toLowerCase().startsWith('zh') ? 1 : 0;
}

function weekdayLabels(locale: string, weekStartsOn: 0 | 1) {
  const formatter = new Intl.DateTimeFormat(locale, { weekday: 'narrow' });
  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(Date.UTC(2024, 0, 7 + weekStartsOn + index));
    return formatter.format(day);
  });
}

function monthTitle(locale: string, month: Date) {
  return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long' }).format(month);
}

function dayLabel(locale: string, date: Date) {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export const Calendar = forwardRef<HTMLDivElement, CalendarProps>(function Calendar(
  {
    mode = 'single',
    selected,
    onSelect,
    month: controlledMonth,
    defaultMonth,
    onMonthChange,
    showLabel = false,
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
  const { locale, messages } = useLocale();
  const labelId = useId();
  const gridId = useId();
  const minValue = boundValue(min);
  const maxValue = boundValue(max);
  const selectedSingle = selected instanceof Date ? startOfDay(selected) : undefined;
  const selectedRange = mode === 'range' ? ((selected ?? {}) as DateRange) : undefined;
  const selectedAnchor =
    selectedSingle ??
    (selectedRange?.from ? startOfDay(selectedRange.from) : undefined) ??
    (selectedRange?.to ? startOfDay(selectedRange.to) : undefined);
  const [uncontrolledMonth, setUncontrolledMonth] = useState(() =>
    startOfDay(
      defaultMonth ??
        selectedAnchor ??
        new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    ),
  );
  const visibleMonth = startOfDay(
    controlledMonth ??
      uncontrolledMonth ??
      selectedAnchor ??
      new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );
  const setVisibleMonth = (next: Date) => {
    const month = new Date(next.getFullYear(), next.getMonth(), 1);
    if (controlledMonth === undefined) setUncontrolledMonth(month);
    onMonthChange?.(month);
  };

  useEffect(() => {
    if (controlledMonth !== undefined || !selectedAnchor) return;
    if (
      selectedAnchor.getFullYear() !== uncontrolledMonth.getFullYear() ||
      selectedAnchor.getMonth() !== uncontrolledMonth.getMonth()
    ) {
      setUncontrolledMonth(new Date(selectedAnchor.getFullYear(), selectedAnchor.getMonth(), 1));
    }
  }, [controlledMonth, selectedAnchor, uncontrolledMonth]);

  const weekStartsOn = resolveWeekStartsOn(locale);
  const days = useMemo(
    () => buildMonthMatrix(visibleMonth, weekStartsOn),
    [visibleMonth, weekStartsOn],
  );
  const weekdays = useMemo(() => weekdayLabels(locale, weekStartsOn), [locale, weekStartsOn]);
  const title = monthTitle(locale, visibleMonth);
  const caption =
    mode === 'range'
      ? (labels?.rangeStart ?? messages.startDate)
      : (labels?.single ?? messages.date);
  const interactive = !disabled && !readOnly;

  const pick = (date: Date) => {
    if (
      !interactive ||
      isDateDisabled(date, { min: minValue, max: maxValue, step, disabled, readOnly })
    ) {
      return;
    }
    if (mode === 'single') {
      onSelect?.(startOfDay(date));
      return;
    }
    const range = selectedRange ?? {};
    if (!range.from || (range.from && range.to)) {
      onSelect?.({ from: startOfDay(date), to: undefined });
      return;
    }
    if (compareDay(date, range.from) < 0) {
      onSelect?.({ from: startOfDay(date), to: startOfDay(range.from) });
      return;
    }
    onSelect?.({ from: startOfDay(range.from), to: startOfDay(date) });
  };

  const moveMonth = (delta: number) => {
    if (!interactive) return;
    setVisibleMonth(addMonths(visibleMonth, delta));
  };

  const onGridKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const target = event.target;
    if (!(target instanceof HTMLElement) || target.getAttribute('role') !== 'gridcell') return;
    const current = fromIndex(target.dataset.dayIndex);
    if (current === undefined) return;
    const move = (offset: number) => {
      event.preventDefault();
      const next = days[current + offset];
      if (!next) return;
      if (
        next.getMonth() !== visibleMonth.getMonth() ||
        next.getFullYear() !== visibleMonth.getFullYear()
      ) {
        setVisibleMonth(next);
      }
      requestAnimationFrame(() => {
        const node = document.getElementById(`${gridId}-day-${toDateValueKey(next)}`);
        node?.focus();
      });
    };
    if (event.key === 'ArrowRight') move(1);
    else if (event.key === 'ArrowLeft') move(-1);
    else if (event.key === 'ArrowDown') move(7);
    else if (event.key === 'ArrowUp') move(-7);
    else if (event.key === 'Home') move(-current);
    else if (event.key === 'End') move(41 - current);
    else if (event.key === 'PageUp') {
      event.preventDefault();
      moveMonth(-1);
    } else if (event.key === 'PageDown') {
      event.preventDefault();
      moveMonth(1);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      pick(days[current]);
    }
  };

  const today = startOfDay(new Date());
  const enabledInMonth = (day: Date) =>
    day.getMonth() === visibleMonth.getMonth() &&
    day.getFullYear() === visibleMonth.getFullYear() &&
    !isDateDisabled(day, { min: minValue, max: maxValue, step, disabled, readOnly });
  const focusValue =
    selectedSingle ??
    selectedRange?.to ??
    selectedRange?.from ??
    (enabledInMonth(today) ? today : undefined) ??
    days.find(enabledInMonth) ??
    days[0];

  return (
    <div
      ref={ref}
      className={cn('ec-calendar', mode === 'range' && 'ec-calendar--range', className)}
      data-disabled={disabled ? 'true' : undefined}
      data-readonly={readOnly ? 'true' : undefined}
      {...props}
    >
      {showLabel ? (
        <div className="ec-calendar__label" id={labelId}>
          {caption}
          {required ? <span aria-hidden="true"> *</span> : null}
        </div>
      ) : null}
      <div
        className="ec-calendar__panel"
        role="group"
        aria-labelledby={showLabel ? labelId : undefined}
      >
        <div className="ec-calendar__header">
          <div className="ec-calendar__month-label" aria-live="polite">
            <span>{title}</span>
            <ChevronDownIcon aria-hidden="true" />
          </div>
          <div className="ec-calendar__nav">
            <IconButton
              label={labels?.previousMonth ?? messages.previousMonth}
              icon={<ChevronUpIcon />}
              size="xs"
              pressable={false}
              disabled={!interactive}
              onClick={() => moveMonth(-1)}
            />
            <IconButton
              label={labels?.nextMonth ?? messages.nextMonth}
              icon={<ChevronDownIcon />}
              size="xs"
              pressable={false}
              disabled={!interactive}
              onClick={() => moveMonth(1)}
            />
          </div>
        </div>
        <div
          id={gridId}
          className="ec-calendar__grid"
          role="grid"
          aria-label={caption}
          aria-readonly={readOnly || undefined}
          onKeyDown={onGridKeyDown}
        >
          <div className="ec-calendar__weekdays" role="row">
            {weekdays.map((day, index) => (
              <span
                key={`${weekStartsOn}-${index}`}
                className="ec-calendar__weekday"
                role="columnheader"
              >
                {day}
              </span>
            ))}
          </div>
          <div className="ec-calendar__days" role="rowgroup">
            {chunkWeeks(days).map((week, weekIndex) => (
              <div key={weekIndex} className="ec-calendar__week" role="row">
                {week.map((date, dayIndex) => {
                  const absoluteIndex = weekIndex * 7 + dayIndex;
                  const outside = date.getMonth() !== visibleMonth.getMonth();
                  const selectedDay =
                    mode === 'single'
                      ? isSameDay(date, selectedSingle)
                      : isSameDay(date, selectedRange?.from) || isSameDay(date, selectedRange?.to);
                  const inRange =
                    mode === 'range' &&
                    selectedRange?.from &&
                    selectedRange?.to &&
                    compareDay(date, selectedRange.from) >= 0 &&
                    compareDay(date, selectedRange.to) <= 0;
                  const dayDisabled = isDateDisabled(date, {
                    min: minValue,
                    max: maxValue,
                    step,
                    disabled,
                    readOnly,
                  });
                  const isToday = isSameDay(date, today);
                  const tabIndex =
                    interactive && !dayDisabled && isSameDay(date, focusValue) ? 0 : -1;
                  return (
                    <button
                      key={toDateValueKey(date)}
                      id={`${gridId}-day-${toDateValueKey(date)}`}
                      type="button"
                      role="gridcell"
                      className="ec-calendar__day"
                      data-day-index={absoluteIndex}
                      data-outside={outside ? 'true' : undefined}
                      data-selected={selectedDay ? 'true' : undefined}
                      data-in-range={inRange ? 'true' : undefined}
                      data-today={isToday ? 'true' : undefined}
                      aria-label={dayLabel(locale, date)}
                      aria-selected={selectedDay || undefined}
                      aria-current={isToday ? 'date' : undefined}
                      aria-disabled={dayDisabled || undefined}
                      disabled={dayDisabled}
                      tabIndex={tabIndex}
                      onClick={() => pick(date)}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

function chunkWeeks(days: Date[]) {
  return Array.from({ length: 6 }, (_, index) => days.slice(index * 7, index * 7 + 7));
}

function toDateValueKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function fromIndex(value?: string) {
  if (value === undefined) return undefined;
  const index = Number(value);
  return Number.isInteger(index) ? index : undefined;
}
