import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { useControllableState } from '../../hooks/useControllableState';
export interface SwitchProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: ReactNode;
  description?: ReactNode;
  size?: 'sm' | 'md';
}
export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  {
    checked,
    defaultChecked = false,
    onCheckedChange,
    label,
    description,
    size = 'md',
    disabled,
    className,
    ...props
  },
  ref,
) {
  const [active, setActive] = useControllableState({
    value: checked,
    defaultValue: defaultChecked,
    onChange: onCheckedChange,
  });
  return (
    <span className={['ec-switch-field', className].filter(Boolean).join(' ')}>
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-label={typeof label === 'string' ? label : undefined}
        aria-checked={active}
        disabled={disabled}
        className={['ec-switch', 'ec-focusable', `ec-switch--${size}`].join(' ')}
        onClick={() => setActive(!active)}
        {...props}
      >
        <span />
      </button>
      {label || description ? (
        <span className="ec-switch-field__content">
          {label ? <span>{label}</span> : null}
          {description ? <small>{description}</small> : null}
        </span>
      ) : null}
    </span>
  );
});
