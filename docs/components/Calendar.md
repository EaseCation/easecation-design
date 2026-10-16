# Calendar

数据录入组件。业务层负责值、校验、提交和服务端错误。

## 导入

```tsx
import { Calendar } from '@easecation/design';
import '@easecation/design/style.css';
```

组件只从包根入口导入。不要依赖 src/、dist/ 或内部组件路径。

## 基础示例

```tsx
<Calendar mode="single" selected={date} onSelect={setDate} />
```

## API

mode: single | range；selected；onSelect；showLabel；labels；className。当前使用原生日期输入，不提供月份面板或多月展示属性。

- **成熟度**：`beta`
- **支持平台**：web, pwa, android-webview, ios-wkwebview, windows-webview2, ssr
- **可访问性**：native-date-input, label-association
- **主要 Token**：`--ec-color-border-strong`, `--ec-color-bg`

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
export declare const Calendar: ForwardRefExoticComponent<
  Omit<CalendarProps, 'ref'> & RefAttributes<HTMLDivElement>
>;

export declare interface CalendarProps extends Omit<ComponentProps<'div'>, 'onSelect'> {
  mode?: 'single' | 'range';
  selected?: Date | DateRange;
  onSelect?: (value: CalendarSelectValue) => void;
  showLabel?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  /** Inclusive local-calendar date bounds. Strings use YYYY-MM-DD. */
  min?: Date | string;
  max?: Date | string;
  /** Native date-input step in days. */
  step?: number;
  labels?: {
    single?: string;
    rangeStart?: string;
    rangeEnd?: string;
  };
}

export declare type DateRange = {
  from?: Date;
  to?: Date;
};

export declare type CalendarSelectValue = Date | DateRange | undefined;
```

<!-- generated-api:end -->
