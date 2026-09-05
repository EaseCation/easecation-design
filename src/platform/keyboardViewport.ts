export interface KeyboardViewportSnapshot {
  height: number;
  offsetTop: number;
  keyboardHeight: number;
}
export function observeKeyboardViewport(callback: (snapshot: KeyboardViewportSnapshot) => void) {
  if (typeof window === 'undefined' || !window.visualViewport) return () => {};
  const viewport = window.visualViewport;
  const update = () =>
    callback({
      height: viewport.height,
      offsetTop: viewport.offsetTop,
      keyboardHeight: Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop),
    });
  update();
  viewport.addEventListener('resize', update);
  viewport.addEventListener('scroll', update);
  return () => {
    viewport.removeEventListener('resize', update);
    viewport.removeEventListener('scroll', update);
  };
}
