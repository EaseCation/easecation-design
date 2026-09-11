import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import type { ButtonTone, ButtonVariant, ComponentSize } from './Button';
export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  icon: ReactNode;
  variant?: ButtonVariant;
  tone?: ButtonTone;
  size?: ComponentSize | 'xs';
  loading?: boolean;
}
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  {
    label,
    icon,
    variant = 'ghost',
    tone = 'default',
    size = 'md',
    loading = false,
    className,
    disabled,
    type = 'button',
    ...props
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      aria-busy={loading || undefined}
      disabled={disabled || loading}
      className={[
        'ec-icon-button',
        'ec-focusable',
        `ec-button--${variant}`,
        tone !== 'default' && `ec-button--tone-${tone}`,
        `ec-button--${size}`,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {loading ? <span className="ec-spinner" aria-hidden="true" /> : icon}
    </button>
  );
});
