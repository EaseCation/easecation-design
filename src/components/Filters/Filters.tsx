import { CalendarIcon, ChevronDownIcon } from 'lucide-react';
import {
  forwardRef,
  useId,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { Button, type ComponentSize } from '../Button';
import { Calendar, type DateRange } from '../Calendar';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../DropdownMenu';
import { Input } from '../Input';
import { Label } from '../Label';
import { Popover, PopoverContent, PopoverTrigger } from '../Popover';
import { Select } from '../Select';
import { cn } from '../../utils/classNames';
import { useLocale } from '../../locale/LocaleProvider';
export function createFilterEnterSearchHandler(onSearch?: () => void) {
  return (event: KeyboardEvent<HTMLElement>) => {
    if (
      !onSearch ||
      event.key !== 'Enter' ||
      event.defaultPrevented ||
      event.nativeEvent.isComposing ||
      event.nativeEvent.keyCode === 229
    )
      return;
    const target = event.target;
    if (
      !(target instanceof HTMLInputElement) ||
      target.type === 'button' ||
      target.type === 'submit'
    )
      return;
    event.preventDefault();
    onSearch();
  };
}
export interface FilterBarProps extends ComponentProps<'div'> {
  actions?: ReactNode;
  variant?: 'card' | 'plain';
  align?: 'start' | 'end';
  onSearch?: () => void;
}
export function FilterBar({
  className,
  actions,
  children,
  variant = 'plain',
  align = 'end',
  onSearch,
  onKeyDown,
  ...props
}: FilterBarProps) {
  return (
    <div
      className={cn(
        'ec-filter-bar',
        `ec-filter-bar--${variant}`,
        align === 'start' && 'ec-filter-bar--start',
        className,
      )}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        createFilterEnterSearchHandler(onSearch)(event);
      }}
      {...props}
    >
      <div className="ec-filter-bar__fields">{children}</div>
      {actions ? <div className="ec-filter-bar__actions">{actions}</div> : null}
    </div>
  );
}
export function FilterField({
  label,
  children,
  className,
  htmlFor,
  layout = 'stack',
  width,
}: {
  label: string;
  children: ReactNode;
  className?: string;
  htmlFor?: string;
  layout?: 'stack' | 'inline';
  width?: 'wide' | 'range';
}) {
  return (
    <div
      className={cn(
        'ec-filter-field',
        `ec-filter-field--${layout}`,
        width && `ec-filter-field--${width}`,
        className,
      )}
    >
      <Label htmlFor={htmlFor}>{label}</Label>
      <div>{children}</div>
    </div>
  );
}
export type FilterSelectOption = { value: string; label: string };
export interface FilterSelectProps extends Omit<ComponentProps<typeof Select>, 'options' | 'ref'> {
  value: string;
  onValueChange: (value: string) => void;
  options: FilterSelectOption[];
}
export const FilterSelect = forwardRef<HTMLButtonElement, FilterSelectProps>(function FilterSelect(
  {
    value,
    onValueChange,
    options,
    placeholder = 'Select an option',
    className,
    triggerClassName,
    size = 'lg',
    disabled,
    'aria-label': ariaLabel,
    ...controlProps
  },
  ref,
) {
  return (
    <Select
      {...controlProps}
      ref={ref}
      className={cn('ec-filter-select', className)}
      value={value}
      onValueChange={onValueChange}
      options={options}
      placeholder={placeholder}
      label={ariaLabel ?? controlProps.label}
      triggerClassName={triggerClassName}
      size={size}
      disabled={disabled}
    />
  );
});

export type FilterPickerOption = FilterSelectOption;
type PickerBase = {
  options: FilterPickerOption[];
  placeholder?: string;
  clearLabel?: string;
  selectedSeparator?: string;
  className?: string;
  triggerClassName?: string;
  size?: ComponentSize;
  disabled?: boolean;
  'aria-label'?: string;
};
export type FilterPickerProps =
  | (PickerBase & { mode?: 'single'; value: string; onValueChange: (value: string) => void })
  | (PickerBase & { mode: 'multiple'; value: string[]; onValueChange: (value: string[]) => void });
export function FilterPicker(props: FilterPickerProps) {
  const { messages } = useLocale();
  if (props.mode !== 'multiple') return <FilterSelect {...props} />;
  const labels = props.options.filter((o) => props.value.includes(o.value)).map((o) => o.label);
  const text = labels.length
    ? labels.join(props.selectedSeparator ?? ', ')
    : (props.placeholder ?? 'Select options');
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={props.disabled}>
        <Button
          variant="outline"
          size={props.size ?? 'lg'}
          pressable={false}
          className={['ec-filter-picker', props.className, props.triggerClassName]
            .filter(Boolean)
            .join(' ')}
          aria-label={props['aria-label']}
          trailingIcon={<ChevronDownIcon aria-hidden="true" />}
        >
          <span className="ec-filter-picker__label">{text}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="ec-filter-picker__menu">
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            props.onValueChange([]);
          }}
        >
          {props.clearLabel ?? messages.all}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {props.options.map((o) => (
          <DropdownMenuCheckboxItem
            key={o.value}
            checked={props.value.includes(o.value)}
            onCheckedChange={(checked) =>
              props.onValueChange(
                checked ? [...props.value, o.value] : props.value.filter((v) => v !== o.value),
              )
            }
            onSelect={(e) => e.preventDefault()}
          >
            <span className="ec-filter-picker__option" title={o.label}>
              {o.label}
            </span>
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export type TimePrecision = 'minute' | 'second';
const normalizeTime = (value: string, precision: TimePrecision) =>
  precision === 'second'
    ? value.length === 5
      ? `${value}:00`
      : value.slice(0, 8)
    : value.slice(0, 5);
const parse = (value: string, precision: TimePrecision) => {
  const [date, time = ''] = value.split('T');
  return { date: date ?? '', time: normalizeTime(time, precision) };
};
export interface DateTimePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  dateLabel?: string;
  timeLabel?: string;
  timePrecision?: TimePrecision;
  className?: string;
  size?: ComponentSize;
  disabled?: boolean;
  'aria-label'?: string;
}
export function DateTimePicker({
  value,
  onChange,
  placeholder = 'Select date and time',
  dateLabel = 'Date',
  timeLabel = 'Time',
  timePrecision = 'minute',
  className,
  size = 'lg',
  disabled = false,
  'aria-label': ariaLabel,
}: DateTimePickerProps) {
  const id = useId();
  const dateId = `${id}-date`;
  const timeId = `${id}-time`;
  const dateInputRef = useRef<HTMLInputElement>(null);
  const part = parse(value, timePrecision);
  const defaultTime = timePrecision === 'second' ? '00:00:00' : '00:00';
  const content = useMemo(
    () => (
      <div className="ec-datetime-fields">
        <Label htmlFor={dateId}>{dateLabel}</Label>
        <Input
          ref={dateInputRef}
          id={dateId}
          type="date"
          value={part.date}
          disabled={disabled}
          onChange={(e) =>
            onChange(e.target.value ? `${e.target.value}T${part.time || defaultTime}` : '')
          }
        />
        <Label htmlFor={timeId}>{timeLabel}</Label>
        <Input
          id={timeId}
          type="time"
          step={timePrecision === 'second' ? 1 : 60}
          value={part.time}
          disabled={disabled}
          onChange={(e) =>
            onChange(
              part.date
                ? `${part.date}T${normalizeTime(e.target.value, timePrecision) || defaultTime}`
                : '',
            )
          }
        />
      </div>
    ),
    [
      dateId,
      dateLabel,
      defaultTime,
      disabled,
      onChange,
      part.date,
      part.time,
      timeId,
      timeLabel,
      timePrecision,
    ],
  );
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size={size}
          pressable={false}
          className={cn('ec-datetime-trigger', className)}
          aria-label={ariaLabel}
          disabled={disabled}
          leadingIcon={<CalendarIcon />}
        >
          {value ? value.replace('T', ' ') : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        align="start"
        collisionPadding={8}
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          if (window.matchMedia?.('(pointer: coarse)').matches) {
            (event.target as HTMLElement | null)?.focus({ preventScroll: true });
            return;
          }
          dateInputRef.current?.focus({ preventScroll: true });
        }}
      >
        <div className="ec-popover-content__body">{content}</div>
      </PopoverContent>
    </Popover>
  );
}

export type DateRangePickerMode = 'date' | 'datetime';

export interface DateRangePickerValue {
  start: string;
  end: string;
}

export interface DateRangePickerPreset {
  label: ReactNode;
  value: DateRangePickerValue | (() => DateRangePickerValue);
}

export interface DateRangePickerProps {
  value: DateRangePickerValue;
  onChange: (value: DateRangePickerValue) => void;
  mode?: DateRangePickerMode;
  timePrecision?: TimePrecision;
  presets?: readonly DateRangePickerPreset[];
  placeholder?: string;
  startLabel?: string;
  endLabel?: string;
  startTimeLabel?: string;
  endTimeLabel?: string;
  presetsLabel?: string;
  applyLabel?: string;
  cancelLabel?: string;
  invalidRangeMessage?: string;
  /** Allow applying a range with only a start or an end value. */
  allowOpenRange?: boolean;
  size?: ComponentSize;
  className?: string;
  disabled?: boolean;
  'aria-label'?: string;
}

const datePart = (value: string) => value.split('T')[0] ?? '';
const timePart = (value: string, fallback: string, precision: TimePrecision) =>
  normalizeTime(value.split('T')[1] || fallback, precision);

function dateToInputValue(date?: Date) {
  if (!date) return '';
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate(),
  ).padStart(2, '0')}`;
}

function inputValueToDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  if (
    Number.isNaN(date.getTime()) ||
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return undefined;
  }
  return date;
}

function combineDateAndTime(
  date: string,
  currentValue: string,
  fallbackTime: string,
  mode: DateRangePickerMode,
  precision: TimePrecision,
) {
  if (!date) return '';
  return mode === 'date' ? date : `${date}T${timePart(currentValue, fallbackTime, precision)}`;
}

function formatRangeValue(value: DateRangePickerValue) {
  return value.start + value.end
    ? [value.start, value.end]
        .map((part) => part.replace(/-/g, '/').replace('T', ' ') || '...')
        .join(' - ')
    : '';
}

export function DateRangePicker({
  value,
  onChange,
  mode = 'date',
  timePrecision = 'minute',
  presets = [],
  placeholder = 'Select date range',
  startLabel = 'Start date',
  endLabel = 'End date',
  startTimeLabel = 'Start time',
  endTimeLabel = 'End time',
  presetsLabel = 'Quick ranges',
  applyLabel,
  cancelLabel,
  invalidRangeMessage = 'The end must not be earlier than the start.',
  allowOpenRange = false,
  size = 'lg',
  className,
  disabled = false,
  'aria-label': ariaLabel,
}: DateRangePickerProps) {
  const { messages } = useLocale();
  const [open, setOpen] = useState(false);
  const defaultStartTime = timePrecision === 'second' ? '00:00:00' : '00:00';
  const defaultEndTime = timePrecision === 'second' ? '23:59:59' : '23:59';
  const normalizeRange = (range: DateRangePickerValue): DateRangePickerValue =>
    mode === 'datetime' && timePrecision === 'second'
      ? {
          start: combineDateAndTime(
            datePart(range.start),
            range.start,
            defaultStartTime,
            mode,
            timePrecision,
          ),
          end: combineDateAndTime(
            datePart(range.end),
            range.end,
            defaultEndTime,
            mode,
            timePrecision,
          ),
        }
      : range;
  const [draft, setDraft] = useState(() => normalizeRange(value));

  const calendarValue: DateRange = {
    from: inputValueToDate(datePart(draft.start)),
    to: inputValueToDate(datePart(draft.end)),
  };
  const complete = Boolean(draft.start && draft.end);
  const hasValue = Boolean(draft.start || draft.end);
  const invalid = complete && draft.start > draft.end;

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) setDraft(normalizeRange(value));
    setOpen(nextOpen);
  };

  const handleCalendarChange = (next: DateRange) => {
    setDraft((current) => ({
      start: combineDateAndTime(
        dateToInputValue(next.from),
        current.start,
        defaultStartTime,
        mode,
        timePrecision,
      ),
      end: combineDateAndTime(
        dateToInputValue(next.to),
        current.end,
        defaultEndTime,
        mode,
        timePrecision,
      ),
    }));
  };

  const commit = (range: DateRangePickerValue) => {
    const next = normalizeRange(range);
    const nextComplete = next.start && next.end;
    if ((!allowOpenRange && !nextComplete) || !(next.start || next.end)) return;
    if (nextComplete && next.start > next.end) return;
    onChange(next);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size={size}
          pressable={false}
          className={cn('ec-date-range-trigger', className)}
          aria-label={ariaLabel}
          disabled={disabled}
          leadingIcon={<CalendarIcon />}
        >
          <span className="ec-date-range-trigger__label">
            {formatRangeValue(value) || placeholder}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        collisionPadding={8}
        className="ec-date-range-popover"
        onOpenAutoFocus={(event) => {
          if (window.matchMedia?.('(pointer: coarse)').matches) {
            event.preventDefault();
            (event.target as HTMLElement | null)?.focus({ preventScroll: true });
          }
        }}
      >
        {presets.length ? (
          <section className="ec-date-range-presets" aria-label={presetsLabel}>
            <div>
              {presets.map((preset, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="xs"
                  onClick={() =>
                    commit(typeof preset.value === 'function' ? preset.value() : preset.value)
                  }
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </section>
        ) : null}

        <Calendar
          mode="range"
          selected={calendarValue}
          onSelect={(next) => {
            if (next && !(next instanceof Date)) handleCalendarChange(next);
          }}
          labels={{ rangeStart: startLabel, rangeEnd: endLabel }}
        />

        {mode === 'datetime' ? (
          <div className="ec-date-range-times">
            <Label>
              {startTimeLabel}
              <Input
                type="time"
                step={timePrecision === 'second' ? 1 : 60}
                value={timePart(draft.start, '', timePrecision)}
                disabled={!draft.start}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    start: `${datePart(current.start)}T${normalizeTime(event.target.value, timePrecision) || defaultStartTime}`,
                  }))
                }
              />
            </Label>
            <Label>
              {endTimeLabel}
              <Input
                type="time"
                step={timePrecision === 'second' ? 1 : 60}
                value={timePart(draft.end, '', timePrecision)}
                disabled={!draft.end}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    end: `${datePart(current.end)}T${normalizeTime(event.target.value, timePrecision) || defaultEndTime}`,
                  }))
                }
              />
            </Label>
          </div>
        ) : null}

        {invalid ? (
          <p className="ec-date-range-error" role="alert">
            {invalidRangeMessage}
          </p>
        ) : null}

        <div className="ec-date-range-actions">
          <Button variant="ghost" tone="muted" size="sm" onClick={() => setOpen(false)}>
            {cancelLabel ?? messages.cancel}
          </Button>
          <Button
            size="sm"
            disabled={(allowOpenRange ? !hasValue : !complete) || invalid}
            onClick={() => commit(draft)}
          >
            {applyLabel ?? messages.apply}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
