# Combobox

可搜索的单选输入，适合选项较多、用户需要按名称或关键字定位的场景。

## 导入

```tsx
import { Combobox } from '@easecation/design';
```

## API

`options`；`value/defaultValue`；`onValueChange`；`placeholder`；`searchPlaceholder`；`emptyText`；`allowCustomValue`；`clearable`；`label`；`size`；`status`；`disabled`；`required`；`name`。

- `textValue` 提供 ReactNode 标签对应的搜索文本。
- `keywords` 提供不展示但可搜索的同义词。
- `allowCustomValue` 让输入内容持续写入 value，适合既可选择预设、又必须保留任意标识符的字段。普通单选不要开启。
- 组件提供 combobox/listbox 语义、方向键与 Home/End 导航、Enter 选择、Escape 关闭，并自动滚动到键盘高亮项。

## TypeScript 公开声明

以下内容由 `pnpm docs:generate` 从构建后的 `index.d.ts` 提取；CI 会检查声明与文档是否一致。

<!-- generated-api:start -->

```ts
export declare const Combobox: ForwardRefExoticComponent<
  ComboboxProps & RefAttributes<HTMLInputElement>
>;

export declare interface ComboboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'value' | 'defaultValue' | 'onChange' | 'children'
> {
  options: ComboboxOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: ReactNode;
  allowCustomValue?: boolean;
  clearable?: boolean;
  clearLabel?: string;
  label?: string;
  size?: ComponentSize;
  status?: InputStatus;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  className?: string;
}

export declare interface ComboboxOption {
  value: string;
  label: ReactNode;
  textValue?: string;
  description?: ReactNode;
  keywords?: string[];
  disabled?: boolean;
}

export declare type ComponentSize = 'sm' | 'md' | 'lg';

export declare type InputStatus = 'default' | 'error' | 'warning' | 'success';
```

<!-- generated-api:end -->
