# ImageViewer

Controlled image gallery composed with Modal. `images` contains accessible image descriptions, `index` selects an image, and `onIndexChange` navigates. Closing restores focus through the shared overlay lifecycle.

Toolbar buttons and Left/Right keys navigate. Zoom works through buttons, wheel and pinch; drag pans a zoomed image and swipe navigates at normal scale. Double click toggles zoom. Rotation, horizontal/vertical flips and reset are available. Changing the active image or reopening resets transformations. Loading failures offer retry. The image list and URLs remain caller-owned; the component does not load business metadata or manage authorization.

## TypeScript 公开声明

以下内容由 `pnpm docs:generate` 从构建后的 `index.d.ts` 提取；CI 会检查声明与文档是否一致。

<!-- generated-api:start -->

```ts
export declare function ImageViewer({
  open,
  onOpenChange,
  images,
  index,
  onIndexChange,
  title,
}: ImageViewerProps): JSX.Element;

export declare interface ImageViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  images: readonly ImageViewerItem[];
  index: number;
  onIndexChange: (index: number) => void;
  title?: string;
}

export declare interface ImageViewerItem {
  src: string;
  alt: string;
}
```

<!-- generated-api:end -->
