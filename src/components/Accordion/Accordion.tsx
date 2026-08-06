import type { ReactNode } from 'react';
import { ChevronDownIcon } from 'lucide-react';
import { Accordion as AccordionPrimitive } from 'radix-ui';

export interface AccordionItem {
  value: string;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}

interface AccordionCommonProps {
  items: AccordionItem[];
  className?: string;
  ariaLabel?: string;
}

export type AccordionProps = AccordionCommonProps &
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

function AccordionItems({ items }: { items: AccordionItem[] }) {
  return items.map((item) => (
    <AccordionPrimitive.Item
      key={item.value}
      value={item.value}
      disabled={item.disabled}
      className="ec-accordion__item"
    >
      <AccordionPrimitive.Header className="ec-accordion__header">
        <AccordionPrimitive.Trigger className="ec-accordion__trigger">
          <span className="ec-accordion__heading">
            <span className="ec-accordion__title">{item.title}</span>
            {item.description ? (
              <span className="ec-accordion__description">{item.description}</span>
            ) : null}
          </span>
          <ChevronDownIcon className="ec-accordion__chevron" aria-hidden="true" />
        </AccordionPrimitive.Trigger>
        {item.action ? <span className="ec-accordion__action">{item.action}</span> : null}
      </AccordionPrimitive.Header>
      <AccordionPrimitive.Content className="ec-accordion__content">
        <div className="ec-accordion__content-inner">{item.content}</div>
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  ));
}

export function Accordion(props: AccordionProps) {
  const { items, className, ariaLabel } = props;
  if (props.type === 'multiple') {
    return (
      <AccordionPrimitive.Root
        type="multiple"
        value={props.value}
        defaultValue={props.defaultValue}
        onValueChange={props.onValueChange}
        aria-label={ariaLabel}
        className={['ec-accordion', className].filter(Boolean).join(' ')}
      >
        <AccordionItems items={items} />
      </AccordionPrimitive.Root>
    );
  }
  return (
    <AccordionPrimitive.Root
      type="single"
      value={props.value}
      defaultValue={props.defaultValue}
      onValueChange={props.onValueChange}
      collapsible={props.collapsible ?? true}
      aria-label={ariaLabel}
      className={['ec-accordion', className].filter(Boolean).join(' ')}
    >
      <AccordionItems items={items} />
    </AccordionPrimitive.Root>
  );
}
