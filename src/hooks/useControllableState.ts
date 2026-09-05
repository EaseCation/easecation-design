import { useCallback, useState } from 'react';

export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: {
  value?: T;
  defaultValue: T;
  onChange?: (value: T) => void;
}) {
  const [internal, setInternal] = useState(defaultValue);
  const controlled = value !== undefined;
  const state = controlled ? value : internal;
  const setState = useCallback(
    (next: T) => {
      if (!controlled) setInternal(next);
      onChange?.(next);
    },
    [controlled, onChange],
  );
  return [state, setState] as const;
}
