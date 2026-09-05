import * as React from 'react';
import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '../table';
import { cn } from '../../lib/utils';
import { EASECATION_MOBILE_MEDIA_QUERY as MOBILE_MEDIA_QUERY } from '../../lib/config';
import { EmptyState } from '../state/empty-state';
import { InlineQueryError } from '../state/inline-query-error';
import { Skeleton } from '../skeleton';
import { useMediaQuery } from '../../hooks/use-media-query';

type QueryDataTableColumnMeta = {
  sticky?: 'left' | 'right';
  headerClassName?: string;
  cellClassName?: string;
};

function getColumnMeta(meta: unknown): QueryDataTableColumnMeta {
  return (meta ?? {}) as QueryDataTableColumnMeta;
}

function stickyColumnClassName(sticky: 'left' | 'right' | undefined, variant: 'head' | 'cell') {
  if (!sticky) return '';

  return cn(
    'sticky z-10',
    sticky === 'right' ? 'right-0' : 'left-0',
    variant === 'head'
      ? 'z-20 bg-background/95 backdrop-blur-sm'
      : 'bg-background group-hover:bg-muted/40 group-data-[state=selected]:bg-muted/30',
    sticky === 'right' && 'border-l border-border/30',
    sticky === 'left' && 'border-r border-border/30',
    sticky === 'right' &&
      'shadow-[-6px_0_12px_-8px_rgba(0,0,0,0.08)] dark:shadow-[-6px_0_12px_-8px_rgba(0,0,0,0.3)]',
  );
}

export type QueryDataTableRowRenderProps<TData> = {
  rowId: string;
  row: TData;
  className?: string;
  children: React.ReactNode;
};

export interface QueryDataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  getRowId?: (row: TData, index: number) => string;
  isLoading?: boolean;
  mobileCard?: (row: TData) => React.ReactNode;
  layout?: 'auto' | 'table';
  renderTableRow?: (props: QueryDataTableRowRenderProps<TData>) => React.ReactNode;
  embedded?: boolean;
  embeddedShellClassName?: string;
  panelClassName?: string;
  tableClassName?: string;
  tableRowClassName?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  errorTitle?: string;
  errorDescription?: string;
  onRetry?: () => void;
}

export function QueryDataTable<TData>({
  data,
  columns,
  getRowId,
  isLoading = false,
  mobileCard,
  layout = 'auto',
  embedded = false,
  embeddedShellClassName,
  panelClassName,
  tableClassName,
  tableRowClassName,
  renderTableRow,
  emptyTitle = '暂无数据',
  emptyDescription = '调整筛选条件后再试一次。',
  errorTitle,
  errorDescription,
  onRetry,
}: QueryDataTableProps<TData>) {
  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);
  const useTableLayout = layout === 'table' || !isMobile;
  // TanStack Table returns callable objects that the React Compiler intentionally leaves un-memoized.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId,
  });

  const embeddedShellClass = cn(
    'mx-3 mb-3 min-w-0 overflow-hidden rounded-xl border border-border/30 bg-card sm:mx-4',
    embeddedShellClassName,
  );

  const embeddedPanelClass = embedded
    ? embeddedShellClass
    : cn(
        'w-full min-w-0 overflow-hidden rounded-xl border border-border/40 bg-card',
        panelClassName,
      );

  if (isLoading) {
    return (
      <div className={cn('grid gap-3 p-3 sm:p-4', embedded && embeddedShellClass)}>
        {Array.from({ length: useTableLayout ? 6 : 4 }).map((_, index) => (
          <Skeleton key={index} className="h-20 rounded-lg" />
        ))}
      </div>
    );
  }

  if (errorDescription) {
    return (
      <InlineQueryError
        title={errorTitle}
        description={errorDescription}
        onRetry={onRetry}
        embedded={embedded}
        className={embedded ? embeddedShellClass : undefined}
      />
    );
  }

  if (data.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        className={embedded ? cn(embeddedShellClass, 'min-h-40') : undefined}
      />
    );
  }

  if (!useTableLayout && mobileCard) {
    return (
      <div className={cn('grid min-w-0 gap-3 p-3 sm:p-4', embedded && embeddedShellClass)}>
        {data.map(mobileCard)}
      </div>
    );
  }

  return (
    <div className={embeddedPanelClass}>
      <div className="relative w-full overflow-x-auto">
        <table data-slot="table" className={cn('w-full caption-bottom text-sm', tableClassName)}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const meta = getColumnMeta(header.column.columnDef.meta);

                  return (
                    <TableHead
                      key={header.id}
                      className={cn(
                        stickyColumnClassName(meta.sticky, 'head'),
                        meta.headerClassName,
                      )}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => {
              const rowClassName = cn(tableRowClassName);
              const cells = row.getVisibleCells().map((cell) => {
                const meta = getColumnMeta(cell.column.columnDef.meta);

                return (
                  <TableCell
                    key={cell.id}
                    className={cn(stickyColumnClassName(meta.sticky, 'cell'), meta.cellClassName)}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                );
              });

              if (renderTableRow) {
                return (
                  <React.Fragment key={row.id}>
                    {renderTableRow({
                      rowId: row.id,
                      row: row.original,
                      className: rowClassName,
                      children: cells,
                    })}
                  </React.Fragment>
                );
              }

              return (
                <TableRow key={row.id} className={cn('group', rowClassName)}>
                  {cells}
                </TableRow>
              );
            })}
          </TableBody>
        </table>
      </div>
    </div>
  );
}
