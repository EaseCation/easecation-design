import { BarChart3Icon, HomeIcon, SettingsIcon } from 'lucide-react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ActionBar,
  AppShell,
  Button,
  Card,
  CardContent,
  PageScaffold,
  SectionCard,
  StatCard,
  ThemeProvider,
} from '../src';
const Sidebar = () => (
  <div style={{ padding: '1rem', display: 'grid', gap: '.5rem' }}>
    <b>Atlas Admin</b>
    <a href="#home">
      <HomeIcon /> Overview
    </a>
    <a href="#analytics">
      <BarChart3Icon /> Analytics
    </a>
    <a href="#settings">
      <SettingsIcon /> Settings
    </a>
  </div>
);
const meta = {
  title: 'Patterns/App Shell',
  component: AppShell,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof AppShell>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Dashboard: Story = {
  args: { brand: 'Atlas', sidebar: <Sidebar />, children: null },
  render: () => (
    <AppShell
      brand={<b>Atlas Admin</b>}
      sidebar={<Sidebar />}
      headerTitle="Operations"
      headerActions={<Button size="sm">Create</Button>}
      bottomBar={<div>Mobile actions</div>}
    >
      <PageScaffold
        eyebrow="Workspace"
        title="Operations dashboard"
        actions={<Button variant="outline">Export</Button>}
      >
        <ActionBar>Filters and actions</ActionBar>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(14rem,1fr))',
            gap: '1rem',
          }}
        >
          <StatCard label="Revenue" value="$286,420" delta="18.2%" trend="up" />
          <StatCard label="Active teams" value="128" delta="8.7%" trend="up" />
        </div>
        <SectionCard title="Activity">
          <Card>
            <CardContent>Domain-neutral dashboard content</CardContent>
          </Card>
        </SectionCard>
      </PageScaffold>
    </AppShell>
  ),
};
