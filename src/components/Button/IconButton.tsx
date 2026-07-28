import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import type { ButtonVariant, ComponentSize } from './Button';
export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> { label: string; icon: ReactNode; variant?: ButtonVariant; size?: ComponentSize; loading?: boolean; }
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton({ label, icon, variant='ghost', size='md', loading=false, className, disabled, type='button', ...props }, ref) {
  return <button ref={ref} type={type} aria-label={label} aria-busy={loading || undefined} disabled={disabled || loading} className={['ec-icon-button','ec-focusable',`ec-button--${variant}`,`ec-button--${size}`,className].filter(Boolean).join(' ')} {...props}>{loading ? <span className="ec-spinner" aria-hidden="true"/> : icon}</button>;
});