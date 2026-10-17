# MultiSelect

可搜索的多选标签输入；`creatable` 模式允许录入选项目录外的值。

## 导入

```tsx
import { MultiSelect } from '@easecation/design';
```

## API

`options`；`filterOption(query, option)`；`value/defaultValue`；`onValueChange`；`creatable`；`createLabel`；`tokenSeparators`；`placeholder`；`searchPlaceholder`；`emptyText`；`label`；`removeLabel`；`size`；`status`；`disabled`；`required`；`name`。

- 值按选择顺序输出，不会因为搜索或重新渲染而排序。
- Backspace 删除最后一个标签，逗号等 `tokenSeparators` 可批量提交自定义值。
- 禁用选项不可通过鼠标或键盘加入。
- 下拉列表支持方向键与 Home/End 导航，并自动滚动到键盘高亮项。

自定义匹配通过 `filterOption` 表达，例如只匹配完整标识符；未传入时仍按值、文字和 keywords 做子串搜索。回调只决定可见候选项，不改变已选值或 creatable 创建规则。标识符是否合法仍由业务表单校验。

## TypeScript 公开声明

以下内容由 `pnpm docs:generate` 从构建后的 `index.d.ts` 提取；CI 会检查声明与文档是否一致。

<!-- generated-api:start -->

```ts
export declare const MultiSelect: ForwardRefExoticComponent<
  MultiSelectProps & RefAttributes<HTMLInputElement>
>;

export declare interface MultiSelectProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'value' | 'defaultValue' | 'onChange' | 'children'
> {
  options: MultiSelectOption[];
  /** Override matching without changing selected values or custom-value creation. */
  filterOption?: (query: string, option: MultiSelectOption) => boolean;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: ReactNode;
  creatable?: boolean;
  createLabel?: (value: string) => ReactNode;
  tokenSeparators?: string[];
  label?: string;
  removeLabel?: (value: string) => string;
  size?: ComponentSize;
  status?: InputStatus;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  className?: string;
}

export declare interface MultiSelectOption {
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
