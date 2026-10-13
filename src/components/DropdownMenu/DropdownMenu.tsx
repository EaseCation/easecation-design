import { CheckIcon, ChevronRightIcon } from 'lucide-react';
import { DropdownMenu as Primitive } from 'radix-ui';
import type { ComponentProps } from 'react';
import { useTheme } from '../../theme/ThemeProvider';

const classes = (...values: Array<string | false | undefined>) => values.filter(Boolean).join(' ');
export const DropdownMenu = Primitive.Root;
export function DropdownMenuPortal(props: ComponentProps<typeof Primitive.Portal>) {
  const { portalContainer } = useTheme();
  return <Primitive.Portal container={portalContainer ?? undefined} {...props} />;
}
export const DropdownMenuTrigger = Primitive.Trigger;
export const DropdownMenuGroup = Primitive.Group;
export const DropdownMenuRadioGroup = Primitive.RadioGroup;
export const DropdownMenuSub = Primitive.Sub;
export function DropdownMenuContent({
  className,
  align = 'start',
  sideOffset = 4,
  ...props
}: ComponentProps<typeof Primitive.Content>) {
  const { portalContainer } = useTheme();
  return (
    <Primitive.Portal container={portalContainer ?? undefined}>
      <Primitive.Content
        data-slot="dropdown-menu-content"

        align={align}
        sideOffset={sideOffset}
        className={classes('ec-dropdown-content', className)}
        {...props}
      />
    </Primitive.Portal>
  );
}
export interface DropdownMenuItemProps extends ComponentProps<typeof Primitive.Item> {
  inset?: boolean;
  variant?: 'default' | 'destructive';
}
export function DropdownMenuItem({
  className,
  inset,
  variant = 'default',
  ...props
}: DropdownMenuItemProps) {
  return (
    <Primitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset || undefined}
      data-variant={variant}
      className={classes('ec-dropdown-item', className)}
      {...props}
    />
  );
}
export function DropdownMenuCheckboxItem({
  className,
  children,
  inset,
  ...props
}: ComponentProps<typeof Primitive.CheckboxItem> & { inset?: boolean }) {
  return (
    <Primitive.CheckboxItem
      data-inset={inset || undefined}
      className={classes('ec-dropdown-item', 'ec-dropdown-check-item', className)}
      {...props}
    >
      <span className="ec-dropdown-indicator">
        <Primitive.ItemIndicator>
          <CheckIcon />
        </Primitive.ItemIndicator>
      </span>
      {children}
    </Primitive.CheckboxItem>
  );
}
export function DropdownMenuRadioItem({
  className,
  children,
  inset,
  ...props
}: ComponentProps<typeof Primitive.RadioItem> & { inset?: boolean }) {
  return (
    <Primitive.RadioItem
      data-inset={inset || undefined}
      className={classes('ec-dropdown-item', 'ec-dropdown-check-item', className)}
      {...props}
    >
      <span className="ec-dropdown-indicator">
        <Primitive.ItemIndicator>
          <CheckIcon />
        </Primitive.ItemIndicator>
      </span>
      {children}
    </Primitive.RadioItem>
  );
}
export function DropdownMenuLabel({
  className,
  inset,
  ...props
}: ComponentProps<typeof Primitive.Label> & { inset?: boolean }) {
  return (
    <Primitive.Label
      data-inset={inset || undefined}
      className={classes('ec-dropdown-label', className)}
      {...props}
    />
  );
}
export function DropdownMenuSeparator({
  className,
  ...props
}: ComponentProps<typeof Primitive.Separator>) {
  return <Primitive.Separator className={classes('ec-dropdown-separator', className)} {...props} />;
}
export function DropdownMenuShortcut({ className, ...props }: ComponentProps<'span'>) {
  return <span className={classes('ec-dropdown-shortcut', className)} {...props} />;
}
export function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: ComponentProps<typeof Primitive.SubTrigger> & { inset?: boolean }) {
  return (
    <Primitive.SubTrigger
      data-inset={inset || undefined}
      className={classes('ec-dropdown-item', 'ec-dropdown-sub-trigger', className)}
      {...props}
    >
      {children}
      <ChevronRightIcon />
    </Primitive.SubTrigger>
  );
}
export function DropdownMenuSubContent({
  className,
  ...props
}: ComponentProps<typeof Primitive.SubContent>) {
  return (
    <Primitive.SubContent
      className={classes(
        'ec-dropdown-content',
        'ec-dropdown-sub-content',

        className,
      )}
      {...props}
    />
  );
}
