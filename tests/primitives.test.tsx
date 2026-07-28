import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Label,
  ScrollArea,
  Separator,
} from '../src';

it('opens the dropdown menu and supports keyboard selection', async () => {
  const user = userEvent.setup();
  const selected = vi.fn();
  render(
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>Actions</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onSelect={selected}>Edit</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>,
  );
  await user.click(screen.getByRole('button', { name: 'Actions' }));
  expect(screen.getByRole('menu')).toBeInTheDocument();
  await user.keyboard('{ArrowDown}{Enter}');
  expect(selected).toHaveBeenCalledTimes(1);
});

it('renders semantic separator, label and scroll viewport', () => {
  render(
    <>
      <Label htmlFor="name">Name</Label>
      <input id="name" />
      <Separator decorative={false} />
      <ScrollArea style={{ height: 80 }}>
        <div style={{ height: 200 }}>Scrollable</div>
      </ScrollArea>
    </>,
  );
  expect(screen.getByText('Name')).toHaveAttribute('for', 'name');
  expect(screen.getByRole('separator')).toHaveAttribute('data-orientation', 'horizontal');
  expect(screen.getByText('Scrollable')).toBeInTheDocument();
});
