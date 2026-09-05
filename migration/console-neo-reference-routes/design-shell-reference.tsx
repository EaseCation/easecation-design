import { BarChart3Icon, HomeIcon, SettingsIcon } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { Card, CardContent } from '@workspace/ui/components/card';
import { ActionBar } from '@workspace/ui/components/layout/action-bar';
import { AppShell } from '@workspace/ui/components/layout/app-shell';
import { PageScaffold } from '@workspace/ui/components/layout/page-scaffold';
import { SectionCard } from '@workspace/ui/components/patterns/section-card';
import { StatCard } from '@workspace/ui/components/patterns/stat-card';

const Sidebar = () => (
  <div style={{ padding: '1rem', display: 'grid', gap: '.5rem' }}>
    <b>Atlas Admin</b>
    <a href="#home">
      <HomeIcon />
      Overview
    </a>
    <a href="#analytics">
      <BarChart3Icon />
      Analytics
    </a>
    <a href="#settings">
      <SettingsIcon />
      Settings
    </a>
  </div>
);

export default function DesignShellReference() {
  return (
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
  );
}
