import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Boxes, Home, Settings, Users } from 'lucide-react';
import {
  ThemeProvider,
  SidebarPanel,
  SidebarNavItem,
  SidebarAccountButton,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '../src';

const meta = {
  title: 'Layout/Sidebar',
  component: SidebarPanel,
  args: { brand: 'Studio' },
} satisfies Meta<typeof SidebarPanel>;
export default meta;
type Story = StoryObj<typeof meta>;

function Example({
  initiallyCollapsed = false,
  long = false,
}: {
  initiallyCollapsed?: boolean;
  long?: boolean;
}) {
  const [collapsed, setCollapsed] = useState(initiallyCollapsed);
  const [active, setActive] = useState('Overview');
  const [expanded, setExpanded] = useState(true);
  return (
    <ThemeProvider>
      <div style={{ width: collapsed ? 68 : 252, height: 600, background: 'var(--sidebar)' }}>
        <SidebarPanel
          brand={<strong>{collapsed ? 'S' : 'Studio'}</strong>}
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
          footer={
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarAccountButton
                  name={long ? 'Alex Morgan — Workspace administrator' : 'Alex Morgan'}
                  collapsed={collapsed}
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Preferences</DropdownMenuItem>
                <DropdownMenuItem>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          }
        >
          <nav
            style={{ minHeight: 0, overflowY: 'auto', display: 'grid', gap: 4, paddingInline: 6 }}
          >
            <SidebarNavItem
              asChild
              label="Overview"
              icon={<Home />}
              active={active === 'Overview'}
              collapsed={collapsed}
            >
              <a href="#overview" onClick={() => setActive('Overview')} />
            </SidebarNavItem>
            <SidebarNavItem
              label="Members"
              icon={<Users />}
              active={active === 'Members'}
              collapsed={collapsed}
              onClick={() => setActive('Members')}
            />
            <SidebarNavItem
              label="Resources"
              icon={<Boxes />}
              expanded={expanded}
              collapsed={collapsed}
              onClick={() => setExpanded(!expanded)}
            />
            {!collapsed && expanded ? (
              <SidebarNavItem asChild label="Settings" icon={<Settings />} level="secondary" active>
                <a href="#settings" />
              </SidebarNavItem>
            ) : null}
            {long
              ? Array.from({ length: 24 }, (_, i) => (
                  <SidebarNavItem
                    key={i}
                    label={`Workspace ${i + 1}`}
                    icon={<Boxes />}
                    collapsed={collapsed}
                  />
                ))
              : null}
          </nav>
        </SidebarPanel>
      </div>
    </ThemeProvider>
  );
}
export const Standard: Story = { render: () => <Example /> };
export const Collapsed: Story = { render: () => <Example initiallyCollapsed /> };
export const LongContent: Story = { render: () => <Example long /> };
