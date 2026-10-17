import {
  forwardRef,
  useImperativeHandle,
  useRef,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import RcInputNumber, { type InputNumberRef } from '@rc-component/input-number';
import type { ComponentSize } from '../Button';
import type { InputStatus } from '../Input';

interface NumberInputBaseProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  | 'size'
  | 'prefix'
  | 'value'
  | 'defaultValue'
  | 'onChange'
  | 'min'
  | 'max'
  | 'step'
  | 'type'
  | 'onInput'
  | 'onMouseDown'
  | 'onMouseUp'
  | 'onMouseMove'
  | 'onMouseEnter'
  | 'onMouseLeave'
  | 'onMouseOut'
  | 'onMouseOver'
  | 'onClick'
> {
  size?: ComponentSize;
  status?: InputStatus;
  prefix?: ReactNode;
  suffix?: ReactNode;
  /** Decimal places applied on blur or Enter, without interrupting typing. */
  precision?: number;
  step?: number | string;
}

export type NumberInputProps = NumberInputBaseProps &
  (
    | {
        stringMode?: false;
        value?: number | null;
        defaultValue?: number;
        min?: number;
        max?: number;
        onValueChange?: (value: number | null) => void;
      }
    | {
        /** Preserve values beyond JavaScript number precision as decimal strings. */
        stringMode: true;
        value?: string | null;
        defaultValue?: string;
        min?: string;
        max?: string;
        onValueChange?: (value: string | null) => void;
      }
  );

/** Decimal input with ArrowUp/ArrowDown stepping and blur/Enter normalization. */
export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(function NumberInput(
  { size = 'md', status = 'default', className, disabled, onValueChange, stringMode, ...props },
  ref,
) {
  const innerRef = useRef<InputNumberRef>(null);
  useImperativeHandle(
    ref,
    () => innerRef.current?.nativeElement.querySelector('input') as HTMLInputElement,
  );
  return (
    <RcInputNumber<number | string>
      {...props}
      ref={innerRef}
      stringMode={stringMode}
      controls={false}
      inputMode="decimal"
      disabled={disabled}
      aria-invalid={status === 'error' || props['aria-invalid'] || undefined}
      prefixCls="ec-number-input"
      className={[
        'ec-input-shell',
        `ec-input-shell--${size}`,
        `ec-input-shell--${status}`,
        disabled && 'is-disabled',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      classNames={{ input: 'ec-input', prefix: 'ec-input-affix', suffix: 'ec-input-affix' }}
      onChange={(value) => {
        if (stringMode) {
          (onValueChange as ((value: string | null) => void) | undefined)?.(
            value === null ? null : String(value),
          );
        } else {
          (onValueChange as ((value: number | null) => void) | undefined)?.(
            value === null ? null : Number(value),
          );
        }
      }}
    />
  );
});
