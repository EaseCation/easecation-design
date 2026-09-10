import {
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { ChevronRightIcon } from 'lucide-react';
import { useControllableState } from '../../hooks/useControllableState';

export interface TreeViewItem {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  children?: readonly TreeViewItem[];
  disabled?: boolean;
}

export interface TreeViewProps {
  items: readonly TreeViewItem[];
  selectedValue?: string;
  defaultSelectedValue?: string;
  onSelectedValueChange?: (value: string) => void;
  expandedValues?: string[];
  defaultExpandedValues?: string[];
  onExpandedValuesChange?: (values: string[]) => void;
  ariaLabel: string;
  emptyText?: ReactNode;
  className?: string;
}

interface FlatTreeItem {
  item: TreeViewItem;
  depth: number;
  parentValue?: string;
}

function flattenVisible(
  items: readonly TreeViewItem[],
  expanded: ReadonlySet<string>,
  depth = 1,
  parentValue?: string,
): FlatTreeItem[] {
  return items.flatMap((item) => {
    const current = { item, depth, parentValue };
    if (!item.children?.length || !expanded.has(item.value)) return [current];
    return [current, ...flattenVisible(item.children, expanded, depth + 1, item.value)];
  });
}

export function TreeView({
  items,
  selectedValue,
  defaultSelectedValue = '',
  onSelectedValueChange,
  expandedValues,
  defaultExpandedValues = [],
  onExpandedValuesChange,
  ariaLabel,
  emptyText = 'No items',
  className,
}: TreeViewProps) {
  const [selected, setSelected] = useControllableState({
    value: selectedValue,
    defaultValue: defaultSelectedValue,
    onChange: onSelectedValueChange,
  });
  const [expanded, setExpanded] = useControllableState({
    value: expandedValues,
    defaultValue: defaultExpandedValues,
    onChange: onExpandedValuesChange,
  });
  const expandedSet = useMemo(() => new Set(expanded), [expanded]);
  const visible = useMemo(() => flattenVisible(items, expandedSet), [expandedSet, items]);
  const enabled = visible.filter(({ item }) => !item.disabled);
  const [focusedValue, setFocusedValue] = useState(() => selected || enabled[0]?.item.value || '');
  const itemRefs = useRef(new Map<string, HTMLButtonElement>());
  const tabbableValue = enabled.some(({ item }) => item.value === focusedValue)
    ? focusedValue
    : (enabled.find(({ item }) => item.value === selected)?.item.value ??
      enabled[0]?.item.value ??
      '');

  const focusItem = (value?: string) => {
    if (!value) return;
    setFocusedValue(value);
    itemRefs.current.get(value)?.focus();
  };

  const toggle = (value: string) => {
    setExpanded(
      expandedSet.has(value) ? expanded.filter((item) => item !== value) : [...expanded, value],
    );
  };

  const select = (item: TreeViewItem) => {
    if (item.disabled) return;
    setSelected(item.value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, entry: FlatTreeItem) => {
    const index = enabled.findIndex(({ item }) => item.value === entry.item.value);
    const hasChildren = Boolean(entry.item.children?.length);

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const offset = event.key === 'ArrowDown' ? 1 : -1;
      const next = enabled[index + offset];
      if (next) focusItem(next.item.value);
      return;
    }
    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      focusItem(event.key === 'Home' ? enabled[0]?.item.value : enabled.at(-1)?.item.value);
      return;
    }
    if (event.key === 'ArrowRight' && hasChildren) {
      event.preventDefault();
      if (!expandedSet.has(entry.item.value)) toggle(entry.item.value);
      else focusItem(entry.item.children?.find((item) => !item.disabled)?.value);
      return;
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      if (hasChildren && expandedSet.has(entry.item.value)) toggle(entry.item.value);
      else focusItem(entry.parentValue);
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      select(entry.item);
      if (hasChildren) toggle(entry.item.value);
    }
  };

  const renderItems = (
    nextItems: readonly TreeViewItem[],
    depth = 1,
    parentValue?: string,
  ): ReactNode =>
    nextItems.map((item) => {
      const hasChildren = Boolean(item.children?.length);
      const isExpanded = hasChildren && expandedSet.has(item.value);
      const entry = { item, depth, parentValue };
      return (
        <div key={item.value} role="none">
          <button
            ref={(node) => {
              if (node) itemRefs.current.set(item.value, node);
              else itemRefs.current.delete(item.value);
            }}
            type="button"
            role="treeitem"
            className="ec-tree-view__item"
            style={{ '--ec-tree-indent': `${Math.max(0, depth - 1)}rem` } as CSSProperties}
            aria-level={depth}
            aria-expanded={hasChildren ? isExpanded : undefined}
            aria-selected={selected === item.value}
            aria-disabled={item.disabled || undefined}
            disabled={item.disabled}
            tabIndex={tabbableValue === item.value ? 0 : -1}
            data-selected={selected === item.value ? 'true' : undefined}
            onFocus={() => setFocusedValue(item.value)}
            onClick={() => {
              select(item);
              if (hasChildren) toggle(item.value);
            }}
            onKeyDown={(event) => handleKeyDown(event, entry)}
          >
            <span className="ec-tree-view__disclosure" aria-hidden="true">
              {hasChildren ? <ChevronRightIcon data-expanded={isExpanded || undefined} /> : null}
            </span>
            {item.icon ? (
              <span className="ec-tree-view__icon" aria-hidden="true">
                {item.icon}
              </span>
            ) : null}
            <span className="ec-tree-view__copy">
              <span className="ec-tree-view__label">{item.label}</span>
              {item.description ? (
                <span className="ec-tree-view__description">{item.description}</span>
              ) : null}
            </span>
          </button>
          {isExpanded ? (
            <div role="group">{renderItems(item.children ?? [], depth + 1, item.value)}</div>
          ) : null}
        </div>
      );
    });

  return (
    <div
      role="tree"
      aria-label={ariaLabel}
      className={['ec-tree-view', className].filter(Boolean).join(' ')}
    >
      {items.length ? renderItems(items) : <div className="ec-tree-view__empty">{emptyText}</div>}
    </div>
  );
}
