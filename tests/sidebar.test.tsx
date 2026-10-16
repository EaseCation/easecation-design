import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import {
  SidebarAccountButton,
  SidebarNavItem,
  SidebarPanel,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '../src';

describe('sidebar composition', () => {
  it('loads account images with a fallback and resets image state when the source changes', () => {
    const { container, rerender } = render(
      <SidebarAccountButton name="Alex" avatarSrc="/alex.png" avatar={<span>Fallback</span>} />,
    );
    expect(screen.getByText('Fallback')).toBeVisible();
    fireEvent.load(container.querySelector('img')!);
    expect(container.querySelector('img')).toBeVisible();
    expect(screen.queryByText('Fallback')).not.toBeInTheDocument();
    rerender(
      <SidebarAccountButton name="Sam" avatarSrc="/sam.png" avatar={<span>Fallback</span>} />,
    );
    expect(screen.getByText('Fallback')).toBeVisible();
    expect(container.querySelector('img')).toHaveAttribute('src', '/sam.png');
    fireEvent.error(container.querySelector('img')!);
    expect(container.querySelector('img')).not.toBeInTheDocument();
    expect(screen.getByText('Fallback')).toBeVisible();
    rerender(<SidebarAccountButton name="Alex" avatarSrc="/alex.png" />);
    fireEvent.load(container.querySelector('img')!);
    expect(container.querySelector('img')).toBeVisible();
    rerender(<SidebarAccountButton name="Alex" />);
    expect(container.querySelector('img')).not.toBeInTheDocument();
  });

  it('preserves router-link semantics, ref and events when composing a navigation item', () => {
    const navigate = vi.fn((event) => event.preventDefault());
    const ref = createRef<HTMLButtonElement>();
    render(
      <SidebarNavItem asChild label="Overview" icon={<svg />} active ref={ref}>
        <a href="/overview" aria-current="page" onClick={navigate} />
      </SidebarNavItem>,
    );
    const link = screen.getByRole('link', { name: 'Overview' });
    expect(link).toHaveAttribute('href', '/overview');
    expect(link).toHaveAttribute('aria-current', 'page');
    expect(link).not.toHaveAttribute('type');
    expect(ref.current).toBe(link);
    fireEvent.click(link);
    expect(navigate).toHaveBeenCalledOnce();
  });

  it('keeps group disclosure controlled and names collapsed icon links', () => {
    const toggle = vi.fn();
    const { rerender } = render(
      <SidebarNavItem label="Resources" icon={<svg />} expanded={false} onClick={toggle} />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Resources' }));
    expect(toggle).toHaveBeenCalledOnce();
    expect(screen.getByRole('button', { name: 'Resources' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    rerender(
      <SidebarNavItem asChild label="Overview" icon={<svg />} collapsed>
        <a href="/overview" />
      </SidebarNavItem>,
    );
    expect(screen.getByRole('link', { name: 'Overview' })).toHaveAttribute('data-collapsed');
    expect(screen.queryByText('Overview')).not.toBeInTheDocument();
  });

  it('uses controlled collapse state and leaves mobile controls out when no callback is provided', () => {
    const change = vi.fn();
    const { rerender } = render(
      <SidebarPanel brand="Studio" onCollapsedChange={change} collapsed={false}>
        <nav />
      </SidebarPanel>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Collapse sidebar' }));
    expect(change).toHaveBeenCalledWith(true);
    rerender(
      <SidebarPanel brand="Studio" onCollapsedChange={change} collapsed>
        <nav />
      </SidebarPanel>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Expand sidebar' }));
    expect(change).toHaveBeenLastCalledWith(false);
    rerender(
      <SidebarPanel brand="Studio">
        <nav />
      </SidebarPanel>,
    );
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('forwards account menu trigger events and preserves the accessible name when collapsed', async () => {
    const { rerender } = render(
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarAccountButton name="Alex Morgan" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Sign out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
    const button = screen.getByRole('button', { name: 'Alex Morgan' });
    fireEvent.keyDown(button, { key: 'Enter' });
    expect(await screen.findByRole('menuitem', { name: 'Sign out' })).toBeInTheDocument();
    rerender(<SidebarAccountButton name="Alex Morgan" collapsed />);
    expect(screen.getByRole('button', { name: 'Alex Morgan' })).toHaveAttribute(
      'title',
      'Alex Morgan',
    );
    expect(screen.queryByText('Alex Morgan')).not.toBeInTheDocument();
  });
});
