# SidebarPanel

A full-height sidebar frame with a brand, scrollable navigation region and a consistent footer. `collapsed` is controlled by the host; provide `onCollapsedChange` to show the shared collapse control. Omit it in a mobile drawer. Compose account menus through `footer`. Application routes, session state and translations stay in the host.

All components use shared theme and size tokens, honor reduced motion, and provide at least the shared touch target on coarse pointers.

For AppShell drawer entrance/exit staggering, wrap each visible navigation row in
`.ec-sidebar-motion-row` and set its zero-based `--row-index`. Entrance delays cap at
240ms so long navigation lists finish within the drawer's animation phase.

For expandable groups, keep content mounted inside `.ec-sidebar-group-content`
with `data-expanded={expanded}`, containing `.ec-sidebar-group-content__inner`
and a nested list wrapper for application-owned spacing. The shared grid transition animates height
and honors reduced motion. Set `inert={!expanded}` and `aria-hidden={!expanded}`
on the content; connect the toggle with `aria-controls` and `expanded`. Applications
own expanded state and route selection. See the Sidebar story for the composition.

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
