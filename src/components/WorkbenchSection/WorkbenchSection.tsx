import { useId, type HTMLAttributes, type ReactNode } from 'react';
export interface WorkbenchSectionProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title: string;
  icon?: ReactNode;
  groups?: Array<{ title: string; content: ReactNode }>;
}
/** Compact navigation grid with the same column count for sparse and full sections. */
export function WorkbenchSection({
  title,
  icon,
  groups,
  children,
  className,
  ...props
}: WorkbenchSectionProps) {
  const titleId = useId();
  return (
    <section
      aria-labelledby={titleId}
      className={['ec-workbench-section', className].filter(Boolean).join(' ')}
      {...props}
    >
      <h2 id={titleId}>
        {icon ? <span aria-hidden="true">{icon}</span> : null}
        {title}
      </h2>
      {groups ? (
        <div className="ec-workbench-section__groups">
          {groups.map((group) => (
            <div key={group.title}>
              {groups.length > 1 ? <h3>{group.title}</h3> : null}
              <div className="ec-workbench-section__grid">{group.content}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="ec-workbench-section__grid">{children}</div>
      )}
    </section>
  );
}
