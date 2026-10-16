# Drawer

反馈或浮层组件。必须验证焦点、Escape、遮罩关闭和移动端行为。

## 导入

```tsx
import { Drawer } from '@easecation/design';
import '@easecation/design/style.css';
```

组件只从包根入口导入。不要依赖 src/、dist/ 或内部组件路径。

## 基础示例

```tsx
<Drawer open={open} onOpenChange={setOpen} placement="right">
  详情
</Drawer>
```

## API

open；onOpenChange；title；description；footer；placement；size；closeOnBackdrop；showCloseButton；closeLabel；ariaLabel；instant；className；style。

Drawer 会跟随 `visualViewport` 的高度和偏移，在虚拟键盘弹出或 WebView 可视区域变化时保持内容可滚动、底部操作可达。左右侧 Drawer 在小屏幕上自动限制宽度并应用顶部与底部 Safe Area。无 `title` 时使用 `ariaLabel` 提供对话框名称。

- **成熟度**：`beta`
- **支持平台**：web, pwa, android-webview, ios-wkwebview, windows-webview2, ssr
- **可访问性**：aria-modal, escape-close
- **主要 Token**：`--ec-color-overlay`, `--ec-safe-bottom`

## 关闭与焦点

`dismissible={false}` 或 `pending` 会阻止关闭按钮、Escape、遮罩和宿主返回键关闭。锁定的最上层仍消费返回操作，避免误关下面的弹层。`closeOnBackdrop={false}`（Modal / Drawer）只限制遮罩，保留其他关闭方式。

触屏打开时焦点移入容器，避免自动弹出键盘；桌面保留首个可交互元素的自动聚焦。关闭后恢复打开前焦点。更改 `onOpenChange` 回调不会改变弹层顺序。默认关闭文案来自 `LocaleProvider`，`closeLabel` 可覆盖。

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
export declare function Drawer({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  placement,
  size,
  closeOnBackdrop,
  dismissible,
  pending,
  showCloseButton,
  closeLabel: closeLabelProp,
  ariaLabel,
  instant,
  className,
  style,
}: DrawerProps): JSX.Element;

export declare interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  placement?: 'left' | 'right' | 'top' | 'bottom';
  size?: string;
  closeOnBackdrop?: boolean;
  /** Blocks every user dismissal, including host Back. */
  dismissible?: boolean;
  pending?: boolean;
  showCloseButton?: boolean;
  closeLabel?: string;
  ariaLabel?: string;
  instant?: boolean;
  className?: string;
  style?: CSSProperties;
}
```

<!-- generated-api:end -->
