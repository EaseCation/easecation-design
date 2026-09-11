import { EllipsisIcon } from 'lucide-react';
import { useMemo, useRef, type HTMLAttributes, type KeyboardEvent, type ReactNode } from 'react';
import { useControllableState } from '../../hooks/useControllableState';
import { useOverflowItems } from '../../hooks/useOverflowItems';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '../DropdownMenu';

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
  overflowLabel?: string;
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
  overflowLabel = 'More options',
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
  const activeIndex = options.findIndex((option) => option.value === selectedValue);
  const { containerRef, measureRef, visibleIndexes, hasOverflow } = useOverflowItems({
    itemCount: options.length,
    activeIndex,
    enabled: orientation === 'horizontal',
  });
  const visible = useMemo(() => new Set(visibleIndexes), [visibleIndexes]);
  const overflowOptions = options.filter((_, index) => !visible.has(index));

  const selectAt = (index: number) => {
    const option = options[index];
    if (!option || option.disabled) return;
    setSelectedValue(option.value);
    requestAnimationFrame(() => refs.current[index]?.focus());
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
      ref={containerRef}
      className={['ec-segmented', fullWidth && 'ec-segmented--block', className]
        .filter(Boolean)
        .join(' ')}
      data-size={size}
      data-orientation={orientation}
      data-overflow={hasOverflow ? 'true' : undefined}
      {...props}
    >
      <div
        role="radiogroup"
        aria-label={ariaLabel}
        aria-orientation={orientation}
        className="ec-segmented__items"
      >
        {options.map((option, index) => {
          if (!visible.has(index)) return null;
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
      {hasOverflow ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="ec-segmented-item ec-segmented__overflow ec-focusable"
              aria-label={overflowLabel}
              data-selected={overflowOptions.some((option) => option.value === selectedValue)}
            >
              <EllipsisIcon aria-hidden="true" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="ec-segmented__overflow-menu">
            <DropdownMenuRadioGroup value={selectedValue} onValueChange={setSelectedValue}>
              {overflowOptions.map((option) => (
                <DropdownMenuRadioItem
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.icon ? (
                    <span className="ec-segmented-item__icon" aria-hidden="true">
                      {option.icon}
                    </span>
                  ) : null}
                  {option.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}
      <div ref={measureRef} className="ec-overflow-measure" aria-hidden="true">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            tabIndex={-1}
            className="ec-segmented-item"
            data-overflow-measure-item
          >
            {option.icon ? <span className="ec-segmented-item__icon">{option.icon}</span> : null}
            <span className="ec-segmented-item__label">{option.label}</span>
          </button>
        ))}
        <button
          type="button"
          tabIndex={-1}
          className="ec-segmented-item ec-segmented__overflow"
          data-overflow-measure-trigger
        >
          <EllipsisIcon />
        </button>
      </div>
    </div>
  );
}
