# PageSkeleton

A shared page-content placeholder built from Skeleton. It stays in normal document flow and never covers navigation or creates a fullscreen overlay. Pass a localized `label` for its busy status. For a known table, form or card layout, compose Skeleton directly to preserve that layout.

```tsx
<Suspense fallback={<PageSkeleton label="Loading content" />}>
  <Page />
</Suspense>
```

## TypeScript 公开声明

以下内容由 `pnpm docs:generate` 从构建后的 `index.d.ts` 提取；CI 会检查声明与文档是否一致。

<!-- generated-api:start -->

```ts
export declare const PageSkeleton: ForwardRefExoticComponent<
  PageSkeletonProps & RefAttributes<HTMLDivElement>
>;

export declare interface PageSkeletonProps extends HTMLAttributes<HTMLDivElement> {
  label?: string;
}
```

<!-- generated-api:end -->
