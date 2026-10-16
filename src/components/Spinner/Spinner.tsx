import { forwardRef, type HTMLAttributes } from 'react';

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  /** Omit to inherit the surrounding text size, including inside a button. */
  size?: 'sm' | 'md' | 'lg';
  /** Supply for standalone status; omit for decorative icons beside visible text. */
  label?: string;
}

const sizes = {
  sm: 'var(--ec-font-size-xs)',
  md: 'var(--ec-font-size-md)',
  lg: 'var(--ec-control-xs)',
};

export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  { size, label, className, style, ...props },
  ref,
) {
  return (
    <span
      ref={ref}
      className={['ec-spinner', className].filter(Boolean).join(' ')}
      role={label ? 'status' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      style={{ ...(size ? { fontSize: sizes[size] } : {}), ...style }}
      {...props}
    />
  );
});
