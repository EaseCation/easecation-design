import {
  forwardRef,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { CheckIcon, ChevronDownIcon, XIcon } from 'lucide-react';
import { useControllableState } from '../../hooks/useControllableState';
import type { ComponentSize } from '../Button';
import type { InputStatus } from '../Input';

export interface ComboboxOption {
  value: string;
  label: ReactNode;
  textValue?: string;
  description?: ReactNode;
  keywords?: string[];
  disabled?: boolean;
}

export interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: ReactNode;
  clearable?: boolean;
  clearLabel?: string;
  label?: string;
  size?: ComponentSize;
  status?: InputStatus;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  className?: string;
}

function optionText(option: ComboboxOption): string {
  if (option.textValue) return option.textValue;
  if (typeof option.label === 'string' || typeof option.label === 'number') {
    return String(option.label);
  }
  return option.value;
}

function firstEnabledIndex(options: ComboboxOption[]) {
  return Math.max(
    0,
    options.findIndex((option) => !option.disabled),
  );
}

function lastEnabledIndex(options: ComboboxOption[]) {
  for (let index = options.length - 1; index >= 0; index -= 1) {
    if (!options[index]?.disabled) return index;
  }
  return 0;
}

export const Combobox = forwardRef<HTMLInputElement, ComboboxProps>(function Combobox(
  {
    options,
    value,
    defaultValue = '',
    onValueChange,
    placeholder = 'Select an option',
    searchPlaceholder,
    emptyText = 'No options found',
    clearable = false,
    clearLabel = 'Clear selection',
    label,
    size = 'md',
    status = 'default',
    disabled = false,
    required = false,
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
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const selectedOption = options.find((option) => option.value === selected);

  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

  const filteredOptions = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    if (!needle) return options;
    return options.filter((option) =>
      [option.value, optionText(option), ...(option.keywords ?? [])]
        .join(' ')
        .toLocaleLowerCase()
        .includes(needle),
    );
  }, [options, query]);

  useEffect(() => {
    if (!open) setQuery(selectedOption ? optionText(selectedOption) : '');
  }, [open, selectedOption]);

  useEffect(() => {
    const selectedIndex = filteredOptions.findIndex(
      (option) => option.value === selected && !option.disabled,
    );
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : firstEnabledIndex(filteredOptions));
  }, [filteredOptions, selected]);

  useEffect(() => {
    if (!open || typeof document === 'undefined') return;
    const close = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, [open]);

  const choose = (option: ComboboxOption) => {
    if (option.disabled) return;
    setSelected(option.value);
    setQuery(optionText(option));
    setOpen(false);
    inputRef.current?.focus();
  };

  const move = (direction: 1 | -1) => {
    if (!filteredOptions.length) return;
    let next = activeIndex;
    for (let attempt = 0; attempt < filteredOptions.length; attempt += 1) {
      next = (next + direction + filteredOptions.length) % filteredOptions.length;
      if (!filteredOptions[next]?.disabled) {
        setActiveIndex(next);
        return;
      }
    }
  };

  const openOptions = () => {
    if (!open) setQuery('');
    setOpen(true);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!open) openOptions();
      else move(event.key === 'ArrowDown' ? 1 : -1);
      return;
    }
    if (event.key === 'Enter' && open) {
      event.preventDefault();
      const option = filteredOptions[activeIndex];
      if (option) choose(option);
      return;
    }
    if (open && (event.key === 'Home' || event.key === 'End')) {
      event.preventDefault();
      setActiveIndex(
        event.key === 'Home'
          ? firstEnabledIndex(filteredOptions)
          : lastEnabledIndex(filteredOptions),
      );
      return;
    }
    if (event.key === 'Escape') {
      setOpen(false);
      return;
    }
    if (event.key === 'Tab') setOpen(false);
  };

  const clear = () => {
    setSelected('');
    setQuery('');
    setOpen(true);
    inputRef.current?.focus();
  };

  const activeOption = filteredOptions[activeIndex];
  const activeOptionId = activeOption ? `${listId}-option-${activeIndex}` : undefined;

  useEffect(() => {
    if (!open || !activeOptionId) return;
    document.getElementById(activeOptionId)?.scrollIntoView?.({ block: 'nearest' });
  }, [activeOptionId, open]);

  return (
    <div ref={rootRef} className={['ec-combobox', className].filter(Boolean).join(' ')}>
      {name ? <input type="hidden" name={name} value={selected} /> : null}
      <div
        className={[
          'ec-combobox__control',
          `ec-combobox__control--${size}`,
          `ec-input-shell--${status}`,
          disabled && 'is-disabled',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <input
          ref={inputRef}
          role="combobox"
          className="ec-combobox__input"
          aria-label={label}
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls={listId}
          aria-activedescendant={open ? activeOptionId : undefined}
          aria-autocomplete="list"
          aria-required={required || undefined}
          aria-invalid={status === 'error' || undefined}
          autoComplete="off"
          disabled={disabled}
          placeholder={open ? (searchPlaceholder ?? placeholder) : placeholder}
          value={query}
          onFocus={openOptions}
          onClick={openOptions}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onKeyDown={handleKeyDown}
        />
        {clearable && selected && !disabled ? (
          <button
            type="button"
            className="ec-combobox__icon-button"
            aria-label={clearLabel}
            onClick={clear}
          >
            <XIcon aria-hidden="true" />
          </button>
        ) : null}
        <button
          type="button"
          className="ec-combobox__icon-button"
          aria-label={open ? 'Close options' : 'Open options'}
          aria-expanded={open}
          disabled={disabled}
          onClick={() => {
            if (open) setOpen(false);
            else openOptions();
            inputRef.current?.focus();
          }}
        >
          <ChevronDownIcon aria-hidden="true" />
        </button>
      </div>
      {open && !disabled ? (
        <div id={listId} role="listbox" className="ec-combobox__menu" aria-label={label}>
          {filteredOptions.length ? (
            filteredOptions.map((option, index) => (
              <button
                id={`${listId}-option-${index}`}
                key={option.value}
                type="button"
                role="option"
                aria-selected={selected === option.value}
                disabled={option.disabled}
                className={[
                  'ec-combobox__option',
                  index === activeIndex && 'is-active',
                  selected === option.value && 'is-selected',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onPointerMove={() => setActiveIndex(index)}
                onPointerDown={(event) => event.preventDefault()}
                onClick={() => choose(option)}
              >
                <span className="ec-combobox__option-copy">
                  <span>{option.label}</span>
                  {option.description ? <small>{option.description}</small> : null}
                </span>
                <span className="ec-combobox__option-check" aria-hidden="true">
                  {selected === option.value ? <CheckIcon /> : null}
                </span>
              </button>
            ))
          ) : (
            <div className="ec-combobox__empty">{emptyText}</div>
          )}
        </div>
      ) : null}
    </div>
  );
});
