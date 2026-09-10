import { forwardRef, type ButtonHTMLAttributes, type HTMLAttributes } from 'react';
export type BadgeVariant = 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export interface BadgeButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BadgeVariant;
}

function badgeClassName(variant: BadgeVariant, className?: string) {
  return ['ec-badge', `ec-badge--${variant}`, className].filter(Boolean).join(' ');
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { variant = 'primary', className, ...props },
  ref,
) {
  return <span ref={ref} className={badgeClassName(variant, className)} {...props} />;
});

export const BadgeButton = forwardRef<HTMLButtonElement, BadgeButtonProps>(function BadgeButton(
  { variant = 'primary', className, type = 'button', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={badgeClassName(
        variant,
        ['ec-badge--interactive', 'ec-focusable', className].filter(Boolean).join(' '),
      )}
      {...props}
    />
  );
});
