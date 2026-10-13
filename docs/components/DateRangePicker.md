# DateRangePicker

统一的日期范围选择组件。通过 `date` 和 `datetime` 两种模式覆盖按天筛选与精确到分钟的时间范围筛选。

## 导入

```tsx
import { DateRangePicker } from '@easecation/design';
import '@easecation/design/style.css';
```

## 基础示例

```tsx
<DateRangePicker
  mode="datetime"
  value={range}
  onChange={setRange}
  presets={[{ label: '最近 7 天', value: lastSevenDays }]}
/>
```

查询条件允许仅设置开始或结束时间时，启用开放区间：

```tsx
<DateRangePicker
  mode="datetime"
  value={{ start, end }}
  onChange={({ start, end }) => setRange({ start, end })}
  allowOpenRange
/>
```

## API

value；onChange；mode: date | datetime；presets；placeholder；startLabel；endLabel；startTimeLabel；endTimeLabel；applyLabel；cancelLabel；invalidRangeMessage；size；disabled；className；aria-label。

- **成熟度**：`beta`
- **支持平台**：web, pwa, android-webview, ios-wkwebview, windows-webview2, ssr
- **可访问性**：label-association, keyboard-popover, responsive-reflow
- **主要 Token**：`--ec-color-border-strong`, `--ec-color-popover`, `--ec-color-danger`

## 行为约定

- `date` 模式使用本地 `YYYY-MM-DD` 字符串；`datetime` 模式使用本地 `YYYY-MM-DDTHH:mm` 字符串，不隐式转换时区。
- 自定义范围先保存在组件草稿中，点击确定后统一提交；预设范围会立即提交。
- 起止值必须完整且结束不早于开始。业务层仍负责接口约束和服务端错误。
- 组件会在窄屏切换为单列，并限制浮层不超过视口宽度。

## TypeScript 公开声明

以下内容由 `pnpm docs:generate` 从构建后的 `index.d.ts` 提取；CI 会检查声明与文档是否一致。

<!-- generated-api:start -->

```ts
export declare function DateRangePicker({
  value,
  onChange,
  mode,
  presets,
  placeholder,
  startLabel,
  endLabel,
  startTimeLabel,
  endTimeLabel,
  presetsLabel,
  applyLabel,
  cancelLabel,
  invalidRangeMessage,
  allowOpenRange,
  size,
  className,
  disabled,
  'aria-label': ariaLabel,
}: DateRangePickerProps): JSX.Element;

export declare interface DateRangePickerProps {
  value: DateRangePickerValue;
  onChange: (value: DateRangePickerValue) => void;
  mode?: DateRangePickerMode;
  presets?: readonly DateRangePickerPreset[];
  placeholder?: string;
  startLabel?: string;
  endLabel?: string;
  startTimeLabel?: string;
  endTimeLabel?: string;
  presetsLabel?: string;
  applyLabel?: string;
  cancelLabel?: string;
  invalidRangeMessage?: string;
  /** Allow applying a range with only a start or an end value. */
  allowOpenRange?: boolean;
  size?: ComponentSize;
  className?: string;
  disabled?: boolean;
  'aria-label'?: string;
}

export declare interface DateRangePickerValue {
  start: string;
  end: string;
}

export declare type DateRangePickerMode = 'date' | 'datetime';

export declare interface DateRangePickerPreset {
  label: ReactNode;
  value: DateRangePickerValue | (() => DateRangePickerValue);
}

export declare type ComponentSize = 'sm' | 'md' | 'lg';
```

<!-- generated-api:end -->
