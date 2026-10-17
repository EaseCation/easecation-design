# ExpandableText

Plain text with a bounded line preview and a keyboard-accessible expand/collapse control. Short text has no unnecessary toggle. New text resets the preview; width changes update overflow detection. Use existing Accordion for structured content and navigation sections.

```tsx
import { ExpandableText } from '@easecation/design';

<ExpandableText text={description} rows={3} />;
```

`text` remains fully available to assistive technology. The button provides aria-expanded and aria-controls, keeps focus on collapse, and uses LocaleProvider labels unless expandLabel/collapseLabel are supplied. `collapsible={false}` displays all content. Applications own the text, empty fallback, requests and business state. ClassName and style are for placement and layout.

Review short/long text, line breaks, narrow/touch layouts, width changes, keyboard toggling, light/dark and SSR. The component adds no motion.

## TypeScript 公开声明

以下内容由 `pnpm docs:generate` 从构建后的 `index.d.ts` 提取；CI 会检查声明与文档是否一致。

<!-- generated-api:start -->

```ts
export declare function ExpandableText(props: ExpandableTextProps): JSX.Element;

export declare interface ExpandableTextProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children'
> {
  text: string;
  /** Number of visible lines before expansion. */
  rows?: number;
  /** Render the full text without an expansion control. */
  collapsible?: boolean;
  expandLabel?: ReactNode;
  collapseLabel?: ReactNode;
}
```

<!-- generated-api:end -->
