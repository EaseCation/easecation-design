import { useRef, type HTMLAttributes, type KeyboardEvent, type ReactNode } from 'react';
import { useControllableState } from '../../hooks/useControllableState';

export interface SegmentedControlOption {
  value: string;
  label: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface SegmentedControlProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'defaultValue' | 'onChange'
> {
  options: SegmentedControlOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  size?: 'sm' | 'md' | 'lg';
  orientation?: 'horizontal' | 'vertical';
  fullWidth?: boolean;
  ariaLabel: string;
}

export function SegmentedControl({
  options,
  value,
  defaultValue,
  onValueChange,
  size = 'md',
  orientation = 'horizontal',
  fullWidth = false,
  ariaLabel,
  className,
  ...props
}: SegmentedControlProps) {
  const firstEnabled = options.find((option) => !option.disabled)?.value ?? '';
  const [selectedValue, setSelectedValue] = useControllableState({
    value,
    defaultValue: defaultValue ?? firstEnabled,
    onChange: onValueChange,
  });
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  const selectAt = (index: number) => {
    const option = options[index];
    if (!option || option.disabled) return;
    refs.current[index]?.focus();
    setSelectedValue(option.value);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const previousKey = orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp';
    const nextKey = orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown';
    if (![previousKey, nextKey, 'Home', 'End'].includes(event.key)) return;

    event.preventDefault();
    const enabled = options.flatMap((option, optionIndex) =>
      option.disabled ? [] : [optionIndex],
    );
    if (!enabled.length) return;

    const position = enabled.indexOf(index);
    const nextIndex =
      event.key === 'Home'
        ? enabled[0]
        : event.key === 'End'
          ? enabled.at(-1)!
          : enabled[
              (position + (event.key === nextKey ? 1 : -1) + enabled.length) % enabled.length
            ];
    selectAt(nextIndex);
  };

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      aria-orientation={orientation}
      className={['ec-segmented', fullWidth && 'ec-segmented--block', className]
        .filter(Boolean)
        .join(' ')}
      data-size={size}
      data-orientation={orientation}
      {...props}
    >
      {options.map((option, index) => {
        const selected = selectedValue === option.value;
        return (
          <button
            key={option.value}
            ref={(node) => {
              refs.current[index] = node;
            }}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={option.disabled}
            tabIndex={selected || (!selectedValue && option.value === firstEnabled) ? 0 : -1}
            className="ec-segmented-item ec-focusable"
            data-selected={selected ? 'true' : 'false'}
            onClick={() => setSelectedValue(option.value)}
            onKeyDown={(event) => onKeyDown(event, index)}
          >
            {option.icon ? (
              <span className="ec-segmented-item__icon" aria-hidden="true">
                {option.icon}
              </span>
            ) : null}
            <span className="ec-segmented-item__label">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
