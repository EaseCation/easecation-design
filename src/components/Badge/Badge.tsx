import { forwardRef, type ButtonHTMLAttributes, type HTMLAttributes } from 'react';
export type BadgeVariant = 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
export type BadgeColor =
  | 'blue'
  | 'cyan'
  | 'teal'
  | 'green'
  | 'lime'
  | 'amber'
  | 'orange'
  | 'red'
  | 'rose'
  | 'pink'
  | 'purple'
  | 'indigo';
export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  /** Stable categorical color; takes precedence over variant appearance. */
  color?: BadgeColor;
}

export interface BadgeButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BadgeVariant;
  /** Stable categorical color; takes precedence over variant appearance. */
  color?: BadgeColor;
}

function badgeClassName(variant: BadgeVariant, className?: string) {
  return ['ec-badge', `ec-badge--${variant}`, className].filter(Boolean).join(' ');
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { variant = 'primary', color, className, ...props },
  ref,
) {
  return (
    <span data-color={color} ref={ref} className={badgeClassName(variant, className)} {...props} />
  );
});

export const BadgeButton = forwardRef<HTMLButtonElement, BadgeButtonProps>(function BadgeButton(
  { variant = 'primary', color, className, type = 'button', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      data-color={color}
      className={badgeClassName(
        variant,
        ['ec-badge--interactive', 'ec-focusable', className].filter(Boolean).join(' '),
      )}
      {...props}
    />
  );
});
