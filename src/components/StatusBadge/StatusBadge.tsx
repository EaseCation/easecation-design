import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

export type StatusBadgeTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';
export type StatusBadgeAppearance = 'soft' | 'solid' | 'outline';

export interface StatusBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: StatusBadgeTone;
  appearance?: StatusBadgeAppearance;
  icon?: ReactNode;
  showDot?: boolean;
}

export const StatusBadge = forwardRef<HTMLSpanElement, StatusBadgeProps>(function StatusBadge(
  { tone = 'neutral', appearance = 'soft', icon, showDot = false, className, children, ...props },
  ref,
) {
  return (
    <span
      ref={ref}
      className={['ec-status-badge', className].filter(Boolean).join(' ')}
      data-tone={tone}
      data-appearance={appearance}
      {...props}
    >
      {showDot ? <span className="ec-status-badge__dot" aria-hidden="true" /> : null}
      {icon ? (
        <span className="ec-status-badge__icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <span className="ec-status-badge__label">{children}</span>
    </span>
  );
});
