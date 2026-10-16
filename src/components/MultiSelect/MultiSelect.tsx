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
  type ChangeEvent,
  type KeyboardEvent,
  type ReactNode,
  type InputHTMLAttributes,
} from 'react';
import { CheckIcon, ChevronDownIcon, PlusIcon, XIcon } from 'lucide-react';
import { useControllableState } from '../../hooks/useControllableState';
import type { ComponentSize } from '../Button';
import type { InputStatus } from '../Input';

export interface MultiSelectOption {
  value: string;
  label: ReactNode;
  textValue?: string;
  description?: ReactNode;
  keywords?: string[];
  disabled?: boolean;
}

export interface MultiSelectProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'value' | 'defaultValue' | 'onChange' | 'children'
> {
  options: MultiSelectOption[];
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: ReactNode;
  creatable?: boolean;
  createLabel?: (value: string) => ReactNode;
  tokenSeparators?: string[];
  label?: string;
  removeLabel?: (value: string) => string;
  size?: ComponentSize;
  status?: InputStatus;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  className?: string;
}

function optionText(option: MultiSelectOption): string {
  if (option.textValue) return option.textValue;
  if (typeof option.label === 'string' || typeof option.label === 'number') {
    return String(option.label);
  }
  return option.value;
}

function firstEnabledIndex(options: MultiSelectOption[]) {
  return Math.max(
    0,
    options.findIndex((option) => !option.disabled),
  );
}

function lastEnabledIndex(options: MultiSelectOption[]) {
  for (let index = options.length - 1; index >= 0; index -= 1) {
    if (!options[index]?.disabled) return index;
  }
  return 0;
}

export const MultiSelect = forwardRef<HTMLInputElement, MultiSelectProps>(function MultiSelect(
  {
    options,
    value,
    defaultValue = [],
    onValueChange,
    placeholder = 'Select values',
    searchPlaceholder,
    emptyText = 'No options found',
    creatable = false,
    createLabel = (next) => `Add "${next}"`,
    tokenSeparators = [','],
    label,
    removeLabel = (next) => `Remove ${next}`,
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
  const selectedSet = useMemo(() => new Set(selected), [selected]);
  const optionByValue = useMemo(
    () => new Map(options.map((option) => [option.value, option])),
    [options],
  );
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
  const customValue = query.trim();
  const canCreate =
    creatable &&
    customValue.length > 0 &&
    !optionByValue.has(customValue) &&
    !selectedSet.has(customValue);

  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

  useEffect(() => {
    setActiveIndex(firstEnabledIndex(filteredOptions));
  }, [filteredOptions]);

  const toggle = (option: MultiSelectOption) => {
    if (option.disabled) return;
    if (selectedSet.has(option.value)) {
      setSelected(selected.filter((item) => item !== option.value));
    } else {
      setSelected([...selected, option.value]);
    }
    setQuery('');
    setOpen(true);
    inputRef.current?.focus();
  };

  const addCustomValues = (values: string[]) => {
    const next = [...selected];
    values.forEach((item) => {
      const normalized = item.trim();
      if (!normalized || next.includes(normalized)) return;
      const option = optionByValue.get(normalized);
      if (!creatable && !option) return;
      if (option?.disabled) return;
      next.push(normalized);
    });
    if (next.length !== selected.length) setSelected(next);
    setQuery('');
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

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextQuery = event.target.value;
    const hasSeparator = tokenSeparators.some((separator) => nextQuery.includes(separator));
    if (hasSeparator) {
      const expression = new RegExp(`[${tokenSeparators.map((item) => `\\${item}`).join('')}]`);
      const parts = nextQuery.split(expression);
      const endsWithSeparator = tokenSeparators.some((separator) => nextQuery.endsWith(separator));
      const complete = endsWithSeparator ? parts : parts.slice(0, -1);
      if (complete.length) addCustomValues(complete);
      if (!endsWithSeparator) setQuery(parts.at(-1) ?? '');
    } else {
      setQuery(nextQuery);
    }
    setOpen(true);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.nativeEvent.isComposing) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!open) setOpen(true);
      else move(event.key === 'ArrowDown' ? 1 : -1);
      return;
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      const option = open ? filteredOptions[activeIndex] : undefined;
      if (option) toggle(option);
      else if (canCreate) addCustomValues([customValue]);
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
    if (event.key === 'Backspace' && !query && selected.length) {
      setSelected(selected.slice(0, -1));
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

  const activeOption = filteredOptions[activeIndex];
  const activeOptionId = activeOption ? `${listId}-option-${activeIndex}` : undefined;

  useEffect(() => {
    if (!open || !activeOptionId) return;
    document.getElementById(activeOptionId)?.scrollIntoView?.({ block: 'nearest' });
  }, [activeOptionId, open]);

  return (
    <div className={['ec-multi-select', className].filter(Boolean).join(' ')}>
      <ChoicePopover.Root open={open && !disabled} onOpenChange={setOpen}>
        {name
          ? selected.map((item) => (
              <input key={item} type="hidden" name={name} value={item} disabled={disabled} />
            ))
          : null}
        <ChoicePopover.Anchor asChild>
          <div
            className={[
              'ec-multi-select__control',
              `ec-multi-select__control--${size}`,
              `ec-input-shell--${status}`,
              disabled && 'is-disabled',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={(event) => {
              if (disabled || event.defaultPrevented) return;
              inputRef.current?.focus();
              setOpen(true);
            }}
          >
            {selected.map((item) => {
              const option = optionByValue.get(item);
              return (
                <span key={item} className="ec-multi-select__tag">
                  <span>{option?.label ?? item}</span>
                  {!disabled ? (
                    <button
                      type="button"
                      aria-label={removeLabel(item)}
                      onClick={(event) => {
                        event.stopPropagation();
                        setSelected(selected.filter((selectedItem) => selectedItem !== item));
                      }}
                    >
                      <XIcon aria-hidden="true" />
                    </button>
                  ) : null}
                </span>
              );
            })}
            <input
              {...inputProps}
              ref={inputRef}
              role="combobox"
              className="ec-multi-select__input"
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
              placeholder={selected.length ? searchPlaceholder : placeholder}
              value={query}
              onFocus={inputProps.onFocus}
              onChange={handleChange}
              onKeyDown={(event) => {
                inputProps.onKeyDown?.(event);
                if (!event.defaultPrevented) handleKeyDown(event);
              }}
            />
            <button
              type="button"
              className="ec-multi-select__chevron"
              aria-label={open ? 'Close options' : 'Open options'}
              aria-expanded={open}
              disabled={disabled}
              onClick={(event) => {
                event.stopPropagation();
                setOpen((current) => !current);
                inputRef.current?.focus();
              }}
            >
              <ChevronDownIcon aria-hidden="true" />
            </button>
          </div>
        </ChoicePopover.Anchor>
        <ChoicePopover.Portal container={portalContainer ?? undefined}>
          <ChoicePopover.Content
            side="bottom"
            align="start"
            sideOffset={6}
            collisionPadding={8}
            onOpenAutoFocus={(event) => event.preventDefault()}
            onCloseAutoFocus={(event) => event.preventDefault()}
            onInteractOutside={(event) => {
              if (inputRef.current?.contains(event.target as Node)) event.preventDefault();
            }}
            id={listId}
            role="listbox"
            aria-label={label}
            aria-multiselectable="true"
            className="ec-multi-select__menu"
          >
            {filteredOptions.map((option, index) => (
              <button
                id={`${listId}-option-${index}`}
                key={option.value}
                type="button"
                role="option"
                tabIndex={-1}
                aria-selected={selectedSet.has(option.value)}
                disabled={option.disabled}
                className={[
                  'ec-multi-select__option',
                  index === activeIndex && 'is-active',
                  selectedSet.has(option.value) && 'is-selected',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onPointerMove={() => setActiveIndex(index)}
                onPointerDown={(event) => event.preventDefault()}
                onClick={() => toggle(option)}
              >
                <span className="ec-multi-select__option-copy">
                  <span>{option.label}</span>
                  {option.description ? <small>{option.description}</small> : null}
                </span>
                <span className="ec-multi-select__option-check" aria-hidden="true">
                  {selectedSet.has(option.value) ? <CheckIcon /> : null}
                </span>
              </button>
            ))}
            {canCreate ? (
              <button
                type="button"
                role="option"
                tabIndex={-1}
                aria-selected="false"
                className="ec-multi-select__option ec-multi-select__create"
                onPointerDown={(event) => event.preventDefault()}
                onClick={() => addCustomValues([customValue])}
              >
                <PlusIcon aria-hidden="true" />
                <span>{createLabel(customValue)}</span>
              </button>
            ) : null}
            {!filteredOptions.length && !canCreate ? (
              <div className="ec-multi-select__empty">{emptyText}</div>
            ) : null}
          </ChoicePopover.Content>
        </ChoicePopover.Portal>
      </ChoicePopover.Root>
    </div>
  );
});
