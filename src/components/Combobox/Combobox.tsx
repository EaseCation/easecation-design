import { Popover as ChoicePopover } from 'radix-ui';
import { useTheme } from '../../theme/ThemeProvider';
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
  type InputHTMLAttributes,
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

export interface ComboboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'value' | 'defaultValue' | 'onChange' | 'children'
> {
  options: ComboboxOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: ReactNode;
  allowCustomValue?: boolean;
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
    allowCustomValue = false,
    clearable = false,
    clearLabel = 'Clear selection',
    label,
    size = 'md',
    status = 'default',
    disabled = false,
    required = false,
    name,
    className,
    ...inputProps
  },
  ref,
) {
  const [selected, setSelected] = useControllableState({
    value,
    defaultValue,
    onChange: onValueChange,
  });
  const { portalContainer } = useTheme();
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
    if (!open)
      setQuery(selectedOption ? optionText(selectedOption) : allowCustomValue ? selected : '');
  }, [allowCustomValue, open, selected, selectedOption]);

  useEffect(() => {
    if (allowCustomValue) {
      const exactIndex = filteredOptions.findIndex(
        (option) => !option.disabled && (option.value === selected || optionText(option) === query),
      );
      setActiveIndex(exactIndex);
      return;
    }
    const selectedIndex = filteredOptions.findIndex(
      (option) => option.value === selected && !option.disabled,
    );
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : firstEnabledIndex(filteredOptions));
  }, [allowCustomValue, filteredOptions, query, selected]);

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
    if (!open && !allowCustomValue) setQuery('');
    setOpen(true);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.nativeEvent.isComposing) return;
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
      else if (allowCustomValue) setOpen(false);
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
      if (open) {
        event.preventDefault();
        event.stopPropagation();
      }
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
    <div className={['ec-combobox', className].filter(Boolean).join(' ')}>
      <ChoicePopover.Root open={open && !disabled} onOpenChange={setOpen}>
        {name ? <input type="hidden" name={name} value={selected} disabled={disabled} /> : null}
        <ChoicePopover.Anchor asChild>
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
              {...inputProps}
              ref={inputRef}
              role="combobox"
              className="ec-combobox__input"
              aria-label={label ?? inputProps['aria-label']}
              aria-expanded={open}
              aria-haspopup="listbox"
              aria-controls={listId}
              aria-activedescendant={open ? activeOptionId : undefined}
              aria-autocomplete="list"
              aria-required={inputProps['aria-required'] ?? (required || undefined)}
              aria-invalid={inputProps['aria-invalid'] ?? (status === 'error' || undefined)}
              autoComplete="off"
              disabled={disabled}
              placeholder={open ? (searchPlaceholder ?? placeholder) : placeholder}
              value={query}
              // Restoring focus after a dialog must preserve the selection and stay closed.
              // Click, typing and arrow keys are explicit requests to open options.
              onFocus={inputProps.onFocus}
              onClick={(event) => {
                inputProps.onClick?.(event);
                if (!event.defaultPrevented) openOptions();
              }}
              onChange={(event) => {
                setQuery(event.target.value);
                if (allowCustomValue) setSelected(event.target.value);
                setOpen(true);
              }}
              onKeyDown={(event) => {
                inputProps.onKeyDown?.(event);
                if (!event.defaultPrevented) handleKeyDown(event);
              }}
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
        </ChoicePopover.Anchor>
        <ChoicePopover.Portal container={portalContainer ?? undefined}>
          <ChoicePopover.Content
            id={listId}
            role="listbox"
            className="ec-combobox__menu"
            aria-label={label}
            side="bottom"
            align="start"
            sideOffset={6}
            collisionPadding={8}
            onOpenAutoFocus={(event) => event.preventDefault()}
            onCloseAutoFocus={(event) => event.preventDefault()}
            onInteractOutside={(event) => {
              if (inputRef.current?.contains(event.target as Node)) event.preventDefault();
            }}
          >
            {filteredOptions.length ? (
              filteredOptions.map((option, index) => (
                <button
                  id={`${listId}-option-${index}`}
                  key={option.value}
                  type="button"
                  role="option"
                  tabIndex={-1}
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
          </ChoicePopover.Content>
        </ChoicePopover.Portal>
      </ChoicePopover.Root>
    </div>
  );
});
