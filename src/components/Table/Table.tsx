import type { Key, ReactNode } from 'react';
export interface TableColumn<T> {
  key: string;
  title: ReactNode;
  dataIndex?: keyof T;
  render?: (value: unknown, record: T, index: number) => ReactNode;
  align?: 'left' | 'center' | 'right';
  width?: string | number;
  mobileLabel?: ReactNode;
}
export interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  rowKey: keyof T | ((record: T) => Key);
  caption?: ReactNode;
  loading?: boolean;
  emptyText?: ReactNode;
  loadingText?: ReactNode;
  compact?: boolean;
  mobile?: 'scroll' | 'cards';
  className?: string;
  onRowClick?: (record: T, index: number) => void;
}
export function Table<T>({
  columns,
  data,
  rowKey,
  caption,
  loading = false,
  emptyText = 'No data',
  loadingText = 'Loading',
  compact = false,
  mobile = 'scroll',
  className,
  onRowClick,
}: TableProps<T>) {
  const getKey = (record: T) =>
    typeof rowKey === 'function' ? rowKey(record) : (record[rowKey] as Key);
  const cell = (column: TableColumn<T>, record: T, index: number) => {
    const value = column.dataIndex ? record[column.dataIndex] : undefined;
    return column.render ? column.render(value, record, index) : (value as ReactNode);
  };
  return (
    <div
      className={[
        'ec-table-wrap',
        mobile === 'cards' && 'ec-table-wrap--cards',
        compact && 'is-compact',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-busy={loading || undefined}
    >
      <table className="ec-table">
        {caption ? <caption>{caption}</caption> : null}
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                style={{ textAlign: column.align, width: column.width }}
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length}>
                <span className="ec-table__state">
                  <span className="ec-spinner" aria-hidden="true" />
                  {loadingText}
                </span>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>
                <span className="ec-table__state">{emptyText}</span>
              </td>
            </tr>
          ) : (
            data.map((record, index) => (
              <tr
                key={getKey(record)}
                tabIndex={onRowClick ? 0 : undefined}
                className={onRowClick ? 'is-interactive' : undefined}
                onClick={() => onRowClick?.(record, index)}
                onKeyDown={(event) => {
                  if (onRowClick && (event.key === 'Enter' || event.key === ' ')) {
                    event.preventDefault();
                    onRowClick(record, index);
                  }
                }}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    data-label={column.mobileLabel ?? column.title}
                    style={{ textAlign: column.align }}
                  >
                    {cell(column, record, index)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
