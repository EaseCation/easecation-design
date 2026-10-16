import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import { useReducedMotion } from './useReducedMotion';

/** Shared physical press feedback for surface and action primitives. */
export function usePressFeedback(enabled: boolean, rotation: number) {
  const reducedMotion = useReducedMotion();
  const active = enabled && !reducedMotion;
  const [pressStyle, setPressStyle] = useState<CSSProperties | null>(null);
  const gesture = useRef({ held: false, until: 0 });
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const clearTimer = () => {
    clearTimeout(timer.current);
    timer.current = undefined;
  };
  const end = () => {
    clearTimer();
    gesture.current.held = false;
    setPressStyle(null);
  };
  useEffect(() => {
    if (!active) {
      clearTimeout(timer.current);
      gesture.current.held = false;
    }
    return () => clearTimeout(timer.current);
  }, [active]);
  if (!active && pressStyle !== null) setPressStyle(null);
  const begin = (element: HTMLElement, clientX?: number, clientY?: number) => {
    if (!active) return;
    clearTimer();
    const duration = getComputedStyle(element).getPropertyValue('--ec-motion-fast').trim();
    const milliseconds = (Number.parseFloat(duration) || 0) * (duration.endsWith('ms') ? 1 : 1000);
    gesture.current = { held: true, until: performance.now() + Math.max(0, milliseconds) };
    const rect = element.getBoundingClientRect();
    const x = clientX === undefined ? rect.width / 2 : clientX - rect.left;
    const y = clientY === undefined ? rect.height / 2 : clientY - rect.top;
    const clamp = (value: number) => Math.max(-1, Math.min(1, value));
    setPressStyle({
      '--press-x': `${x}px`,
      '--press-y': `${y}px`,
      '--rotate-x': `${-clamp((y - rect.height / 2) / (rect.height / 2 || 1)) * rotation}deg`,
      '--rotate-y': `${clamp((x - rect.width / 2) / (rect.width / 2 || 1)) * rotation}deg`,
    } as CSSProperties);
  };
  const release = () => {
    if (!gesture.current.held) return;
    gesture.current.held = false;
    const remaining = gesture.current.until - performance.now();
    if (active && remaining > 0) timer.current = setTimeout(end, remaining);
    else end();
  };
  return {
    pressing: active && pressStyle !== null,
    pressStyle: active ? (pressStyle ?? {}) : {},
    start(event: PointerEvent<HTMLElement>) {
      if (event.defaultPrevented || (event.button != null && event.button !== 0)) return;
      begin(event.currentTarget, event.clientX, event.clientY);
    },
    // Native keyboard and assistive-technology clicks have no pointer location.
    // Keep their centered feedback visual only; the browser owns activation.
    activate(element: HTMLElement) {
      begin(element);
      release();
    },
    release,
    // Touch releases capture and leaves the surface after pointerup. Let an
    // already completed tap finish its feedback; interrupted presses cancel.
    cancelHeld() {
      if (gesture.current.held) end();
    },
    end,
  };
}
