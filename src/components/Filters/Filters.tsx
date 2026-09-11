import { CalendarIcon, ChevronDownIcon } from 'lucide-react';
import {
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
export function createFilterEnterSearchHandler(onSearch?: () => void) {
  return (event: KeyboardEvent<HTMLElement>) => {
    if (!onSearch || event.key !== 'Enter' || event.defaultPrevented) return;
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
      onKeyDown={createFilterEnterSearchHandler(onSearch)}
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
export function FilterSelect({
  value,
  onValueChange,
  options,
  placeholder = 'Select an option',
  className,
  triggerClassName,
  size = 'lg',
  disabled,
  'aria-label': ariaLabel,
}: {
  value: string;
  onValueChange: (value: string) => void;
  options: FilterSelectOption[];
  placeholder?: string;
  className?: string;
  triggerClassName?: string;
  size?: ComponentSize;
  disabled?: boolean;
  'aria-label'?: string;
}) {
  return (
    <Select
      className={cn('ec-filter-select', className)}
      value={value}
      onValueChange={onValueChange}
      options={options}
      placeholder={placeholder}
      label={ariaLabel}
      triggerClassName={triggerClassName}
      size={size}
      disabled={disabled}
    />
  );
}
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
          {props.clearLabel ?? 'All'}
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
const parse = (value: string) => {
  const [date, time = ''] = value.split('T');
  return { date: date ?? '', time: time.slice(0, 5) };
};
export interface DateTimePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  dateLabel?: string;
  timeLabel?: string;
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
  className,
  size = 'lg',
  disabled = false,
  'aria-label': ariaLabel,
}: DateTimePickerProps) {
  const id = useId();
  const dateId = `${id}-date`;
  const timeId = `${id}-time`;
  const dateInputRef = useRef<HTMLInputElement>(null);
  const part = parse(value);
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
            onChange(e.target.value ? `${e.target.value}T${part.time || '00:00'}` : '')
          }
        />
        <Label htmlFor={timeId}>{timeLabel}</Label>
        <Input
          id={timeId}
          type="time"
          value={part.time}
          disabled={disabled}
          onChange={(e) => onChange(part.date ? `${part.date}T${e.target.value || '00:00'}` : '')}
        />
      </div>
    ),
    [dateId, dateLabel, disabled, onChange, part.date, part.time, timeId, timeLabel],
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
          if (window.matchMedia?.('(pointer: coarse)').matches) return;
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
const timePart = (value: string, fallback: string) => value.split('T')[1]?.slice(0, 5) || fallback;

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
) {
  if (!date) return '';
  return mode === 'date' ? date : `${date}T${timePart(currentValue, fallbackTime)}`;
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
  presets = [],
  placeholder = 'Select date range',
  startLabel = 'Start date',
  endLabel = 'End date',
  startTimeLabel = 'Start time',
  endTimeLabel = 'End time',
  presetsLabel = 'Quick ranges',
  applyLabel = 'Apply',
  cancelLabel = 'Cancel',
  invalidRangeMessage = 'The end must not be earlier than the start.',
  allowOpenRange = false,
  size = 'lg',
  className,
  disabled = false,
  'aria-label': ariaLabel,
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value);

  const calendarValue: DateRange = {
    from: inputValueToDate(datePart(draft.start)),
    to: inputValueToDate(datePart(draft.end)),
  };
  const complete = Boolean(draft.start && draft.end);
  const hasValue = Boolean(draft.start || draft.end);
  const invalid = complete && draft.start > draft.end;

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) setDraft(value);
    setOpen(nextOpen);
  };

  const handleCalendarChange = (next: DateRange) => {
    setDraft((current) => ({
      start: combineDateAndTime(dateToInputValue(next.from), current.start, '00:00', mode),
      end: combineDateAndTime(dateToInputValue(next.to), current.end, '23:59', mode),
    }));
  };

  const commit = (next: DateRangePickerValue) => {
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
          if (window.matchMedia?.('(pointer: coarse)').matches) event.preventDefault();
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
                value={timePart(draft.start, '')}
                disabled={!draft.start}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    start: `${datePart(current.start)}T${event.target.value || '00:00'}`,
                  }))
                }
              />
            </Label>
            <Label>
              {endTimeLabel}
              <Input
                type="time"
                value={timePart(draft.end, '')}
                disabled={!draft.end}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    end: `${datePart(current.end)}T${event.target.value || '23:59'}`,
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
            {cancelLabel}
          </Button>
          <Button
            size="sm"
            disabled={(allowOpenRange ? !hasValue : !complete) || invalid}
            onClick={() => commit(draft)}
          >
            {applyLabel}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
