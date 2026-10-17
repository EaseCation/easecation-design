# Watermark

A repeating text overlay with optional children. Spacing, rotation and opacity are controlled by props; color and type follow semantic theme tokens. Pointer events pass through and assistive technologies ignore the decorative SVG. Rendering is SSR-safe.

A MutationObserver restores removed or altered overlay nodes while mounted. This is a visual deterrent; applications remain responsible for authorization and data protection. Content, audit policy and user identification belong to the caller.

## TypeScript 公开声明

以下内容由 `pnpm docs:generate` 从构建后的 `index.d.ts` 提取；CI 会检查声明与文档是否一致。

<!-- generated-api:start -->

```ts
export declare function Watermark({
  content,
  children,
  gap,
  rotate,
  opacity,
  className,
  style,
}: WatermarkProps): JSX.Element;

export declare interface WatermarkProps {
  content: string;
  children?: ReactNode;
  /** Tile spacing in CSS pixels. */
  gap?: readonly [number, number];
  rotate?: number;
  opacity?: number;
  className?: string;
  style?: CSSProperties;
}
```

<!-- generated-api:end -->
