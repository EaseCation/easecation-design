# SidebarNavItem

A primary or secondary navigation row with a label, icon, active state and optional controlled disclosure. Primary items highlight the icon; secondary items use an indented row. Use `asChild` with an anchor or router link to retain routing behavior. `collapsed` preserves the accessible label. The host supplies `aria-current` for links and manages group visibility.

All components use shared theme and size tokens, honor reduced motion, and provide at least the shared touch target on coarse pointers.

## TypeScript 公开声明

以下内容由 `pnpm docs:generate` 从构建后的 `index.d.ts` 提取；CI 会检查声明与文档是否一致。

<!-- generated-api:start -->

```ts
export declare const SidebarNavItem: ForwardRefExoticComponent<
  SidebarNavItemProps & RefAttributes<HTMLButtonElement>
>;

export declare interface SidebarNavItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  icon?: ReactNode;
  active?: boolean;
  level?: 'primary' | 'secondary';
  collapsed?: boolean;
  expanded?: boolean;
  asChild?: boolean;
}
```

<!-- generated-api:end -->
