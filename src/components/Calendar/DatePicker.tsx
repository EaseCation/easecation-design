import { CalendarIcon } from 'lucide-react';
import { useId, useState, type ReactNode } from 'react';
import { Button, type ComponentSize } from '../Button';
import { Label } from '../Label';
import { Popover, PopoverContent, PopoverTrigger } from '../Popover';
import { useLocale } from '../../locale/LocaleProvider';
import { cn } from '../../utils/classNames';
import { Calendar } from './Calendar';
import { startOfDay, toDateValue } from './dateMath';

export interface DatePickerProps {
  value?: Date;
  onChange?: (value: Date | undefined) => void;
  placeholder?: string;
  label?: ReactNode;
  clearLabel?: string;
  todayLabel?: string;
  size?: ComponentSize;
  className?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  min?: Date | string;
  max?: Date | string;
  step?: number;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  'aria-label'?: string;
}

function formatDisplay(locale: string, value?: Date) {
  if (!value) return '';
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(value);
}

export function DatePicker({
  value,
  onChange,
  placeholder,
  label,
  clearLabel,
  todayLabel,
  size = 'md',
  className,
  disabled = false,
  readOnly = false,
  required = false,
  min,
  max,
  step,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  'aria-label': ariaLabel,
}: DatePickerProps) {
  const { locale, messages } = useLocale();
  const labelId = useId();
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = (next: boolean) => {
    if (controlledOpen === undefined) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };
  const selected = value ? startOfDay(value) : undefined;
  const display = formatDisplay(locale, selected);
  const showLabel = label !== null;
  const fieldLabel = label ?? messages.date;
  const triggerLabel = ariaLabel ?? (typeof fieldLabel === 'string' ? fieldLabel : messages.date);

  return (
    <div className={cn('ec-date-picker', className)}>
      {showLabel ? (
        <Label id={labelId} className="ec-date-picker__label">
          {fieldLabel}
          {required ? <span aria-hidden="true"> *</span> : null}
        </Label>
      ) : null}
      <Popover open={open} onOpenChange={(next) => !disabled && !readOnly && setOpen(next)}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size={size}
            pressable={false}
            className="ec-date-picker__trigger"
            disabled={disabled}
            aria-label={triggerLabel}
            aria-labelledby={showLabel ? labelId : undefined}
            aria-haspopup="dialog"
            aria-expanded={open}
            leadingIcon={<CalendarIcon aria-hidden="true" />}
          >
            <span
              className={cn(
                'ec-date-picker__value',
                !display && 'ec-date-picker__value--placeholder',
              )}
            >
              {display || placeholder || messages.datePlaceholder}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          collisionPadding={8}
          className="ec-date-picker-popover"
          onOpenAutoFocus={(event) => {
            if (window.matchMedia?.('(pointer: coarse)').matches) {
              event.preventDefault();
              (event.target as HTMLElement | null)?.focus({ preventScroll: true });
            }
          }}
        >
          <Calendar
            mode="single"
            selected={selected}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            onSelect={(next) => {
              if (!(next instanceof Date)) return;
              onChange?.(startOfDay(next));
              setOpen(false);
            }}
          />
          <div className="ec-date-picker__footer">
            <Button
              type="button"
              variant="link"
              size="sm"
              pressable={false}
              disabled={disabled || readOnly || !selected}
              onClick={() => {
                onChange?.(undefined);
                setOpen(false);
              }}
            >
              {clearLabel ?? messages.clear}
            </Button>
            <Button
              type="button"
              variant="link"
              size="sm"
              pressable={false}
              disabled={
                disabled ||
                readOnly ||
                Boolean(
                  min &&
                  toDateValue(startOfDay(new Date())) <
                    (typeof min === 'string' ? min : toDateValue(min)),
                ) ||
                Boolean(
                  max &&
                  toDateValue(startOfDay(new Date())) >
                    (typeof max === 'string' ? max : toDateValue(max)),
                )
              }
              onClick={() => {
                const today = startOfDay(new Date());
                onChange?.(today);
                setOpen(false);
              }}
            >
              {todayLabel ?? messages.today}
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
