import {
  CircleAlertIcon,
  CircleCheckIcon,
  CircleXIcon,
  InfoIcon,
  TriangleAlertIcon,
  XIcon,
} from 'lucide-react';
import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { IconButton } from '../Button';

export type AlertTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

export interface AlertProps extends Omit<ComponentPropsWithoutRef<'div'>, 'title'> {
  tone?: AlertTone;
  title?: ReactNode;
  icon?: ReactNode | false;
  action?: ReactNode;
  onDismiss?: () => void;
  dismissLabel?: string;
}

const toneIcons: Record<AlertTone, ReactNode> = {
  neutral: <CircleAlertIcon />,
  info: <InfoIcon />,
  success: <CircleCheckIcon />,
  warning: <TriangleAlertIcon />,
  danger: <CircleXIcon />,
};

function isPresent(node: ReactNode) {
  return node !== undefined && node !== null && node !== false;
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  {
    tone = 'info',
    title,
    icon,
    action,
    onDismiss,
    dismissLabel = 'Dismiss',
    className,
    children,
    role,
    ...props
  },
  ref,
) {
  const resolvedIcon = icon === false ? null : (icon ?? toneIcons[tone]);
  const resolvedRole = role ?? (tone === 'danger' ? 'alert' : 'status');
  const hasTitle = isPresent(title);
  const hasDescription = isPresent(children);
  const hasAction = isPresent(action);
  const hasActions = hasAction || Boolean(onDismiss);

  return (
    <div
      ref={ref}
      role={resolvedRole}
      className={['ec-alert', className].filter(Boolean).join(' ')}
      data-tone={tone}
      data-show-icon={resolvedIcon ? 'true' : 'false'}
      data-has-description={hasDescription ? 'true' : 'false'}
      data-has-action={hasActions ? 'true' : 'false'}
      {...props}
    >
      {resolvedIcon ? (
        <span className="ec-alert__icon" aria-hidden="true">
          {resolvedIcon}
        </span>
      ) : null}
      <div className="ec-alert-content">
        {hasTitle ? <strong className="ec-alert__title">{title}</strong> : null}
        {hasDescription ? <div className="ec-alert-description">{children}</div> : null}
      </div>
      {hasActions ? (
        <div className="ec-alert-action">
          {hasAction ? action : null}
          {onDismiss ? (
            <IconButton
              className="ec-alert__dismiss"
              label={dismissLabel}
              icon={<XIcon />}
              size="sm"
              onClick={onDismiss}
            />
          ) : null}
        </div>
      ) : null}
    </div>
  );
});
