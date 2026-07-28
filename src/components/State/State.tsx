import { AlertTriangleIcon, InboxIcon } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import { Button } from '../Button';
export interface EmptyStateProps extends ComponentProps<'div'> {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}
export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div className={['ec-empty-state', className].filter(Boolean).join(' ')} {...props}>
      <div className="ec-state-icon">{icon ?? <InboxIcon />}</div>
      <div className="ec-state-copy">
        <h3>{title}</h3>
        {description ? <p>{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
export interface ErrorStateProps extends ComponentProps<'div'> {
  title: string;
  description?: string;
  actionLabel?: string;
  onRetry?: () => void;
}
export function ErrorState({
  title,
  description,
  actionLabel = '重试',
  onRetry,
  className,
  ...props
}: ErrorStateProps) {
  return (
    <div
      className={['ec-empty-state', 'ec-error-state', className].filter(Boolean).join(' ')}
      {...props}
    >
      <div className="ec-state-icon">
        <AlertTriangleIcon />
      </div>
      <div className="ec-state-copy">
        <h3>{title}</h3>
        {description ? <p>{description}</p> : null}
      </div>
      {onRetry ? (
        <Button variant="outline" onClick={onRetry}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
export interface InlineQueryErrorProps extends ComponentProps<'div'> {
  title?: string;
  description?: string;
  actionLabel?: string;
  onRetry?: () => void;
  embedded?: boolean;
}
export function InlineQueryError({
  title = '加载失败',
  description,
  actionLabel = '重试',
  onRetry,
  embedded = false,
  className,
  ...props
}: InlineQueryErrorProps) {
  return (
    <div
      role="alert"
      className={['ec-inline-error', embedded && 'is-embedded', className]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      <div className="ec-inline-error__title">
        <AlertTriangleIcon />
        <h3>{title}</h3>
      </div>
      {description ? <p>{description}</p> : null}
      {onRetry ? (
        <Button variant="outline" size="sm" onClick={onRetry}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
