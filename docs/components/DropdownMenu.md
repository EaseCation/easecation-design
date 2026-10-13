# DropdownMenu

导航或访问边界组件。路由和服务端权限仍由应用负责。

## 导入

```tsx
import { DropdownMenu } from '@easecation/design';
import '@easecation/design/style.css';
```

组件只从包根入口导入。不要依赖 src/、dist/ 或内部组件路径。

## 基础示例

```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button>操作</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>编辑</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

## API

DropdownMenu、Trigger、Content、Item、CheckboxItem、RadioItem、Label、Separator、Shortcut 和 Sub 组合 API。

- **成熟度**：`beta`
- **支持平台**：web, pwa, android-webview, ios-wkwebview, windows-webview2, ssr
- **可访问性**：radix-roving-focus, keyboard-navigation, menu-roles
- **主要 Token**：`--ec-color-popover`, `--ec-color-accent`, `--ec-shadow-lg`

## 使用约束

- 业务状态、请求、权限和路由由应用层维护，通过 Props 和回调传入。
- 同一个值不要同时使用受控属性与 default* 属性。
- 不覆盖组件内部 DOM 选择器；品牌和密度通过 ThemeProvider、Token 或公开 className 调整。
- 在 320、390、768 和桌面宽度验证响应式；交互组件同时验证键盘、焦点和禁用状态。
- 完整类型以 @easecation/design 发布包的 TypeScript 声明为准，Storybook 是行为和视觉事实来源。

## 兼容性

从其他 UI 实现替换到该组件时，不要只修改组件名称。应同时核对 Props 模型、受控状态、Compound API、移动端布局、空/错/加载状态和可访问性语义。

## TypeScript 公开声明

以下内容由 `pnpm docs:generate` 从构建后的 `index.d.ts` 提取；CI 会检查声明与文档是否一致。

<!-- generated-api:start -->

```ts
export declare const DropdownMenu: FC<DropdownMenu_2.DropdownMenuProps>;

export declare function DropdownMenuCheckboxItem({
  className,
  children,
  inset,
  ...props
}: ComponentProps<typeof DropdownMenu_2.CheckboxItem> & {
  inset?: boolean;
}): JSX.Element;

export declare function DropdownMenuContent({
  className,
  align,
  sideOffset,
  ...props
}: ComponentProps<typeof DropdownMenu_2.Content>): JSX.Element;

export declare const Content: ForwardRefExoticComponent<
  HTMLAttributes<HTMLElement> & RefAttributes<HTMLElement>
>;

export declare const DropdownMenuGroup: ForwardRefExoticComponent<
  DropdownMenu_2.DropdownMenuGroupProps & RefAttributes<HTMLDivElement>
>;

export declare function DropdownMenuItem({
  className,
  inset,
  variant,
  ...props
}: DropdownMenuItemProps): JSX.Element;

export declare interface DropdownMenuItemProps extends ComponentProps<typeof DropdownMenu_2.Item> {
  inset?: boolean;
  variant?: 'default' | 'destructive';
}

export declare function DropdownMenuLabel({
  className,
  inset,
  ...props
}: ComponentProps<typeof DropdownMenu_2.Label> & {
  inset?: boolean;
}): JSX.Element;

export declare function Label({
  className,
  ...props
}: ComponentProps<typeof Label_2.Root>): JSX.Element;

export declare function DropdownMenuPortal(
  props: ComponentProps<typeof DropdownMenu_2.Portal>,
): JSX.Element;

export declare function Portal({
  children,
  container,
}: {
  children: ReactNode;
  container?: Element | null;
}): ReactPortal | null;

export declare const DropdownMenuRadioGroup: ForwardRefExoticComponent<
  DropdownMenu_2.DropdownMenuRadioGroupProps & RefAttributes<HTMLDivElement>
>;

export declare function DropdownMenuRadioItem({
  className,
  children,
  inset,
  ...props
}: ComponentProps<typeof DropdownMenu_2.RadioItem> & {
  inset?: boolean;
}): JSX.Element;

export declare function DropdownMenuSeparator({
  className,
  ...props
}: ComponentProps<typeof DropdownMenu_2.Separator>): JSX.Element;

export declare function Separator({
  className,
  orientation,
  decorative,
  ...props
}: ComponentProps<typeof Separator_2.Root>): JSX.Element;

export declare function DropdownMenuShortcut({
  className,
  ...props
}: ComponentProps<'span'>): JSX.Element;

export declare const DropdownMenuSub: FC<DropdownMenu_2.DropdownMenuSubProps>;

export declare function DropdownMenuSubContent({
  className,
  ...props
}: ComponentProps<typeof DropdownMenu_2.SubContent>): JSX.Element;

export declare function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: ComponentProps<typeof DropdownMenu_2.SubTrigger> & {
  inset?: boolean;
}): JSX.Element;

export declare const DropdownMenuTrigger: ForwardRefExoticComponent<
  DropdownMenu_2.DropdownMenuTriggerProps & RefAttributes<HTMLButtonElement>
>;
```

<!-- generated-api:end -->
