import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import {
  ThemeModeMenuItems,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  ThemeProvider,
} from '../src';

it('exposes the current mode and selects a mode by keyboard', async () => {
  const user = userEvent.setup();
  const onValueChange = vi.fn();
  render(
    <ThemeProvider>
      <DropdownMenu>
        <DropdownMenuTrigger>Appearance</DropdownMenuTrigger>
        <DropdownMenuContent>
          <ThemeModeMenuItems value="system" onValueChange={onValueChange} />
        </DropdownMenuContent>
      </DropdownMenu>
    </ThemeProvider>,
  );
  await user.click(screen.getByText('Appearance'));
  expect(screen.getByRole('menuitemradio', { name: '跟随系统' })).toHaveAttribute(
    'aria-checked',
    'true',
  );
  screen.getByRole('menuitemradio', { name: '深色模式' }).focus();
  await user.keyboard('{Enter}');
  expect(onValueChange).toHaveBeenCalledWith('dark');
});

it('supports localized headings and mode names without changing selection values', async () => {
  const user = userEvent.setup();
  const onValueChange = vi.fn();
  render(
    <ThemeProvider>
      <DropdownMenu>
        <DropdownMenuTrigger>Appearance</DropdownMenuTrigger>
        <DropdownMenuContent>
          <ThemeModeMenuItems
            value="dark"
            onValueChange={onValueChange}
            labels={{ heading: 'Display mode', light: 'Light', dark: 'Dark', system: 'System' }}
          />
        </DropdownMenuContent>
      </DropdownMenu>
    </ThemeProvider>,
  );
  await user.click(screen.getByText('Appearance'));
  expect(screen.getByRole('group', { name: 'Display mode' })).toBeInTheDocument();
  await user.click(screen.getByRole('menuitemradio', { name: 'Light' }));
  expect(onValueChange).toHaveBeenCalledWith('light');
});
