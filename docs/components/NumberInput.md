# NumberInput

Decimal input with the same size, status, prefix/suffix and focus treatment as Input.
Use `onValueChange` with React Hook Form Controller; an empty value is `null`.
The ref targets the input, so error focus and Field labels work normally.

Typing preserves incomplete decimals. Blur or Enter applies `precision` and min/max bounds;
ArrowUp/ArrowDown steps using decimal arithmetic. Mobile users type directly with the decimal
keyboard. There are no hover-only step buttons. `readOnly` and `disabled` prevent changes.
Use `stringMode` with string values, bounds and decimal steps when JavaScript number precision
is insufficient. Business validation and payload conversion remain the consumer's responsibility.

The unstyled `@rc-component/input-number` engine owns decimal parsing, draft preservation,
composition and stepping. EaseDesign owns the public API, tokens, input semantics and presentation.
Existing Input type=number remains appropriate for simple native numeric fields.

Dependency review: version 1.6.2 is MIT-licensed, has no business-service or network integration,
and depends on the MIT-licensed mini-decimal/util packages and clsx. SSR and input behavior are
covered by the NumberInput tests; dependency advisories are checked by the release audit.

Consumers motivating this capability: editable rates, decimal quantities, and integer item counts.
Acceptance covers decimal stepping, empty/reset, bounds, precision, high precision strings,
Field error association, input refs, SSR, disabled/readOnly, light/dark and narrow layouts.

## TypeScript 公开声明

以下内容由 `pnpm docs:generate` 从构建后的 `index.d.ts` 提取；CI 会检查声明与文档是否一致。

<!-- generated-api:start -->

```ts
export declare const NumberInput: ForwardRefExoticComponent<
  NumberInputProps & RefAttributes<HTMLInputElement>
>;

export declare type NumberInputProps = NumberInputBaseProps &
  (
    | {
        stringMode?: false;
        value?: number | null;
        defaultValue?: number;
        min?: number;
        max?: number;
        onValueChange?: (value: number | null) => void;
      }
    | {
        /** Preserve values beyond JavaScript number precision as decimal strings. */
        stringMode: true;
        value?: string | null;
        defaultValue?: string;
        min?: string;
        max?: string;
        onValueChange?: (value: string | null) => void;
      }
  );

declare interface NumberInputBaseProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  | 'size'
  | 'prefix'
  | 'value'
  | 'defaultValue'
  | 'onChange'
  | 'min'
  | 'max'
  | 'step'
  | 'type'
  | 'onInput'
  | 'onMouseDown'
  | 'onMouseUp'
  | 'onMouseMove'
  | 'onMouseEnter'
  | 'onMouseLeave'
  | 'onMouseOut'
  | 'onMouseOver'
  | 'onClick'
> {
  size?: ComponentSize;
  status?: InputStatus;
  prefix?: ReactNode;
  suffix?: ReactNode;
  /** Decimal places applied on blur or Enter, without interrupting typing. */
  precision?: number;
  step?: number | string;
}

export declare type ComponentSize = 'sm' | 'md' | 'lg';

export declare type InputStatus = 'default' | 'error' | 'warning' | 'success';
```

<!-- generated-api:end -->
