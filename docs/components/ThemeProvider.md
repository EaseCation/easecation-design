# ThemeProvider

基础组件或主题能力，用于统一视觉、尺寸和交互默认值。

## 导入

```tsx
import { ThemeProvider } from '@easecation/design';
import '@easecation/design/style.css';
```

组件只从包根入口导入。不要依赖 src/、dist/ 或内部组件路径。

## 基础示例

```tsx
<ThemeProvider mode="system">
  <App />
</ThemeProvider>
```

SSR 时 `system` 使用浅色服务端快照，并在 hydration 后同步 `prefers-color-scheme`，避免服务端与客户端标记不一致。服务端已知用户偏好时可显式传入 `light` 或 `dark`，使首屏颜色也保持确定。

## 品牌配色

将应用的浅色、深色配色集中到一份配置，通过根部 Provider 的 `tokens` 传入。
组件样式必须读取公开的 `--ec-*` Token，不要直接读取底层 `--primary`、
`--sidebar-primary` 等调色板变量，否则会绕过 Provider 的覆盖值。

侧边栏允许独立配色。如果它与品牌色一致，可将 `--ec-sidebar-primary` 设为
`var(--ec-color-primary)`，并对应关联前景、accent、边框和焦点 Token。
品牌色变化不应替换错误、成功、警告或分类颜色。验证主题时应同时检查正文、
导航选中态和 Portal 中的菜单、弹窗；亮色填充不能直接当作浅色页面的小字颜色。

金色等明亮品牌色可用 `--ec-color-primary` 设置填充，并用
`--ec-color-text-primary` 设置链接、轻量按钮和品牌图标的可读前景色。
后者默认跟随主色，现有主题无需修改。

## API

children；mode: light | dark | system；density；tokens；colorTheme；asChild；useTheme()。

- **成熟度**：`beta`
- **支持平台**：web, pwa, android-webview, ios-wkwebview, windows-webview2, ssr
- **可访问性**：reduced-motion, system-color-scheme
- **主要 Token**：`--ec-color-primary`, `--ec-density-scale`

## 使用约束

- 业务状态、请求、权限和路由由应用层维护，通过 Props 和回调传入。
- 同一个值不要同时使用受控属性与 default* 属性。
- 不覆盖组件内部 DOM 选择器；品牌和密度通过 ThemeProvider、Token 或公开 className 调整。
- `asChild` 要求一个能转发 DOM ref、`className`、`style` 和 `data-*` 属性的单一 React 元素。
- Provider 只建立主题作用域；页面高度、背景和滚动由应用布局负责。
- 浮层继承当前作用域的模式、配色、密度、字体与 Token。嵌套 Provider 继承未指定的配置，可显式切换为浅色。
- 在 320、390、768 和桌面宽度验证响应式；交互组件同时验证键盘、焦点和禁用状态。
- 完整类型以 @easecation/design 发布包的 TypeScript 声明为准，Storybook 是行为和视觉事实来源。

## 兼容性

从其他 UI 实现替换到该组件时，不要只修改组件名称。应同时核对 Props 模型、受控状态、Compound API、移动端布局、空/错/加载状态和可访问性语义。

## TypeScript 公开声明

以下内容由 `pnpm docs:generate` 从构建后的 `index.d.ts` 提取；CI 会检查声明与文档是否一致。

<!-- generated-api:start -->

```ts
export declare function ThemeProvider({
  children,
  mode: requestedMode,
  density: requestedDensity,
  tokens,
  colorTheme: requestedColorTheme,
  className,
  style,
  asChild,
  ...props
}: ThemeProviderProps): JSX.Element;

export declare interface ThemeProviderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'color'> {
  children: ReactNode;
  mode?: ThemeMode;
  density?: Density;
  tokens?: ThemeOverrides;
  colorTheme?: 'default' | 'black-gold';
  asChild?: boolean;
}

export declare type ThemeMode = 'light' | 'dark' | 'system';

export declare type Density = 'compact' | 'comfortable';

export declare type ThemeOverrides = Partial<Record<`--ec-${string}`, string | number>>;

export declare const useTheme: () => ThemeContextValue;

export declare interface ThemeContextValue {
  mode: ThemeMode;
  resolvedMode: 'light' | 'dark';
  density: Density;
  colorTheme: 'default' | 'black-gold';
  tokens: ThemeOverrides;
  portalContainer: HTMLDivElement | null;
}
```

<!-- generated-api:end -->
