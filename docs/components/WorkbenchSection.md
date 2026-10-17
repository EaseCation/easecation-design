# WorkbenchSection

A labeled section containing a responsive entry grid. Pass `title`, optional decorative `icon`, and WorkbenchEntry children. Columns remain consistent for sparse sections: one below 640px, two from 640px, three from 1024px.

Import from `@easecation/design`. Appearance, hover/focus, responsive spacing, and reduced motion belong to the library. Applications own routing, permissions, identity requests, loading, summary data and artwork. Do not duplicate the component CSS in consumers.

## Extraction

Real consumers: Console workbench and HR home. This replaces their independently maintained welcome and navigation-entry presentation while preserving business-specific summaries and permission filtering. Test light/dark, 320/390/768/1280px, long names, sparse groups, avatar failure, keyboard navigation and SSR.

Use `groups: Array<{ title, content }>` for subgrouped navigation; subgroup headings appear when there is more than one group. A single group uses the section heading without repeating it.

## TypeScript 公开声明

以下内容由 `pnpm docs:generate` 从构建后的 `index.d.ts` 提取；CI 会检查声明与文档是否一致。

<!-- generated-api:start -->

```ts
export declare function WorkbenchSection({
  title,
  icon,
  groups,
  children,
  className,
  ...props
}: WorkbenchSectionProps): JSX.Element;

export declare interface WorkbenchSectionProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title: string;
  icon?: ReactNode;
  groups?: Array<{
    title: string;
    content: ReactNode;
  }>;
}
```

<!-- generated-api:end -->
