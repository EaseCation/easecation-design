import { useCallback, useLayoutEffect, useRef, useState } from 'react';

const LAYOUT_EPSILON = 1;

interface OverflowItemsOptions {
  itemCount: number;
  activeIndex: number;
  enabled?: boolean;
}

function indexes(count: number) {
  return Array.from({ length: count }, (_, index) => index);
}

function sameIndexes(left: number[], right: number[]) {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

export function useOverflowItems({ itemCount, activeIndex, enabled = true }: OverflowItemsOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [visibleIndexes, setVisibleIndexes] = useState(() => indexes(itemCount));

  const measure = useCallback(() => {
    const container = containerRef.current;
    const measureRow = measureRef.current;
    if (!enabled || !container || !measureRow) {
      setVisibleIndexes(indexes(itemCount));
      return;
    }

    const items = Array.from(
      measureRow.querySelectorAll<HTMLElement>('[data-overflow-measure-item]'),
    );
    const overflowTrigger = measureRow.querySelector<HTMLElement>(
      '[data-overflow-measure-trigger]',
    );
    if (items.length !== itemCount || !overflowTrigger) return;

    const widths = items.map((item) => item.offsetWidth);
    if (container.clientWidth <= 0 || widths.every((width) => width === 0)) {
      setVisibleIndexes(indexes(itemCount));
      return;
    }

    const styles = getComputedStyle(container);
    const measureStyles = getComputedStyle(measureRow);
    const gap = Number.parseFloat(measureStyles.columnGap || measureStyles.gap) || 0;
    const available =
      container.clientWidth -
      (Number.parseFloat(styles.paddingLeft) || 0) -
      (Number.parseFloat(styles.paddingRight) || 0);
    const total = widths.reduce((sum, width) => sum + width, 0) + gap * (itemCount - 1);

    if (total <= available + LAYOUT_EPSILON) {
      setVisibleIndexes((current) => {
        const next = indexes(itemCount);
        return sameIndexes(current, next) ? current : next;
      });
      return;
    }

    const budget = Math.max(0, available - overflowTrigger.offsetWidth - gap);
    const selected = new Set<number>();
    let used = 0;
    const priorityIndex = activeIndex >= 0 && activeIndex < itemCount ? activeIndex : 0;
    if (itemCount > 0) {
      selected.add(priorityIndex);
      used = widths[priorityIndex];
    }
    const add = (index: number) => {
      if (index < 0 || index >= itemCount || selected.has(index)) return;
      const next = used + widths[index] + (selected.size ? gap : 0);
      if (next > budget + LAYOUT_EPSILON) return;
      selected.add(index);
      used = next;
    };

    for (let index = 0; index < itemCount; index += 1) add(index);
    const next = [...selected].sort((left, right) => left - right);
    setVisibleIndexes((current) => (sameIndexes(current, next) ? current : next));
  }, [activeIndex, enabled, itemCount]);

  useLayoutEffect(() => {
    let mounted = true;
    const measureWhileMounted = () => {
      if (mounted) measure();
    };

    measureWhileMounted();
    const observer =
      typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measureWhileMounted);
    if (containerRef.current) observer?.observe(containerRef.current);
    if (measureRef.current) observer?.observe(measureRef.current);
    window.addEventListener('resize', measureWhileMounted);
    void document.fonts?.ready?.then(measureWhileMounted);
    return () => {
      mounted = false;
      observer?.disconnect();
      window.removeEventListener('resize', measureWhileMounted);
    };
  }, [measure]);

  return {
    containerRef,
    measureRef,
    visibleIndexes,
    hasOverflow: visibleIndexes.length < itemCount,
  };
}
