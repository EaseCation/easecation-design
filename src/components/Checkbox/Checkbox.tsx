import {
  forwardRef,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { CheckIcon, MinusIcon } from 'lucide-react';
export interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'size' | 'checked'
> {
  label?: ReactNode;
  description?: ReactNode;
  indeterminate?: boolean;
  checked?: boolean | 'indeterminate';
  onCheckedChange?: (checked: boolean) => void;
}
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  {
    label,
    description,
    indeterminate = false,
    checked,
    onCheckedChange,
    onChange,
    className,
    id,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const innerRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => innerRef.current as HTMLInputElement);
  const mixed = indeterminate || checked === 'indeterminate';
  const control = (
    <>
      <input
        ref={innerRef}
        id={inputId}
        type="checkbox"
        data-slot="checkbox"
        data-state={mixed ? 'indeterminate' : checked ? 'checked' : 'unchecked'}
        checked={checked === 'indeterminate' ? false : checked}
        aria-checked={mixed ? 'mixed' : checked}
        onChange={(event) => {
          onChange?.(event);
          onCheckedChange?.(event.target.checked);
        }}
        {...props}
      />
      <span className="ec-check__box" aria-hidden="true">
        {mixed ? <MinusIcon /> : <CheckIcon />}
      </span>
      {label || description ? (
        <span className="ec-check__content">
          {label ? <span>{label}</span> : null}
          {description ? <small>{description}</small> : null}
        </span>
      ) : null}
    </>
  );
  useEffect(() => {
    if (innerRef.current) innerRef.current.indeterminate = mixed;
  }, [mixed]);

  const rootClassName = ['ec-check', className].filter(Boolean).join(' ');
  return label || description ? (
    <label className={rootClassName} htmlFor={inputId}>
      {control}
    </label>
  ) : (
    <span className={rootClassName}>{control}</span>
  );
});
