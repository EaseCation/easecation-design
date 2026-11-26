export type DateRange = { from?: Date; to?: Date };
export type CalendarSelectValue = Date | DateRange | undefined;

export const toDateValue = (date?: Date) =>
  date && !Number.isNaN(date.getTime())
    ? `${String(date.getFullYear()).padStart(4, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    : '';

export const fromDateValue = (value: string) => {
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

export const startOfDay = (date: Date) => {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
};

export const isSameDay = (left?: Date, right?: Date) =>
  Boolean(left && right && toDateValue(left) === toDateValue(right));

export const compareDay = (left: Date, right: Date) =>
  toDateValue(left).localeCompare(toDateValue(right));

export const addMonths = (date: Date, count: number) => {
  const next = new Date(date);
  const day = next.getDate();
  next.setDate(1);
  next.setMonth(next.getMonth() + count);
  const maxDay = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate();
  next.setDate(Math.min(day, maxDay));
  return next;
};

export const boundValue = (value?: Date | string) =>
  typeof value === 'string' ? toDateValue(fromDateValue(value)) : toDateValue(value);

export function isDateDisabled(
  date: Date,
  options: { min?: string; max?: string; step?: number; disabled?: boolean; readOnly?: boolean },
) {
  if (options.disabled || options.readOnly) return true;
  const value = toDateValue(date);
  if (options.min && value < options.min) return true;
  if (options.max && value > options.max) return true;
  if (options.step && options.step > 1 && options.min) {
    const minDate = fromDateValue(options.min);
    if (!minDate) return false;
    const diff = Math.round(
      (startOfDay(date).getTime() - startOfDay(minDate).getTime()) / 86_400_000,
    );
    return diff % options.step !== 0;
  }
  return false;
}

/** Build a 6×7 local-calendar matrix for the visible month. */
export function buildMonthMatrix(month: Date, weekStartsOn: 0 | 1) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const offset = (first.getDay() - weekStartsOn + 7) % 7;
  const start = new Date(first);
  start.setDate(1 - offset);
  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    date.setHours(0, 0, 0, 0);
    return date;
  });
}
