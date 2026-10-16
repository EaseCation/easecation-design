# SidebarPanel

A full-height sidebar frame with a brand, scrollable navigation region and a consistent footer. `collapsed` is controlled by the host; provide `onCollapsedChange` to show the shared collapse control. Omit it in a mobile drawer. Compose account menus through `footer`. Application routes, session state and translations stay in the host.

All components use shared theme and size tokens, honor reduced motion, and provide at least the shared touch target on coarse pointers.

## TypeScript 公开声明

以下内容由 `pnpm docs:generate` 从构建后的 `index.d.ts` 提取；CI 会检查声明与文档是否一致。

<!-- generated-api:start -->

```ts
export declare const SidebarPanel: ForwardRefExoticComponent<
  SidebarPanelProps & RefAttributes<HTMLDivElement>
>;

export declare interface SidebarPanelProps extends HTMLAttributes<HTMLDivElement> {
  brand: ReactNode;
  footer?: ReactNode;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  collapseLabel?: string;
  expandLabel?: string;
}
```

<!-- generated-api:end -->
