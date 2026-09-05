import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { CheckIcon, ChevronDownIcon } from 'lucide-react';
import { useControllableState } from '../../hooks/useControllableState';
import type { ComponentSize } from '../Button';

export interface SelectOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
  description?: ReactNode;
}
export interface SelectProps {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  size?: ComponentSize;
  status?: 'default' | 'error' | 'warning' | 'success';
  disabled?: boolean;
  required?: boolean;
  name?: string;
  className?: string;
}

export const Select = forwardRef<HTMLButtonElement, SelectProps>(function Select(
  {
    options,
    value,
    defaultValue = '',
    onValueChange,
    placeholder = 'Select an option',
    label,
    size = 'md',
    status = 'default',
    disabled,
    required,
    name,
    className,
  },
  ref,
) {
  const [selected, setSelected] = useControllableState({
    value,
    defaultValue,
    onChange: onValueChange,
  });
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const selectedOption = options.find((option) => option.value === selected);

  useEffect(() => {
    if (!open || typeof document === 'undefined') return;
    const close = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, [open]);

  const move = (direction: 1 | -1) => {
    if (!options.length) return;
    let next = activeIndex;
    do next = (next + direction + options.length) % options.length;
    while (options[next]?.disabled && next !== activeIndex);
    setActiveIndex(next);
  };
  const choose = (index: number) => {
    const option = options[index];
    if (!option || option.disabled) return;
    setSelected(option.value);
    setOpen(false);
  };
  const keyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!open) setOpen(true);
      else move(event.key === 'ArrowDown' ? 1 : -1);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (open) choose(activeIndex);
      else setOpen(true);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div ref={rootRef} className={['ec-select', className].filter(Boolean).join(' ')}>
      {name ? <input type="hidden" name={name} value={selected} /> : null}
      <button
        ref={ref}
        type="button"
        className={[
          'ec-select__trigger',
          'ec-focusable',
          `ec-select__trigger--${size}`,
          `ec-input-shell--${status}`,
        ].join(' ')}
        role="combobox"
        aria-label={label}
        aria-expanded={open}
        aria-controls={listId}
        aria-haspopup="listbox"
        aria-required={required || undefined}
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={keyDown}
      >
        <span
          className={['ec-select__label', selectedOption ? undefined : 'ec-select__placeholder']
            .filter(Boolean)
            .join(' ')}
        >
          {selectedOption?.label ?? placeholder}
        </span>
        <ChevronDownIcon className="ec-select__chevron" aria-hidden="true" />
      </button>
      {open ? (
        <div id={listId} role="listbox" className="ec-select__menu" aria-label={label}>
          {options.map((option, index) => {
            const isSelected = selected === option.value;
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                disabled={option.disabled}
                className={[
                  'ec-select__option',
                  index === activeIndex && 'is-active',
                  isSelected && 'is-selected',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onPointerMove={() => setActiveIndex(index)}
                onClick={() => choose(index)}
              >
                <span className="ec-select__option-label">
                  <span>{option.label}</span>
                  {option.description ? <small>{option.description}</small> : null}
                </span>
                <span className="ec-select__option-indicator" aria-hidden="true">
                  {isSelected ? <CheckIcon /> : null}
                </span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
});
