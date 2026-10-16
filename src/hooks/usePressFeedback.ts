import { useState, type CSSProperties, type PointerEvent } from 'react';
import { useReducedMotion } from './useReducedMotion';

/** Shared physical press feedback for surface and action primitives. */
export function usePressFeedback(enabled: boolean, rotation: number) {
  const reducedMotion = useReducedMotion();
  const active = enabled && !reducedMotion;
  const [pressStyle, setPressStyle] = useState<CSSProperties | null>(null);
  const end = () => setPressStyle(null);
  if (!active && pressStyle !== null) setPressStyle(null);
  return {
    pressing: active && pressStyle !== null,
    pressStyle: active ? (pressStyle ?? {}) : {},
    start(event: PointerEvent<HTMLElement>) {
      if (!active || event.defaultPrevented || (event.button != null && event.button !== 0)) return;
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
    end,
  };
}
