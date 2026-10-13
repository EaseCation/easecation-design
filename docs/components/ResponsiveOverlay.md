# ResponsiveOverlay

反馈或浮层组件。必须验证焦点、Escape、遮罩关闭和移动端行为。

## 导入

```tsx
import { ResponsiveOverlay } from '@easecation/design';
import '@easecation/design/style.css';
```

组件只从包根入口导入。不要依赖 src/、dist/ 或内部组件路径。

## 基础示例

```tsx
<ResponsiveOverlay />
```

## API

Compound API。Content 支持 `mobileSide`、`desktopSize`、`showCloseButton`、`instant` 和
`layer: default | nested`。嵌套弹层必须使用 `layer="nested"`，不要在业务侧手写 z-index。
Body 支持 `padding: default | none`。

- **成熟度**：`beta`
- **支持平台**：web, pwa, android-webview, ios-wkwebview, windows-webview2, ssr
- **可访问性**：dialog-focus-trap, escape-close, responsive-centered-dialog
- **主要 Token**：`--ec-color-popover`, `--ec-shadow-xl`

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
export declare function ResponsiveOverlay({
  open,
  onOpenChange,
  children,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}): JSX.Element;

export declare function ResponsiveOverlayBody({
  className,
  padding,
  ...props
}: ResponsiveOverlayBodyProps): JSX.Element;

export declare interface ResponsiveOverlayBodyProps extends ComponentProps<'div'> {
  padding?: 'default' | 'none';
}

export declare function ResponsiveOverlayContent({
  children,
  className,
  mobileClassName,
  mobileSide,
  desktopSize,
  layer,
  showCloseButton,
  closeLabel,
  instant,
  forceMount,
  style,
  ...props
}: ResponsiveOverlayContentProps): JSX.Element;

export declare interface ResponsiveOverlayContentProps extends ComponentProps<
  typeof Dialog.Content
> {
  mobileClassName?: string;
  mobileSide?: 'top' | 'right' | 'bottom' | 'left' | 'center';
  desktopSize?: ResponsiveOverlayDesktopSize;
  layer?: 'default' | 'nested';
  showCloseButton?: boolean;
  closeLabel?: string;
  instant?: boolean;
  forceMount?: true;
}

export declare const Content: ForwardRefExoticComponent<
  HTMLAttributes<HTMLElement> & RefAttributes<HTMLElement>
>;

export declare type ResponsiveOverlayDesktopSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export declare function ResponsiveOverlayDescription({
  className,
  ...props
}: ComponentProps<typeof Dialog.Description>): JSX.Element;

export declare function ResponsiveOverlayFooter({
  className,
  ...props
}: ComponentProps<'div'>): JSX.Element;

export declare function ResponsiveOverlayHeader({
  className,
  ...props
}: ComponentProps<'div'>): JSX.Element;

export declare function ResponsiveOverlayTitle({
  className,
  ...props
}: ComponentProps<typeof Dialog.Title>): JSX.Element;

export declare const ResponsiveOverlayTrigger: ForwardRefExoticComponent<
  Dialog.DialogTriggerProps & RefAttributes<HTMLButtonElement>
>;
```

<!-- generated-api:end -->
