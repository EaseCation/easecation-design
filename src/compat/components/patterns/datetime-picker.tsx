'use client';

import { CalendarIcon } from 'lucide-react';

import { Button } from '../button';
import { Input } from '../input';
import { Label } from '../label';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';
import { cn } from '../../lib/utils';

import { TOOLBAR_FIELD_HEIGHT_CLASS } from './toolbar-controls';

function parseDateTimeLocal(value: string) {
  if (!value) return { date: '', time: '' };
  const [date, timePart] = value.split('T');
  return {
    date: date ?? '',
    time: timePart?.slice(0, 5) ?? '',
  };
}

function combineDateTime(date: string, time: string) {
  if (!date) return '';
  return `${date}T${time || '00:00'}`;
}

function formatDisplay(value: string) {
  if (!value) return '';
  return value.replace('T', ' ');
}

export function DateTimePicker({
  value,
  onChange,
  placeholder = '选择日期时间',
  className,
  'aria-label': ariaLabel,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  'aria-label'?: string;
}) {
  const { date, time } = parseDateTimeLocal(value);
  const display = formatDisplay(value);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="lg"
          className={cn(
            TOOLBAR_FIELD_HEIGHT_CLASS,
            'min-w-[11rem] justify-start gap-2 px-2.5 font-normal',
            !display && 'text-muted-foreground',
            className,
          )}
          aria-label={ariaLabel}
        >
          <CalendarIcon className="size-4 shrink-0 opacity-60" />
          <span className="truncate">{display || placeholder}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto min-w-[16rem] p-3" align="start">
        <div className="grid gap-3">
          <div className="grid gap-1.5">
            <Label className="text-xs text-muted-foreground">日期</Label>
            <Input
              type="date"
              className="h-9"
              value={date}
              onChange={(event) => onChange(combineDateTime(event.target.value, time))}
            />
          </div>
          <div className="grid gap-1.5">
            <Label className="text-xs text-muted-foreground">时间</Label>
            <Input
              type="time"
              className="h-9"
              value={time}
              onChange={(event) => onChange(combineDateTime(date, event.target.value))}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
