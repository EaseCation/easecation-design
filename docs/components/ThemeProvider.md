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
- `asChild` 要求一个可接收 `className`、`style` 和 `data-*` 属性的单一 React 元素。
- 在 320、390、768 和桌面宽度验证响应式；交互组件同时验证键盘、焦点和禁用状态。
- 完整类型以 @easecation/design 发布包的 TypeScript 声明为准，Storybook 是行为和视觉事实来源。

## 兼容性

从其他 UI 实现替换到该组件时，不要只修改组件名称。应同时核对 Props 模型、受控状态、Compound API、移动端布局、空/错/加载状态和可访问性语义。

## TypeScript 公开声明

以下内容直接来自发布包的 `index.d.ts`，用于核对完整 Props、联合类型、泛型和原生属性继承。

```ts
export declare function ThemeProvider({
  children,
  mode,
  density,
  tokens,
  colorTheme,
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

export declare const useTheme: () => ThemeContextValue;
```
