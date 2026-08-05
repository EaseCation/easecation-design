import { useEffect, useId, type ReactNode } from 'react';
import { XIcon } from 'lucide-react';
import { Dialog as DialogPrimitive } from 'radix-ui';
import { registerOverlay } from '../../platform/overlayStack';
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
  showCloseButton?: boolean;
  closeLabel?: string;
  instant?: boolean;
  className?: string;
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
  showCloseButton = true,
  closeLabel = 'Close',
  instant = false,
  className,
}: DrawerProps) {
  const id = useId();
  const { resolvedMode } = useTheme();
  useEffect(() => {
    if (!open) return;
    return registerOverlay({ id, close: () => onOpenChange(false) });
  }, [id, onOpenChange, open]);

  const style = placement === 'top' || placement === 'bottom' ? { height: size } : { width: size };
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={['ec-dialog-overlay', instant && 'is-instant'].filter(Boolean).join(' ')}
        />
        <DialogPrimitive.Content
          data-side={placement}
          data-ec-theme={resolvedMode}
          className={[
            'ec-drawer',
            resolvedMode === 'dark' && 'dark',
            instant && 'is-instant',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          style={style}
          aria-describedby={description ? `${id}-description` : undefined}
          onPointerDownOutside={(event) => {
            if (!closeOnBackdrop) event.preventDefault();
          }}
          onInteractOutside={(event) => {
            if (!closeOnBackdrop) event.preventDefault();
          }}
        >
          {title || description ? (
            <header className="ec-drawer__header">
              {title ? (
                <DialogPrimitive.Title id={`${id}-title`}>{title}</DialogPrimitive.Title>
              ) : null}
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
              <IconButton className="ec-overlay-close" size="sm" label={closeLabel} icon={<XIcon />} />
            </DialogPrimitive.Close>
          ) : null}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
