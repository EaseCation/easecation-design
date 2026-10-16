import { useLocale } from '../../locale/LocaleProvider';
import { useId, type ReactNode } from 'react';
import { XIcon } from 'lucide-react';
import type { CSSProperties } from 'react';
import { Dialog as DialogPrimitive } from 'radix-ui';
import { useOverlayBehavior, useOverlayFocus } from '../../platform/useOverlayBehavior';
import { useOverlayViewportStyle } from '../../platform/useOverlayViewport';
import { IconButton } from '../Button';
import { useTheme } from '../../theme/ThemeProvider';

export interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  placement?: 'left' | 'right' | 'top' | 'bottom';
  size?: string;
  closeOnBackdrop?: boolean;
  /** Blocks every user dismissal, including host Back. */
  dismissible?: boolean;
  pending?: boolean;
  showCloseButton?: boolean;
  closeLabel?: string;
  ariaLabel?: string;
  instant?: boolean;
  className?: string;
  style?: CSSProperties;
}

export function Drawer({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  placement = 'right',
  size,
  closeOnBackdrop = true,
  dismissible = true,
  pending = false,
  showCloseButton = true,
  closeLabel: closeLabelProp,
  ariaLabel,
  instant = false,
  className,
  style,
}: DrawerProps) {
  const { messages } = useLocale();
  const closeLabel = closeLabelProp ?? messages.close;
  const id = useId();
  const { portalContainer } = useTheme();
  const canDismiss = dismissible && !pending;
  const changeOpen = useOverlayBehavior(open, onOpenChange, canDismiss);
  const focus = useOverlayFocus();

  const viewportStyle = useOverlayViewportStyle({
    ...style,
    ...(placement === 'top' || placement === 'bottom' ? { height: size } : { width: size }),
  });
  return (
    <DialogPrimitive.Root open={open} onOpenChange={changeOpen}>
      <DialogPrimitive.Portal container={portalContainer ?? undefined}>
        <DialogPrimitive.Overlay
          className={['ec-dialog-overlay', instant && 'is-instant'].filter(Boolean).join(' ')}
        />
        <DialogPrimitive.Content
          {...focus}
          tabIndex={-1}
          aria-busy={pending || undefined}
          data-side={placement}

          className={['ec-drawer', instant && 'is-instant', className].filter(Boolean).join(' ')}
          style={viewportStyle}
          aria-label={title ? undefined : (ariaLabel ?? closeLabel)}
          aria-describedby={description ? `${id}-description` : undefined}
          onEscapeKeyDown={(event) => {
            if (!canDismiss) event.preventDefault();
          }}
          onPointerDownOutside={(event) => {
            if (!closeOnBackdrop || !canDismiss) event.preventDefault();
          }}
          onInteractOutside={(event) => {
            if (!closeOnBackdrop || !canDismiss) event.preventDefault();
          }}
        >
          {title || description ? (
            <header className="ec-drawer__header">
              {title ? <DialogPrimitive.Title>{title}</DialogPrimitive.Title> : null}
              {description ? (
                <DialogPrimitive.Description id={`${id}-description`}>
                  {description}
                </DialogPrimitive.Description>
              ) : null}
            </header>
          ) : null}
          <div className="ec-drawer__body">{children}</div>
          {footer ? <footer className="ec-drawer__footer">{footer}</footer> : null}
          {showCloseButton ? (
            <DialogPrimitive.Close asChild>
              <IconButton
                className="ec-overlay-close"
                size="sm"
                label={closeLabel}
                disabled={!canDismiss}
                icon={<XIcon />}
              />
            </DialogPrimitive.Close>
          ) : null}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
