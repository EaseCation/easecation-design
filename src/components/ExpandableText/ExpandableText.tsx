import { useEffect, useId, useRef, useState, type HTMLAttributes, type ReactNode } from 'react';
import { Button } from '../Button';
import { useLocale } from '../../locale/LocaleProvider';

export interface ExpandableTextProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  text: string;
  /** Number of visible lines before expansion. */
  rows?: number;
  /** Render the full text without an expansion control. */
  collapsible?: boolean;
  expandLabel?: ReactNode;
  collapseLabel?: ReactNode;
}

/** Plain text preview with a keyboard-accessible expansion control. */
export function ExpandableText(props: ExpandableTextProps) {
  return <ExpandableTextContent key={props.text} {...props} />;
}

function ExpandableTextContent({
  text,
  rows = 3,
  collapsible = true,
  expandLabel,
  collapseLabel,
  className,
  ...props
}: ExpandableTextProps) {
  const { messages } = useLocale();
  const id = useId();
  const contentRef = useRef<HTMLParagraphElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [overflow, setOverflow] = useState(false);
  const lines = Math.max(1, Math.floor(rows));
  useEffect(() => {
    const element = contentRef.current;
    if (!element || !collapsible) return;
    const measure = () => {
      const lineHeight = parseFloat(getComputedStyle(element).lineHeight);
      setOverflow(element.scrollHeight > lineHeight * lines + 1);
    };
    measure();
    const observer =
      typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(measure);
    observer?.observe(element);
    return () => observer?.disconnect();
  }, [collapsible, lines, expanded]);
  return (
    <div {...props} className={['ec-expandable-text', className].filter(Boolean).join(' ')}>
      <p
        ref={contentRef}
        id={id}
        className="ec-expandable-text__content"
        data-collapsed={(collapsible && !expanded) || undefined}
        style={{ WebkitLineClamp: lines }}
      >
        {text}
      </p>
      {collapsible && (overflow || expanded) && (
        <Button
          variant="link"
          size="sm"
          aria-expanded={expanded}
          aria-controls={id}
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded
            ? (collapseLabel ?? messages.collapseText)
            : (expandLabel ?? messages.expandText)}
        </Button>
      )}
    </div>
  );
}
