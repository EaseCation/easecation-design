import { useEffect, useId, useRef, type CSSProperties, type ReactNode } from 'react';
export interface WatermarkProps {
  content: string;
  children?: ReactNode;
  /** Tile spacing in CSS pixels. */
  gap?: readonly [number, number];
  rotate?: number;
  opacity?: number;
  className?: string;
  style?: CSSProperties;
}

/** A repeating visual overlay, not an authorization or content-protection boundary. */
export function Watermark({
  content,
  children,
  gap = [24, 24],
  rotate = -22,
  opacity = 0.08,
  className,
  style,
}: WatermarkProps) {
  const id = `ec-watermark-${useId().replace(/:/g, '')}`;
  const overlay = useRef<SVGSVGElement>(null);
  const [gapX, gapY] = gap;
  const width = Math.max(120, content.length * 9) + Math.max(0, gapX);
  const height = 64 + Math.max(0, gapY);
  useEffect(() => {
    const element = overlay.current,
      parent = element?.parentElement;
    if (!element || !parent || typeof MutationObserver === 'undefined') return;
    const original = element.cloneNode(true) as SVGSVGElement;
    const observer = new MutationObserver(() => {
      observer.disconnect();
      if (element.parentElement !== parent) parent.appendChild(element);
      for (const attribute of Array.from(element.attributes))
        element.removeAttribute(attribute.name);
      for (const attribute of Array.from(original.attributes))
        element.setAttribute(attribute.name, attribute.value);
      element.replaceChildren(
        ...Array.from(original.childNodes).map((node) => node.cloneNode(true)),
      );
      observe();
    });
    const observe = () => {
      observer.observe(parent, { childList: true });
      observer.observe(element, {
        attributes: true,
        childList: true,
        subtree: true,
        characterData: true,
      });
    };
    observe();
    return () => observer.disconnect();
  }, [content, gapX, gapY, rotate, opacity]);
  return (
    <div
      className={['ec-watermark', className].filter(Boolean).join(' ')}
      style={{ position: 'relative', minWidth: 0, ...style }}
    >
      {children}
      <svg
        key={`${content}:${gapX}:${gapY}:${rotate}:${opacity}`}
        ref={overlay}
        className="ec-watermark__overlay"
        width="100%"
        height="100%"
        aria-hidden="true"
        focusable="false"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          color: 'var(--ec-color-text)',
          font: 'inherit',
          fontSize: 'var(--ec-font-size-sm)',
          pointerEvents: 'none',
          userSelect: 'none',
          opacity: Math.max(0, Math.min(1, opacity)),
        }}
      >
        <defs>
          <pattern id={id} width={width} height={height} patternUnits="userSpaceOnUse">
            <text
              x={width / 2}
              y={height / 2}
              textAnchor="middle"
              dominantBaseline="middle"
              transform={`rotate(${rotate}, ${width / 2}, ${height / 2})`}
              fill="currentColor"
            >
              {content}
            </text>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
    </div>
  );
}
