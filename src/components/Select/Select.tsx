import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { Select as Primitive } from 'radix-ui';
import { forwardRef, type ReactNode, type ButtonHTMLAttributes } from 'react';
import { useControllableState } from '../../hooks/useControllableState';
import { useTheme } from '../../theme/ThemeProvider';
import type { ComponentSize } from '../Button';

const EMPTY_VALUE = 'empty';
const VALUE_PREFIX = 'value:';

const toPrimitiveValue = (value: string) =>
  value === '' ? EMPTY_VALUE : `${VALUE_PREFIX}${value}`;
const fromPrimitiveValue = (value: string) =>
  value === EMPTY_VALUE ? '' : value.slice(VALUE_PREFIX.length);

export interface SelectOption {
  value: string;
  label: ReactNode;
  group?: string;
  disabled?: boolean;
  description?: ReactNode;
}

export interface SelectProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children' | 'value' | 'defaultValue' | 'onChange'
> {
  options: readonly SelectOption[];
  id?: string;
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
  triggerClassName?: string;
  contentClassName?: string;
}

export const Select = forwardRef<HTMLButtonElement, SelectProps>(function Select(
  {
    options,
    id,
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
    triggerClassName,
    contentClassName,
    ...triggerProps
  },
  ref,
) {
  const [selected, setSelected] = useControllableState({
    value,
    defaultValue,
    onChange: onValueChange,
  });
  const { portalContainer } = useTheme();
  const selectedValue = toPrimitiveValue(selected);
  const optionGroups = new Map<string | undefined, SelectOption[]>();
  for (const option of options) {
    const group = optionGroups.get(option.group);
    if (group) group.push(option);
    else optionGroups.set(option.group, [option]);
  }

  const renderOption = (option: SelectOption) => {
    const optionValue = toPrimitiveValue(option.value);
    return (
      <Primitive.Item
        key={optionValue}
        value={optionValue}
        disabled={option.disabled}
        className="ec-select__option"
      >
        <span className="ec-select__option-label">
          <Primitive.ItemText>{option.label}</Primitive.ItemText>
          {option.description ? <small>{option.description}</small> : null}
        </span>
        <Primitive.ItemIndicator className="ec-select__option-indicator">
          <CheckIcon aria-hidden="true" />
        </Primitive.ItemIndicator>
      </Primitive.Item>
    );
  };

  return (
    <div className={['ec-select', className].filter(Boolean).join(' ')}>
      <Primitive.Root
        value={selectedValue}
        onValueChange={(next) => setSelected(fromPrimitiveValue(next))}
        disabled={disabled}
        required={required}
        name={name}
      >
        <Primitive.Trigger
          {...triggerProps}
          ref={ref}
          id={id}
          className={[
            'ec-select__trigger',
            'ec-focusable',
            `ec-select__trigger--${size}`,
            `ec-input-shell--${status}`,
            triggerClassName,
          ]
            .filter(Boolean)
            .join(' ')}
          aria-label={label ?? triggerProps['aria-label']}
          aria-invalid={triggerProps['aria-invalid'] ?? (status === 'error' || undefined)}
          aria-required={triggerProps['aria-required'] ?? (required || undefined)}
        >
          <Primitive.Value placeholder={placeholder} />
          <Primitive.Icon asChild>
            <ChevronDownIcon className="ec-select__chevron" aria-hidden="true" />
          </Primitive.Icon>
        </Primitive.Trigger>
        <Primitive.Portal container={portalContainer ?? undefined}>
          <Primitive.Content
            position="popper"
            align="start"
            sideOffset={4}
            collisionPadding={8}
            className={['ec-select__menu', contentClassName].filter(Boolean).join(' ')}
          >
            <Primitive.ScrollUpButton className="ec-select__scroll-button">
              <ChevronUpIcon aria-hidden="true" />
            </Primitive.ScrollUpButton>
            <Primitive.Viewport className="ec-select__viewport">
              {Array.from(optionGroups, ([group, groupOptions]) =>
                group ? (
                  <Primitive.Group key={group}>
                    <Primitive.Label className="ec-select__group-label">{group}</Primitive.Label>
                    {groupOptions.map(renderOption)}
                  </Primitive.Group>
                ) : (
                  groupOptions.map(renderOption)
                ),
              )}
            </Primitive.Viewport>
            <Primitive.ScrollDownButton className="ec-select__scroll-button">
              <ChevronDownIcon aria-hidden="true" />
            </Primitive.ScrollDownButton>
          </Primitive.Content>
        </Primitive.Portal>
      </Primitive.Root>
    </div>
  );
});
