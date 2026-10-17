# WorkbenchWelcome

Welcome card with `name`, optional `greeting`, `avatarSrc`, product-supplied `backgroundImage`, `summary`, and `headingLevel` (1 or 2). Artwork is decorative and uses a dark theme island. Avatar failure shows initials; changing the source retries. Use level 2 when a page already owns its h1.

Import from `@easecation/design`. Appearance, hover/focus, responsive spacing, and reduced motion belong to the library. Applications own routing, permissions, identity requests, loading, summary data and artwork. Do not duplicate the component CSS in consumers.

## Extraction

Real consumers: Console workbench and HR home. This replaces their independently maintained welcome and navigation-entry presentation while preserving business-specific summaries and permission filtering. Test light/dark, 320/390/768/1280px, long names, sparse groups, avatar failure, keyboard navigation and SSR.

`avatarAlt` defaults to an empty string because the visible heading already identifies the user; supply a localized description when needed.

## TypeScript 公开声明

以下内容由 `pnpm docs:generate` 从构建后的 `index.d.ts` 提取；CI 会检查声明与文档是否一致。

<!-- generated-api:start -->

```ts
export declare function WorkbenchWelcome({
  name,
  greeting,
  avatarSrc,
  avatarAlt,
  backgroundImage,
  summary,
  headingLevel,
  className,
  ...props
}: WorkbenchWelcomeProps): JSX.Element;

export declare interface WorkbenchWelcomeProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
  greeting?: string;
  avatarSrc?: string;
  avatarAlt?: string;
  /** Decorative product artwork supplied by the application. */
  backgroundImage?: string;
  summary?: ReactNode;
  headingLevel?: 1 | 2;
}
```

<!-- generated-api:end -->
