import {
  Children,
  cloneElement,
  forwardRef,
  type AnchorHTMLAttributes,
  type ReactElement,
  type ReactNode,
} from 'react';
import { Slot } from 'radix-ui';
import { ArrowRight } from 'lucide-react';

export interface WorkbenchEntryProps extends Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  'title'
> {
  title: string;
  description?: ReactNode;
  icon?: ReactNode;
  detail?: ReactNode;
  /** Compose a router Link; routing remains owned by the application. */
  asChild?: boolean;
}
export const WorkbenchEntry = forwardRef<HTMLAnchorElement, WorkbenchEntryProps>(
  function WorkbenchEntry(
    { title, description, icon, detail, asChild = false, children, className, ...props },
    ref,
  ) {
    const Component = asChild ? Slot.Root : 'a';
    const content = (
      <>
        {icon ? (
          <span className="ec-workbench-entry__icon" aria-hidden="true">
            {icon}
          </span>
        ) : null}
        <span className="ec-workbench-entry__copy">
          <strong>{title}</strong> {description ? <span>{description}</span> : null}
          {detail != null ? <span>{detail}</span> : null}
        </span>
        <ArrowRight className="ec-workbench-entry__arrow" aria-hidden="true" />
      </>
    );
    return (
      <Component
        ref={ref}
        className={['ec-workbench-entry', 'ec-focusable', className].filter(Boolean).join(' ')}
        {...props}
      >
        {asChild
          ? cloneElement(
              Children.only(children) as ReactElement<{ children?: ReactNode }>,
              {},
              content,
            )
          : content}
      </Component>
    );
  },
);
