# ResponsiveDialog

反馈或浮层组件。必须验证焦点、Escape、遮罩关闭和移动端行为。

## 导入

```tsx
import { ResponsiveDialog } from '@easecation/design';
import '@easecation/design/style.css';
```

组件只从包根入口导入。不要依赖 src/、dist/ 或内部组件路径。

## 基础示例

```tsx
<ResponsiveDialog open={open} onOpenChange={setOpen} title="筛选">
  内容
</ResponsiveDialog>
```

## API

桌面宽度使用 `desktopSize: sm | md | lg | xl | full`，移动端默认居中弹出，需要抽屉时通过 `mobileSide` 指定方向。嵌套弹层使用 `layer="nested"`，不要在业务代码中手写 z-index；关闭按钮通过 `showCloseButton` 控制。

open；onOpenChange；title；description；footer；desktopContentClassName；mobileContentClassName；bodyClassName。

- **成熟度**：`beta`
- **支持平台**：web, pwa, android-webview, ios-wkwebview, windows-webview2, ssr
- **可访问性**：dialog-title-description, responsive-centered-dialog
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
export declare function ResponsiveDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  desktopSize,
  mobileSide,
  layer,
  desktopContentClassName,
  mobileContentClassName,
  bodyClassName,
  showCloseButton,
  closeLabel,
  instant,
  forceMount,
}: ResponsiveDialogProps): JSX.Element;

export declare interface ResponsiveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  desktopSize?: ResponsiveOverlayDesktopSize;
  mobileSide?: 'top' | 'right' | 'bottom' | 'left' | 'center';
  layer?: 'default' | 'nested';
  desktopContentClassName?: string;
  mobileContentClassName?: string;
  bodyClassName?: string;
  showCloseButton?: boolean;
  closeLabel?: string;
  instant?: boolean;
  forceMount?: true;
}

export declare type ResponsiveOverlayDesktopSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';
```

<!-- generated-api:end -->
