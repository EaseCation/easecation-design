# Accordion

支持单项或多项展开的内容分组，并为每个标题提供独立的 `action` 区域。

## 导入

```tsx
import { Accordion } from '@easecation/design';
```

## API

`items`；`type`；`value/defaultValue`；`onValueChange`；`collapsible`；`ariaLabel`；`className`。

每个 item 包含 `value`、`title`、可选 `description`、可选 `action`、`content` 和 `disabled`。`action` 与展开按钮是兄弟节点，点击操作不会切换展开状态。

## TypeScript 公开声明

以下内容由 `pnpm docs:generate` 从构建后的 `index.d.ts` 提取；CI 会检查声明与文档是否一致。

<!-- generated-api:start -->

```ts
export declare function Accordion(props: AccordionProps): JSX.Element;

export declare type AccordionProps = AccordionCommonProps &
  (
    | {
        type?: 'single';
        value?: string;
        defaultValue?: string;
        onValueChange?: (value: string) => void;
        collapsible?: boolean;
      }
    | {
        type: 'multiple';
        value?: string[];
        defaultValue?: string[];
        onValueChange?: (value: string[]) => void;
      }
  );

declare interface AccordionCommonProps {
  items: AccordionItem[];
  className?: string;
  ariaLabel?: string;
}

export declare interface AccordionItem {
  value: string;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}
```

<!-- generated-api:end -->
