import { forwardRef, type ComponentProps, type Key, type ReactNode } from 'react';

export interface TableRootProps extends ComponentProps<'table'> {
  containerClassName?: string;
  compact?: boolean;
  mobile?: 'scroll' | 'cards';
  layout?: 'auto' | 'fixed';
}
export const TableRoot = forwardRef<HTMLTableElement, TableRootProps>(function TableRoot(
  { containerClassName, compact = false, mobile = 'scroll', layout = 'auto', className, ...props },
  ref,
) {
  return (
    <div
      className={[
        'ec-table-wrap',
        mobile === 'cards' && 'ec-table-wrap--cards',
        compact && 'is-compact',
        containerClassName,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <table
        ref={ref}
        data-slot="table"
        data-layout={layout}
        className={['ec-table', className].filter(Boolean).join(' ')}
        {...props}
      />
    </div>
  );
});

export const TableHeader = forwardRef<HTMLTableSectionElement, ComponentProps<'thead'>>(
  function TableHeader(props, ref) {
    return <thead ref={ref} data-slot="table-header" {...props} />;
  },
);
export const TableBody = forwardRef<HTMLTableSectionElement, ComponentProps<'tbody'>>(
  function TableBody(props, ref) {
    return <tbody ref={ref} data-slot="table-body" {...props} />;
  },
);
export const TableFooter = forwardRef<HTMLTableSectionElement, ComponentProps<'tfoot'>>(
  function TableFooter(props, ref) {
    return <tfoot ref={ref} data-slot="table-footer" {...props} />;
  },
);
export const TableRow = forwardRef<HTMLTableRowElement, ComponentProps<'tr'>>(
  function TableRow(props, ref) {
    return <tr ref={ref} data-slot="table-row" {...props} />;
  },
);
export const TableHead = forwardRef<HTMLTableCellElement, ComponentProps<'th'>>(
  function TableHead(props, ref) {
    return <th ref={ref} data-slot="table-head" {...props} />;
  },
);
export const TableCell = forwardRef<HTMLTableCellElement, ComponentProps<'td'>>(
  function TableCell(props, ref) {
    return <td ref={ref} data-slot="table-cell" {...props} />;
  },
);
export const TableCaption = forwardRef<HTMLTableCaptionElement, ComponentProps<'caption'>>(
  function TableCaption(props, ref) {
    return <caption ref={ref} data-slot="table-caption" {...props} />;
  },
);

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
    <TableRoot
      containerClassName={className}
      compact={compact}
      mobile={mobile}
      layout="fixed"
      aria-busy={loading || undefined}
    >
      {caption ? <TableCaption>{caption}</TableCaption> : null}
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead
              key={column.key}
              scope="col"
              style={{ textAlign: column.align, width: column.width }}
            >
              {column.title}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={columns.length}>
              <span className="ec-table__state">
                <span className="ec-spinner" aria-hidden="true" />
                {loadingText}
              </span>
            </TableCell>
          </TableRow>
        ) : data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={columns.length}>
              <span className="ec-table__state">{emptyText}</span>
            </TableCell>
          </TableRow>
        ) : (
          data.map((record, index) => (
            <TableRow
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
                <TableCell
                  key={column.key}
                  data-label={column.mobileLabel ?? column.title}
                  style={{ textAlign: column.align }}
                >
                  {cell(column, record, index)}
                </TableCell>
              ))}
            </TableRow>
          ))
        )}
      </TableBody>
    </TableRoot>
  );
}
