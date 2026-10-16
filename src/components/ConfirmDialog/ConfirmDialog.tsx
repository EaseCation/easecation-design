import { useLocale } from '../../locale/LocaleProvider';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Button } from '../Button';
import { Modal } from '../Modal';
import { InlineQueryError } from '../State';

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  /** Resolve to close; reject to keep the dialog open for an explicit retry. */
  onConfirm: () => void | Promise<void>;
  confirmLabel?: string;
  cancelLabel?: string;
  errorMessage?: string;
  destructive?: boolean;
}

/** Shared confirmation, pending lock, error feedback, and focus restoration. */
export function ConfirmDialog(props: ConfirmDialogProps) {
  // Each opening starts a fresh operation. Settling a previous request cannot close a new dialog.
  return props.open ? <ConfirmDialogSession {...props} /> : null;
}

function ConfirmDialogSession({
  onOpenChange,
  title,
  description,
  children,
  onConfirm,
  confirmLabel: confirmLabelProp,
  cancelLabel: cancelLabelProp,
  errorMessage: errorMessageProp,
  destructive = false,
}: ConfirmDialogProps) {
  const { messages } = useLocale();
  const confirmLabel = confirmLabelProp ?? messages.confirm;
  const cancelLabel = cancelLabelProp ?? messages.cancel;
  const errorMessage = errorMessageProp ?? messages.actionFailed;
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);
  const locked = useRef(false);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  const confirm = async () => {
    if (locked.current) return;
    locked.current = true;
    setPending(true);
    setFailed(false);
    try {
      await onConfirm();
      if (mounted.current) onOpenChange(false);
    } catch {
      if (mounted.current) setFailed(true);
    } finally {
      if (mounted.current) {
        locked.current = false;
        setPending(false);
      }
    }
  };
  return (
    <Modal
      open
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      pending={pending}
      closeLabel={cancelLabel}
      showCloseButton={false}
      footer={
        <>
          <Button variant="outline" disabled={pending} onClick={() => onOpenChange(false)}>
            {cancelLabel}
          </Button>
          <Button variant={destructive ? 'danger' : 'primary'} loading={pending} onClick={confirm}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      {children}
      {failed ? <InlineQueryError title={errorMessage} /> : null}
    </Modal>
  );
}
