import { forwardRef, type ComponentPropsWithoutRef, type Key, type ReactNode } from 'react';

export interface DescriptionListItem {
  key?: Key;
  term: ReactNode;
  description: ReactNode;
  span?: 1 | 2 | 3;
}

export interface DescriptionListProps extends ComponentPropsWithoutRef<'dl'> {
  items: DescriptionListItem[];
  columns?: 1 | 2 | 3;
  layout?: 'horizontal' | 'vertical';
  appearance?: 'plain' | 'bordered';
  size?: 'sm' | 'md';
}

export const DescriptionList = forwardRef<HTMLDListElement, DescriptionListProps>(
  function DescriptionList(
    {
      items,
      columns = 1,
      layout = 'horizontal',
      appearance = 'plain',
      size = 'md',
      className,
      ...props
    },
    ref,
  ) {
    return (
      <dl
        ref={ref}
        className={['ec-descriptions', className].filter(Boolean).join(' ')}
        data-columns={columns}
        data-layout={layout}
        data-appearance={appearance}
        data-size={size}
        {...props}
      >
        {items.map((item, index) => (
          <div
            className="ec-descriptions-item"
            data-span={Math.min(item.span ?? 1, columns)}
            key={item.key ?? index}
          >
            <dt>{item.term}</dt>
            <dd>{item.description}</dd>
          </div>
        ))}
      </dl>
    );
  },
);
