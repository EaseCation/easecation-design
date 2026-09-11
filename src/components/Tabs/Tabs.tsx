import { Tabs as Primitive } from 'radix-ui';
import { forwardRef, type ComponentProps, type ReactNode } from 'react';
import { useControllableState } from '../../hooks/useControllableState';

export const TabsRoot = forwardRef<HTMLDivElement, ComponentProps<typeof Primitive.Root>>(
  function TabsRoot({ className, ...props }, ref) {
    return (
      <Primitive.Root
        ref={ref}
        className={['ec-tabs', className].filter(Boolean).join(' ')}
        {...props}
      />
    );
  },
);

export interface TabsListProps extends ComponentProps<typeof Primitive.List> {
  variant?: 'default' | 'line';
}
export const TabsList = forwardRef<HTMLDivElement, TabsListProps>(function TabsList(
  { className, variant = 'default', ...props },
  ref,
) {
  return (
    <Primitive.List
      ref={ref}
      data-variant={variant}
      className={['ec-tab-list', className].filter(Boolean).join(' ')}
      {...props}
    />
  );
});

export const TabsTrigger = forwardRef<HTMLButtonElement, ComponentProps<typeof Primitive.Trigger>>(
  function TabsTrigger({ className, ...props }, ref) {
    return (
      <Primitive.Trigger
        ref={ref}
        className={['ec-tab', 'ec-focusable', className].filter(Boolean).join(' ')}
        {...props}
      />
    );
  },
);

export const TabsContent = forwardRef<HTMLDivElement, ComponentProps<typeof Primitive.Content>>(
  function TabsContent({ className, ...props }, ref) {
    return (
      <Primitive.Content
        ref={ref}
        className={['ec-tab-panel', className].filter(Boolean).join(' ')}
        {...props}
      />
    );
  },
);

export interface TabItem {
  value: string;
  label: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}
export interface TabsProps {
  items: TabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}
export function Tabs({ items, value, defaultValue, onValueChange, className }: TabsProps) {
  const first = items.find((item) => !item.disabled)?.value ?? '';
  const [active, setActive] = useControllableState({
    value,
    defaultValue: defaultValue ?? first,
    onChange: onValueChange,
  });
  return (
    <TabsRoot value={active} onValueChange={setActive} className={className}>
      <TabsList>
        {items.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value} disabled={tab.disabled}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {items.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          {tab.content}
        </TabsContent>
      ))}
    </TabsRoot>
  );
}
