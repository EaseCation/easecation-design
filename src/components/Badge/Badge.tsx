import { forwardRef, type HTMLAttributes } from 'react';
export type BadgeVariant = 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { variant = 'primary', className, ...props },
  ref,
) {
  return (
    <span
      ref={ref}
      className={['ec-badge', `ec-badge--${variant}`, className].filter(Boolean).join(' ')}
      {...props}
    />
  );
});
