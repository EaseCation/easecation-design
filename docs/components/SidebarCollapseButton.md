# SidebarCollapseButton

An icon-only controlled collapse control with consistent icon placement and dimensions. The current action is available as its accessible name and hover title. Pass `collapsed`, `collapseLabel` and `expandLabel`; toggle the host state in `onClick`. `SidebarPanel` composes this automatically when `onCollapsedChange` is provided.

All components use shared theme and size tokens, honor reduced motion, and provide at least the shared touch target on coarse pointers.

## TypeScript 公开声明

以下内容由 `pnpm docs:generate` 从构建后的 `index.d.ts` 提取；CI 会检查声明与文档是否一致。

<!-- generated-api:start -->

```ts
export declare const SidebarCollapseButton: ForwardRefExoticComponent<
  SidebarCollapseButtonProps & RefAttributes<HTMLButtonElement>
>;

export declare interface SidebarCollapseButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  collapsed: boolean;
  collapseLabel?: string;
  expandLabel?: string;
}
```

<!-- generated-api:end -->
