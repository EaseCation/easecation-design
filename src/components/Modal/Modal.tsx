import { useEffect, useId, type CSSProperties, type ReactNode } from 'react';
import { XIcon } from 'lucide-react';
import { Dialog as DialogPrimitive } from 'radix-ui';
import { registerOverlay } from '../../platform/overlayStack';
import { IconButton } from '../Button';
import { useTheme } from '../../theme/ThemeProvider';

export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  closeOnBackdrop?: boolean;
  fullScreenOnMobile?: boolean;
  showCloseButton?: boolean;
  closeLabel?: string;
  instant?: boolean;
  className?: string;
  style?: CSSProperties;
}

function isTouchDevice() {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia?.('(pointer: coarse)').matches
  );
}

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  closeOnBackdrop = true,
  fullScreenOnMobile = false,
  showCloseButton = true,
  closeLabel = 'Close',
  instant = false,
  className,
  style,
}: ModalProps) {
  const id = useId();
  const { resolvedMode } = useTheme();
  useEffect(() => {
    if (!open) return;
    return registerOverlay({ id, close: () => onOpenChange(false) });
  }, [id, onOpenChange, open]);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={['ec-dialog-overlay', instant && 'is-instant'].filter(Boolean).join(' ')}
          data-testid="modal-overlay"
        />
        <DialogPrimitive.Content
          className={[
            'ec-modal',
            resolvedMode === 'dark' && 'dark',
            fullScreenOnMobile && 'ec-modal--responsive',
            instant && 'is-instant',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          data-ec-theme={resolvedMode}
          aria-describedby={description ? `${id}-description` : undefined}
          style={style}
          onOpenAutoFocus={(event) => {
            if (isTouchDevice()) event.preventDefault();
          }}
          onPointerDownOutside={(event) => {
            if (!closeOnBackdrop) event.preventDefault();
          }}
          onInteractOutside={(event) => {
            if (!closeOnBackdrop) event.preventDefault();
          }}
        >
          {title || description ? (
            <header className="ec-modal__header">
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
          <div className="ec-modal__body">{children}</div>
          {footer ? <footer className="ec-modal__footer">{footer}</footer> : null}
          {showCloseButton ? (
            <DialogPrimitive.Close asChild>
              <IconButton
                className="ec-overlay-close"
                size="sm"
                label={closeLabel}
                icon={<XIcon />}
              />
            </DialogPrimitive.Close>
          ) : null}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
