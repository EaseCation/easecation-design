import { EllipsisIcon } from 'lucide-react';
import { Tabs as Primitive } from 'radix-ui';
import {
  Children,
  createContext,
  forwardRef,
  isValidElement,
  useCallback,
  useContext,
  useMemo,
  type ComponentProps,
  type ReactElement,
  type ReactNode,
} from 'react';
import { useControllableState } from '../../hooks/useControllableState';
import { useOverflowItems } from '../../hooks/useOverflowItems';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '../DropdownMenu';

interface TabsValueContextValue {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsValueContext = createContext<TabsValueContextValue | null>(null);

export const TabsRoot = forwardRef<HTMLDivElement, ComponentProps<typeof Primitive.Root>>(
  function TabsRoot({ className, value, defaultValue, onValueChange, ...props }, ref) {
    const [active, setActive] = useControllableState({
      value,
      defaultValue: defaultValue ?? '',
      onChange: onValueChange,
    });
    const context = useMemo(
      () => ({ value: active, onValueChange: setActive }),
      [active, setActive],
    );
    return (
      <TabsValueContext.Provider value={context}>
        <Primitive.Root
          ref={ref}
          value={active}
          className={['ec-tabs', className].filter(Boolean).join(' ')}
          onValueChange={setActive}
          {...props}
        />
      </TabsValueContext.Provider>
    );
  },
);

export interface TabsListProps extends ComponentProps<typeof Primitive.List> {
  variant?: 'default' | 'line';
  overflowLabel?: string;
}

type TabTriggerElement = ReactElement<ComponentProps<typeof Primitive.Trigger>>;

function isTabTriggerElement(child: ReactNode): child is TabTriggerElement {
  return isValidElement<ComponentProps<typeof Primitive.Trigger>>(child) && 'value' in child.props;
}

export const TabsList = forwardRef<HTMLDivElement, TabsListProps>(function TabsList(
  { className, variant = 'default', overflowLabel = 'More tabs', children, ...props },
  ref,
) {
  const context = useContext(TabsValueContext);
  const childArray = Children.toArray(children);
  const tabChildren = childArray.filter(isTabTriggerElement);
  const supportsOverflow = Boolean(context) && tabChildren.length === childArray.length;
  const activeIndex = tabChildren.findIndex((child) => child.props.value === context?.value);
  const { containerRef, measureRef, visibleIndexes, hasOverflow } = useOverflowItems({
    itemCount: tabChildren.length,
    activeIndex,
    enabled: supportsOverflow,
  });
  const visible = useMemo(() => new Set(visibleIndexes), [visibleIndexes]);
  const overflowTabs = tabChildren.filter((_, index) => !visible.has(index));
  const setListRef = useCallback(
    (node: HTMLDivElement | null) => {
      containerRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    },
    [containerRef, ref],
  );

  return (
    <div
      className="ec-tab-list-shell"
      data-variant={variant}
      data-overflow={hasOverflow ? 'true' : undefined}
    >
      <Primitive.List
        ref={setListRef}
        data-variant={variant}
        className={['ec-tab-list', className].filter(Boolean).join(' ')}
        {...props}
      >
        {supportsOverflow
          ? tabChildren.map((child, index) => (visible.has(index) ? child : null))
          : children}
      </Primitive.List>
      {hasOverflow && context ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="ec-tab-list__overflow ec-focusable"
              aria-label={overflowLabel}
              data-active={overflowTabs.some((tab) => tab.props.value === context.value)}
            >
              <EllipsisIcon aria-hidden="true" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="ec-tab-list__overflow-menu">
            <DropdownMenuRadioGroup value={context.value} onValueChange={context.onValueChange}>
              {overflowTabs.map((tab) => (
                <DropdownMenuRadioItem
                  key={tab.props.value}
                  value={tab.props.value}
                  disabled={tab.props.disabled}
                >
                  {tab.props.children}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}
      <div ref={measureRef} className="ec-overflow-measure ec-tab-list__measure" aria-hidden>
        {tabChildren.map((tab) => (
          <div key={tab.props.value} className="ec-tab" data-overflow-measure-item>
            {tab.props.children}
          </div>
        ))}
        <button
          type="button"
          tabIndex={-1}
          className="ec-tab-list__overflow"
          data-overflow-measure-trigger
        >
          <EllipsisIcon />
        </button>
      </div>
    </div>
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
