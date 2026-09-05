import { ArrowDownRightIcon, ArrowRightIcon, ArrowUpRightIcon } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
export interface SectionCardProps extends ComponentProps<'section'> {
  title: string;
  description?: string;
  actions?: ReactNode;
}
export function SectionCard({
  title,
  description,
  actions,
  className,
  children,
  ...props
}: SectionCardProps) {
  return (
    <section className={['ec-section-card', className].filter(Boolean).join(' ')} {...props}>
      <header>
        <div>
          <h2>{title}</h2>
          {description ? <p>{description}</p> : null}
        </div>
        {actions}
      </header>
      <div className="ec-section-card__body">{children}</div>
    </section>
  );
}
export interface StatCardProps extends ComponentProps<'article'> {
  label: string;
  value: string;
  delta: string;
  hint?: string;
  trend: 'up' | 'down' | 'steady';
  icon?: ReactNode;
}
const icons = {
  up: <ArrowUpRightIcon />,
  down: <ArrowDownRightIcon />,
  steady: <ArrowRightIcon />,
};
export function StatCard({
  label,
  value,
  delta,
  hint,
  trend,
  icon,
  className,
  ...props
}: StatCardProps) {
  return (
    <article className={['ec-stat-card', className].filter(Boolean).join(' ')} {...props}>
      <div className="ec-stat-card__top">
        <div>
          <p className="ec-stat-card__label">{label}</p>
          <div className="ec-stat-card__value-group">
            <p className="ec-stat-card__value">{value}</p>
            <div className="ec-stat-card__delta" data-trend={trend}>
              {icons[trend]}
              <span>{delta}</span>
            </div>
          </div>
        </div>
        <div
          className="ec-stat-card__icon"
          data-empty={icon ? undefined : 'true'}
          aria-hidden={icon ? undefined : true}
        >
          {icon}
        </div>
      </div>
      {hint ? <p className="ec-stat-card__hint">{hint}</p> : null}
    </article>
  );
}
