import {
  forwardRef,
  useId,
  useImperativeHandle,
  useRef,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import type { ComponentSize } from '../Button';

export type InputStatus = 'default' | 'error' | 'warning' | 'success';
export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  size?: ComponentSize;
  status?: InputStatus;
  prefix?: ReactNode;
  suffix?: ReactNode;
  clearable?: boolean;
  clearLabel?: string;
  onClear?: () => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    size = 'md',
    status = 'default',
    prefix,
    suffix,
    clearable = false,
    clearLabel = 'Clear input',
    onClear,
    className,
    value,
    defaultValue,
    disabled,
    onChange,
    ...props
  },
  ref,
) {
  const innerRef = useRef<HTMLInputElement>(null);
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? '');
  const controlled = value !== undefined;
  const currentValue = controlled ? value : uncontrolledValue;
  useImperativeHandle(ref, () => innerRef.current as HTMLInputElement);

  const clear = () => {
    if (!controlled) setUncontrolledValue('');
    onClear?.();
    innerRef.current?.focus();
  };

  return (
    <span
      className={[
        'ec-input-shell',
        `ec-input-shell--${size}`,
        `ec-input-shell--${status}`,
        disabled && 'is-disabled',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {prefix ? <span className="ec-input-affix">{prefix}</span> : null}
      <input
        ref={innerRef}
        className="ec-input"
        value={currentValue}
        disabled={disabled}
        aria-invalid={status === 'error' || undefined}
        onChange={(event) => {
          if (!controlled) setUncontrolledValue(event.target.value);
          onChange?.(event);
        }}
        {...props}
      />
      {clearable && String(currentValue).length > 0 && !disabled ? (
        <button type="button" className="ec-input-clear" aria-label={clearLabel} onClick={clear}>
          ×
        </button>
      ) : suffix ? (
        <span className="ec-input-affix">{suffix}</span>
      ) : null}
    </span>
  );
});

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  status?: InputStatus;
  autoResize?: boolean;
}
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { status = 'default', className, ...props },
  ref,
) {
  return (
    <textarea
      ref={ref}
      className={['ec-textarea', `ec-input-shell--${status}`, className].filter(Boolean).join(' ')}
      aria-invalid={status === 'error' || undefined}
      {...props}
    />
  );
});

export interface FormItemProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: ReactNode;
  htmlFor?: string;
  required?: boolean;
  help?: ReactNode;
  error?: ReactNode;
}
export function FormItem({
  label,
  htmlFor,
  required,
  help,
  error,
  className,
  children,
  ...props
}: FormItemProps) {
  const id = useId();
  const target = htmlFor ?? id;
  return (
    <div className={['ec-form-item', className].filter(Boolean).join(' ')} {...props}>
      {label ? (
        <label className="ec-form-label" htmlFor={target}>
          {label}
          {required ? (
            <span aria-hidden="true" className="ec-required">
              {' '}
              *
            </span>
          ) : null}
        </label>
      ) : null}
      <div>{children}</div>
      {error ? (
        <div className="ec-form-help ec-form-help--error" role="alert">
          {error}
        </div>
      ) : help ? (
        <div className="ec-form-help">{help}</div>
      ) : null}
    </div>
  );
}
