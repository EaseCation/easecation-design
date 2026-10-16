import { useState } from 'react';
import { useLocale } from '../../locale/LocaleProvider';
import { Select } from '../Select';
import { Input } from '../Input';
import { Button } from '../Button';
import './Pagination.css';

export interface PaginationProps {
  page: number;
  /** Omit for cursor/unknown-total navigation; supply hasNextPage instead. */
  total?: number;
  hasNextPage?: boolean;
  /** Authoritative page count when supplied by the API. */
  totalPages?: number;
  compact?: boolean;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: readonly number[];
  showPageJump?: boolean;
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
  hasNextPage = false,
  totalPages,
  compact = false,
  onPageSizeChange,
  pageSizeOptions = [20, 50, 100],
  showPageJump = false,
  pageSize = 10,
  onPageChange,
  siblingCount = 1,
  disabled = false,
  className,
  showTotal = true,
  ariaLabel,
  previousLabel,
  nextLabel,
  totalLabel,
  pageLabel,
}: PaginationProps) {
  const { locale, messages } = useLocale();
  const [jump, setJump] = useState('');
  const size = Number.isFinite(pageSize) ? Math.max(1, Math.floor(pageSize)) : 10;
  const count = total === undefined ? undefined : Math.max(0, Number.isFinite(total) ? total : 0);
  const pages =
    totalPages !== undefined && Number.isFinite(totalPages)
      ? Math.max(1, Math.floor(totalPages))
      : count === undefined
        ? undefined
        : Math.max(1, Math.ceil(count / size));
  const current = Math.min(
    Math.max(Number.isFinite(page) ? Math.floor(page) : 1, 1),
    pages ?? Infinity,
  );
  const items =
    pages && !compact
      ? getItems(
          current,
          pages,
          Number.isFinite(siblingCount) ? Math.min(5, Math.max(0, Math.floor(siblingCount))) : 1,
        )
      : [];
  const labelPage =
    pageLabel ?? ((item: number) => (locale === 'zh-CN' ? `第 ${item} 页` : `Page ${item}`));
  const sizes = [...new Set([...pageSizeOptions, size])]
    .filter((item) => Number.isInteger(item) && item > 0)
    .sort((a, b) => a - b);
  const jumpPage = Number(jump);
  const validJump =
    jump.trim() !== '' &&
    Number.isInteger(jumpPage) &&
    jumpPage >= 1 &&
    pages !== undefined &&
    jumpPage <= pages;
  const applyJump = () => {
    if (disabled || !validJump) return;
    onPageChange(jumpPage);
    setJump('');
  };
  return (
    <nav
      className={['ec-pagination', className].filter(Boolean).join(' ')}
      aria-label={ariaLabel ?? messages.pagination}
    >
      {showTotal && count !== undefined ? (
        <span className="ec-pagination__total">
          {totalLabel
            ? totalLabel(count)
            : locale === 'zh-CN'
              ? `共 ${count} 条`
              : `${count} items`}
        </span>
      ) : null}
      <div className="ec-pagination__controls">
        <button
          type="button"
          className="ec-pagination__button ec-focusable"
          aria-label={previousLabel ?? messages.previousPage}
          disabled={disabled || current <= 1}
          onClick={() => onPageChange(current - 1)}
        >
          ‹
        </button>
        {compact || pages === undefined ? (
          <span
            className="ec-pagination__position"
            aria-current="page"
            aria-label={labelPage(current)}
          >
            {pages ? `${current} / ${pages}` : current}
          </span>
        ) : null}
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
              aria-label={labelPage(item)}
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
          aria-label={nextLabel ?? messages.nextPage}
          disabled={disabled || (pages === undefined ? !hasNextPage : current >= pages)}
          onClick={() => onPageChange(current + 1)}
        >
          ›
        </button>
      </div>
      {!compact && (onPageSizeChange || (showPageJump && pages !== undefined)) ? (
        <div className="ec-pagination__options">
          {onPageSizeChange ? (
            <Select
              aria-label={messages.pageSize}
              value={String(size)}
              disabled={disabled}
              options={sizes.map((item) => ({
                value: String(item),
                label: locale === 'zh-CN' ? `${item} 条/页` : `${item} / page`,
              }))}
              onValueChange={(value) => {
                setJump('');
                onPageSizeChange(Number(value));
              }}
            />
          ) : null}
          {showPageJump && pages !== undefined ? (
            <div className="ec-pagination__jump">
              <Input
                aria-label={messages.jumpToPage}
                type="number"
                min={1}
                max={pages}
                step={1}
                value={jump}
                disabled={disabled}
                onChange={(event) => setJump(event.target.value)}
                onKeyDown={(event) => {
                  if (
                    event.key === 'Enter' &&
                    !event.nativeEvent.isComposing &&
                    event.nativeEvent.keyCode !== 229
                  ) {
                    event.preventDefault();
                    applyJump();
                  }
                }}
              />
              <Button variant="outline" disabled={disabled || !validJump} onClick={applyJump}>
                {messages.goToPage}
              </Button>
            </div>
          ) : null}
        </div>
      ) : null}
    </nav>
  );
}
