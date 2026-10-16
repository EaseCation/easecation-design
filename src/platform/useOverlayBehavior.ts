import { useCallback, useEffect, useId, useRef } from 'react';
import { registerOverlay } from './overlayStack';

/** Keep an open layer in place when a consumer recreates its callback. */
export function useOverlayBehavior(
  open: boolean,
  onOpenChange: (open: boolean) => void,
  dismissible = true,
) {
  const id = useId();
  const latest = useRef({ onOpenChange, dismissible });
  useEffect(() => {
    latest.current = { onOpenChange, dismissible };
  }, [onOpenChange, dismissible]);
  const changeOpen = useCallback((next: boolean) => {
    if (next || latest.current.dismissible) latest.current.onOpenChange(next);
  }, []);
  useEffect(() => {
    if (!open) return;
    // A locked top layer still consumes Back; never dismiss a layer underneath it.
    return registerOverlay({ id, close: () => changeOpen(false) });
  }, [id, open, changeOpen]);
  return changeOpen;
}

export function useOverlayFocus() {
  const contentRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  return {
    ref: contentRef,
    onOpenAutoFocus(event: Event) {
      previousFocus.current =
        document.activeElement instanceof HTMLElement ? document.activeElement : null;
      const touch =
        navigator.maxTouchPoints > 0 || window.matchMedia?.('(pointer: coarse)').matches;
      if (touch && !event.defaultPrevented) {
        event.preventDefault();
        contentRef.current?.focus({ preventScroll: true });
      }
    },
    onCloseAutoFocus(event: Event) {
      if (!event.defaultPrevented && previousFocus.current?.isConnected) {
        event.preventDefault();
        previousFocus.current.focus({ preventScroll: true });
      }
    },
  };
}
