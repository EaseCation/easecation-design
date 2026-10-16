import { useLocale } from '../../locale/LocaleProvider';
import { AlertTriangleIcon, InboxIcon, ShieldOffIcon } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import { Button } from '../Button';
export interface EmptyStateProps extends ComponentProps<'div'> {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  embedded?: boolean;
}
export function EmptyState({
  title,
  description,
  icon,
  action,
  embedded = false,
  className,
  ...props
}: EmptyStateProps) {
  const { messages } = useLocale();
  return (
    <div
      className={['ec-empty-state', embedded && 'is-embedded', className].filter(Boolean).join(' ')}
      {...props}
    >
      <div className="ec-state-icon">{icon ?? <InboxIcon />}</div>
      <div className="ec-state-copy">
        <h3>{title ?? messages.loadFailed}</h3>
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
  actionLabel,
  onRetry,
  className,
  ...props
}: ErrorStateProps) {
  const { messages } = useLocale();
  return (
    <div
      className={['ec-empty-state', 'ec-error-state', className].filter(Boolean).join(' ')}
      {...props}
    >
      <div className="ec-state-icon">
        <AlertTriangleIcon />
      </div>
      <div className="ec-state-copy">
        <h3>{title ?? messages.loadFailed}</h3>
        {description ? <p>{description}</p> : null}
      </div>
      {onRetry ? (
        <Button variant="outline" onClick={onRetry}>
          {actionLabel ?? messages.retry}
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
  title,
  description,
  actionLabel,
  onRetry,
  embedded = false,
  className,
  ...props
}: InlineQueryErrorProps) {
  const { messages } = useLocale();
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
        <h3>{title ?? messages.loadFailed}</h3>
      </div>
      {description ? <p>{description}</p> : null}
      {onRetry ? (
        <Button variant="outline" size="sm" onClick={onRetry}>
          {actionLabel ?? messages.retry}
        </Button>
      ) : null}
    </div>
  );
}

export interface AccessDeniedStateProps extends Omit<EmptyStateProps, 'title' | 'icon'> {
  title?: string;
}
/** Permission presentation only; authorization and navigation belong to the host. */
export function AccessDeniedState({ title, description, ...props }: AccessDeniedStateProps) {
  const { messages } = useLocale();
  return (
    <EmptyState
      title={title ?? messages.accessDenied}
      description={description ?? messages.accessDeniedDescription}
      icon={<ShieldOffIcon aria-hidden="true" />}
      {...props}
    />
  );
}
