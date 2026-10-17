import { useLocale } from '../../locale/LocaleProvider';
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table';
import { XIcon } from 'lucide-react';
import {
  createContext,
  useContext,
  useImperativeHandle,
  useState,
  type ComponentProps,
  type ReactNode,
} from 'react';
import { Dialog as Primitive } from 'radix-ui';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useOverlayBehavior, useOverlayFocus } from '../../platform/useOverlayBehavior';
import { useOverlayViewportStyle } from '../../platform/useOverlayViewport';
import { IconButton } from '../Button';
import { EmptyState, InlineQueryError } from '../State';
import { Skeleton } from '../Skeleton';
import { cn } from '../../utils/classNames';
import { useTheme } from '../../theme/ThemeProvider';

export interface DataPanelProps extends ComponentProps<'section'> {
  header?: ReactNode;
  toolbar?: ReactNode;
  footer?: ReactNode;
}

export function DataPanel({
  header,
  toolbar,
  footer,
  className,
  children,
  ...props
}: DataPanelProps) {
  return (
    <section className={cn('ec-data-panel', className)} {...props}>
      {header}
      {toolbar ? <div className="ec-data-panel__toolbar">{toolbar}</div> : null}
      <div className="ec-data-panel__content">{children}</div>
      {footer ? <div className="ec-data-panel__footer">{footer}</div> : null}
    </section>
  );
}

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
  isError?: boolean;
  /** Retain existing rows while a background request runs. */
  isRefreshing?: boolean;
  loadingLabel?: string;
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
  isError,
  isRefreshing = false,
  loadingLabel: loadingLabelProp,
  mobileCard,
  layout = 'auto',
  renderTableRow,
  embedded = false,
  embeddedShellClassName,
  panelClassName,
  tableClassName,
  tableRowClassName,
  emptyTitle: emptyTitleProp,
  emptyDescription,
  errorTitle: errorTitleProp,
  errorDescription,
  retryLabel: retryLabelProp,
  onRetry,
}: QueryDataTableProps<T>) {
  const { messages } = useLocale();
  const loadingLabel = loadingLabelProp ?? messages.loading;
  const emptyTitle = emptyTitleProp ?? messages.noData;
  const errorTitle = errorTitleProp ?? messages.loadFailed;
  const retryLabel = retryLabelProp ?? messages.retry;
  const mobile = useMediaQuery('(max-width: 767px)');
  const cardLayout = mobile && layout !== 'table' && Boolean(mobileCard);
  const queryLayout = cardLayout ? 'cards' : undefined;
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel(), getRowId });
  const shell = cn(
    'ec-query-table',
    embedded && 'is-embedded',
    embeddedShellClassName,
    panelClassName,
  );
  if (isLoading && !isRefreshing)
    return (
      <div
        role="status"
        aria-label={loadingLabel}
        aria-busy="true"
        data-query-layout={queryLayout}
        className={cn('ec-query-loading', embedded && 'is-embedded')}
      >
        {Array.from({ length: cardLayout ? 4 : 6 }, (_, i) => (
          <Skeleton key={i} style={{ height: '5rem' }} />
        ))}
      </div>
    );
  if (isError ?? Boolean(errorDescription))
    return (
      <InlineQueryError
        title={errorTitle}
        description={errorDescription}
        actionLabel={retryLabel}
        onRetry={onRetry}
        embedded={embedded && !cardLayout}
        data-query-layout={queryLayout}
        className={embeddedShellClassName}
      />
    );
  if (!data.length)
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        embedded={embedded && !cardLayout}
        data-query-layout={queryLayout}
        className={embeddedShellClassName}
      />
    );
  if (cardLayout && mobileCard)
    return (
      <div
        aria-busy={isRefreshing || undefined}
        data-query-layout="cards"
        className={cn('ec-query-cards', embedded && 'is-embedded')}
      >
        {data.map(mobileCard)}
      </div>
    );
  return (
    <div className={shell} aria-busy={isRefreshing || undefined}>
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
const OverlayContext = createContext({ mobile: false, canDismiss: true, pending: false });
export type ResponsiveOverlayDesktopSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';
export function ResponsiveOverlay({
  open,
  onOpenChange,
  children,
  dismissible = true,
  pending = false,
}: {
  open?: boolean;
  dismissible?: boolean;
  pending?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}) {
  const mobile = useMediaQuery('(max-width: 767px)');
  const [internalOpen, setInternalOpen] = useState(false);
  const canDismiss = dismissible && !pending;
  const changeOpen = useOverlayBehavior(
    open ?? internalOpen,
    (next) => {
      setInternalOpen(next);
      onOpenChange?.(next);
    },
    canDismiss,
  );
  return (
    <OverlayContext.Provider value={{ mobile, canDismiss, pending }}>
      <Primitive.Root open={open ?? internalOpen} onOpenChange={changeOpen}>
        {children}
      </Primitive.Root>
    </OverlayContext.Provider>
  );
}
export const ResponsiveOverlayTrigger = Primitive.Trigger;
export interface ResponsiveOverlayContentProps extends ComponentProps<typeof Primitive.Content> {
  mobileClassName?: string;
  mobileSide?: 'top' | 'right' | 'bottom' | 'left' | 'center';
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
  mobileSide = 'center',
  desktopSize = 'lg',
  layer = 'default',
  showCloseButton = true,
  closeLabel: closeLabelProp,
  instant = false,
  forceMount,
  style,
  ...props
}: ResponsiveOverlayContentProps) {
  const { messages } = useLocale();
  const closeLabel = closeLabelProp ?? messages.close;
  const { mobile, canDismiss, pending } = useContext(OverlayContext);
  const { ref: contentRef, onOpenAutoFocus, onCloseAutoFocus } = useOverlayFocus();
  useImperativeHandle(props.ref, () => contentRef.current!);
  const { portalContainer } = useTheme();
  const viewportStyle = useOverlayViewportStyle(style);
  return (
    <Primitive.Portal forceMount={forceMount} container={portalContainer ?? undefined}>
      <Primitive.Overlay
        data-layer={layer}
        className={cn('ec-dialog-overlay', instant && 'is-instant')}
      />
      <Primitive.Content
        data-mobile={mobile || undefined}
        data-side={mobile ? mobileSide : undefined}
        data-size={desktopSize}
        data-layer={layer}
        className={cn(
          'ec-responsive-overlay',
          mobile ? mobileClassName : className,
          instant && 'is-instant',
        )}
        style={viewportStyle}
        {...props}
        ref={contentRef}
        tabIndex={-1}
        aria-busy={pending || undefined}
        onOpenAutoFocus={(event) => {
          props.onOpenAutoFocus?.(event);
          onOpenAutoFocus(event);
        }}
        onCloseAutoFocus={(event) => {
          props.onCloseAutoFocus?.(event);
          onCloseAutoFocus(event);
        }}
        onEscapeKeyDown={(event) => {
          props.onEscapeKeyDown?.(event);
          if (!canDismiss) event.preventDefault();
        }}
        onInteractOutside={(event) => {
          props.onInteractOutside?.(event);
          if (!canDismiss) event.preventDefault();
        }}
      >
        {children}
        {showCloseButton ? (
          <Primitive.Close asChild>
            <IconButton
              className="ec-overlay-close"
              size="sm"
              label={closeLabel}
              disabled={!canDismiss}
              icon={<XIcon />}
            />
          </Primitive.Close>
        ) : null}
      </Primitive.Content>
    </Primitive.Portal>
  );
}
export function ResponsiveOverlayHeader({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('ec-responsive-overlay__header', className)} {...props} />;
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
  return <div className={cn('ec-responsive-overlay__footer', className)} {...props} />;
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
      className={cn('ec-responsive-overlay__body', className)}
      data-padding={padding}
      {...props}
    />
  );
}
export interface ResponsiveDialogProps {
  dismissible?: boolean;
  pending?: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  desktopSize?: ResponsiveOverlayDesktopSize;
  mobileSide?: 'top' | 'right' | 'bottom' | 'left' | 'center';
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
  dismissible,
  pending,
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
    <ResponsiveOverlay
      open={open}
      onOpenChange={onOpenChange}
      dismissible={dismissible}
      pending={pending}
    >
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
