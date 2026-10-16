# PageTransition

A router-independent page entry wrapper using the shared base motion duration and emphasized easing. Pass `transitionKey` from the host router to restart entry when the destination changes. Changing that key remounts its children; keep persistent navigation, forms that must survive navigation, and shared providers outside this wrapper.

The shared reduced-motion policy removes the stagger delay and completes animation immediately. Use this wrapper for route content only, not a fullscreen loading layer.

```tsx
<PageTransition transitionKey={pathname}>{children}</PageTransition>
```

## TypeScript 公开声明

以下内容由 `pnpm docs:generate` 从构建后的 `index.d.ts` 提取；CI 会检查声明与文档是否一致。

<!-- generated-api:start -->

```ts
export declare const PageTransition: ForwardRefExoticComponent<
  PageTransitionProps & RefAttributes<HTMLDivElement>
>;

export declare interface PageTransitionProps extends HTMLAttributes<HTMLDivElement> {
  /** The host router owns this key; changing it restarts entry and resets page children. */
  transitionKey?: Key;
}
```

<!-- generated-api:end -->
