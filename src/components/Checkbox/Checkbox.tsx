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
  'type' | 'size'
> {
  label?: ReactNode;
  description?: ReactNode;
  indeterminate?: boolean;
}
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, description, indeterminate = false, className, id, ...props },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const innerRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => innerRef.current as HTMLInputElement);
  useEffect(() => {
    if (innerRef.current) innerRef.current.indeterminate = indeterminate;
  }, [indeterminate]);
  return (
    <label className={['ec-check', className].filter(Boolean).join(' ')} htmlFor={inputId}>
      <input
        ref={innerRef}
        id={inputId}
        type="checkbox"
        aria-checked={indeterminate ? 'mixed' : props.checked}
        {...props}
      />
      <span className="ec-check__box" aria-hidden="true">
        {indeterminate ? <MinusIcon /> : <CheckIcon />}
      </span>
      {label || description ? (
        <span className="ec-check__content">
          {label ? <span>{label}</span> : null}
          {description ? <small>{description}</small> : null}
        </span>
      ) : null}
    </label>
  );
});
