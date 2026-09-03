import { useEffect, useState, type CSSProperties } from 'react';
import { observeKeyboardViewport, type KeyboardViewportSnapshot } from './keyboardViewport';

export type OverlayViewportStyle = CSSProperties & {
  '--ec-overlay-viewport-height'?: string;
  '--ec-overlay-viewport-offset-top'?: string;
};

export function useOverlayViewportStyle(style?: CSSProperties): OverlayViewportStyle {
  const [viewport, setViewport] = useState<KeyboardViewportSnapshot | null>(null);

  useEffect(() => observeKeyboardViewport(setViewport), []);

  return {
    ...style,
    '--ec-overlay-viewport-height': viewport ? `${viewport.height}px` : undefined,
    '--ec-overlay-viewport-offset-top': viewport ? `${viewport.offsetTop}px` : undefined,
  };
}
