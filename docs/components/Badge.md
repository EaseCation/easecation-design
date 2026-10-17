# Badge

数据展示组件。请求状态应通过 Props 显式传入。

## 导入

```tsx
import { Badge, BadgeButton } from '@easecation/design';
import '@easecation/design/style.css';
```

组件只从包根入口导入。不要依赖 src/、dist/ 或内部组件路径。

## 基础示例

```tsx
<Badge variant="secondary">运行中</Badge>
<BadgeButton variant="outline" onClick={openDetails}>查看状态</BadgeButton>
```

## API

`Badge`：variant；color；children；其余属性继承 span。

`BadgeButton`：variant；color；children；其余属性继承 button。仅在 Badge 本身触发操作或浮层时使用。

- **成熟度**：`beta`
- **支持平台**：web, pwa, android-webview, ios-wkwebview, windows-webview2, ssr
- **可访问性**：text-status, non-color-label
- **主要 Token**：`--ec-color-primary`, `--ec-color-secondary`, `--ec-color-danger`

## 分类颜色

`color` 提供 blue、cyan、teal、green、lime、amber、orange、red、rose、pink、purple、indigo 十二种固定分类色，以柔和底色呈现，并自动适配主题文字颜色。设置后优先于 `variant` 的外观。`BadgeButton` 使用同一色板。

```tsx
<Badge color="blue">Design</Badge>
<Badge color="purple">Engineering</Badge>
```

分类与颜色的固定映射由应用维护，不能根据列表顺序或当前主题重新分配。标签必须保留文字，不能只靠颜色区分；成功、错误等状态继续使用 `StatusBadge`。

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
export declare const Badge: ForwardRefExoticComponent<BadgeProps & RefAttributes<HTMLSpanElement>>;

export declare interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  /** Stable categorical color; takes precedence over variant appearance. */
  color?: BadgeColor;
}

export declare type BadgeVariant = 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';

export declare type BadgeColor =
  | 'blue'
  | 'cyan'
  | 'teal'
  | 'green'
  | 'lime'
  | 'amber'
  | 'orange'
  | 'red'
  | 'rose'
  | 'pink'
  | 'purple'
  | 'indigo';

export declare const BadgeButton: ForwardRefExoticComponent<
  BadgeButtonProps & RefAttributes<HTMLButtonElement>
>;

export declare interface BadgeButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BadgeVariant;
  /** Stable categorical color; takes precedence over variant appearance. */
  color?: BadgeColor;
}
```

<!-- generated-api:end -->
