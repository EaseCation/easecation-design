# Progress

Displays a percentage with an accessible name. `value` is clamped to 0–100;
`null` represents an unknown total and omits aria-valuenow. Non-finite numbers become zero.
`showValue` controls visible text; `formatValue` customizes it without removing the accessible name.
Use semantic `tone` values for outcomes and `size="sm"` in compact data rows.
The fill is static, including unknown totals, so it does not imply activity or introduce motion.

Concrete consumers include upload completion, remaining capacity, and spending proportions.
The library owns visual tokens and progress semantics. Consumers own the calculation, status,
network requests and cancellation. Existing application counters remain unchanged.
Acceptance covers bounded/non-finite values, unknown totals, screen-reader names, SSR,
light/dark, narrow data rows and upload feedback. Progress is a passive indicator and has no focus target.

## TypeScript 公开声明

以下内容由 `pnpm docs:generate` 从构建后的 `index.d.ts` 提取；CI 会检查声明与文档是否一致。

<!-- generated-api:start -->

```ts
export declare const Progress: ForwardRefExoticComponent<
  ProgressProps & RefAttributes<HTMLDivElement>
>;

export declare interface ProgressProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Accessible name describing the operation or quantity. */
  label: string;
  /** Percentage, clamped to 0–100. Null means the total is unknown. */
  value: number | null;
  size?: 'sm' | 'md';
  tone?: 'primary' | 'success' | 'warning' | 'danger';
  showValue?: boolean;
  formatValue?: (value: number) => ReactNode;
}
```

<!-- generated-api:end -->
