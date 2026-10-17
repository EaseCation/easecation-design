import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

export interface ProgressProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Accessible name describing the operation or quantity. */
  label: string;
  /** Percentage, clamped to 0–100. Null means the total is unknown. */
  value: number | null;
  size?: 'sm' | 'md';
  tone?: 'primary' | 'success' | 'warning' | 'danger';
  showValue?: boolean;
  formatValue?: (value: number) => ReactNode;
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(function Progress(
  {
    label,
    value,
    size = 'md',
    tone = 'primary',
    showValue = true,
    formatValue,
    className,
    ...props
  },
  ref,
) {
  const percent =
    value === null ? null : Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 0;
  return (
    <div
      ref={ref}
      className={['ec-progress-indicator', className].filter(Boolean).join(' ')}
      data-size={size}
      data-tone={tone}
      {...props}
    >
      <div
        className="ec-progress__track"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent ?? undefined}
      >
        <div className="ec-progress__fill" style={{ width: `${percent ?? 40}%` }} />
      </div>
      {showValue && percent !== null ? (
        <span className="ec-progress__value">{formatValue?.(percent) ?? `${percent}%`}</span>
      ) : null}
    </div>
  );
});
