import { CalendarIcon, ChevronDownIcon } from 'lucide-react';
import { useId, useMemo, type ComponentProps, type KeyboardEvent, type ReactNode } from 'react';
import { Button } from '../Button';
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
import { Popover } from '../Popover';
import { Select } from '../Select';
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
  onSearch?: () => void;
}
export function FilterBar({
  className,
  actions,
  children,
  variant = 'card',
  onSearch,
  ...props
}: FilterBarProps) {
  return (
    <div
      className={['ec-filter-bar', `ec-filter-bar--${variant}`, className]
        .filter(Boolean)
        .join(' ')}
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
}: {
  label: string;
  children: ReactNode;
  className?: string;
  htmlFor?: string;
  layout?: 'stack' | 'inline';
}) {
  return (
    <div
      className={['ec-filter-field', `ec-filter-field--${layout}`, className]
        .filter(Boolean)
        .join(' ')}
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
  disabled,
  'aria-label': ariaLabel,
}: {
  value: string;
  onValueChange: (value: string) => void;
  options: FilterSelectOption[];
  placeholder?: string;
  className?: string;
  triggerClassName?: string;
  disabled?: boolean;
  'aria-label'?: string;
}) {
  return (
    <Select
      className={['ec-filter-select', className].filter(Boolean).join(' ')}
      value={value}
      onValueChange={onValueChange}
      options={options}
      placeholder={placeholder}
      label={ariaLabel}
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
  disabled = false,
  'aria-label': ariaLabel,
}: DateTimePickerProps) {
  const id = useId();
  const dateId = `${id}-date`;
  const timeId = `${id}-time`;
  const part = parse(value);
  const content = useMemo(
    () => (
      <div className="ec-datetime-fields">
        <Label htmlFor={dateId}>{dateLabel}</Label>
        <Input
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
    <Popover
      trigger={
        <Button
          variant="outline"
          size="md"
          pressable={false}
          className={['ec-datetime-trigger', className].filter(Boolean).join(' ')}
          aria-label={ariaLabel}
          disabled={disabled}
          leadingIcon={<CalendarIcon />}
        >
          {value ? value.replace('T', ' ') : placeholder}
        </Button>
      }
    >
      {content}
    </Popover>
  );
}
