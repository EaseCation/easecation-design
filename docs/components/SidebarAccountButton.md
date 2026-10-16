# SidebarAccountButton

A consistent account-menu trigger with a decorative user icon (or custom `avatar`), a truncated name and a disclosure indicator. Use as the child of `DropdownMenuTrigger`. `collapsed` keeps its height and accessible name while displaying the avatar only. Pass `avatarSrc` to load a real image; the custom `avatar` or default icon stays visible while loading and on failure. Changing the source resets image state. Menu items remain owned by the host.

All components use shared theme and size tokens, honor reduced motion, and provide at least the shared touch target on coarse pointers.

## TypeScript 公开声明

以下内容由 `pnpm docs:generate` 从构建后的 `index.d.ts` 提取；CI 会检查声明与文档是否一致。

<!-- generated-api:start -->

```ts
export declare const SidebarAccountButton: ForwardRefExoticComponent<
  SidebarAccountButtonProps & RefAttributes<HTMLButtonElement>
>;

export declare interface SidebarAccountButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  name: string;
  avatar?: ReactNode;
  /** Image URL; avatar (or the default icon) is shown while loading or on failure. */
  avatarSrc?: string;
  collapsed?: boolean;
}
```

<!-- generated-api:end -->
