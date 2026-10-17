import {
  forwardRef,
  useEffect,
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
  inputClassName?: string;
  clearable?: boolean;
  clearLabel?: string;
  onClear?: () => void;
  showCount?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    size = 'md',
    status = 'default',
    prefix,
    suffix,
    inputClassName,
    clearable = false,
    clearLabel = 'Clear input',
    onClear,
    className,
    value,
    defaultValue,
    disabled,
    onChange,
    showCount = false,
    'aria-describedby': describedBy,
    ...props
  },
  ref,
) {
  const innerRef = useRef<HTMLInputElement>(null);
  const countId = `${useId()}-count`;
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
        className={['ec-input', inputClassName].filter(Boolean).join(' ')}
        value={currentValue}
        disabled={disabled}
        aria-invalid={status === 'error' || undefined}
        aria-describedby={
          [describedBy, showCount && countId].filter(Boolean).join(' ') || undefined
        }
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
      {showCount ? (
        <span id={countId} className="ec-input-count">
          {String(currentValue).length}
          {props.maxLength === undefined ? '' : ` / ${props.maxLength}`}
        </span>
      ) : null}
    </span>
  );
});

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  status?: InputStatus;
  /** Grow to fit the content, including controlled updates and width changes. */
  autoResize?: boolean;
  /** Row bounds used when autoResize is enabled. */
  minRows?: number;
  maxRows?: number;
  /** Show the current character count and maxLength, when supplied. */
  showCount?: boolean;
}
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {
    status = 'default',
    className,
    autoResize = false,
    minRows,
    maxRows,
    showCount = false,
    rows = 2,
    value,
    defaultValue,
    onChange,
    'aria-describedby': describedBy,
    ...props
  },
  ref,
) {
  const innerRef = useRef<HTMLTextAreaElement>(null);
  const countId = `${useId()}-count`;
  const [draft, setDraft] = useState(defaultValue ?? '');
  useImperativeHandle(ref, () => innerRef.current as HTMLTextAreaElement);

  useEffect(() => {
    const element = innerRef.current;
    if (!autoResize || !element) return;
    const resize = () => {
      const style = getComputedStyle(element);
      const lineHeight = parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.5;
      const padding = (parseFloat(style.paddingTop) || 0) + (parseFloat(style.paddingBottom) || 0);
      const border =
        (parseFloat(style.borderTopWidth) || 0) + (parseFloat(style.borderBottomWidth) || 0);
      const minimum = Math.max(1, minRows ?? rows);
      const maximum = maxRows === undefined ? Infinity : Math.max(minimum, maxRows);
      element.style.height = 'auto';
      const contentHeight = Math.max(
        element.scrollHeight + border,
        minimum * lineHeight + padding + border,
      );
      const height = Math.min(contentHeight, maximum * lineHeight + padding + border);
      element.style.height = `${height}px`;
      element.style.overflowY = contentHeight > height ? 'auto' : 'hidden';
    };
    resize();
    element.addEventListener('input', resize);
    let width = element.getBoundingClientRect().width;
    const observer =
      typeof ResizeObserver === 'undefined'
        ? undefined
        : new ResizeObserver(() => {
            const nextWidth = element.getBoundingClientRect().width;
            if (nextWidth !== width) {
              width = nextWidth;
              resize();
            }
          });
    observer?.observe(element);
    return () => {
      element.removeEventListener('input', resize);
      observer?.disconnect();
      element.style.removeProperty('height');
      element.style.removeProperty('overflow-y');
    };
  }, [autoResize, minRows, maxRows, rows, value, showCount]);

  const input = (
    <textarea
      ref={innerRef}
      className={[
        'ec-textarea',
        `ec-input-shell--${status}`,
        autoResize && 'ec-textarea--auto-resize',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-invalid={status === 'error' || undefined}
      aria-describedby={[describedBy, showCount && countId].filter(Boolean).join(' ') || undefined}
      rows={minRows ?? rows}
      value={value}
      defaultValue={defaultValue}
      onChange={(event) => {
        setDraft(event.target.value);
        onChange?.(event);
      }}
      {...props}
    />
  );
  return showCount ? (
    <div className="ec-textarea-field">
      {input}
      <span id={countId} className="ec-textarea-count">
        {String(value ?? draft).length}
        {props.maxLength === undefined ? '' : ` / ${props.maxLength}`}
      </span>
    </div>
  ) : (
    input
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
