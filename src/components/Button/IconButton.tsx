import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Button, type ButtonTone, type ButtonVariant, type ComponentSize } from './Button';
export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  icon: ReactNode;
  variant?: ButtonVariant;
  tone?: ButtonTone;
  size?: ComponentSize | 'xs';
  loading?: boolean;
  pressable?: boolean;
}
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  {
    label,
    icon,
    variant = 'ghost',
    tone = 'default',
    size = 'md',
    loading = false,
    pressable = true,
    className,
    disabled,
    type = 'button',
    ...props
  },
  ref,
) {
  return (
    <Button
      ref={ref}
      type={type}
      aria-label={label}
      loading={loading}
      disabled={disabled || loading}
      variant={variant}
      tone={tone}
      size={size}
      pressable={pressable}
      className={['ec-icon-button', className].filter(Boolean).join(' ')}
      leadingIcon={icon}
      {...props}
    />
  );
});
