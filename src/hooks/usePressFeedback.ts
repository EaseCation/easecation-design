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
  return {
    pressing: active && pressStyle !== null,
    pressStyle: active ? (pressStyle ?? {}) : {},
    start(event: PointerEvent<HTMLElement>) {
      if (!active || event.defaultPrevented || (event.button != null && event.button !== 0)) return;
      clearTimer();
      const duration = getComputedStyle(event.currentTarget)
        .getPropertyValue('--ec-motion-fast')
        .trim();
      const milliseconds =
        (Number.parseFloat(duration) || 0) * (duration.endsWith('ms') ? 1 : 1000);
      gesture.current = { held: true, until: performance.now() + Math.max(0, milliseconds) };
      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      setPressStyle({
        '--press-x': `${x}px`,
        '--press-y': `${y}px`,
        '--rotate-x': `${-((y - rect.height / 2) / (rect.height / 2 || 1)) * rotation}deg`,
        '--rotate-y': `${((x - rect.width / 2) / (rect.width / 2 || 1)) * rotation}deg`,
      } as CSSProperties);
    },
    release() {
      if (!gesture.current.held) return;
      gesture.current.held = false;
      const remaining = gesture.current.until - performance.now();
      if (active && remaining > 0) timer.current = setTimeout(end, remaining);
      else end();
    },
    // Touch releases capture and leaves the surface after pointerup. Let an
    // already completed tap finish its feedback; interrupted presses cancel.
    cancelHeld() {
      if (gesture.current.held) end();
    },
    end,
  };
}
