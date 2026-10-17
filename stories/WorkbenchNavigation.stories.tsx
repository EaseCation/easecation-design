import type { Meta, StoryObj } from '@storybook/react-vite';
import { Calendar, Folder, UserRound } from 'lucide-react';
import { ThemeProvider, WorkbenchWelcome, WorkbenchSection, WorkbenchEntry } from '../src';

const meta = {
  title: 'Patterns/Workbench',
  component: WorkbenchWelcome,
  args: { name: 'Alex Morgan' },
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div style={{ padding: '1rem', display: 'grid', gap: '2rem' }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof WorkbenchWelcome>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {
  render: () => (
    <>
      <WorkbenchWelcome
        name="Alex Morgan"
        greeting="Welcome back,"
        summary={<span>3 pending tasks</span>}
      />
      <WorkbenchSection title="Workspace" icon={<Folder />}>
        <WorkbenchEntry
          href="#projects"
          title="Projects"
          description="Review your active projects."
          icon={<Folder />}
        />
        <WorkbenchEntry
          href="#schedule"
          title="Schedule"
          description="Plan the coming week."
          icon={<Calendar />}
        />
        <WorkbenchEntry
          href="#profile"
          title="Profile"
          description="Manage your account."
          icon={<UserRound />}
        />
      </WorkbenchSection>
    </>
  ),
};
export const NarrowDark: Story = {
  render: () => (
    <ThemeProvider mode="dark">
      <div style={{ maxWidth: 320, display: 'grid', gap: '2rem' }}>
        <WorkbenchWelcome
          name="A very long display name that must truncate"
          greeting="Welcome back,"
          avatarSrc="/missing-avatar.png"
          summary={<span>Summary unavailable</span>}
        />
        <WorkbenchSection title="Workspace">
          <WorkbenchEntry
            href="#details"
            title="A very long destination title"
            description="Descriptions wrap without causing horizontal scrolling on a narrow screen."
            icon={<Folder />}
          />
        </WorkbenchSection>
      </div>
    </ThemeProvider>
  ),
};
