import {
  forwardRef,
  Fragment,
  useState,
  type ComponentProps,
  type Key,
  type ReactNode,
  type CSSProperties,
} from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  type SortingState,
  type ColumnFiltersState,
} from '@tanstack/react-table';
import { ChevronDownIcon, ChevronRightIcon, ArrowUpDownIcon, ListFilterIcon } from 'lucide-react';
import { Checkbox } from '../Checkbox';
import { Button, IconButton } from '../Button';
import { Pagination } from '../Pagination';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from '../DropdownMenu';
import { Skeleton } from '../Skeleton';
import { useLocale } from '../../locale/LocaleProvider';

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
  key?: Key;
  title: ReactNode;
  dataIndex?: keyof T | string | readonly (string | number)[];
  // Heterogeneous cells may expose strings, numbers or structured values.
  render?: (value: any, record: T, index: number) => ReactNode;
  align?: 'left' | 'center' | 'right';
  width?: string | number;
  mobileLabel?: ReactNode;
  compare?: (a: T, b: T) => number;
  defaultSortDirection?: 'asc' | 'desc';
  filterOptions?: { label: ReactNode; value: string | number | boolean }[];
  filter?: (value: string | number | boolean, record: T) => boolean;
  pinned?: 'left' | 'right';
  truncate?: boolean;
}
export type TableColumns<T> = TableColumn<T>[];
export interface TablePaginationConfig {
  current?: number;
  defaultPageSize?: number;
  pageSize?: number;
  total?: number;
  /** Server mode renders the supplied page without slicing it again. */
  mode?: 'client' | 'server';
  hideOnSinglePage?: boolean;
  allowPageSizeChange?: boolean;
  showPageJump?: boolean;
  totalLabel?: (total: number, range: [number, number]) => ReactNode;
  onChange?: (page: number, pageSize: number) => void;
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
  style?: CSSProperties;
  minWidth?: number | string;
  maxHeight?: number | string;
  pagination?: false | TablePaginationConfig;
  onPaginationChange?: (pagination: { current: number; pageSize: number }) => void;
  selection?: { selectedKeys: Key[]; onChange: (keys: Key[]) => void };
  renderExpandedRow?: (record: T) => ReactNode;
  getRowProps?: (record: T, index: number) => ComponentProps<'tr'>;
  onRowClick?: (record: T, index: number) => void;
}
export function Table<T>({
  columns,
  data,
  rowKey,
  caption,
  loading = false,
  emptyText,
  loadingText,
  compact = false,
  mobile = 'scroll',
  className,
  style,
  minWidth,
  maxHeight,
  pagination = false,
  onPaginationChange,
  selection,
  renderExpandedRow,
  getRowProps,
  onRowClick,
}: TableProps<T>) {
  const { messages, locale } = useLocale();
  const getKey = (record: T) =>
    typeof rowKey === 'function' ? rowKey(record) : (record[rowKey] as Key);
  const columnId = (column: TableColumn<T>, index: number) =>
    String(column.key ?? `${String(column.dataIndex ?? 'column')}:${index}`);
  const [sorting, setSorting] = useState<SortingState>(() =>
    columns.flatMap((column, index) =>
      column.defaultSortDirection
        ? [{ id: columnId(column, index), desc: column.defaultSortDirection === 'desc' }]
        : [],
    ),
  );
  const [filters, setFilters] = useState<ColumnFiltersState>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(pagination ? (pagination.defaultPageSize ?? 10) : 10);
  const [expanded, setExpanded] = useState<Set<Key>>(() => new Set());
  const config = pagination || undefined;
  const size = Math.max(1, config?.pageSize ?? pageSize);
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable<T>({
    data,
    columns: columns.map((column, index) => ({
      id: columnId(column, index),
      accessorFn: (record) => record,
      enableSorting: Boolean(column.compare),
      sortDescFirst: false,
      sortingFn: column.compare ? (a, b) => column.compare!(a.original, b.original) : undefined,
      filterFn: (row, _id, value) =>
        Array.isArray(value)
          ? value.some((item) => column.filter?.(item, row.original) ?? true)
          : true,
    })),
    state: { sorting, columnFilters: filters },
    onSortingChange: (updater) => {
      setSorting(updater);
      setPage(1);
    },
    onColumnFiltersChange: (updater) => {
      setFilters(updater);
      setPage(1);
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });
  const records = table.getRowModel().rows.map((row) => row.original);
  const total = config?.mode === 'server' ? (config.total ?? records.length) : records.length;
  const current = Math.min(
    Math.max(1, config?.current ?? page),
    Math.max(1, Math.ceil(total / size)),
  );
  const visible =
    config && config.mode !== 'server'
      ? records.slice((current - 1) * size, current * size)
      : records;
  const changePage = (next: number, nextSize = size) => {
    setPage(next);
    setPageSize(nextSize);
    config?.onChange?.(next, nextSize);
    onPaginationChange?.({ current: next, pageSize: nextSize });
  };
  const pageKeys = visible.map(getKey);
  const selected = new Set(selection?.selectedKeys ?? []);
  const selectedCount = pageKeys.filter((key) => selected.has(key)).length;
  const stickyStyle = (index: number): CSSProperties => {
    const column = columns[index];
    if (!column.pinned) return {};
    const preceding = column.pinned === 'left' ? columns.slice(0, index) : columns.slice(index + 1);
    const offset = preceding
      .filter((item) => item.pinned === column.pinned)
      .reduce((sum, item) => sum + (typeof item.width === 'number' ? item.width : 160), 0);
    return { position: 'sticky', [column.pinned]: offset, zIndex: 1 };
  };
  const cell = (column: TableColumn<T>, record: T, index: number) => {
    const value = Array.isArray(column.dataIndex)
      ? column.dataIndex.reduce((value: any, key) => value?.[key], record)
      : column.dataIndex !== undefined
        ? record[column.dataIndex as keyof T]
        : undefined;
    return column.render ? column.render(value, record, index) : (value as ReactNode);
  };
  const span = columns.length + Number(Boolean(selection)) + Number(Boolean(renderExpandedRow));
  const rowLabel = (key: Key) => (locale === 'zh-CN' ? `选择记录 ${key}` : `Select row ${key}`);
  return (
    <div className={className} style={style}>
      <div className="ec-data-table-scroll" style={{ maxHeight }}>
        <TableRoot
          compact={compact}
          mobile={mobile}
          layout="auto"
          aria-busy={loading || undefined}
          style={{ minWidth }}
        >
          {caption ? <TableCaption>{caption}</TableCaption> : null}
          <TableHeader>
            <TableRow>
              {selection ? (
                <TableHead scope="col">
                  <Checkbox
                    aria-label={
                      locale === 'zh-CN' ? '选择本页全部记录' : 'Select all rows on this page'
                    }
                    disabled={loading || !pageKeys.length}
                    checked={
                      selectedCount === pageKeys.length && pageKeys.length > 0
                        ? true
                        : selectedCount
                          ? 'indeterminate'
                          : false
                    }
                    onCheckedChange={(checked) => {
                      const next = new Set(selected);
                      pageKeys.forEach((key) => {
                        if (checked) next.add(key);
                        else next.delete(key);
                      });
                      selection.onChange([...next]);
                    }}
                  />
                </TableHead>
              ) : null}
              {renderExpandedRow ? (
                <TableHead scope="col">
                  <span className="ec-visually-hidden">
                    {locale === 'zh-CN' ? '详情' : 'Details'}
                  </span>
                </TableHead>
              ) : null}
              {columns.map((column, index) => {
                const id = columnId(column, index);
                const engineColumn = table.getColumn(id)!;
                const order = engineColumn.getIsSorted();
                return (
                  <TableHead
                    key={id}
                    scope="col"
                    data-pinned={column.pinned}
                    aria-sort={
                      column.compare
                        ? order === 'asc'
                          ? 'ascending'
                          : order === 'desc'
                            ? 'descending'
                            : 'none'
                        : undefined
                    }
                    style={{
                      textAlign: column.align,
                      width: column.width,
                      minWidth: column.pinned ? (column.width ?? 160) : undefined,
                      ...stickyStyle(index),
                    }}
                  >
                    {column.compare ? (
                      <Button
                        variant="ghost"
                        size="inline"
                        trailingIcon={<ArrowUpDownIcon />}
                        onClick={() => engineColumn.toggleSorting()}
                      >
                        {column.title}
                      </Button>
                    ) : (
                      column.title
                    )}
                    {column.filterOptions ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <IconButton
                            variant="ghost"
                            size="sm"
                            icon={<ListFilterIcon />}
                            label={`${locale === 'zh-CN' ? '筛选' : 'Filter'} ${typeof column.title === 'string' ? column.title : index + 1}`}
                          />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {column.filterOptions.map((option, optionIndex) => (
                            <DropdownMenuCheckboxItem
                              key={optionIndex}
                              checked={
                                (engineColumn.getFilterValue() as unknown[] | undefined)?.includes(
                                  option.value,
                                ) ?? false
                              }
                              onSelect={(event) => event.preventDefault()}
                              onCheckedChange={(checked) => {
                                const current =
                                  (engineColumn.getFilterValue() as unknown[] | undefined) ?? [];
                                const next = checked
                                  ? [...current, option.value]
                                  : current.filter((value) => value !== option.value);
                                engineColumn.setFilterValue(next.length ? next : undefined);
                              }}
                            >
                              {option.label}
                            </DropdownMenuCheckboxItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : null}
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={span}>
                  <div
                    role="status"
                    aria-label={
                      loadingText && typeof loadingText === 'string'
                        ? loadingText
                        : messages.loading
                    }
                  >
                    <Skeleton style={{ height: 'var(--ec-space-8)' }} />
                  </div>
                </TableCell>
              </TableRow>
            ) : !visible.length ? (
              <TableRow>
                <TableCell colSpan={span}>
                  <span className="ec-table__state">{emptyText ?? messages.noData}</span>
                </TableCell>
              </TableRow>
            ) : (
              visible.map((record, index) => {
                const key = getKey(record);
                const rowProps = getRowProps?.(record, index);
                const interactiveTarget = (target: EventTarget | null) =>
                  target instanceof Element &&
                  Boolean(target.closest('button,input,select,textarea,a,[role="button"]'));
                return (
                  <Fragment key={key}>
                    <TableRow
                      {...rowProps}
                      tabIndex={onRowClick ? 0 : undefined}
                      className={[
                        'ec-data-table-row',
                        onRowClick && 'is-interactive',
                        rowProps?.className,
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      data-selected={selected.has(key) || undefined}
                      onClick={(event) => {
                        rowProps?.onClick?.(event);
                        if (!event.defaultPrevented && !interactiveTarget(event.target))
                          onRowClick?.(record, index);
                      }}
                      onKeyDown={(event) => {
                        rowProps?.onKeyDown?.(event);
                        if (
                          !event.defaultPrevented &&
                          event.target === event.currentTarget &&
                          onRowClick &&
                          ['Enter', ' '].includes(event.key)
                        ) {
                          event.preventDefault();
                          onRowClick(record, index);
                        }
                      }}
                    >
                      {selection ? (
                        <TableCell>
                          <Checkbox
                            aria-label={rowLabel(key)}
                            checked={selected.has(key)}
                            onCheckedChange={(checked) => {
                              const next = new Set(selected);
                              if (checked) next.add(key);
                              else next.delete(key);
                              selection.onChange([...next]);
                            }}
                          />
                        </TableCell>
                      ) : null}
                      {renderExpandedRow ? (
                        <TableCell>
                          <IconButton
                            variant="ghost"
                            size="sm"
                            label={locale === 'zh-CN' ? `记录 ${key} 详情` : `Row ${key} details`}
                            aria-expanded={expanded.has(key)}
                            icon={expanded.has(key) ? <ChevronDownIcon /> : <ChevronRightIcon />}
                            onClick={() =>
                              setExpanded((previous) => {
                                const next = new Set(previous);
                                if (next.has(key)) next.delete(key);
                                else next.add(key);
                                return next;
                              })
                            }
                          />
                        </TableCell>
                      ) : null}
                      {columns.map((column, columnIndex) => (
                        <TableCell
                          key={columnId(column, columnIndex)}
                          data-label={
                            typeof (column.mobileLabel ?? column.title) === 'string'
                              ? (column.mobileLabel ?? column.title)
                              : undefined
                          }
                          data-pinned={column.pinned}
                          style={{ textAlign: column.align, ...stickyStyle(columnIndex) }}
                        >
                          <div
                            className={column.truncate ? 'ec-data-table-cell-truncate' : undefined}
                          >
                            {cell(column, record, index)}
                          </div>
                        </TableCell>
                      ))}
                    </TableRow>
                    {renderExpandedRow && expanded.has(key) ? (
                      <TableRow>
                        <TableCell colSpan={span}>{renderExpandedRow(record)}</TableCell>
                      </TableRow>
                    ) : null}
                  </Fragment>
                );
              })
            )}
          </TableBody>
        </TableRoot>
      </div>
      {config && !(config.hideOnSinglePage && total <= size) ? (
        <div className="ec-data-table-pagination">
          {config.totalLabel ? (
            <span>
              {config.totalLabel(
                total,
                total ? [(current - 1) * size + 1, Math.min(current * size, total)] : [0, 0],
              )}
            </span>
          ) : null}
          <Pagination
            page={current}
            pageSize={size}
            total={total}
            disabled={loading}
            showTotal={!config.totalLabel}
            onPageChange={changePage}
            onPageSizeChange={
              (config.allowPageSizeChange ?? total > 50) ? (next) => changePage(1, next) : undefined
            }
            showPageJump={config.showPageJump}
          />
        </div>
      ) : null}
    </div>
  );
}
