import { MenuIcon, MoonIcon } from 'lucide-react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Navbar, ThemeProvider } from '../src';

const meta = {
  title: 'Components/Navbar',
  component: Navbar,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div style={{ minHeight: '100svh', background: 'var(--background)' }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Navbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ProductNavigation: Story = {
  args: {
    brand: (
      <span>
        Atlas <b>UI</b>
      </span>
    ),
    brandHref: '#overview',
    items: [
      { label: 'Overview', href: '#overview', active: true },
      { label: 'Components', href: '#components' },
      { label: 'Guides', href: '#guides' },
    ],
    actions: (
      <Button size="sm" variant="ghost" leadingIcon={<MoonIcon />}>
        Theme
      </Button>
    ),
    menuButton: <MenuIcon />,
    menuButtonProps: { 'aria-label': 'Open navigation' },
  },
};
