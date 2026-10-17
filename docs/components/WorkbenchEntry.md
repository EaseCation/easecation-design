# WorkbenchEntry

A compact navigation link with `title`, optional `description`, `detail`, and decorative `icon`. Use `href` for anchors or `asChild` with one router Link child. Native link keyboard, focus and modified-click behavior are preserved. Filter unavailable destinations in the host; this component does not implement permissions.

Import from `@easecation/design`. Appearance, hover/focus, responsive spacing, and reduced motion belong to the library. Applications own routing, permissions, identity requests, loading, summary data and artwork. Do not duplicate the component CSS in consumers.

## Extraction

Real consumers: Console workbench and HR home. This replaces their independently maintained welcome and navigation-entry presentation while preserving business-specific summaries and permission filtering. Test light/dark, 320/390/768/1280px, long names, sparse groups, avatar failure, keyboard navigation and SSR.

## TypeScript 公开声明

以下内容由 `pnpm docs:generate` 从构建后的 `index.d.ts` 提取；CI 会检查声明与文档是否一致。

<!-- generated-api:start -->

```ts
export declare const WorkbenchEntry: ForwardRefExoticComponent<
  WorkbenchEntryProps & RefAttributes<HTMLAnchorElement>
>;

export declare interface WorkbenchEntryProps extends Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  'title'
> {
  title: string;
  description?: ReactNode;
  icon?: ReactNode;
  detail?: ReactNode;
  /** Compose a router Link; routing remains owned by the application. */
  asChild?: boolean;
}
```

<!-- generated-api:end -->
