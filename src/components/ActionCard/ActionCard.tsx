import { forwardRef, type ButtonHTMLAttributes } from 'react';

export interface ActionCardProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md';
  selected?: boolean;
}

export const ActionCard = forwardRef<HTMLButtonElement, ActionCardProps>(function ActionCard(
  {
    size = 'md',
    selected,
    type = 'button',
    className,
    children,
    'aria-pressed': ariaPressed,
    ...props
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={['ec-action-card', 'ec-focusable', className].filter(Boolean).join(' ')}
      data-size={size}
      data-selected={selected ? 'true' : undefined}
      aria-pressed={ariaPressed ?? (selected === undefined ? undefined : selected)}
      {...props}
    >
      <span className="ec-action-card__content">{children}</span>
    </button>
  );
});
