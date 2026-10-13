# Avatar

数据展示组件。请求状态应通过 Props 显式传入。

## 导入

```tsx
import { Avatar } from '@easecation/design';
import '@easecation/design/style.css';
```

组件只从包根入口导入。不要依赖 src/、dist/ 或内部组件路径。

## 基础示例

```tsx
<Avatar>
  <AvatarImage src={url} />
  <AvatarFallback>EC</AvatarFallback>
</Avatar>
```

## API

Avatar size；AvatarImage；AvatarFallback；AvatarBadge；AvatarGroup；AvatarGroupCount。

- **成熟度**：`beta`
- **支持平台**：web, pwa, android-webview, ios-wkwebview, windows-webview2, ssr
- **可访问性**：image-alt, fallback-content
- **主要 Token**：`--ec-color-muted`, `--ec-color-text-muted`, `--ec-color-border`

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
export declare const Avatar: ForwardRefExoticComponent<
  AvatarProps & RefAttributes<HTMLSpanElement>
>;

export declare interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  size?: AvatarSize;
}

declare type AvatarSize = 'sm' | 'md' | 'lg';

export declare const AvatarBadge: ForwardRefExoticComponent<
  HTMLAttributes<HTMLSpanElement> & RefAttributes<HTMLSpanElement>
>;

export declare const AvatarFallback: ForwardRefExoticComponent<
  HTMLAttributes<HTMLSpanElement> & RefAttributes<HTMLSpanElement>
>;

export declare const AvatarGroup: ForwardRefExoticComponent<
  HTMLAttributes<HTMLDivElement> & RefAttributes<HTMLDivElement>
>;

export declare const AvatarGroupCount: ForwardRefExoticComponent<
  HTMLAttributes<HTMLDivElement> & RefAttributes<HTMLDivElement>
>;

export declare const AvatarImage: ForwardRefExoticComponent<
  ImgHTMLAttributes<HTMLImageElement> & RefAttributes<HTMLImageElement>
>;
```

<!-- generated-api:end -->
