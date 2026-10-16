import { useMediaQuery } from './useMediaQuery';

/** Live system motion preference; safe during server rendering. */
export function useReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}
