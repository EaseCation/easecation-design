import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table';
import { XIcon } from 'lucide-react';
import { createContext, useContext, type ComponentProps, type ReactNode } from 'react';
import { Dialog as Primitive } from 'radix-ui';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useOverlayViewportStyle } from '../../platform/useOverlayViewport';
import { IconButton } from '../Button';
import { EmptyState, InlineQueryError } from '../State';
import { Skeleton } from '../Skeleton';
export type QueryDataTableRowRenderProps<T> = {
  rowId: string;
  row: T;
  className?: string;
  children: ReactNode;
};
export interface QueryDataTableProps<T> {
  data: T[];
  // TanStack columns intentionally allow heterogeneous accessor value types.
  columns: ColumnDef<T, any>[];
  getRowId?: (row: T, index: number) => string;
  isLoading?: boolean;
  mobileCard?: (row: T) => ReactNode;
  layout?: 'auto' | 'table';
  renderTableRow?: (props: QueryDataTableRowRenderProps<T>) => ReactNode;
  embedded?: boolean;
  embeddedShellClassName?: string;
  panelClassName?: string;
  tableClassName?: string;
  tableRowClassName?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  errorTitle?: string;
  errorDescription?: string;
  retryLabel?: string;
  onRetry?: () => void;
}
export function QueryDataTable<T>({
  data,
  columns,
  getRowId,
  isLoading = false,
  mobileCard,
  layout = 'auto',
  renderTableRow,
  embedded = false,
  embeddedShellClassName,
  panelClassName,
  tableClassName,
  tableRowClassName,
  emptyTitle = 'No data',
  emptyDescription = 'Adjust the filters and try again.',
  errorTitle,
  errorDescription,
  retryLabel,
  onRetry,
}: QueryDataTableProps<T>) {
  const mobile = useMediaQuery('(max-width: 767px)');
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel(), getRowId });
  const shell = [
    'ec-query-table',
    embedded && 'is-embedded',
    embeddedShellClassName,
    panelClassName,
  ]
    .filter(Boolean)
    .join(' ');
  if (isLoading)
    return (
      <div className={['ec-query-loading', embedded && 'is-embedded'].filter(Boolean).join(' ')}>
        {Array.from({ length: mobile && layout !== 'table' ? 4 : 6 }, (_, i) => (
          <Skeleton key={i} style={{ height: '5rem' }} />
        ))}
      </div>
    );
  if (errorDescription)
    return (
      <InlineQueryError
        title={errorTitle}
        description={errorDescription}
        actionLabel={retryLabel}
        onRetry={onRetry}
        embedded={embedded}
        className={embeddedShellClassName}
      />
    );
  if (!data.length)
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        className={embeddedShellClassName}
      />
    );
  if (mobile && layout !== 'table' && mobileCard)
    return (
      <div className={['ec-query-cards', embedded && 'is-embedded'].filter(Boolean).join(' ')}>
        {data.map(mobileCard)}
      </div>
    );
  return (
    <div className={shell}>
      <div className="ec-query-table__scroll">
        <table className={tableClassName}>
          <thead>
            {table.getHeaderGroups().map((group) => (
              <tr key={group.id}>
                {group.headers.map((header) => {
                  const meta = header.column.columnDef.meta as
                    { sticky?: 'left' | 'right'; headerClassName?: string } | undefined;
                  return (
                    <th
                      key={header.id}
                      data-sticky={meta?.sticky}
                      className={meta?.headerClassName}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => {
              const cells = row.getVisibleCells().map((cell) => {
                const meta = cell.column.columnDef.meta as
                  { sticky?: 'left' | 'right'; cellClassName?: string } | undefined;
                return (
                  <td key={cell.id} data-sticky={meta?.sticky} className={meta?.cellClassName}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                );
              });
              const content = <>{cells}</>;
              return renderTableRow ? (
                renderTableRow({
                  rowId: row.id,
                  row: row.original,
                  className: tableRowClassName,
                  children: content,
                })
              ) : (
                <tr key={row.id} className={tableRowClassName}>
                  {content}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
const OverlayContext = createContext({ mobile: false });
export type ResponsiveOverlayDesktopSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';
export function ResponsiveOverlay({
  open,
  onOpenChange,
  children,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}) {
  const mobile = useMediaQuery('(max-width: 767px)');
  return (
    <OverlayContext.Provider value={{ mobile }}>
      <Primitive.Root open={open} onOpenChange={onOpenChange}>
        {children}
      </Primitive.Root>
    </OverlayContext.Provider>
  );
}
export const ResponsiveOverlayTrigger = Primitive.Trigger;
export interface ResponsiveOverlayContentProps extends ComponentProps<typeof Primitive.Content> {
  mobileClassName?: string;
  mobileSide?: 'top' | 'right' | 'bottom' | 'left';
  desktopSize?: ResponsiveOverlayDesktopSize;
  layer?: 'default' | 'nested';
  showCloseButton?: boolean;
  closeLabel?: string;
  instant?: boolean;
  forceMount?: true;
}
export function ResponsiveOverlayContent({
  children,
  className,
  mobileClassName,
  mobileSide = 'bottom',
  desktopSize = 'lg',
  layer = 'default',
  showCloseButton = true,
  closeLabel = 'Close',
  instant = false,
  forceMount,
  style,
  ...props
}: ResponsiveOverlayContentProps) {
  const { mobile } = useContext(OverlayContext);
  const viewportStyle = useOverlayViewportStyle(style);
  return (
    <Primitive.Portal forceMount={forceMount}>
      <Primitive.Overlay
        data-layer={layer}
        className={['ec-dialog-overlay', instant && 'is-instant'].filter(Boolean).join(' ')}
      />
      <Primitive.Content
        data-mobile={mobile || undefined}
        data-side={mobile ? mobileSide : undefined}
        data-size={desktopSize}
        data-layer={layer}
        className={[
          'ec-responsive-overlay',
          mobile ? mobileClassName : className,
          instant && 'is-instant',
        ]
          .filter(Boolean)
          .join(' ')}
        style={viewportStyle}
        {...props}
      >
        {children}
        {showCloseButton ? (
          <Primitive.Close asChild>
            <IconButton
              className="ec-overlay-close"
              size="sm"
              label={closeLabel}
              icon={<XIcon />}
            />
          </Primitive.Close>
        ) : null}
      </Primitive.Content>
    </Primitive.Portal>
  );
}
export function ResponsiveOverlayHeader({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={['ec-responsive-overlay__header', className].filter(Boolean).join(' ')}
      {...props}
    />
  );
}
export function ResponsiveOverlayTitle({
  className,
  ...props
}: ComponentProps<typeof Primitive.Title>) {
  return <Primitive.Title className={className} {...props} />;
}
export function ResponsiveOverlayDescription({
  className,
  ...props
}: ComponentProps<typeof Primitive.Description>) {
  return <Primitive.Description className={className} {...props} />;
}
export function ResponsiveOverlayFooter({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={['ec-responsive-overlay__footer', className].filter(Boolean).join(' ')}
      {...props}
    />
  );
}
export interface ResponsiveOverlayBodyProps extends ComponentProps<'div'> {
  padding?: 'default' | 'none';
}
export function ResponsiveOverlayBody({
  className,
  padding = 'default',
  ...props
}: ResponsiveOverlayBodyProps) {
  return (
    <div
      className={['ec-responsive-overlay__body', className].filter(Boolean).join(' ')}
      data-padding={padding}
      {...props}
    />
  );
}
export interface ResponsiveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  desktopSize?: ResponsiveOverlayDesktopSize;
  mobileSide?: 'top' | 'right' | 'bottom' | 'left';
  layer?: 'default' | 'nested';
  desktopContentClassName?: string;
  mobileContentClassName?: string;
  bodyClassName?: string;
  showCloseButton?: boolean;
  closeLabel?: string;
  instant?: boolean;
  forceMount?: true;
}
export function ResponsiveDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  desktopSize,
  mobileSide,
  layer,
  desktopContentClassName,
  mobileContentClassName,
  bodyClassName,
  showCloseButton,
  closeLabel,
  instant,
  forceMount,
}: ResponsiveDialogProps) {
  return (
    <ResponsiveOverlay open={open} onOpenChange={onOpenChange}>
      <ResponsiveOverlayContent
        className={desktopContentClassName}
        mobileClassName={mobileContentClassName}
        desktopSize={desktopSize}
        mobileSide={mobileSide}
        layer={layer}
        showCloseButton={showCloseButton}
        closeLabel={closeLabel}
        instant={instant}
        forceMount={forceMount}
      >
        <ResponsiveOverlayHeader>
          <ResponsiveOverlayTitle>{title}</ResponsiveOverlayTitle>
          {description ? (
            <ResponsiveOverlayDescription>{description}</ResponsiveOverlayDescription>
          ) : null}
        </ResponsiveOverlayHeader>
        <ResponsiveOverlayBody className={bodyClassName}>{children}</ResponsiveOverlayBody>
        {footer ? <ResponsiveOverlayFooter>{footer}</ResponsiveOverlayFooter> : null}
      </ResponsiveOverlayContent>
    </ResponsiveOverlay>
  );
}
