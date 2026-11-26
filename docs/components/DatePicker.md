# DatePicker

数据录入组件。业务层负责值、校验、提交和服务端错误。

## 导入

```tsx
import { DatePicker } from '@easecation/design';
import '@easecation/design/style.css';
```

组件只从包根入口导入。不要依赖 src/、dist/ 或内部组件路径。

## 基础示例

```tsx
<DatePicker label="Date / 日期" value={value} onChange={setValue} />
```

## API

value；onChange；label；placeholder；clearLabel；todayLabel；size；disabled；readOnly；required；min；max；step；open；defaultOpen；onOpenChange；className；aria-label。弹出层使用自定义 `Calendar` 月份面板，不使用浏览器原生日期控件。

- **成熟度**：`beta`
- **支持平台**：web, pwa, android-webview, ios-wkwebview, windows-webview2, ssr
- **可访问性**：label-association, keyboard-popover, keyboard-grid
- **主要 Token**：`--ec-color-border-strong`, `--ec-color-popover`, `--ec-color-primary`

## 使用约束

- 业务状态、请求、权限和路由由应用层维护，通过 Props 和回调传入。
- 同一个值不要同时使用受控属性与 default* 属性。
- 不覆盖组件内部 DOM 选择器；品牌和密度通过 ThemeProvider、Token 或公开 className 调整。
- 在 320、390、768 和桌面宽度验证响应式；交互组件同时验证键盘、焦点和禁用状态。
- 完整类型以 @easecation/design 发布包的 TypeScript 声明为准，Storybook 是行为和视觉事实来源。
- 传入 `label={null}` 可隐藏可见标签，此时请提供 `aria-label`。

## 兼容性

从其他 UI 实现替换到该组件时，不要只修改组件名称。应同时核对 Props 模型、受控状态、Compound API、移动端布局、空/错/加载状态和可访问性语义。

选择日期后弹出层关闭。页脚提供清除与今天快捷操作。日期时间请使用 `DateTimePicker`，日期范围请使用 `DateRangePicker`。

## TypeScript 公开声明

以下内容由 `pnpm docs:generate` 从构建后的 `index.d.ts` 提取；CI 会检查声明与文档是否一致。

<!-- generated-api:start -->

```ts
export declare function DatePicker({
  value,
  onChange,
  placeholder,
  label,
  clearLabel,
  todayLabel,
  size,
  className,
  disabled,
  readOnly,
  required,
  min,
  max,
  step,
  open,
  defaultOpen,
  onOpenChange,
  'aria-label': ariaLabel,
}: DatePickerProps): JSX.Element;

export declare interface DatePickerProps {
  value?: Date;
  onChange?: (value: Date | undefined) => void;
  placeholder?: string;
  label?: ReactNode;
  clearLabel?: string;
  todayLabel?: string;
  size?: ComponentSize;
  className?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  min?: Date | string;
  max?: Date | string;
  step?: number;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  'aria-label'?: string;
}

export declare type ComponentSize = 'sm' | 'md' | 'lg';
```

<!-- generated-api:end -->
