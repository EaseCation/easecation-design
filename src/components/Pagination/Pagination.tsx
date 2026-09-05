export interface PaginationProps {
  page: number;
  total: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  disabled?: boolean;
  className?: string;
  showTotal?: boolean;
  ariaLabel?: string;
  previousLabel?: string;
  nextLabel?: string;
  totalLabel?: (total: number) => string;
  pageLabel?: (page: number) => string;
}
type PageItem = number | 'ellipsis';
function getItems(page: number, pages: number, siblings: number): PageItem[] {
  if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1);
  const values = new Set([1, pages]);
  for (let i = page - siblings; i <= page + siblings; i += 1) if (i > 1 && i < pages) values.add(i);
  const sorted = [...values].sort((a, b) => a - b);
  const result: PageItem[] = [];
  sorted.forEach((value, index) => {
    if (index && value - sorted[index - 1] > 1) result.push('ellipsis');
    result.push(value);
  });
  return result;
}
export function Pagination({
  page,
  total,
  pageSize = 10,
  onPageChange,
  siblingCount = 1,
  disabled = false,
  className,
  showTotal = true,
  ariaLabel = 'Pagination',
  previousLabel = 'Previous page',
  nextLabel = 'Next page',
  totalLabel = (count) => `${count} items`,
  pageLabel = (item) => `Page ${item}`,
}: PaginationProps) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(Math.max(page, 1), pages);
  const items = getItems(current, pages, siblingCount);
  return (
    <nav className={['ec-pagination', className].filter(Boolean).join(' ')} aria-label={ariaLabel}>
      {showTotal ? <span className="ec-pagination__total">{totalLabel(total)}</span> : null}
      <div className="ec-pagination__controls">
        <button
          type="button"
          className="ec-pagination__button ec-focusable"
          aria-label={previousLabel}
          disabled={disabled || current <= 1}
          onClick={() => onPageChange(current - 1)}
        >
          ‹
        </button>
        {items.map((item, index) =>
          item === 'ellipsis' ? (
            <span key={`ellipsis-${index}`} className="ec-pagination__ellipsis">
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              className="ec-pagination__button ec-focusable"
              aria-label={pageLabel(item)}
              aria-current={current === item ? 'page' : undefined}
              disabled={disabled}
              onClick={() => onPageChange(item)}
            >
              {item}
            </button>
          ),
        )}
        <button
          type="button"
          className="ec-pagination__button ec-focusable"
          aria-label={nextLabel}
          disabled={disabled || current >= pages}
          onClick={() => onPageChange(current + 1)}
        >
          ›
        </button>
      </div>
    </nav>
  );
}
