import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Alert,
  Button,
  CardContent,
  Table,
  Card,
  FilterBar,
  Input,
  Modal,
  ResponsiveDialog,
  ThemeProvider,
  closeTopOverlay,
  useReducedMotion,
} from '../../src';
import '../../dist/style.css';

function Interactions() {
  const reducedMotion = useReducedMotion();
  const [actions, setActions] = useState(0);
  const [searches, setSearches] = useState(0);
  const [open, setOpen] = useState(false);
  const [nested, setNested] = useState(false);
  const [pending, setPending] = useState(false);
  useEffect(() => {
    const back = (event: KeyboardEvent) => {
      if (event.key === 'F8') closeTopOverlay();
    };
    document.addEventListener('keydown', back);
    return () => document.removeEventListener('keydown', back);
  }, []);
  return (
    <main style={{ padding: 16, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 16 }}>
      <output data-testid="motion">{reducedMotion ? 'reduced' : 'normal'}</output>
      <output data-testid="actions">{actions}</output>
      <output data-testid="searches">{searches}</output>
      <Button data-testid="press-button">Press button</Button>
      <Button asChild>
        <a href="#press-link" onClick={(event) => event.preventDefault()} data-testid="press-link">
          Press link
        </a>
      </Button>
      <Card pressable data-testid="press-card">
        Press card
      </Card>
      <Button asChild disabled onClick={() => setActions((n) => n + 1)}>
        <a href="#unexpected" onClick={() => setActions((n) => n + 1)} data-testid="disabled-link">
          Disabled link
        </a>
      </Button>
      <Button asChild loading onClick={() => setActions((n) => n + 1)}>
        <a href="#unexpected" onClick={() => setActions((n) => n + 1)} data-testid="loading-link">
          Loading link
        </a>
      </Button>
      <FilterBar onSearch={() => setSearches((n) => n + 1)}>
        <Input aria-label="Search" />
      </FilterBar>
      <Button onClick={() => setOpen(true)}>Open modal</Button>
      <Modal
        open={open}
        onOpenChange={setOpen}
        title="Outer modal"
        description="Focus and host Back regression"
      >
        <Input aria-label="Modal input" />
        <Button onClick={() => setNested(true)}>Open nested</Button>
        <ResponsiveDialog
          open={nested}
          onOpenChange={setNested}
          title="Nested dialog"
          pending={pending}
          layer="nested"
        >
          <Input aria-label="Nested input" />
          <Button onClick={() => setPending((value) => !value)}>
            {pending ? 'Unlock' : 'Lock'}
          </Button>
        </ResponsiveDialog>
      </Modal>
      <section data-testid="alert-tones" style={{ display: 'grid', gap: 12 }}>
        {(['neutral', 'info', 'success', 'warning', 'danger'] as const).map((tone) => (
          <Alert key={tone} tone={tone} title={`${tone} notice`}>
            Contact your administrator for help.
          </Alert>
        ))}
      </section>
      <Card>
        <CardContent>
          <Table
            caption="Scrollable records"
            minWidth={1800}
            columns={[
              { title: 'Record', dataIndex: 'name' },
              { title: 'Actions', dataIndex: 'action', pinned: 'right', width: 100 },
            ]}
            data={Array.from({ length: 24 }, (_, id) => ({
              id,
              name: `Record ${id}`,
              action: 'View',
            }))}
            rowKey="id"
          />
        </CardContent>
      </Card>
      <div aria-hidden="true" style={{ height: 900 }} />
    </main>
  );
}
const requestedTheme = new URLSearchParams(location.search).get('theme');
const theme = requestedTheme === 'dark' || requestedTheme === 'black-gold' ? 'dark' : 'light';
createRoot(document.getElementById('root')!).render(
  <ThemeProvider
    mode={theme}
    colorTheme={requestedTheme === 'black-gold' ? 'black-gold' : 'default'}
  >
    <Interactions />
  </ThemeProvider>,
);
